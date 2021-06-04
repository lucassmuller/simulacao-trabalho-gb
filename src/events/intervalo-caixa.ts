import moment from 'moment';
import {garcons, scheduler} from '..';
import Event from '../api/event';
import Resource from '../api/resource';
import {getSimulationDuration} from '../api/time';
import GarcomEntity from '../entities/garcom';

export class IntervaloCaixaEvent extends Event {
  constructor(private resource: Resource) {
    super('IntervaloCaixaEvent');
  }

  execute() {
    const garcomDisponivel = garcons.find((garcom) => garcom.isAvailable());

    if (garcomDisponivel && this.resource.isAvailable()) {
      this.resource.allocate();
      garcomDisponivel.replaceCashier();
      scheduler.scheduleIn(new FimIntervaloCaixaEvent(garcomDisponivel, this.resource),
          moment.duration(60, 'seconds'));
    }

    if (getSimulationDuration().asSeconds() < 100) {
      scheduler.scheduleIn(new IntervaloCaixaEvent(this.resource), moment.duration(60, 'seconds'));
    }
  }
}

export class FimIntervaloCaixaEvent extends Event {
  constructor(private garcom: GarcomEntity, private resource: Resource) {
    super('FimIntervaloCaixaEvent');
  }

  execute() {
    this.garcom.cashierBack();
    this.resource.release();
  }
}