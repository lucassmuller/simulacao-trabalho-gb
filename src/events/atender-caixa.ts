import moment from 'moment';
import {atendentes1, atendentes2, scheduler} from '..';
import Event from '../api/event';
import GrupoClientes from '../entities/grupo-clientes';
import {FinalizarCaixa1Event, FinalizarCaixa2Event} from './finalizar-caixa';

export class AtenderCaixa1Event extends Event {
  constructor(
    private cliente: GrupoClientes,
  ) {
    super('AtenderCaixa1Event');
  }

  execute() {
    atendentes1.allocate();
    scheduler.scheduleIn(new FinalizarCaixa1Event(this.cliente), moment.duration(12, 'seconds'));
  }
}

export class AtenderCaixa2Event extends Event {
  constructor(
    private cliente: GrupoClientes,
  ) {
    super('AtenderCaixa2Event');
  }

  execute() {
    atendentes2.allocate();
    scheduler.scheduleIn(new FinalizarCaixa2Event(this.cliente), moment.duration(12, 'seconds'));
  }
}
