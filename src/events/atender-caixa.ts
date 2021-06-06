import moment from 'moment';
import {atendentes1, atendentes2, caixa1Queue, caixa2Queue, scheduler} from '..';
import Event from '../api/event';
import {randomNormal} from '../api/random';
import {FinalizarCaixa1Event, FinalizarCaixa2Event} from './finalizar-caixa';

const getCaixaDelay = () => moment.duration(randomNormal(8, 2), 'minutes');

export class AtenderCaixa1Event extends Event {
  constructor() {
    super('AtenderCaixa1Event');
  }

  execute() {
    if (caixa1Queue.isNotEmpty() && atendentes1.isAvailable()) {
      console.log('Atendendo cliente na fila 1:', caixa1Queue.getSize());
      atendentes1.allocate();

      const proximoCliente = caixa1Queue.remove()!;
      scheduler.scheduleIn(new FinalizarCaixa1Event(proximoCliente), getCaixaDelay());
    }
  }
}

export class AtenderCaixa2Event extends Event {
  constructor() {
    super('AtenderCaixa2Event');
  }

  execute() {
    if (caixa2Queue.isNotEmpty() && atendentes2.isAvailable()) {
      console.log('Atendendo cliente na fila 2:', caixa2Queue.getSize());
      atendentes2.allocate();

      const proximoCliente = caixa2Queue.remove()!;
      scheduler.scheduleIn(new FinalizarCaixa2Event(proximoCliente), getCaixaDelay());
    }
  }
}
