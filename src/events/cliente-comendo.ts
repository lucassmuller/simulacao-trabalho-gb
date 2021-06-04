import moment from 'moment';
import {scheduler} from '..';
import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';
import SaidaClienteEvent from './saida-cliente';

export class ClienteComendoEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('ClienteComendoEvent');
  }

  execute() {
    scheduler.scheduleIn(new SaidaClienteEvent(this.cliente), moment.duration(20, 'seconds'));
  }
}

export default ClienteComendoEvent;
