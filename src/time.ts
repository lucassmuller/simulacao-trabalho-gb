import moment from 'moment';

const creationTime = moment();

export const simulationTime = creationTime.clone();

export function getSimulationDuration() {
  return moment.duration(simulationTime.diff(creationTime));
}

export default simulationTime;
