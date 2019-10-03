const mtxGlobals = {
	//Total number of MTX items available in the box
	mtxTotal: mtxData.length,
	//Total number of Rare MTX items available in the box
	mtxTotalRare: mtxData.filter((obj) => obj.rarity === 'rare').length,
	//Total number of Uncommon MTX items available in the box
	mtxTotalUncommon: mtxData.filter((obj) => obj.rarity === 'uncommon').length,
	//Total number of Common MTX items available in the box
	mtxTotalCommon: mtxData.filter((obj) => obj.rarity === 'common').length,

	//Percentage weight for each rarity
	mtxChanceRare: 0.2,
	mtxChanceUncommon: 0.35,
	mtxChanceCommon: 0.45,

	//Percentage chance per item for each rarity
	mtxPercentRare: (0.2 / (mtxData.filter((obj) => obj.rarity === 'rare').length)).toFixed(12),
	mtxPercentUncommon: (0.35 / (mtxData.filter((obj) => obj.rarity === 'uncommon').length)).toFixed(12),
	mtxPercentCommon: (0.45 / (mtxData.filter((obj) => obj.rarity === 'common').length)).toFixed(12),

	//Total point value of items selected from the box for each rarity
	mtxTotalRareValue: '',
	mtxTotalUncommonValue: '',
	mtxTotalCommonValue: ''
}

//Creates UI elements for each item once document has loaded
$(document).ready(function() {
	for(let i = 0; i < mtxGlobals.mtxTotal; i++) {
		jQuery('<label/>', {
			"class": 'list_item transition' + ' ' + mtxData[i].rarity
		}).appendTo('.container');
		jQuery('<input/>', {
			"class": "coins",
			"type": "checkbox",
			"value": mtxData[i].value
		}).appendTo($('.list_item')[i]);
		jQuery('<span/>', {
			"class": "label-text",
			"text":   mtxData[i].name
		}).appendTo($('.coins')[i]);
		jQuery('<img/>', {
			"src": mtxData[i].image,
		}).appendTo($('.coins')[i]);
	}
});