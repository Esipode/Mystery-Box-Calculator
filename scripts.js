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
	mtxTotalRareValue: 0,
	mtxTotalUncommonValue: 0,
	mtxTotalCommonValue: 0,
	mtxFinalBoxValue: 0
}

//Listen for page to finish loading
window.addEventListener('load', function () {
	//Hide the loading screen
	document.getElementById("loader").style.display = 'none';
})

$(document).ready(function() {
	
	//Creates UI elements for each item once document has loaded
	for(let i = 0; i < mtxGlobals.mtxTotal; i++) {
		//Creates label container for each item
		jQuery('<label/>', {
			"class": 'list_item transition' + ' ' + mtxData[i].rarity
		}).appendTo('.container');
		//Creates checkbox for each item
		jQuery('<input/>', {
			"class": "coins",
			"type": "checkbox",
			"value": mtxData[i].value,
			"onclick": 'rarityValues()'
		}).appendTo($('.list_item')[i]);
		//Creates :before and :after UI elements for each item
		jQuery('<span/>', {
			"class": "label-text"
		}).appendTo($('.list_item')[i]);
		//Creates title of each item
		jQuery('<h1/>', {
			"text":   mtxData[i].name
		}).appendTo($('.label-text')[i]);
		//Creates image for each item
		jQuery('<img/>', {
			"src": mtxData[i].image,
		}).appendTo($('.list_item')[i]);
	}
	//Gets point values for each item
	let totalcoins = document.getElementsByClassName("coins");
	let i = 0;
	let arr0 = totalcoins[i].value;
	$('.label-text').each(function() {
		//Display point values for each item
		$('.label-text').eq(i).append("<p>" + totalcoins[i].value + "</p>");
		i++;
	})
});

//Calculates total point value of selected items
let rarityValues = () => {
	//set total values to 0 for each rarity category
	mtxGlobals.mtxTotalRareValue = 0;
	mtxGlobals.mtxTotalUncommonValue = 0;
	mtxGlobals.mtxTotalCommonValue = 0;
	//create arrays from selected items for each category
	let arr0 = document.querySelectorAll('.rare input[type="checkbox"]:checked');
	let arr1 = document.querySelectorAll('.uncommon input[type="checkbox"]:checked');
	let arr2 = document.querySelectorAll('.common input[type="checkbox"]:checked');
	//Calculate average value per category total point values of the arrays
	for(let i = 0; i < arr0.length; i++) {
		mtxGlobals.mtxTotalRareValue += (100 * (parseInt(arr0[i].value) * mtxGlobals.mtxPercentRare) / 100);
	}
	for(let i = 0; i < arr1.length; i++) {
		mtxGlobals.mtxTotalUncommonValue += (100 * (parseInt(arr1[i].value) * mtxGlobals.mtxPercentUncommon) / 100);
	}
	for(let i = 0; i < arr2.length; i++) {
		mtxGlobals.mtxTotalCommonValue += (100 * (parseInt(arr2[i].value) * mtxGlobals.mtxPercentCommon) / 100);
	}
	//Adds together average values for each category to get average value of entire box
	mtxGlobals.mtxFinalBoxValue = (mtxGlobals.mtxTotalRareValue + mtxGlobals.mtxTotalUncommonValue + mtxGlobals.mtxTotalCommonValue).toFixed(2);
	//Display the value
	document.getElementById("final_number").innerHTML = mtxGlobals.mtxFinalBoxValue;
	//Gets color value based on current value of selected items
	colorChange();
	//Change background color based on function's returned value, if 0, return to default color
	if (mtxGlobals.mtxFinalBoxValue > 0) {
		document.getElementById("final_number").style.backgroundColor = colorChange();
	}
	else {
		document.getElementById("final_number").style.backgroundColor = 'gray';
	}
};

//Function to change background color of final value element
let colorChange = (percentage, hue0, hue1) => {
		//value of red on color wheel
		hue0 = 0;
		//value of green on color wheel
		hue1 = 120;
		//current value of box divided max value of box
		percentage = (mtxGlobals.mtxFinalBoxValue / 110);
		//creates final color value based on defined parameters above
    	let hue = (percentage * (hue1 - hue0)) + hue0;

    	return 'hsl(' + hue + ', 100%, 30%)';
}

//Changes edge color of each item to green when selected
$(document).on('click', '.coins', function() {
	//toggles class on click
	$(this.parentNode).toggleClass('selected');
});
