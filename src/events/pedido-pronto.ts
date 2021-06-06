import moment from 'moment';
import {garcons, pedidosProntosQueue, scheduler} from '..';
import Event from '../api/event';
import {randomUniform} from '../api/random';
import PedidoEntregueEvent from './pedido-entregue';

export class PedidoProntoEvent extends Event {
  constructor() {
    super('PedidoProntoEvent');
  }

  execute() {
    const garcomDisponivel = garcons.find((garcom) => garcom.isAvailable());

    if (pedidosProntosQueue.isNotEmpty() && garcomDisponivel) {
      garcomDisponivel.deliverOrder();
      const proximoPedido = pedidosProntosQueue.remove()!;
      scheduler.scheduleIn(
          new PedidoEntregueEvent(proximoPedido, garcomDisponivel),
          moment.duration(randomUniform(1, 5), 'minutes'));
    }
  }
}

export default PedidoProntoEvent;
