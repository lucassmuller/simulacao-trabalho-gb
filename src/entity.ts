import moment from 'moment';
import PetriNet from './petri-net';

export class Entity {
  private id = 0
  private priority = 255
  private creationTime = moment()

  constructor(
    private name: string,
    private petriNet?: PetriNet,
  ) { }

  getId = () => this.id
  getName = () => this.name

  getPriority = () => this.priority
  setPriority = (priority: number) => this.priority = priority

  getPetriNet = () => this.petriNet
  setPetriNet = (petriNet: PetriNet) => this.petriNet = petriNet

  getTimeSinceCreation = () => moment.duration(moment().diff(this.creationTime))
}

export default Entity;
