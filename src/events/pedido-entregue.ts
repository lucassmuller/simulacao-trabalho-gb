import {pedidosProntosQueue, scheduler} from '..';
import Event from '../api/event';
import GarcomEntity from '../entities/garcom';
import PedidoEntity from '../entities/pedido';
import ClienteComendoEvent from './cliente-comendo';
import PedidoProntoEvent from './pedido-pronto';

export class PedidoEntregueEvent extends Event {
  constructor(
    private pedido: PedidoEntity,
    private garcom: GarcomEntity,
  ) {
    super('PedidoEntregueEvent');
  }

  execute() {
    this.garcom.orderDelivered();
    this.pedido.destroy();
    scheduler.scheduleNow(new ClienteComendoEvent(this.pedido.getCliente()));

    if (pedidosProntosQueue.isNotEmpty()) {
      console.log('Atendendo pedido na fila:', pedidosProntosQueue.getSize());
      const proximoPedido = pedidosProntosQueue.remove();
      if (proximoPedido) {
        scheduler.scheduleNow(new PedidoProntoEvent(proximoPedido));
      }
    }
  }
}

export default PedidoEntregueEvent;
