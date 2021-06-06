import moment from 'moment';
import {cozinhaQueue, cozinheiros, scheduler} from '..';
import Event from '../api/event';
import {randomUniform} from '../api/random';
import PedidoEntity from '../entities/pedido';
import FinalizarPedidoEvent from './finalizar-pedido';

export class CozinharPedidoEvent extends Event {
  constructor(private pedido: PedidoEntity) {
    super('CozinharPedidoEvent');
  }

  execute() {
    if (cozinheiros.isAvailable()) {
      cozinheiros.allocate();
      scheduler.scheduleIn(new FinalizarPedidoEvent(this.pedido),
          moment.duration(randomUniform(20, 40), 'minutes'));
    } else {
      cozinhaQueue.insert(this.pedido);
    }
  }
}

export default CozinharPedidoEvent;
