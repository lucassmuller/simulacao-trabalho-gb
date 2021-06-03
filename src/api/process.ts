import {Duration} from 'moment';

export class Process {
  private id = Math.random()
  private active = true

  constructor(
    private name: string,
    private duration: Duration,
  ) { }

  getId = () => this.id;
  getName = () => this.name;

  getDuration = () => this.duration;
  setDuration = (duration: Duration) => this.duration = duration;

  isActive = () => this.active;
  setActive = (active: boolean) => this.active = active;
}

export default Process;
