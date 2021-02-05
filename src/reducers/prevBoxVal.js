const prevBoxVal = (state = 0, action) => {
	switch (action.type) {
		case 'PREV_BOX_VAL':
			return action.value;
		default:
			return state;
	}
};

export default prevBoxVal;
