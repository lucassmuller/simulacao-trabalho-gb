import {bancosBalcao, bancosBalcaoQueue, garcons, mesas2,
  mesas2Queue, mesas4, mesas4Queue, scheduler} from '..';
import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';
import {EntrarBalcaoEvent, EntrarMesa2Event, EntrarMesa4Event} from './entrar-mesa';
import {LimparMesaEvent} from './limpar-mesa';

export class EntrarFilaBalcaoEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('EntrarFilaBalcaoEvent');
  }

  execute() {
    const garcomDisponivel = garcons.find((garcom) => garcom.isAvailable());

    if (bancosBalcao.isAvailable() && garcomDisponivel) {
      scheduler.scheduleNow(new LimparMesaEvent(
          garcomDisponivel,
          new EntrarBalcaoEvent(this.cliente)));
    } else {
      bancosBalcaoQueue.insert(this.cliente);
    }
  }
}

export class EntrarFilaMesa2Event extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('EntrarFilaMesa2Event');
  }

  execute() {
    const garcomDisponivel = garcons.find((garcom) => garcom.isAvailable());

    if (mesas2.isAvailable() && garcomDisponivel) {
      scheduler.scheduleNow(new LimparMesaEvent(
          garcomDisponivel,
          new EntrarMesa2Event(this.cliente)));
    } else {
      mesas2Queue.insert(this.cliente);
    }
  }
}

export class EntrarFilaMesa4Event extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('EntrarFilaMesa4Event');
  }

  execute() {
    const garcomDisponivel = garcons.find((garcom) => garcom.isAvailable());

    if (mesas4.isAvailable() && garcomDisponivel) {
      scheduler.scheduleNow(new LimparMesaEvent(
          garcomDisponivel,
          new EntrarMesa4Event(this.cliente)));
    } else {
      mesas4Queue.insert(this.cliente);
    }
  }
}
