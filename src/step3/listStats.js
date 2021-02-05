export default function listStats(completedList) {
	let rawList = JSON.parse(JSON.stringify(completedList));
	let sortedItems = rawList;
	return new Promise((resolve) => {
		let statList = {};
		statList._id = rawList[0].box;
		statList.total = (() => {
			let sum = 0;
			for (let i = 0; i < rawList.length; i++) {
				sum += rawList[i].count;
			}
			return sum;
		})();
		statList.itemList = (() => {
			sortedItems.sort((a, b) => {
				//Sort by index
				if (a.position < b.position) {
					return -1;
				}
				return 0;
			});
			return sortedItems;
		})();
		resolve(statList);
	});
}
