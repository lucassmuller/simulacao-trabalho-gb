import {caixa1Queue, caixa2Queue, scheduler} from '..';
import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';
import {AtenderCaixa1Event, AtenderCaixa2Event} from './atender-caixa';

export class ChegadaClienteEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('ChegadaClienteEvent');
  }

  execute() {
    if (caixa1Queue.getSize() <= caixa2Queue.getSize()) {
      caixa1Queue.insert(this.cliente);
      scheduler.scheduleNow(new AtenderCaixa1Event());
    } else {
      caixa2Queue.insert(this.cliente);
      scheduler.scheduleNow(new AtenderCaixa2Event());
    }
  }
}

export default ChegadaClienteEvent;
