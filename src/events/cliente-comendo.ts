import moment from 'moment';
import {scheduler} from '..';
import Event from '../api/event';
import {randomUniform} from '../api/random';
import GrupoClientesEntity from '../entities/grupo-clientes';
import SaidaClienteEvent from './saida-cliente';

export class ClienteComendoEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('ClienteComendoEvent');
  }

  execute() {
    scheduler.scheduleIn(new SaidaClienteEvent(this.cliente),
        moment.duration(randomUniform(5, 15), 'minutes'));
  }
}

export default ClienteComendoEvent;
