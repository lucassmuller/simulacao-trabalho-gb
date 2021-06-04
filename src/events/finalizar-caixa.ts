import {atendentes1, atendentes2, caixa1Queue, caixa2Queue, scheduler} from '..';
import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';
import PedidoEntity from '../entities/pedido';
import {AtenderCaixa1Event, AtenderCaixa2Event} from './atender-caixa';
import CozinharPedidoEvent from './cozinhar-pedido';
import RotearMesaEvent from './rotear-mesa';

export class FinalizarCaixa1Event extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('FinalizarCaixa1Event');
  }

  execute() {
    atendentes1.release();

    const pedido = new PedidoEntity(this.cliente);
    scheduler.scheduleNow(new CozinharPedidoEvent(pedido));
    scheduler.scheduleNow(new RotearMesaEvent(this.cliente));

    if (caixa1Queue.isNotEmpty()) {
      console.log('Atendendo cliente na fila:', caixa1Queue.getSize());
      const proximoCliente = caixa1Queue.remove();
      if (proximoCliente) {
        scheduler.scheduleNow(new AtenderCaixa1Event(proximoCliente));
      }
    }
  }
}

export class FinalizarCaixa2Event extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('FinalizarCaixa2Event');
  }

  execute() {
    atendentes2.release();
    scheduler.scheduleNow(new RotearMesaEvent(this.cliente));

    const pedido = new PedidoEntity(this.cliente);
    scheduler.scheduleNow(new CozinharPedidoEvent(pedido));
    scheduler.scheduleNow(new RotearMesaEvent(this.cliente));

    if (caixa2Queue.isNotEmpty()) {
      console.log('Atendendo cliente da fila:', caixa2Queue.getSize());
      scheduler.scheduleNow(new AtenderCaixa2Event(caixa2Queue.remove()!));
    }
  }
}
