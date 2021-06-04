import {bancosBalcao, bancosBalcaoQueue, mesas2,
  mesas2Queue, mesas4, mesas4Queue, scheduler} from '..';
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
      this.proximoClienteBalcao();
    } else if (this.cliente.getSize() === 2) {
      mesas2.release();
      this.proximoClienteMesa2();
    } else if (this.cliente.getSize() > 2) {
      mesas4.release();
      this.proximoClienteMesa4();
    }
  }

  private proximoClienteBalcao() {
    if (bancosBalcaoQueue.isNotEmpty()) {
      scheduler.scheduleNow(new EntrarFilaBalcaoEvent(
        bancosBalcaoQueue.remove()!,
      ));
    }
  }

  private proximoClienteMesa2() {
    if (mesas2Queue.isNotEmpty()) {
      scheduler.scheduleNow(new EntrarFilaMesa2Event(
        mesas2Queue.remove()!,
      ));
    }
  }

  private proximoClienteMesa4() {
    if (mesas4Queue.isNotEmpty()) {
      scheduler.scheduleNow(new EntrarFilaMesa4Event(
        mesas4Queue.remove()!,
      ));
    }
  }
}

export default SaidaClienteEvent;
