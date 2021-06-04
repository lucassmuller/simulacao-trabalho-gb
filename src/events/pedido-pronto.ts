import moment from 'moment';
import {garcons, pedidosProntosQueue, scheduler} from '..';
import Event from '../api/event';
import PedidoEntity from '../entities/pedido';
import PedidoEntregueEvent from './pedido-entregue';

export class PedidoProntoEvent extends Event {
  constructor(private pedido: PedidoEntity) {
    super('PedidoProntoEvent');
  }

  execute() {
    const garcomDisponivel = garcons.find((garcom) => garcom.isAvailable());

    if (garcomDisponivel && garcomDisponivel.deliverOrder()) {
      scheduler.scheduleIn(
          new PedidoEntregueEvent(this.pedido, garcomDisponivel),
          moment.duration(10, 'seconds'));
    } else {
      pedidosProntosQueue.insert(this.pedido);
    }
  }
}

export default PedidoProntoEvent;
