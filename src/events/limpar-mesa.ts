import moment from 'moment';
import {MAIN_MODEL_UNIT, scheduler} from '..';
import Event from '../api/event';
import {randomUniform} from '../api/random';
import GarcomEntity, {GarcomState} from '../entities/garcom';

export class LimparMesaEvent extends Event {
  constructor(private garcom: GarcomEntity, private nextEvent: Event) {
    super('LimparMesaEvent');
  }

  execute() {
    if (this.garcom.getCurrentState() === GarcomState.CLEANING_TABLE) {
      scheduler.scheduleIn(
          new MesaLimpaEvent(this.garcom, this.nextEvent),
          moment.duration(randomUniform(2, 5), MAIN_MODEL_UNIT));
    }
  }
}

export class MesaLimpaEvent extends Event {
  constructor(private garcom: GarcomEntity, private nextEvent: Event) {
    super('MesaLimpaEvent');
  }

  execute() {
    this.garcom.tableCleaned();
    scheduler.scheduleNow(this.nextEvent);
  }
}
