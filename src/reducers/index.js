import { combineReducers } from 'redux';
import currStep from './currStep';
import currMode from './currMode';
import currBox from './currBox';
import boxChanged from './boxChanged';
import fullMTXList from './fullMTXList';
import activeMTX from './activeMTX';
import statList from './statList';
import simRunning from './simRunning';
import allowStepThree from './allowStepThree';
import activeBox from './activeBox';
import boxVal from './boxVal';
import prevBoxVal from './prevBoxVal';
import completedList from './completedList';
import ownedList from './ownedList';
import resultsPending from './resultsPending';
import resultsSubmitted from './resultsSubmitted';
import simMode from './simMode';

const allReducers = combineReducers({
	currStep,
	currMode,
	currBox,
	boxChanged,
	fullMTXList,
	activeMTX,
	statList,
	simRunning,
	allowStepThree,
	activeBox,
	boxVal,
	prevBoxVal,
	completedList,
	ownedList,
	resultsPending,
	resultsSubmitted,
	simMode,
});

export default allReducers;
