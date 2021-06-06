import moment from 'moment';
import {cozinhaQueue, cozinheiros, scheduler} from '..';
import Event from '../api/event';
import {randomUniform} from '../api/random';
import FinalizarPedidoEvent from './finalizar-pedido';

export class CozinharPedidoEvent extends Event {
  constructor() {
    super('CozinharPedidoEvent');
  }

  execute() {
    if (cozinhaQueue.isNotEmpty() && cozinheiros.isAvailable()) {
      console.log('Atendendo pedido na fila:', cozinhaQueue.getSize());
      cozinheiros.allocate();

      const proximoPedido = cozinhaQueue.remove()!;
      scheduler.scheduleIn(new FinalizarPedidoEvent(proximoPedido),
          moment.duration(randomUniform(10, 30), 'minutes'));
    }
  }
}

export default CozinharPedidoEvent;
