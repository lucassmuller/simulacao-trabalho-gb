import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';

export class SaidaClienteEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('SaidaClienteEvent');
  }

  execute() {
    this.cliente.destroy();
    // Limpar mesa. Como saber qual mesa o cliente estava?
  }
}

export default SaidaClienteEvent;
