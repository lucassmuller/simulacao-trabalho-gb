import arcTypes from './arcs';
import {
  Places,
  Transition,
  Transitions,
  TransitionCallback,
  CycleCallback,
  InputType,
} from './definitions';

export class PetriNet {
  private cycleNumber = 0
  private cycleStartCallback?: CycleCallback
  private cycleEndCallback?: CycleCallback
  private transitionCallback?: TransitionCallback

  constructor(
    private places: Places,
    private transitions: Transitions,
  ) { }

  executeCycle() {
    const cycleNumber = ++this.cycleNumber;
    const activeTransitions = this.transitions
        .filter(this.isTransitionActive.bind(this));

    this.cycleStartCallback?.(cycleNumber, activeTransitions);

    activeTransitions
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .forEach(this.executeTransition.bind(this));

    this.cycleEndCallback?.(cycleNumber, activeTransitions);
  }

  private executeTransition(transition: Transition) {
    if (!this.isTransitionActive(transition)) {
      return;
    }

    const inputs = transition.inputs;
    const outputs = transition.outputs;

    inputs.forEach(({place, multiplicity, type}) => {
      const placeTokens = this.places[place].tokens;
      const newTokensAmount = this.getNewTokensAmount(type, multiplicity, placeTokens);
      this.places[place].tokens = newTokensAmount < 0 ? 0 : newTokensAmount;
    });
    outputs.forEach(({place, multiplicity}) => this.places[place].tokens += multiplicity);

    this.transitionCallback?.(transition);

    // Executa transição novamente, para caso continue ativa
    this.executeTransition(transition);
  }

  private getNewTokensAmount(type: InputType, multiplicity: number, tokens: number) {
    return arcTypes[type || 'regular'].getNewTokensAmount(multiplicity, tokens);
  }

  isTransitionActive(transition: Transition) {
    return transition.inputs.every(({place, multiplicity, type}) => {
      const placeTokens = this.places[place].tokens;
      return arcTypes[type || 'regular'].hasNecessaryTokens(multiplicity, placeTokens);
    });
  }

  getTransitions = () => this.transitions
  getPlaces = () => this.places

  getTransitionById = (id: string | number) => this.transitions.find((t) => t.id === id)

  getPlaceById = (id: string) => this.places[id]

  onCycleStart(callback: CycleCallback) {
    this.cycleStartCallback = callback;
  }

  onCycleEnd(callback: CycleCallback) {
    this.cycleEndCallback = callback;
  }

  onTransitionExecuted(callback: TransitionCallback) {
    this.transitionCallback = callback;
  }
}

export default PetriNet;
