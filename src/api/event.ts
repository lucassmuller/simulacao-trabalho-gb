
export abstract class Event {
  private id = Math.random()

  constructor(
    private name: string,
  ) { }

  getId = () => this.id;
  getName = () => this.name;

  abstract execute(): void;
}

export default Event;
