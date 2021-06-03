export interface Place {
  tokens: number
}

export type Places = {[id: string]: Place}

export type InputType = 'regular' | 'inhibitor' | 'reset' | undefined

export interface Input {
  place: string
  multiplicity: number
  type?: InputType
}

export interface Output {
  place: string
  multiplicity: number
}

export interface Transition {
  id: string | number
  inputs: Input[]
  outputs: Output[]
  priority?: number
}

export interface ArcType {
  getNewTokensAmount(multiplicity: number, tokens: number): number
  hasNecessaryTokens(multiplicity: number, tokens: number): boolean
}

export type Transitions = Transition[]

export type TransitionCallback = (transition: Transition) => void

export type CycleCallback = (cycleNumber: number, activeTransitions: Transitions) => void
