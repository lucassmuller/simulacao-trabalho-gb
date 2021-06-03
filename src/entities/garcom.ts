import Entity from '../api/entity';
import PetriNet from '../api/petri-net';
import {Places, Transitions} from '../api/petri-net/definitions';

export class GarcomEntity extends Entity {
  constructor() {
    super('GarcomEntity', buildPetriNet());
  }

  isAvailable() {
    const place = this.getPetriNet()?.getPlaceById('livre');
    return place?.tokens === 1;
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
