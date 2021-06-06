import {bancosBalcao, bancosBalcaoQueue, garcons, mesas2,
  mesas2Queue, mesas4, mesas4Queue, scheduler} from '..';
import EntitySet from '../api/entity-set';
import Event from '../api/event';
import Resource from '../api/resource';
import GrupoClientesEntity from '../entities/grupo-clientes';
import {LimparMesaEvent} from './limpar-mesa';

abstract class EntrarFilaEvent extends Event {
  constructor(name: string,
    private queue: EntitySet<GrupoClientesEntity>,
    private resource: Resource,
  ) {
    super(name);
  }

  execute() {
    const garcomDisponivel = garcons.find((garcom) => garcom.isAvailable());

    if (this.queue.isNotEmpty() && this.resource.isAvailable() && garcomDisponivel) {
      garcomDisponivel.cleanTable();
      const proximoCliente = this.queue.remove()!;
      scheduler.scheduleNow(new LimparMesaEvent(
          garcomDisponivel,
          this.getAllocateEvent(proximoCliente)));
    }
  }

  private getAllocateEvent(cliente: GrupoClientesEntity) {
    const resource = this.resource;
    return new class extends Event {
      execute() {
        resource.allocate();
        console.log('Cliente', cliente.getId(), 'sentou na mesa.');
        // Cliente espera o pedido, que chega por outro evento
      }
    }('AllocateMesaEvent');
  }
}

export class EntrarFilaBalcaoEvent extends EntrarFilaEvent {
  constructor() {
    super('EntrarFilaBalcaoEvent', bancosBalcaoQueue, bancosBalcao);
  }
}

export class EntrarFilaMesa2Event extends EntrarFilaEvent {
  constructor() {
    super('EntrarFilaMesa2Event', mesas2Queue, mesas2);
  }
}

export class EntrarFilaMesa4Event extends EntrarFilaEvent {
  constructor() {
    super('EntrarFilaMesa4Event', mesas4Queue, mesas4);
  }
}
