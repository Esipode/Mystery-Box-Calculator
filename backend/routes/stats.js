const router = require('express').Router();
let Stat = require('../models/stats.model');

router.route('/').get((req, res) => {
	Stat.find()
		.then(stats => res.json(stats))
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
	const _id = req.body._id;;
	const total = 0;
	const itemList = req.body.itemList;
	for (let i = 0; i < itemList.length; i++) {
		itemList[i].count = 0;
		itemList[i].wanted = 0;
		itemList[i].unwanted = 0;
	}
	const newStat = new Stat({
		_id,
		total,
		itemList
	});

	newStat.save()
		.then(() => res.json('Stat added!'))
		.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
	Stat.findById(req.params.id)
		.then(stat => {
			stat.total = req.body.total;
			stat.itemList = req.body.itemList;

			stat.save()
				.then(() => res.json('Stat updated!'))
				.catch(err => res.status(400).json('Error: ' + err));
		})
		.catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;