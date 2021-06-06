import {atendentes1, atendentes2, cozinhaQueue, scheduler} from '..';
import Event from '../api/event';
import Resource from '../api/resource';
import GrupoClientesEntity from '../entities/grupo-clientes';
import PedidoEntity from '../entities/pedido';
import {AtenderCaixa1Event, AtenderCaixa2Event} from './atender-caixa';
import CozinharPedidoEvent from './cozinhar-pedido';
import RotearMesaEvent from './rotear-mesa';

abstract class FinalizarCaixaEvent extends Event {
  constructor(name: string,
    private atendente: Resource,
    private cliente: GrupoClientesEntity,
  ) {
    super(name);
  }

  execute() {
    this.atendente.release();
    scheduler.scheduleNow(new RotearMesaEvent(this.cliente));

    const pedido = new PedidoEntity(this.cliente);
    cozinhaQueue.insert(pedido);
    scheduler.scheduleNow(new CozinharPedidoEvent());
  }
}

export class FinalizarCaixa1Event extends FinalizarCaixaEvent {
  constructor(cliente: GrupoClientesEntity) {
    super('FinalizarCaixa1Event', atendentes1, cliente);
  }

  execute() {
    super.execute();
    scheduler.scheduleNow(new AtenderCaixa1Event());
  }
}

export class FinalizarCaixa2Event extends FinalizarCaixaEvent {
  constructor(cliente: GrupoClientesEntity) {
    super('FinalizarCaixa2Event', atendentes2, cliente);
  }

  execute() {
    super.execute();
    scheduler.scheduleNow(new AtenderCaixa2Event());
  }
}
