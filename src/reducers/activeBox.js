const activeBox = (state = '', action) => {
	switch (action.type) {
		case 'ACTIVE_BOX':
			return action.value;
		default:
			return state;
	}
}

export default activeBox;