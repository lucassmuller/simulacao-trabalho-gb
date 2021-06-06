import {scheduler} from '..';
import Entity from '../api/entity';
import {randomUniform} from '../api/random';

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

const getRandomSize = () => Math.floor(randomUniform(1, 5));

export default GrupoClientesEntity;
