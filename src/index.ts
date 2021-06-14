import moment from 'moment';
import EntitySet, {EntitySetMode} from './api/entity-set';
import Resource from './api/resource';
import Scheduler from './api/scheduler';
import {getSimulationDuration} from './api/time';
import GarcomEntity from './entities/garcom';
import GrupoClientesEntity, {GRUPO_CLIENTS_NAME} from './entities/grupo-clientes';
import PedidoEntity, {PEDIDO_NAME} from './entities/pedido';
import GeraChegadaClienteEvent from './events/gera-cliente';

export const scheduler = new Scheduler();
export const MAIN_MODEL_UNIT = 'minutes';

export const atendentes1 = new Resource('AtendentesCaixa1', 1);
export const caixa1Queue = new EntitySet<GrupoClientesEntity>('Caixa1Queue', EntitySetMode.FIFO);

export const atendentes2 = new Resource('AtendentesCaixa2', 1);
export const caixa2Queue = new EntitySet<GrupoClientesEntity>('Caixa2Queue', EntitySetMode.FIFO);

export const bancosBalcao = new Resource('BancosBalcao', 6);
export const bancosBalcaoQueue = new EntitySet<GrupoClientesEntity>(
    'BancosBalcaoQueue', EntitySetMode.FIFO);

export const mesas2 = new Resource('Mesas2', 4);
export const mesas2Queue = new EntitySet<GrupoClientesEntity>('Mesas2Queue', EntitySetMode.FIFO);

export const mesas4 = new Resource('Mesas4', 4);
export const mesas4Queue = new EntitySet<GrupoClientesEntity>('Mesas4Queue', EntitySetMode.FIFO);

export const cozinheiros = new Resource('Cozinheiros', 3);
export const cozinhaQueue = new EntitySet<PedidoEntity>('CozinheirosQueue', EntitySetMode.FIFO);
export const pedidosProntosQueue = new EntitySet<PedidoEntity>(
    'PedidosProntosQueue', EntitySetMode.FIFO);

export const garcons = Array(3).fill(undefined).map(() => new GarcomEntity());

scheduler.scheduleNow(new GeraChegadaClienteEvent());
// scheduler.scheduleIn(new IntervaloCaixaEvent(), moment.duration(10, MAIN_MODEL_UNIT));
caixa1Queue.startLog(moment.duration(10, MAIN_MODEL_UNIT), scheduler, 10);
caixa2Queue.startLog(moment.duration(10, MAIN_MODEL_UNIT), scheduler, 10);
bancosBalcaoQueue.startLog(moment.duration(30, MAIN_MODEL_UNIT), scheduler, 10);
mesas2Queue.startLog(moment.duration(30, MAIN_MODEL_UNIT), scheduler, 10);
mesas4Queue.startLog(moment.duration(30, MAIN_MODEL_UNIT), scheduler, 10);
cozinhaQueue.startLog(moment.duration(30, MAIN_MODEL_UNIT), scheduler, 10);
pedidosProntosQueue.startLog(moment.duration(30, MAIN_MODEL_UNIT), scheduler, 10);
// scheduler.simulateBy(moment.duration(1, 'hour'));
scheduler.simulate();

console.log('-----');
console.log('Simulation duration:', getSimulationDuration().asHours());
console.log('Clientes count:', scheduler.getEntityTotalQuantityByName(GRUPO_CLIENTS_NAME));
console.log('Pedidos count:', scheduler.getEntityTotalQuantityByName(PEDIDO_NAME));
console.log('Clientes average:', scheduler.averageTimeInModelByName(GRUPO_CLIENTS_NAME).asHours());
console.log('Pedidos average:', scheduler.averageTimeInModelByName(PEDIDO_NAME).asMinutes());
console.log('Atendentes 1 allocation rate:', atendentes1.allocationRate());
console.log('Atendentes 2 allocation rate:', atendentes2.allocationRate());
console.log('Cozinheiros allocation rate:', cozinheiros.allocationRate());
console.log('Atendentes average allocation:', atendentes1.averageAllocation());
console.log('Caixa 1 logs:', caixa1Queue.getLog());
console.log('Caixa 2 logs:', caixa2Queue.getLog());
console.log('Bancos Balcao logs:', bancosBalcaoQueue.getLog());
console.log('Mesas 2 logs:', mesas2Queue.getLog());
console.log('Mesas 4 logs:', mesas4Queue.getLog());
console.log('Cozinha logs:', cozinhaQueue.getLog());
console.log('Pedidos Prontos logs:', pedidosProntosQueue.getLog());
