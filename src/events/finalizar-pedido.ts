import {cozinhaQueue, cozinheiros, scheduler} from '..';
import Event from '../api/event';
import PedidoEntity from '../entities/pedido';
import CozinharPedidoEvent from './cozinhar-pedido';
import PedidoProntoEvent from './pedido-pronto';

export class FinalizarPedidoEvent extends Event {
  constructor(private pedido: PedidoEntity) {
    super('FinalizarPedidoEvent');
  }

  execute() {
    cozinheiros.release();
    scheduler.scheduleNow(new PedidoProntoEvent(this.pedido));

    if (cozinhaQueue.isNotEmpty()) {
      console.log('Atendendo pedido na fila:', cozinhaQueue.getSize());
      scheduler.scheduleNow(new CozinharPedidoEvent(cozinhaQueue.remove()!));
    }
  }
}

export default FinalizarPedidoEvent;
