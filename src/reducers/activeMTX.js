const activeMTX = (state = [], action) => {
	switch (action.type) {
		case 'ACTIVE_MTX':
			return action.value;
		default:
			return state;
	}
}

export default activeMTX;