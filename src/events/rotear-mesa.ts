import {scheduler} from '..';
import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';
import {EntrarFilaBalcaoEvent, EntrarFilaMesa2Event, EntrarFilaMesa4Event} from './fila-mesa';

export class RotearMesaEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('RotearMesaEvent');
  }

  execute() {
    if (this.cliente.getSize() === 1) {
      scheduler.scheduleNow(new EntrarFilaBalcaoEvent(this.cliente));
    } else if (this.cliente.getSize() === 2) {
      scheduler.scheduleNow(new EntrarFilaMesa2Event(this.cliente));
    } else if (this.cliente.getSize() > 2) {
      scheduler.scheduleNow(new EntrarFilaMesa4Event(this.cliente));
    }
  }
}

export default RotearMesaEvent;
