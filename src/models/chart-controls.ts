import { UserActions } from './users-actions';
import { Stopwatch } from './stopwatch.model';

export interface ChartControls {
  pdaValue: number,
  inhaleValue: number,
  exhaleValue: number,
  abbsValue: number,
  userActionValue: UserActions,
  isComplexChart: boolean,
  appIsRunning: boolean,
  runningStopwatch: Stopwatch,
  finalStopwatch: Stopwatch
}
