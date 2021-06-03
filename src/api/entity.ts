import moment from 'moment';
import PetriNet from './petri-net';
import {getSimulationTime} from './time';

export class Entity {
  private id = Math.random()
  private priority = 255
  private creationTime = getSimulationTime()

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

  getTimeSinceCreation = () => moment.duration(getSimulationTime().diff(this.creationTime))
}

export default Entity;
