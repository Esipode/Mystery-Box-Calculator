const simRunning = (state = false, action) => {
	switch (action.type) {
		case 'SIM_RUNNING':
			return action.value;
		default:
			return state;
	}
}

export default simRunning;