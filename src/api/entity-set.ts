import moment from 'moment';
import Entity from './entity';
import Event from './event';
import Scheduler from './scheduler';

export enum EntitySetMode {
  // eslint-disable-next-line no-unused-vars
  FIFO,
  // eslint-disable-next-line no-unused-vars
  LIFO,
  // eslint-disable-next-line no-unused-vars
  Priority,
}

interface EntitySetLog {
  time: moment.Moment;
  size: number;
}

export class EntitySet<T extends Entity = Entity> {
  private id = Math.random()
  private set: T[] = []
  private logs: EntitySetLog[] = []
  private keepLogging = true

  constructor(
    private name: string,
    private mode?: EntitySetMode,
    private maxSize = 0,
  ) { }

  getId = () => this.id;
  getName = () => this.name;

  getMode = () => this.mode;
  setMode = (mode?: EntitySetMode) => this.mode = mode;

  getSize = () => this.set.length;
  isEmpty = () => this.getSize() === 0;
  isNotEmpty = () => !this.isEmpty();

  getMaxSize = () => this.maxSize;
  setMaxSize = (maxSize: number) => this.maxSize = maxSize;

  findEntity(entityId: number) {
    return this.set.find((entity) => entity.getId() === entityId);
  }

  insert(entity: T) {
    if (this.getMaxSize() === 0 || this.getSize() < this.getMaxSize()) {
      this.set.push(entity);
    } else {
      throw new Error('Max possible size reached.');
    }
  }

  remove() {
    if (this.isEmpty()) {
      return undefined;
    }

    switch (this.mode) {
      case EntitySetMode.LIFO:
        return this.set.pop();
      case EntitySetMode.FIFO:
        return this.set.shift();
      case EntitySetMode.Priority:
        return this.set.slice().sort((a, b) => b.getPriority() - a.getPriority()).pop();
      default:
        return this.removeByIndex(this.getRandomSetIndex());
    }
  }

  private getRandomSetIndex() {
    return Math.floor(Math.random() * this.getSize());
  }

  removeById(entityId: number) {
    const index = this.set.findIndex((entity) => entity.getId() === entityId);
    return this.removeByIndex(index);
  }

  private removeByIndex(index: number) {
    return this.set.slice(index, 1)[0];
  }

  getLog = () => this.logs;

  startLog(timeGap: moment.Duration, scheduler: Scheduler, logLimit = 0) {
    this.keepLogging = true;
    const entitySet = this;
    const logEvent = new class extends Event {
      constructor() {
        super('EntitySetLogEvent');
      }

      execute() {
        if (!entitySet.keepLogging) {
          return;
        }

        if (logLimit > 0 && entitySet.logs.length >= logLimit) {
          entitySet.keepLogging = false;
          return;
        }

        entitySet.logs.push({
          time: scheduler.getTime(),
          size: entitySet.getSize(),
        });

        if (scheduler.hasEvents()) {
          scheduler.scheduleIn(logEvent, timeGap, true);
        }
      }
    };

    scheduler.scheduleNow(logEvent, true);
  }

  stopLog = () => this.keepLogging = false
}

export default EntitySet;
