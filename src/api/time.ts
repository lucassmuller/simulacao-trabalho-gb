import moment from 'moment';

const creationTime = moment();

let simulationTime = creationTime.clone();

export function getSimulationTime() {
  return simulationTime.clone();
}

export function setSimulationTime(time: moment.Moment) {
  simulationTime = time;
}

export function getSimulationDuration() {
  return moment.duration(simulationTime.diff(creationTime));
}
