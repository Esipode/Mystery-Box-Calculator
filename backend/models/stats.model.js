const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	total: {
		type: Number,
		required: true
	},
	itemList: {
		type: [],
		required: true
	}
}, {
	timestamps: true
});

const Stat = mongoose.model('Stat', itemSchema);

module.exports = Stat;