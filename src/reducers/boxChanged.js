const boxChanged = (state = false, action) => {
	switch (action.type) {
		case 'BOX_CHANGED':
			return action.value;
		default:
			return state;
	}
};

export default boxChanged;
