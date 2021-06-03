import moment, {Moment} from 'moment';
import {getSimulationTime, getSimulationDuration} from './time';

interface ResourceAllocation {
  quantity: number
  time: Moment
  isAllocation: boolean
}

export class Resource {
  private id = Math.random()
  private allocations: ResourceAllocation[] = []

  constructor(
    private name: string,
    private quantity: number = 1,
  ) { }

  getId = () => this.id;
  getName = () => this.name;

  allocate(quantity: number = 1) {
    const canAllocate = quantity <= this.getFreeQuantity();

    if (canAllocate) {
      this.allocations.push({
        quantity,
        time: getSimulationTime(),
        isAllocation: true,
      });
    }

    return canAllocate;
  }

  release(quantity: number = 1) {
    if (quantity > this.getAllocatedQuantity()) {
      throw new Error('The release quantity is greater than the allocated quantity.');
    } else {
      this.allocations.push({
        quantity,
        time: getSimulationTime(),
        isAllocation: false,
      });
    }
  }

  isAvailable() {
    return this.getFreeQuantity() > 0;
  }

  getFreeQuantity() {
    return this.quantity - this.getAllocatedQuantity();
  }

  getAllocatedQuantity() {
    return this.allocations
        .map(({quantity, isAllocation}) => isAllocation ? quantity : -quantity)
        .reduce((p, c) => p + c, 0);
  }

  allocationRate() {
    const allocationsDuration = this.allocations
        .map(({time, isAllocation}) => {
          const diff = getSimulationTime().diff(time);

          return isAllocation ? diff : -diff;
        })
        .reduce((p, c) => p + c, 0);

    const allocationSeconds = moment.duration(allocationsDuration).asSeconds();

    return allocationSeconds / getSimulationDuration().asSeconds();
  }

  averageAllocation() {
    const allocationsSinceCreation = this.allocations
        .filter(({isAllocation}) => isAllocation)
        .map(({quantity}) => quantity)
        .reduce((p, c) => p + c, 0);

    return allocationsSinceCreation / getSimulationDuration().asSeconds();
  }
}

export default Resource;
