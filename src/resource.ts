import moment, {Moment} from 'moment';

interface ResourceAllocation {
  quantity: number
  time: Moment
  isAllocation: boolean
}

export class Resource {
  private id = 0
  private creationTime = moment()
  private allocations: ResourceAllocation[] = []

  constructor(
    private name: string,
    private quantity: number = 1,
  ) { }

  getName = () => this.name

  allocate(quantity: number) {
    const canAllocate = quantity <= this.getFreeQuantity();

    if (canAllocate) {
      this.allocations.push({
        quantity,
        time: moment(),
        isAllocation: true,
      });
    }

    return canAllocate;
  }

  release(quantity: number) {
    if (quantity > this.getAllocatedQuantity()) {
      throw new Error('The release quantity is greater than the allocated quantity.');
    } else {
      this.allocations.push({
        quantity,
        time: moment(),
        isAllocation: false,
      });
    }
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
    const currentTime = moment();
    const allocationsDuration = this.allocations
        .map(({time, isAllocation}) => {
          const diff = currentTime.diff(time);

          return isAllocation ? diff : -diff;
        })
        .reduce((p, c) => p + c, 0);

    const allocationSeconds = moment.duration(allocationsDuration).seconds();

    return allocationSeconds / this.getSimulationDuration(currentTime);
  }

  averageAllocation() {
    const allocationsSinceCreation = this.allocations
        .filter(({isAllocation}) => isAllocation)
        .map(({quantity}) => quantity)
        .reduce((p, c) => p + c, 0);

    return allocationsSinceCreation / this.getSimulationDuration();
  }

  private getSimulationDuration(time = moment()) {
    return moment.duration(time.diff(this.creationTime)).seconds();
  }
}

export default Resource;
