import {atendentes1, atendentes2, caixa1Queue, caixa2Queue, scheduler} from '..';
import Event from '../api/event';
import GrupoClientes from '../entities/grupo-clientes';
import {AtenderCaixa1Event, AtenderCaixa2Event} from './atender-caixa';
import RotearMesaEvent from './rotear-mesa';

export class FinalizarCaixa1Event extends Event {
  constructor(
    private cliente: GrupoClientes,
  ) {
    super('FinalizarCaixa1Event');
  }

  execute() {
    atendentes1.release();
    scheduler.scheduleNow(new RotearMesaEvent(this.cliente));

    if (caixa1Queue.isNotEmpty()) {
      console.log('Atendendo cliente da fila:', caixa1Queue.getSize());
      const proximoCliente = caixa1Queue.remove();
      if (proximoCliente) {
        scheduler.scheduleNow(new AtenderCaixa1Event(proximoCliente));
      }
    }
  }
}

export class FinalizarCaixa2Event extends Event {
  constructor(
    private cliente: GrupoClientes,
  ) {
    super('FinalizarCaixa2Event');
  }

  execute() {
    atendentes2.release();
    scheduler.scheduleNow(new RotearMesaEvent(this.cliente));

    if (caixa2Queue.isNotEmpty()) {
      console.log('Atendendo cliente da fila:', caixa2Queue.getSize());
      const proximoCliente = caixa2Queue.remove();
      if (proximoCliente) {
        scheduler.scheduleNow(new AtenderCaixa2Event(proximoCliente));
      }
    }
  }
}
