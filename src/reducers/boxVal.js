const boxVal = (state = null, action) => {
	switch (action.type) {
		case 'BOX_VAL':
			return action.value;
		default:
			return state;
	}
}

export default boxVal;