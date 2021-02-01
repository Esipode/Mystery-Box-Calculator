export const setStep = (val) => {
	return {
		type: "STEP",
		value: val
	}
}

export const setBox = (val) => {
	return {
		type: "BOX",
		value: val
	}
}

export const setBoxChanged = (val) => {
	return {
		type: "BOX_CHANGED",
		value: val
	}
}

export const setFullMTXList = (val) => {
	return {
		type: "FULL_MTX_LIST",
		value: val
	}
}

export const setActiveMTX = (val) => {
	return {
		type: "ACTIVE_MTX",
		value: val
	}
}

export const setStatList = (val) => {
	return {
		type: "STAT_LIST",
		value: val
	}
}

export const setSimRunning = (val) => {
	return {
		type: "SIM_RUNNING",
		value: val
	}
}

export const setStepThree = (val) => {
	return {
		type: "STEP_THREE",
		value: val
	}
}

export const setActiveBox = (val) => {
	return {
		type: "ACTIVE_BOX",
		value: val
	}
}

export const setBoxVal = (val) => {
	return {
		type: "BOX_VAL",
		value: val
	}
}

export const setPrevBoxVal = (val) => {
	return {
		type: "PREV_BOX_VAL",
		value: val
	}
}

export const setCompletedList = (val) => {
	return {
		type: "COMPLETED_LIST",
		value: val
	}
}

export const setResultsPending = (val) => {
	return {
		type: "RESULTS_PENDING",
		value: val
	}
}

export const setResultsSubmitted = (val) => {
	return {
		type: "RESULTS_SUBMITTED",
		value: val
	}
}