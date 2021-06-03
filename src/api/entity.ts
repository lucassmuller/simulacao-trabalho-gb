import moment from 'moment';
import {getSimulationTime} from './time';

export class Entity {
  private id = Math.random()
  private priority = 255
  private creationTime = getSimulationTime()

  constructor(
    private name: string,
  ) { }

  getId = () => this.id
  getName = () => this.name

  getPriority = () => this.priority
  setPriority = (priority: number) => this.priority = priority

  getTimeSinceCreation = () => moment.duration(getSimulationTime().diff(this.creationTime))
}

export default Entity;
