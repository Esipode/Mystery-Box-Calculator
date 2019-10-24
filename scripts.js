const mtxGlobals = {
	//Total point value of items selected from the box for each rarity
	mtxTotalRareValue: 0,
	mtxTotalUncommonValue: 0,
	mtxTotalCommonValue: 0,
	mtxFinalBoxValue: 0,

	//Array of items from the currently active box
	mtxCurrList: [],

	//Currently selected box
	mtxCurrentBox: '',
	//Previously selected box
	mtxPrevBox: ''
}

//Listen for page to finish loading
window.addEventListener('load', function () {
	//Runs library that replaces 'select' element and replaces with spans
	$('.dropdown').select2();
	//Sets value for what box is active by default
	mtxGlobals.mtxCurrentBox = (document.getElementsByClassName('select2-selection__rendered')[0].innerHTML);
	//By default there is no previous box so it takes the value of the current box
	mtxGlobals.mtxPrevBox = mtxGlobals.mtxCurrentBox;
	//Loads content of default box
	loadContent();
	//Loads all images, then removes loading screen
	preloadImages();
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

//After dropdown has opened, prepend list items with images of each corresponding box 
$('.dropdown').on('select2:open', function() {
	//Short delay so event doesn't fire before dropdown list is created
	setTimeout(function() {
		for(let i = 0; i < boxImage.length; i++) {
			//Creates image, then places img tag into list item at index
			jQuery('<img/>', {
				"src": boxImage[i],
			}).prependTo($('.select2-results__option')[i]);
		}
	}, 5);
})

function loadContent() {
	//Force dropdown to open, triggering box thumbnails loading
	$(".dropdown").select2('open');
	//Force dropdown to close immediately after
	$(".dropdown").select2('close');
	//Creates array of items based on the active box
	mtxGlobals.mtxCurrList = mtxData.filter((obj) => obj.box === mtxGlobals.mtxCurrentBox);
	//Check if current box is the same as previously selected box
	if (mtxGlobals.mtxCurrentBox != mtxGlobals.mtxPrevBox) {
		//Check if any items of the box exist currently
		if(!$('.list_item').length) {
			//Set previous box at value of current box
			mtxGlobals.mtxPrevBox = mtxGlobals.mtxCurrentBox;
		}
		//If box item elements exist already, remove old elements before replacing with new elements
		else {
			//Loads all images, then removes loading screen
			preloadImages();
			//Forces function to wait until loading animation has finished
			setTimeout(function() {
				//remove all items in container
				$('.container').empty();
				//Run to reset values to default for final value
				rarityValues();
			}, 300);
			//After finishing removing all items, set previous box at value of current box
			mtxGlobals.mtxPrevBox = mtxGlobals.mtxCurrentBox;
		}
	}
	//Forces function to wait until loading animation has finished
	setTimeout(function() {
		//Creates UI elements for each item once document has loaded
		for(let j = 0; j < mtxGlobals.mtxCurrList.length; j++) {
			//Creates label container for each item
			jQuery('<label/>', {
				"class": 'list_item transition' + ' ' + mtxGlobals.mtxCurrList[j].rarity
			}).appendTo('.container');
			//Creates checkbox for each item
			jQuery('<input/>', {
				"class": "coins",
				"type": "checkbox",
				"value": mtxGlobals.mtxCurrList[j].value,
				"onclick": 'rarityValues()'
			}).appendTo($('.list_item')[j]);
			//Creates :before and :after UI elements for each item
			jQuery('<span/>', {
				"class": "label-text"
			}).appendTo($('.list_item')[j]);
			//Creates title of each item
			jQuery('<h1/>', {
				"text":   mtxGlobals.mtxCurrList[j].name
			}).appendTo($('.label-text')[j]);
			//Creates image for each item
			jQuery('<img/>', {
				"src": mtxGlobals.mtxCurrList[j].image,
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
	}, 300);
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
		mtxGlobals.mtxTotalRareValue += (parseInt(arr0[i].value) * (0.2 / (mtxData.filter((obj) => obj.rarity === 'rare' && obj.box === mtxGlobals.mtxCurrentBox).length)));
	}
	for(let i = 0; i < arr1.length; i++) {
		mtxGlobals.mtxTotalUncommonValue += (parseInt(arr1[i].value) * (0.35 / (mtxData.filter((obj) => obj.rarity === 'uncommon' && obj.box === mtxGlobals.mtxCurrentBox).length)));
	}
	for(let i = 0; i < arr2.length; i++) {
		mtxGlobals.mtxTotalCommonValue += (parseInt(arr2[i].value) * (0.45 / (mtxData.filter((obj) => obj.rarity === 'common' && obj.box === mtxGlobals.mtxCurrentBox).length)));
	}
	//Adds together average values for each category to get average value of entire box
	mtxGlobals.mtxFinalBoxValue = parseFloat((mtxGlobals.mtxTotalRareValue + mtxGlobals.mtxTotalUncommonValue + mtxGlobals.mtxTotalCommonValue).toFixed(2));
	//Gets old final value of box
	let prevFinalValue = parseFloat(document.getElementById("final_number").innerHTML);
	//Animates final value changing
	animateValue(prevFinalValue, mtxGlobals.mtxFinalBoxValue);
	//Change background color based on function's returned value, if 0, return to default color
	if (mtxGlobals.mtxFinalBoxValue > 0) {
		document.getElementById("final_number").style.backgroundColor = colorChange(); 	//Gets color value based on current value of selected items
	}
	else {
		document.getElementById("final_number").style.backgroundColor = 'gray';
	}
};

//Animates final value of box changing
function animateValue(start, end) {
	//By default, current value is given the starting value
	let current = start;
	//Sets how much the number increments with each step
	let increment = end > start ? ((end - start) / 20) : -((start - end) / 20);
	//Sets rate at which the number increments
	let stepTime = Math.abs(Math.floor(20));
	//Sets the timer for the animation
	let timer = setInterval(function() {
		//Add increment to current value
		current += increment;
		//Display incremented value
		document.getElementById("final_number").innerHTML = current.toFixed(2);
		//When the current value is equal to the target value
		if (current.toFixed(2) == end) {
			//Check for negative number
			if (current < 0) {
				//Correct negative number
				document.getElementById("final_number").innerHTML = '0.00';
			}
			clearInterval(timer);
		}
	}, stepTime);
}


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

//Loads all images from sources in data.js
function preloadImages() {
	$("#loader").fadeIn(250);
	//creates promise function to load all images into DOM
	let loadImages = new Promise(function(resolve, reject) {
		let images = [];
		for (let i = 0; i < mtxGlobals.mtxCurrList.length; i++) {
			images[i] = new Image();
			images[i].src = mtxGlobals.mtxCurrList[i].image;
		}
		//Return value of entire array of images after finishing
		resolve(images);
	});
	//After promise function completes, check each image index to see if it has finished loading
	loadImages.then(function(value) {
		let loadCounter = 0;
		for (let j = 0; (j + 1) < value.length; j++) {
			value[j].onload = function() {
				loadCounter++;
				j = loadCounter;
				//Once all images are done loading, remove loading screen
				if (loadCounter == (value.length - 1)) {
					$("#loader").delay(300).fadeOut(250);
				}
			}
		}
	});
};