import {scheduler} from '..';
import Entity from '../api/entity';
import PetriNet from '../api/petri-net';
import {Places, Transitions} from '../api/petri-net/definitions';

export enum GarcomState {
  // eslint-disable-next-line no-unused-vars
  AVAILABLE = 'livre',
  // eslint-disable-next-line no-unused-vars
  REPLACING_CASHIER = 'no-caixa',
  // eslint-disable-next-line no-unused-vars
  DELIVERING_ORDER = 'levando-pedido',
  // eslint-disable-next-line no-unused-vars
  CLEANING_TABLE = 'higienizando-mesa'
}

export const GARCOM_NAME = 'GarcomEntity';

export class GarcomEntity extends Entity {
  private petriNet = buildPetriNet();

  constructor() {
    super(GARCOM_NAME);
    scheduler.logEntityCreation(this);
  }

  getPetriNet = () => this.petriNet;

  isAvailable = () => this.getCurrentState() === GarcomState.AVAILABLE;

  getCurrentState() {
    const placeHasTokens = (placeId: string) => this.getPetriNet().getPlaceById(placeId).tokens > 0;

    return Object.keys(GarcomState)
        .map((key) => GarcomState[key])
        .find((state) => placeHasTokens(state));
  }

  replaceCashier = () => this.doWork('substituir-caixa');
  cashierBack = () => this.doWork('caixa-retorno', GarcomState.REPLACING_CASHIER);

  deliverOrder = () => this.doWork('pedido-pronto');
  orderDelivered = () => this.doWork('pedido-na-mesa', GarcomState.DELIVERING_ORDER);

  cleanTable = () => this.doWork('cliente-vai-sentar');
  tableCleaned = () => this.doWork('mesa-higienizada', GarcomState.CLEANING_TABLE);

  private doWork(placeId: string, expectedState = GarcomState.AVAILABLE) {
    const isExpectedState = this.getCurrentState() === expectedState;

    if (isExpectedState) {
      this.getPetriNet().getPlaceById(placeId).tokens = 1;
      this.getPetriNet().executeCycle();
    }

    return isExpectedState;
  }
}

const buildPetriNet = () => {
  const petriNetPlaces: Places = {
    'livre': {tokens: 1},

    'substituir-caixa': {tokens: 0},
    'no-caixa': {tokens: 0},
    'caixa-retorno': {tokens: 0},

    'pedido-pronto': {tokens: 0},
    'levando-pedido': {tokens: 0},
    'pedido-na-mesa': {tokens: 0},

    'cliente-vai-sentar': {tokens: 0},
    'higienizando-mesa': {tokens: 0},
    'mesa-higienizada': {tokens: 0},
  };

  const petriNetTransitions: Transitions = [
    {
      id: 'ir-para-caixa',
      inputs: [
        {place: 'livre', multiplicity: 1},
        {place: 'substituir-caixa', multiplicity: 1},
      ],
      outputs: [
        {place: 'no-caixa', multiplicity: 1},
      ],
    },
    {
      id: 'sair-do-caixa',
      inputs: [
        {place: 'no-caixa', multiplicity: 1},
        {place: 'caixa-retorno', multiplicity: 1},
      ],
      outputs: [
        {place: 'livre', multiplicity: 1},
      ],
    },
    {
      id: 'levar-pedido',
      inputs: [
        {place: 'livre', multiplicity: 1},
        {place: 'pedido-pronto', multiplicity: 1},
      ],
      outputs: [
        {place: 'levando-pedido', multiplicity: 1},
      ],
    },
    {
      id: 'pedido-entregue',
      inputs: [
        {place: 'levando-pedido', multiplicity: 1},
        {place: 'pedido-na-mesa', multiplicity: 1},
      ],
      outputs: [
        {place: 'livre', multiplicity: 1},
      ],
    },
    {
      id: 'higienizar-mesa',
      inputs: [
        {place: 'livre', multiplicity: 1},
        {place: 'cliente-vai-sentar', multiplicity: 1},
      ],
      outputs: [
        {place: 'higienizando-mesa', multiplicity: 1},
      ],
    },
    {
      id: 'mesa-pronta',
      inputs: [
        {place: 'higienizando-mesa', multiplicity: 1},
        {place: 'mesa-higienizada', multiplicity: 1},
      ],
      outputs: [
        {place: 'livre', multiplicity: 1},
      ],
    },
  ];

  return new PetriNet(petriNetPlaces, petriNetTransitions);
};

export default GarcomEntity;
