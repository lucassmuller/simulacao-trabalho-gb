import moment from 'moment';
import {atendentes1, atendentes2, caixa1Queue, caixa2Queue, scheduler} from '..';
import Event from '../api/event';
import {getSimulationDuration} from '../api/time';
import GrupoClientesEntity from '../entities/grupo-clientes';
import {AtenderCaixa1Event, AtenderCaixa2Event} from './atender-caixa';

export class ChegadaClienteEvent extends Event {
  constructor() {
    super('ChegadaCliente');
  }

  execute() {
    const cliente = new GrupoClientesEntity();

    if (atendentes1.isAvailable()) {
      scheduler.scheduleNow(new AtenderCaixa1Event(cliente));
    } else if (atendentes2.isAvailable()) {
      scheduler.scheduleNow(new AtenderCaixa2Event(cliente));
    } else if (caixa1Queue.getSize() < caixa2Queue.getSize()) {
      caixa1Queue.insert(cliente);
    } else {
      caixa2Queue.insert(cliente);
    }

    // Gera chegada de novos clientes
    if (getSimulationDuration().asSeconds() < 200) {
      scheduler.scheduleIn(new ChegadaClienteEvent(), moment.duration(5, 'seconds'));
    }
  }
}

export default ChegadaClienteEvent;
