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
window.addEventListener('load', function() {
	//Runs library that replaces 'select' element and replaces with spans
	$('.dropdown').select2();
	//Sets value for what box is active by default, and remove any ampersands
	mtxGlobals.mtxCurrentBox = (document.getElementsByClassName('select2-selection__rendered')[0].innerHTML);
	//By default there is no previous box so it takes the value of the current box
	mtxGlobals.mtxPrevBox = mtxGlobals.mtxCurrentBox;
	//Loads content of default box
	loadContent();
	//Loads all images, then removes loading screen
	preloadImages();
});

//Disables and re-enables header when scrolling
$('.mainWrapper').scroll(function() {
	if (!$('.select2-dropdown').length) {
		const scrollY = $('.mainWrapper').scrollTop() || window.pageYOffset;
	    const header = $('.header');
	    scrollY <= this.lastScroll ? header.removeClass('hideHeader') : header.addClass('hideHeader');
	    this.lastScroll = scrollY;
	    if (scrollY < 1) {
	    	header.removeClass('hideHeader');
	    }
	}
	else {return}
})

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
			$('.select2-results__option').eq(i).css('background-image', 'url(' + boxImage[i].image + ')');
		}
	}, 5);
})

let loadContent = () =>  {
	//Force dropdown to open, triggering box thumbnails loading
	$(".dropdown").select2('open');
	//Force dropdown to close immediately after
	$(".dropdown").select2('close');
	//Set box icon in simulator to active box
	$('.simulatorBox').css('background-image', 'url(' + boxImage[$(".dropdown").prop('selectedIndex')].image + ')');
	//Reset all simulator properties
	resetPoints();
	//Change simulator toggler image to current box thumbnail
	setTimeout(function() {
		//Change simulator toggler image to current box thumbnail
		$('.toggleSimulator').css('background-image', 'url(' + boxImage[$(".dropdown").prop('selectedIndex')].image + ')');
	}, 300);
	//Clear box simulator contents
	$('.simulatorTitle').html('');
	$('.simulatorItem').css('background-image', '');
	//Creates array of items based on the active box
	mtxGlobals.mtxCurrList = mtxData.filter((obj) => obj.box === mtxGlobals.mtxCurrentBox);
	//Check if current box is the same as previously selected box
	if (mtxGlobals.mtxCurrentBox != mtxGlobals.mtxPrevBox) {
		//Check if any items of the box exist currently
		if(!$('.listItem').length) {
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
				$('.listItem').remove();
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
				"class": 'listItem transition' + ' ' + mtxGlobals.mtxCurrList[j].rarity
			}).appendTo('.' + mtxGlobals.mtxCurrList[j].rarity + 'Container');
			//Creates checkbox for each item
			jQuery('<input/>', {
				"class": "coins",
				"type": "checkbox",
				"value": mtxGlobals.mtxCurrList[j].value,
				"onclick": 'rarityValues()'
			}).appendTo($('.listItem')[j]);
			//Creates :before and :after UI elements for each item
			jQuery('<span/>', {
				"class": "labelText"
			}).appendTo($('.listItem')[j]);
			//Creates title of each item
			jQuery('<h1/>', {
				"text":   mtxGlobals.mtxCurrList[j].name
			}).appendTo($('.labelText')[j]);
			//Creates image for each item
			jQuery('<img/>', {
				"src": mtxGlobals.mtxCurrList[j].image,
				"draggable": false
			}).appendTo($('.listItem')[j]);
		}
		//Set display of number of total items for each rarity
		$('.outOfRareB').html(mtxData.filter((obj) => obj.rarity === 'rare' && obj.box === mtxGlobals.mtxCurrentBox).length);
		$('.outOfUncommonB').html(mtxData.filter((obj) => obj.rarity === 'uncommon' && obj.box === mtxGlobals.mtxCurrentBox).length);
		$('.outOfCommonB').html(mtxData.filter((obj) => obj.rarity === 'common' && obj.box === mtxGlobals.mtxCurrentBox).length);
		//Gets point values for each item
		let totalcoins = document.getElementsByClassName("coins");
		let k = 0;
		let arr0 = totalcoins[k].value;
		$('.labelText').each(function() {
			//Display point values for each item
			$('.labelText').eq(k).append("<p>" + totalcoins[k].value + "</p>");
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
	let prevFinalValue = parseFloat(document.getElementById("total").innerHTML);
	//Animates final value changing
	animateValue(prevFinalValue, mtxGlobals.mtxFinalBoxValue);
	//Change background color based on function's returned value, if 0, return to default color
	if (mtxGlobals.mtxFinalBoxValue > 0) {
		$("#finalNumber").css('filter', 'saturate(1)'); //Remove grascale
		let currColor = colorChange(); //Gets color value based on current value of selected items
		$("#finalNumber").css('filter', 'saturate(1)' + 'hue-rotate(' + (currColor - 30) + 'deg)' + 'brightness(1.2)'); //Shifts color of background
		$("#totalCoin").css('filter', 'hue-rotate(' + (30 - currColor) + 'deg)'); //Reverses color shifting of coin
	}
	else {
		$("#finalNumber").css('filter', 'saturate(0)') //Return element image to grayscale
	}
	//Set display of number of selected items for each rarity
	$('.outOfRareA').html(arr0.length);
	$('.outOfUncommonA').html(arr1.length);
	$('.outOfCommonA').html(arr2.length);
};

//Animates final value of box changing
let animateValue = (start, end) => {
	//By default, current value is given the starting value
	let current = start;
	//Sets how much the number increments with each step
	let increment = end > start ? ((end - start) / 20) : -((start - end) / 20);
	//Sets rate at which the number increments
	let stepTime = 20;
	//Sets the timer for the animation
	let timer = setInterval(function() {
		//Add increment to current value
		current += increment;
		//Display incremented value
		document.getElementById("total").innerHTML = current.toFixed(2);
		//When the current value is equal to the target value
		if (current.toFixed(2) == end) {
			//Check for negative number
			if (current < 0) {
				//Correct negative number
				document.getElementById("total").innerHTML = '0.00';
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
		let hue = ((percentage * (hue1 - hue0)) + hue0);

		return hue.toFixed(0);
}

//Changes edge color of each item to green when selected
$(document).on('click', '.coins', function() {
	//toggles class on click
	$(this.parentNode).toggleClass('selected');
});

//Minimizes item container when clicking corresponding rarity's title
$('div[class*="Label"]').on('click', function() {
	if (this.classList.contains("historyLabel")) {
		$(this).toggleClass('inactiveHistory');
		$(this.nextElementSibling).toggleClass('inactive');
		$('.simulatorGambler').toggleClass('hiddenMobile');
		$('.prevItems').toggleClass('showMobile');
	}
	else {
		$(this).toggleClass('inactiveTitle');
		$(this.nextElementSibling).toggleClass('inactive');
	}
});

//Loads all images from sources in data.js
let preloadImages = () => {
	//Combine current list of items with all UI elements. This ensures UI loads before removing loading screen on first load.
	let allImages = mtxGlobals.mtxCurrList.concat(uiImages, boxImage);
	//Fade in loading screen
	$("#loader").fadeIn(250);
	//Creates promise function to load all images into DOM
	let loadImages = new Promise(function(resolve, reject) {
		let images = [];
		for (let i = 0; i < allImages.length; i++) {
			images[i] = new Image();
			images[i].src = allImages[i].image;
		}
		//Return value of entire array of images after finishing
		resolve(images);
	});
	//After promise function completes, check each image index to see if it has finished loading
	loadImages.then(function(value) {
		//Reset number of loaded elements
		let loadCounter = 0;
		//Reset percentage of loaded elements
		let percentage = 0;
		for (let j = 0; (j + 1) < value.length; j++) {
			value[j].onload = function() {
				loadCounter++;
				j = loadCounter;
				//Set cookie to not trigger sameSite warning
				document.cookie = `${allImages[j].name}=${encodeURIComponent(allImages[j].image)}; expires=${365*60*60*24}; sameSite=none; secure`;
				//Set percentage to reflect amount of images loaded
				percentage = (((j + 1) * 100) / value.length).toFixed(0);
				//Display loaded percentage
				$('.loadCurrent').css({
					'clip-path': 'inset(' + ((13 - parseInt(percentage)) + 100) + '% 0px 0px 0px',
					'-webkit-clip-path': 'inset(' + ((13 - parseInt(percentage)) + 100) + '% 0px 0px 0px'
				});
				//Once all images are done loading, remove loading screen
				if (loadCounter == (value.length - 1)) {
					//Reset any inactive rarity containers
					$('*').removeClass('inactiveTitle inactive');
					//Fade away loading screen
					$("#loader").delay(300).fadeOut(250);
					//After loading screen is gone, reset progress percentage
					setTimeout(function() {
						$('.loadCurrent').css({
							'clip-path': 'inset(100% 0px 0px 0px)',
							'-webkit-clip-path': 'inset(100% 0px 0px 0px)'
					});
					}, 750);
				}
			}
		}
	});
};

let simulatorToggle = () => {
	if ($('.simulatorContainer').attr('active') == 'true') {
		$('.simulatorContainer')
			.animate({top: '110%'}, 0, function() {
				$('.simulatorContainer').attr('active', 'false');
				$('body').css('overflow', 'auto');
		});
	}
	else {
		$('.simulatorContainer').fadeIn()
			.css({top: '110%', display: 'grid'})
			.animate({top: '3%'}, 0, function() {
				$('.simulatorContainer').attr('active', 'true');
				$('body').css('overflow', 'hidden');
		});
	}
}

let simulateItems = () => {
	//Checks if function is currently running to prevent click spamming
	if ($('.simulatorContainer').attr('running') == 'true') {
		return;
	}
	//Set function to 'running' state
	$('.simulatorContainer').attr('running', 'true');
	//Determines value of random chance in order to pick rarity
	chanceRoll = Math.floor(Math.random()*(100)+1);
	//Checks for and sets 'rare'
	if (chanceRoll <= 20) {
		currentRarity = 'rare';
	}
	//Checks for and sets 'uncommon'
	else if (chanceRoll <= 55 && chanceRoll >= 20) {
		currentRarity = 'uncommon';
	}
	//Checks for and sets 'common'
	else if (chanceRoll > 55) {
		currentRarity = 'common';
	}
	//Chooses a random item index from array of current possible box items
	chanceRoll = Math.floor(Math.random()*(mtxGlobals.mtxCurrList.length));

	//Loops until correct item with correct rarity is selected
	let rolling = setInterval(function() {
		//When the current rarity is equal to the item rarity
		if (currentRarity == mtxGlobals.mtxCurrList[chanceRoll].rarity) {
			//Store incremented value of total points spent on current box
			let pointsSpent = parseInt($('.simulatorPoints span').html()) + 30;
			//Fade out item name and image, then fade back in after changing
			$('.simulatorTitle, .simulatorItem').fadeOut(300, function() {
				($('.simulatorTitle').html(mtxGlobals.mtxCurrList[chanceRoll].name).fadeIn(300));
				($('.simulatorItem').css('background-image', 'url(' + mtxGlobals.mtxCurrList[chanceRoll].image + ')')).fadeIn(300);
				//Display updated spent points value
				$('.simulatorPoints span').html(pointsSpent);
				//Change function state to 'not running'
				$('.simulatorContainer').attr('running', 'false');
			});
			clearInterval(rolling);
			//Create 'history' cards of previous item draws
			prevItemCards(chanceRoll);
		}
		else {
			//Rerolls items in list until correct rarity is found
			chanceRoll = Math.floor(Math.random()*(mtxGlobals.mtxCurrList.length));
		}
	}, 20);
}

let prevItemCards = (index) => {
	let duplicateFound;
	$('.prevItem h4').each(function() {
		if ($(this).text() == mtxGlobals.mtxCurrList[index].name) {
			$(this).parent().attr('total', (parseInt($(this).parent().attr('total')) + 1));
			$(this).parent().prependTo('.prevItems');
			duplicateFound = true;
		}
	});
	if (!duplicateFound) {
		jQuery('<div/>', {
			"class": 'prevItem' + ' transition ' + mtxGlobals.mtxCurrList[index].rarity,
			"total": 1
		}).prependTo('.prevItems');
		jQuery('<h4/>', {
			"text": mtxGlobals.mtxCurrList[index].name
		}).appendTo($('.prevItem')[0]);
		jQuery('<img/>', {
			"src": mtxGlobals.mtxCurrList[index].image,
			"draggable": false
		}).appendTo($('.prevItem')[0]);
	}
	duplicateFound = false;
}

let resetPoints = () => {
	//Reset display of points spent
	$('.simulatorPoints span').html(0);
	//Remove previous item draws
	$('.prevItem').remove();
	//Removed currently displayed item name
	$('.simulatorTitle').html('');
	//Removed currently displayed item image
	$('.simulatorItem').css('background-image', '');
}

window.addEventListener('load', function() {
	let hideScroll = $('.prevItems');
	hideScroll.css('padding-right', hideScroll.offsetWidth - hideScroll.clientWidth + 'px');
});