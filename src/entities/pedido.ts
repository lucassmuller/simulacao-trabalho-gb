import {scheduler} from '..';
import Entity from '../api/entity';
import GrupoClientesEntity from './grupo-clientes';

export const PEDIDO_NAME = 'PedidoEntity';

export class PedidoEntity extends Entity {
  constructor(private cliente: GrupoClientesEntity) {
    super(PEDIDO_NAME);
    scheduler.logEntityCreation(this);
  }

  getCliente = () => this.cliente;

  destroy() {
    scheduler.logEntityDestruction(this);
  }
}

export default PedidoEntity;
