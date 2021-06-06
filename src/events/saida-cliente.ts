import {bancosBalcao, mesas2, mesas4, scheduler} from '..';
import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';
import {EntrarFilaBalcaoEvent, EntrarFilaMesa2Event, EntrarFilaMesa4Event} from './fila-mesa';

export class SaidaClienteEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('SaidaClienteEvent');
  }

  execute() {
    this.cliente.destroy();

    if (this.cliente.getSize() === 1) {
      bancosBalcao.release();
      scheduler.scheduleNow(new EntrarFilaBalcaoEvent());
    } else if (this.cliente.getSize() === 2) {
      mesas2.release();
      scheduler.scheduleNow(new EntrarFilaMesa2Event());
    } else if (this.cliente.getSize() > 2) {
      mesas4.release();
      scheduler.scheduleNow(new EntrarFilaMesa4Event());
    }
  }
}

export default SaidaClienteEvent;
