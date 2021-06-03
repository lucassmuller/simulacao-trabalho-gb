import EntitySet, {EntitySetMode} from './api/entity-set';
import Resource from './api/resource';
import Scheduler from './api/scheduler';
import {getSimulationDuration} from './api/time';
import GrupoClientesEntity, {GRUPO_CLIENTS_NAME} from './entities/grupo-clientes';
import PedidoEntity, {PEDIDO_NAME} from './entities/pedido';
import ChegadaClienteEvent from './events/chegada-cliente';

export const scheduler = new Scheduler();

export const atendentes1 = new Resource('AtendentesCaixa1', 1);
export const caixa1Queue = new EntitySet<GrupoClientesEntity>('Caixa1Queue', EntitySetMode.FIFO);

export const atendentes2 = new Resource('AtendentesCaixa2', 1);
export const caixa2Queue = new EntitySet<GrupoClientesEntity>('Caixa2Queue', EntitySetMode.FIFO);

export const cozinheiros = new Resource('Cozinheiros', 3);
export const cozinhaQueue = new EntitySet<PedidoEntity>('CozinheirosQueue', EntitySetMode.FIFO);
export const pedidosProntosQueue = new EntitySet<PedidoEntity>(
    'PedidosProntosQueue', EntitySetMode.FIFO);

scheduler.scheduleNow(new ChegadaClienteEvent());
scheduler.simulate();

console.log('Simulation duration:', getSimulationDuration().asSeconds(), 'seconds');
console.log('Clientes atendidos:', scheduler.getEntityTotalQuantityByName(GRUPO_CLIENTS_NAME));
console.log('Pedidos atendidos:', scheduler.getEntityTotalQuantityByName(PEDIDO_NAME));
console.log('Atendentes allocation rate:', atendentes1.allocationRate());
console.log('Atendentes average allocation:', atendentes1.averageAllocation());
