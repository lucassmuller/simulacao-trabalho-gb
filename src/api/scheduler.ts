import moment from 'moment';
import Entity from './entity';
import Event from './event';
import {getSimulationTime, setSimulationTime} from './time';

interface ScheduledEvent {
  time: moment.Moment;
  event: Event;
}

type EntityLog = {[name: string]: number}

export class Scheduler {
  private entityLog: EntityLog = {}
  private events: ScheduledEvent[] = []

  // Event scheduling

  scheduleNow(event: Event) {
    this.scheduleAt(event, getSimulationTime());
  }

  scheduleIn(event: Event, timeToEvent: moment.Duration) {
    this.scheduleAt(event, getSimulationTime().add(timeToEvent));
  }

  scheduleAt(event: Event, absoluteTime: moment.Moment) {
    console.log('Event', event.getName(), 'scheduled at', absoluteTime.format('mm:ss'));

    this.events.push({
      event,
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
    while (this.hasEvents() && getSimulationTime() <= absoluteTime) {
      this.simulateOneStep(absoluteTime);
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
      return;
    }

    setSimulationTime(nextEvent.time);
    console.log('Executing event', nextEvent.event.getName());
    nextEvent.event.execute();
  }

  hasEvents = () => this.events.length > 0;

  // Statistics

  logEntityCreation(entity: Entity) {
    const amount = this.entityLog[entity.getName()] || 0;
    this.entityLog[entity.getName()] = amount + 1;
  }

  getEntityTotalQuantity() {
    return Object.keys(this.entityLog)
        .map((key) => this.entityLog[key])
        .reduce((p, c) => p + c, 0);
  }

  getEntityTotalQuantityByName(name: string) {
    return this.entityLog[name] || 0;
  }
}

export default Scheduler;
