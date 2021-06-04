import {scheduler} from '..';
import Entity from '../api/entity';

export const GRUPO_CLIENTS_NAME = 'GrupoClientesEntity';

export class GrupoClientesEntity extends Entity {
  constructor(private size = getRandomSize()) {
    super(GRUPO_CLIENTS_NAME);
    scheduler.logEntityCreation(this);
  }

  getSize = () => this.size;

  destroy() {
    scheduler.logEntityDestruction(this);
  }
}

const getRandomSize = () => Math.floor(Math.random() * 4) + 1;

export default GrupoClientesEntity;
