import moment from 'moment';
import {cozinhaQueue, cozinheiros, scheduler} from '..';
import Event from '../api/event';
import PedidoEntity from '../entities/pedido';
import FinalizarPedidoEvent from './finalizar-pedido';

export class CozinharPedidoEvent extends Event {
  constructor(private pedido: PedidoEntity) {
    super('CozinharPedidoEvent');
  }

  execute() {
    if (cozinheiros.isAvailable()) {
      cozinheiros.allocate();
      scheduler.scheduleIn(new FinalizarPedidoEvent(this.pedido), moment.duration(40, 'seconds'));
    } else {
      cozinhaQueue.insert(this.pedido);
    }
  }
}

export default CozinharPedidoEvent;
