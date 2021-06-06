import moment from 'moment';
import {garcons, pedidosProntosQueue, scheduler} from '..';
import Event from '../api/event';
import {randomUniform} from '../api/random';
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
          moment.duration(randomUniform(1, 5), 'minutes'));
    } else {
      pedidosProntosQueue.insert(this.pedido);
    }
  }
}

export default PedidoProntoEvent;
