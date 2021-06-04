import moment from 'moment';
import {scheduler} from '..';
import Event from '../api/event';
import GarcomEntity from '../entities/garcom';

export class LimparMesaEvent extends Event {
  constructor(private garcom: GarcomEntity, private nextEvent: Event) {
    super('LimparMesaEvent');
  }

  execute() {
    if (this.garcom.cleanTable()) {
      scheduler.scheduleIn(
          new MesaLimpaEvent(this.garcom, this.nextEvent),
          moment.duration(5, 'seconds'));
    } else {
      throw new Error('Garçom não disponível!');
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