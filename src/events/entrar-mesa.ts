import {bancosBalcao, mesas2, mesas4} from '..';
import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';

export class EntrarBalcaoEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('EntrarBalcaoEvent');
  }

  execute() {
    bancosBalcao.allocate();
    // Cliente espera o pedido, que chega por outro evento
  }
}

export class EntrarMesa2Event extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('EntrarMesa2Event');
  }

  execute() {
    mesas2.allocate();
    // Cliente espera o pedido, que chega por outro evento
  }
}

export class EntrarMesa4Event extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('EntrarMesa4Event');
  }

  execute() {
    mesas4.allocate();
    // Cliente espera o pedido, que chega por outro evento
  }
}
