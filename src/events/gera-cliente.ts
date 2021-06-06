import moment from 'moment';
import {scheduler} from '..';
import Event from '../api/event';
import {randomExponential} from '../api/random';
import GrupoClientesEntity, {GRUPO_CLIENTS_NAME} from '../entities/grupo-clientes';
import ChegadaClienteEvent from './chegada-cliente';

export class GeraChegadaClienteEvent extends Event {
  constructor() {
    super('GeraChegadaClienteEvent');
  }

  execute() {
    if (scheduler.getEntityTotalQuantityByName(GRUPO_CLIENTS_NAME) < 545) {
      const cliente = new GrupoClientesEntity();
      scheduler.scheduleIn(new ChegadaClienteEvent(cliente),
          moment.duration(randomExponential(3), 'minutes'));
      scheduler.scheduleIn(new GeraChegadaClienteEvent(), moment.duration(30, 'seconds'));
    }
  }
}

export default GeraChegadaClienteEvent;
