import Entity from './entity';

export enum EntitySetMode {
  // eslint-disable-next-line no-unused-vars
  FIFO,
  // eslint-disable-next-line no-unused-vars
  LIFO,
  // eslint-disable-next-line no-unused-vars
  Priority,
}

export class EntitySet {
  private id = 0
  private set: Entity[] = []

  constructor(
    private name: string,
    private mode?: EntitySetMode,
    private maxSize = 0,
  ) { }

  getName = () => this.name;

  getMode = () => this.mode
  setMode = (mode?: EntitySetMode) => this.mode = mode

  getSize = () => this.set.length
  isEmpty = () => this.getSize() === 0

  getMaxSize = () => this.maxSize
  setMaxSize = (maxSize: number) => this.maxSize = maxSize

  findEntity(entityId: number) {
    return this.set.find((entity) => entity.getId() === entityId);
  }

  insert(entity: Entity) {
    if (this.getMaxSize() === 0 || this.getSize() < this.getMaxSize()) {
      this.set.push(entity);
    } else {
      throw new Error('Max possible size reached.');
    }
  }

  remove() {
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

  // TODOs:
  averageSize = () => null
  averageTimeInSet = () => null
  maxTimeInSet = () => null
  startLog = () => null
  stopLog = () => null
  getLog = () => null
}

export default EntitySet;
