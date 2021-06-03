import EntitySet, {EntitySetMode} from './api/entity-set';
import Resource from './api/resource';
import Scheduler from './api/scheduler';
import {getSimulationDuration} from './api/time';
import GrupoClientes, {GRUPO_CLIENTS_NAME} from './entities/grupo-clientes';
import ChegadaClienteEvent from './events/chegada-cliente';

export const scheduler = new Scheduler();

export const atendentes1 = new Resource('AtendentesCaixa1', 1);
export const caixa1Queue = new EntitySet<GrupoClientes>('Caixa1Queue', EntitySetMode.FIFO);

export const atendentes2 = new Resource('AtendentesCaixa2', 1);
export const caixa2Queue = new EntitySet<GrupoClientes>('Caixa2Queue', EntitySetMode.FIFO);

scheduler.scheduleNow(new ChegadaClienteEvent());
scheduler.simulate();

console.log('Simulation duration:', getSimulationDuration().asSeconds());
console.log('Clientes atendidos:', scheduler.getEntityTotalQuantityByName(GRUPO_CLIENTS_NAME));
console.log('Atendentes allocation rate:', atendentes1.allocationRate());
console.log('Atendentes average allocation:', atendentes1.averageAllocation());
