const currMode = (state = 'new', action) => {
	switch (action.type) {
		case 'MODE':
			return action.value;
		default:
			return state;
	}
};

export default currMode;
