import {cozinhaQueue, cozinheiros, pedidosProntosQueue, scheduler} from '..';
import Event from '../api/event';
import PedidoEntity from '../entities/pedido';
import CozinharPedidoEvent from './cozinhar-pedido';

export class FinalizarPedidoEvent extends Event {
  constructor(private pedido: PedidoEntity) {
    super('FinalizarPedidoEvent');
  }

  execute() {
    cozinheiros.release();

    console.log('Pedido pronto!', this.pedido.getId());
    pedidosProntosQueue.insert(this.pedido);
    // Adicionar fluxo de entregar pedido

    if (cozinhaQueue.isNotEmpty()) {
      console.log('Atendendo pedido na fila:', cozinhaQueue.getSize());
      const proximoPedido = cozinhaQueue.remove();
      if (proximoPedido) {
        scheduler.scheduleNow(new CozinharPedidoEvent(proximoPedido));
      }
    }
  }
}

export default FinalizarPedidoEvent;
