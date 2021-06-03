import {scheduler} from '..';
import Entity from '../api/entity';

export const GRUPO_CLIENTS_NAME = 'GrupoClientesEntity';

export class GrupoClientesEntity extends Entity {
  constructor() {
    super(GRUPO_CLIENTS_NAME);
    scheduler.logEntityCreation(this);
  }
}

export default GrupoClientesEntity;
