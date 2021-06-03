import moment from 'moment';
import {atendentes1, atendentes2, scheduler} from '..';
import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';
import {FinalizarCaixa1Event, FinalizarCaixa2Event} from './finalizar-caixa';

const FINALIZAR_CAIXA_SCHEDULE = moment.duration(12, 'seconds');

export class AtenderCaixa1Event extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('AtenderCaixa1Event');
  }

  execute() {
    atendentes1.allocate();
    scheduler.scheduleIn(new FinalizarCaixa1Event(this.cliente), FINALIZAR_CAIXA_SCHEDULE);
  }
}

export class AtenderCaixa2Event extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('AtenderCaixa2Event');
  }

  execute() {
    atendentes2.allocate();
    scheduler.scheduleIn(new FinalizarCaixa2Event(this.cliente), FINALIZAR_CAIXA_SCHEDULE);
  }
}
