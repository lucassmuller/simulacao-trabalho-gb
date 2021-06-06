import {bancosBalcaoQueue, mesas2Queue, mesas4Queue, scheduler} from '..';
import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';
import {EntrarFilaBalcaoEvent, EntrarFilaMesa2Event, EntrarFilaMesa4Event} from './fila-mesa';

export class RotearMesaEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('RotearMesaEvent');
  }

  execute() {
    if (this.cliente.getSize() === 1) {
      bancosBalcaoQueue.insert(this.cliente);
      scheduler.scheduleNow(new EntrarFilaBalcaoEvent());
    } else if (this.cliente.getSize() === 2) {
      mesas2Queue.insert(this.cliente);
      scheduler.scheduleNow(new EntrarFilaMesa2Event());
    } else if (this.cliente.getSize() > 2) {
      mesas4Queue.insert(this.cliente);
      scheduler.scheduleNow(new EntrarFilaMesa4Event());
    }
  }
}

export default RotearMesaEvent;
