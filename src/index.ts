import moment from 'moment';
import EntitySet, {EntitySetMode} from './api/entity-set';
import Resource from './api/resource';
import Scheduler from './api/scheduler';
import {getSimulationDuration} from './api/time';
import GarcomEntity from './entities/garcom';
import GrupoClientesEntity, {GRUPO_CLIENTS_NAME} from './entities/grupo-clientes';
import PedidoEntity, {PEDIDO_NAME} from './entities/pedido';
import ChegadaClienteEvent from './events/chegada-cliente';
// import {IntervaloCaixaEvent} from './events/intervalo-caixa';

export const scheduler = new Scheduler();

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

scheduler.scheduleNow(new ChegadaClienteEvent());
// scheduler.scheduleIn(new IntervaloCaixaEvent(atendentes1), moment.duration(10, 'seconds'));
// scheduler.scheduleIn(new IntervaloCaixaEvent(atendentes2), moment.duration(30, 'seconds'));
caixa1Queue.startLog(moment.duration(10, 'seconds'), scheduler, 10);
caixa2Queue.startLog(moment.duration(10, 'seconds'), scheduler, 10);
scheduler.simulate();

console.log('Simulation duration:', getSimulationDuration().asSeconds(), 'seconds');
console.log('Clientes atendidos:', scheduler.getEntityTotalQuantityByName(GRUPO_CLIENTS_NAME));
console.log('Pedidos atendidos:', scheduler.getEntityTotalQuantityByName(PEDIDO_NAME));
console.log('Clientes average', scheduler.averageTimeInModelByName(GRUPO_CLIENTS_NAME).asSeconds());
console.log('Pedidos average', scheduler.averageTimeInModelByName(PEDIDO_NAME).asSeconds());
console.log('Atendentes allocation rate:', atendentes1.allocationRate());
console.log('Atendentes average allocation:', atendentes1.averageAllocation());
console.log('Caixa 1 logs:', caixa1Queue.getLog());
console.log('Caixa 2 logs:', caixa2Queue.getLog());
