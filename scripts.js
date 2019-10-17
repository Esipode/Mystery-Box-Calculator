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
	mtxFinalBoxValue: 0,

	//Currently selected box
	mtxCurrentBox: '',
	//Previously selected box
	mtxPrevBox: ''
}

//Listen for page to finish loading
window.addEventListener('load', function () {
	//Runs library that replaces 'select' element and replaces with spans
	$('.dropdown').select2();
	//Hide the loading screen
	$("#loader").fadeOut(500);
	//Sets value for what box is active by default
	mtxGlobals.mtxCurrentBox = (document.getElementsByClassName('select2-selection__rendered')[0].innerHTML);
	//By default there is no previous box so it takes the value of the current box
	mtxGlobals.mtxPrevBox = mtxGlobals.mtxCurrentBox;
	//Loads content of default box
	loadContent();
});

//Watches for the box selector to change
$('.dropdown').change(function() {
	//Creates a delay so that the function doesn't carry out before value changes
	setTimeout(function () {
		//Sets value for what box is being changed to
		mtxGlobals.mtxCurrentBox = (document.getElementsByClassName('select2-selection__rendered')[0].innerHTML);
		//Loads newly selected box content
		loadContent();
	}, 50);
});

function loadContent() {
	//Check if current box is the same as previously selected box
	if (mtxGlobals.mtxCurrentBox != mtxGlobals.mtxPrevBox) {
		//Check if any items of the box exist currently
		if(!$('.list_item').length) {
			//Set previous box at value of current box
			mtxGlobals.mtxPrevBox = mtxGlobals.mtxCurrentBox;
		}
		//If box item elements exist already, remove old elements before replacing with new elements
		else {
			console.log('Items do exist');
			//Removes previous box content
			for(let i = 0; i < mtxGlobals.mtxTotal; i++) {
				$('.list_item').get(0).remove();
			}
			//After finishing removing all items, set previous box at value of current box
			mtxGlobals.mtxPrevBox = mtxGlobals.mtxCurrentBox;
		}
		//Creates UI elements for each item once document has loaded
		for(let j = 0; j < mtxGlobals.mtxTotal; j++) {
			//Creates label container for each item
			jQuery('<label/>', {
				"class": 'list_item transition' + ' ' + mtxData[j].rarity
			}).appendTo('.container');
			//Creates checkbox for each item
			jQuery('<input/>', {
				"class": "coins",
				"type": "checkbox",
				"value": mtxData[j].value,
				"onclick": 'rarityValues()'
			}).appendTo($('.list_item')[j]);
			//Creates :before and :after UI elements for each item
			jQuery('<span/>', {
				"class": "label-text"
			}).appendTo($('.list_item')[j]);
			//Creates title of each item
			jQuery('<h1/>', {
				"text":   mtxData[j].name
			}).appendTo($('.label-text')[j]);
			//Creates image for each item
			jQuery('<img/>', {
				"src": mtxData[j].image,
			}).appendTo($('.list_item')[j]);
		}
		//Gets point values for each item
		let totalcoins = document.getElementsByClassName("coins");
		let k = 0;
		let arr0 = totalcoins[k].value;
		$('.label-text').each(function() {
			//Display point values for each item
			$('.label-text').eq(k).append("<p>" + totalcoins[k].value + "</p>");
			k++;
		})
	}
};

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
	document.getElementById("final_number").innerHTML = mtxGlobals.mtxFinalBoxValue + "<img src='https://web.poecdn.com/image/shop/item/ShopItemCoin.png?1554764519971' />";
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
