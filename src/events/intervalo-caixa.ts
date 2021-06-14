import moment from 'moment';
import {garcons, MAIN_MODEL_UNIT, scheduler} from '..';
import Event from '../api/event';
import {randomUniform} from '../api/random';
import {getSimulationDuration} from '../api/time';
import GarcomEntity from '../entities/garcom';

export class IntervaloCaixaEvent extends Event {
  constructor() {
    super('IntervaloCaixaEvent');
  }

  execute() {
    const garcomDisponivel = garcons.find((garcom) => garcom.isAvailable());

    if (garcomDisponivel) {
      garcomDisponivel.replaceCashier();
      scheduler.scheduleIn(new FimIntervaloCaixaEvent(garcomDisponivel),
          moment.duration(randomUniform(1, 2), MAIN_MODEL_UNIT));
    }

    if (getSimulationDuration().asMinutes() < 100) {
      scheduler.scheduleIn(new IntervaloCaixaEvent(),
          moment.duration(randomUniform(40, 60), MAIN_MODEL_UNIT));
    }
  }
}

export class FimIntervaloCaixaEvent extends Event {
  constructor(private garcom: GarcomEntity) {
    super('FimIntervaloCaixaEvent');
  }

  execute() {
    this.garcom.cashierBack();
  }
}
