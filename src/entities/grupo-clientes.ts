import {scheduler} from '..';
import Entity from '../api/entity';

export const GRUPO_CLIENTS_NAME = 'GrupoClientes';

export class GrupoClientes extends Entity {
  constructor() {
    super(GRUPO_CLIENTS_NAME);
    scheduler.logEntityCreation(this);
  }
}

export default GrupoClientes;
