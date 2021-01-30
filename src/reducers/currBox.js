const currBox = (state = '', action) => {
	switch (action.type) {
		case 'BOX':
			return action.value;
		default:
			return state;
	}
}

export default currBox;