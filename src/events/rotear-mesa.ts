import Event from '../api/event';
import GrupoClientesEntity from '../entities/grupo-clientes';

// Envia cliente para mesa ou adiciona a fila se não houver lugar
export class RotearMesaEvent extends Event {
  constructor(private cliente: GrupoClientesEntity) {
    super('RotearMesaEvent');
  }

  execute() {
    console.log('Atendimento de cliente finalizado!',
        this.cliente.getTimeSinceCreation().asSeconds());
  }
}

export default RotearMesaEvent;
