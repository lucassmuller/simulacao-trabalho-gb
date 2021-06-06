import {cozinheiros, pedidosProntosQueue, scheduler} from '..';
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
    pedidosProntosQueue.insert(this.pedido);
    scheduler.scheduleNow(new PedidoProntoEvent());
    scheduler.scheduleNow(new CozinharPedidoEvent());
  }
}

export default FinalizarPedidoEvent;
