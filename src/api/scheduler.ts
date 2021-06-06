import moment from 'moment';
import Entity from './entity';
import Event from './event';
import {getSimulationTime, setSimulationTime} from './time';

interface ScheduledEvent {
  time: moment.Moment;
  event: Event;
  logEvent: boolean;
}

type EntityLog = {[name: string]: number}
type EntityDurationLog = {[name: string]: moment.Duration[]}

export class Scheduler {
  private creationTime = getSimulationTime()
  private entityLog: EntityLog = {}
  private entityDurationLog: EntityDurationLog = {}
  private events: ScheduledEvent[] = []

  getTime = () => getSimulationTime();

  // Event scheduling

  scheduleNow(event: Event, logEvent = false) {
    this.scheduleAt(event, getSimulationTime(), logEvent);
  }

  scheduleIn(event: Event, timeToEvent: moment.Duration, logEvent = false) {
    this.scheduleAt(event, getSimulationTime().add(timeToEvent), logEvent);
  }

  scheduleAt(event: Event, absoluteTime: moment.Moment, logEvent = false) {
    console.log('Event', event.getName(), '(', event.getId(), ') scheduled at',
        moment.duration(absoluteTime.diff(this.creationTime)).asMinutes(), 'minutes');

    this.events.push({
      event,
      logEvent,
      time: absoluteTime.clone(),
    });
  }

  // Simulation

  simulate() {
    while (this.hasEvents()) {
      this.simulateOneStep();
    }
  }

  simulateBy(duration: moment.Duration) {
    this.simulateUntil(getSimulationTime().add(duration));
  }

  simulateUntil(absoluteTime: moment.Moment) {
    while (this.hasEvents()) {
      if (getSimulationTime() >= absoluteTime) {
        break;
      } else {
        this.simulateOneStep();
      }
    }
  }

  simulateOneStep(limit?: moment.Moment) {
    const nextEvent = this.events
        .sort((a, b) => b.time.valueOf() - a.time.valueOf())
        .pop();

    if (!nextEvent) {
      console.log('No event to execute');
      return;
    }

    if (limit && nextEvent.time > limit) {
      // Add to events list in case the simulation runs again
      this.events.push(nextEvent);
      return;
    }

    setSimulationTime(nextEvent.time);
    console.log('Executing event', nextEvent.event.getName(), '(', nextEvent.event.getId(), ')');
    nextEvent.event.execute();
  }

  hasEvents = () => !!this.events.find((e) => !e.logEvent)

  // Statistics

  logEntityCreation(entity: Entity) {
    const amount = this.entityLog[entity.getName()] || 0;
    this.entityLog[entity.getName()] = amount + 1;
  }

  logEntityDestruction(entity: Entity) {
    this.entityDurationLog[entity.getName()] = this.entityDurationLog[entity.getName()] || [];
    this.entityDurationLog[entity.getName()].push(entity.getTimeSinceCreation());
  }

  getEntityTotalQuantity() {
    return Object.keys(this.entityLog)
        .map((key) => this.entityLog[key])
        .reduce((p, c) => p + c, 0);
  }

  getEntityTotalQuantityByName(name: string) {
    return this.entityLog[name] || 0;
  }

  averageTimeInModelByName(name: string) {
    const durationLogs = this.entityDurationLog[name] || [];
    const durationsSum = durationLogs
        .map((duration) => duration.asMilliseconds())
        .reduce((p, c) => p + c, 0);
    return moment.duration(durationsSum / durationLogs.length, 'milliseconds');
  }
}

export default Scheduler;
