(function($){


	$(document).ready(function(){

		var isTransferPage = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_transfer_buy.php");

		if (isTransferPage) {
			var newTableDiv = $('<div id="newContent"><table><tbody></tbody></table></div>'),
				theLinks 	= [];

			createOptionBox();
			eventHandlers();

			$('#buyform table').after(newTableDiv);

		}

		function eventHandlers() {

			//Trigger the plugin
			$('#trigger-sale-form').on('click',function(event){
				event.preventDefault();

				var theLinks = [];
				buildLinks();

				$('#buyform table tbody tr').remove();
				newTableDiv.addClass('loading');
			});

			//Get SP-info code
			$('#spinfo-button').on('click',function(event){
				event.preventDefault();

				spinfoButtonTrigger();

			})

			//Toggle checkboxes
			$('a.toggle-link').on('click',function(event){
				event.preventDefault();

				var allCheckboxes = $(this).closest('[class*=checkboxes]').find('input[type="checkbox"]');
				allCheckboxes.each(function(){
					$(this).attr('checked', !$(this).attr('checked'));
				})
			})


			//Tabs controls
			var tabLinks = 	$('.tabs-cont a'),
				tabPanels = $('.tabs-panel');

			tabLinks.on('click',function(event){
				event.preventDefault();

				var tabHref = $(this).attr('href');

				tabLinks.removeClass('active');
				$(this).addClass('active');

				tabPanels.removeClass('active');
				$(tabHref+"-options").addClass('active');
			})

			//Trigger set highest bid
			var highBidTrigger = $('#trigger-bid-calculation');

			highBidTrigger.on('click',function(event){
				event.preventDefault();

				setHighestBid();
			})
		}

		function spinfoButtonTrigger() {
			var players 	= $('#newContent tr[id^=id_]'),
				pIDs 		= [],
				currentID 	= 0,
				spfCode 	= '';

			players.each(function(){
				pIDs.push($(this).attr('id').split("id_").pop());
			})

			pIDs.forEach(function(theID){

				$.ajax({
					type: "POST",
					crossDomain : true,
					url: 'https://www.soccerproject.com/ajax_player.php?pID=' + theID,
					complete: function (data) {
						currentID++;
						spfCode += generateSpinfoCode(data['responseText'],theID);
						if (currentID>=pIDs.length) {
							copyClipboardText(spfCode);
						}
					},
				});

			})
		}

		function generateSpinfoCode(data,playerID) {
			var newTable 	= $(data),
				playerCode 	= '';

			var price 		= $('#id_'+playerID).prev().find('td:nth-child(6)').text(),
				country		= $('#id_'+playerID).prev().find('td:nth-child(1) img').attr('title'),
				name		= $('#id_'+playerID).prev().find('td:nth-child(2)').text(),
				saleDate	= $('#id_'+playerID).prev().find('td:nth-child(5)').text(),
				age 		= $('#id_'+playerID).prev().find('td:nth-child(3)').text();

			var birthday 	= newTable.find('tbody tr:nth-child(1) td:nth-child(3)').text(),
				experience 	= newTable.find('tbody tr:nth-child(1) td:nth-child(5)').text(),
				row1col6 	= newTable.find('tbody tr:nth-child(1) th:nth-child(6)').text(),
				row1col7 	= newTable.find('tbody tr:nth-child(1) td:nth-child(7)').text(),
				morale 		= newTable.find('tbody tr:nth-child(2) td:nth-child(4)').text(),
				row2col5 	= newTable.find('tbody tr:nth-child(2) th:nth-child(5)').text(),
				row2col6 	= newTable.find('tbody tr:nth-child(2) td:nth-child(6)').text(),
				fitness		= newTable.find('tbody tr:nth-child(3) td:nth-child(4)').text(),
				row3col5 	= newTable.find('tbody tr:nth-child(3) th:nth-child(5)').text(),
				row3col6 	= newTable.find('tbody tr:nth-child(3) td:nth-child(6)').text(),
				stamina		= newTable.find('tbody tr:nth-child(4) td:nth-child(4)').text(),
				row4col5 	= newTable.find('tbody tr:nth-child(4) th:nth-child(5)').text(),
				row4col6 	= newTable.find('tbody tr:nth-child(4) td:nth-child(6)').text(),
				rating		= newTable.find('tbody tr:nth-child(5) td:nth-child(2)').text(),
				speed		= newTable.find('tbody tr:nth-child(5) td:nth-child(4)').text(),
				row5col5 	= newTable.find('tbody tr:nth-child(5) th:nth-child(5)').text(),
				row5col6 	= newTable.find('tbody tr:nth-child(5) td:nth-child(6)').text(),
				aggression	= newTable.find('tbody tr:nth-child(6) td:nth-child(2)').text(),
				ballcontrol	= newTable.find('tbody tr:nth-child(6) td:nth-child(4)').text(),
				row6col5 	= newTable.find('tbody tr:nth-child(6) th:nth-child(5)').text(),
				row6col6 	= newTable.find('tbody tr:nth-child(6) td:nth-child(6)').text();

			playerCode += country + ' ';
			playerCode += ' ' + name + ' ';
			playerCode += ' ' + age + ' ';
			playerCode += ' ' + rating + ' ';
			playerCode += ' 11 Jun (22:00)-15 Jun (04:00) € 50,00 M ';
			playerCode += ' Birthday '+birthday+' ';
			playerCode += ' Experience '+experience+' ';
			playerCode += ' '+row1col6+' '+row1col7+' ';
			playerCode += ' Morale '+morale+' ';
			playerCode += ' '+row2col5+' '+row2col6+' ';
			playerCode += ' Fitness '+fitness+' ';
			playerCode += ' '+row3col5+' '+row3col6+' ';
			playerCode += ' Stamina '+stamina+' ';
			playerCode += ' '+row4col5+' '+row4col6+' ';
			playerCode += ' Global rating '+rating+' ';
			playerCode += ' Speed '+speed+' ';
			playerCode += ' '+row5col5+' '+row5col6+' ';
			playerCode += ' Aggression '+aggression+' ';
			playerCode += ' Ballcontrol '+ballcontrol+' ';
			playerCode += ' '+row6col5+' '+row6col6+' ';

			return playerCode;
		}

		function calculateTransfer() {

		  $.ajax({
		      url: '//spinfo-tool.com/',
		      success: function (data) {
		      	console.log(data);
		      },
		      error: function(data) {
		      	console.log(data);
		      }
		  });
		}

		function insertCustome() {
			var yourCustomJavaScriptCode = "LoadPlayerInDiv(29632878, 'id_');";
			var script = document.createElement('script');
			var code = document.createTextNode('(function() {' + yourCustomJavaScriptCode + '})();');
			script.appendChild(code);
			(document.body || document.head).appendChild(script);	
		}

		function getPlayer(pID)	{
		  $.ajax({
		      type: "POST",
		      crossDomain : true,
		      url: 'https://www.soccerproject.com/ajax_player.php?pID=' + pID,
		      complete: function (data) {
		      	return data['responseText'];
		      },
		  });
		}

		function createOptionBox() {

			/* * *
			/*	Create option box
			/* */
			var optionBox = $('<div class="option-box transfers-page"></div>');

			/* * *
			/*	Add tabs
			/* */
			var tabsCont = $('<div class="tabs-cont"></div>');

			tabsCont.append('<a href="#basic" class="active">Basic</a>');
			tabsCont.append('<a href="#attributes">Attributes</a>');
			tabsCont.append('<a href="#bid">Bid</a>');

			optionBox.append(tabsCont);

			var basicOpt 		= $('<div class="tabs-panel active" id="basic-options"></div>'),
				attributesOpt 	= $('<div class="tabs-panel" id="attributes-options"></div>'),
				bidOpt 			= $('<div class="tabs-panel" id="bid-options"></div>');

			/* * *
			/*	Age checkboxes
			/* */
			var ageDropdown = $('#selage option');

			var ageCheckboxCont = $('<div class="age-checkboxes single-options-cont"></div>');

				ageCheckboxCont.append('<h3>Age: <a class="toggle-link">Toggle all</a></h3>');

				ageDropdown.each(function(){
					var ageValue = $(this).attr('value'),
						ageLabel = $(this).text();

					var newCheckbox = $('<input type="checkbox" name="" id="age'+ageValue+'" value="'+ageValue+'"><label for="age'+ageValue+'">'+ageLabel+'</label>');
					ageCheckboxCont.append(newCheckbox);
				});

			basicOpt.append(ageCheckboxCont);

			/* * *
			/*	Position checkboxes
			/* */
			var positionDropdown 	= $('#selpos option'),
				allPositions 		= [];

			var positionCheckboxCont = $('<div class="position-checkboxes single-options-cont"></div>');

				positionCheckboxCont.append('<h3>Position: <a class="toggle-link">Toggle all</a></h3>');

				positionDropdown.each(function(){
					var positionValue = $(this).attr('value'),
						positionLabel = $(this).text();

					allPositions.push(positionValue);
					var newCheckbox = $('<input type="checkbox" name="" id="position'+positionValue+'" value="'+positionValue+'"><label for="position'+positionValue+'">'+positionLabel+'</label>');
					positionCheckboxCont.append(newCheckbox);
				})

			basicOpt.append(positionCheckboxCont);

			/* * *
			/*	Price range
			/* */
			var priceRangeCont = $('<div class="price-range single-options-cont"></div>');

			priceRangeCont.append('<h3>Price range:</h3>');

			var minPriceDropdown = '<select name="min-price">'+
										'<option value=""></option>'+
										'<option value="500000">500K</option>';
			for (var i=1;i<30;i++) {
				minPriceDropdown += 	'<option value="'+i*1000000+'">'+i+'M</option>';
			}
			minPriceDropdown +=		'</select>';

			var maxPriceDropdown = '<select name="max-price">'+
										'<option value=""></option>'+
										'<option value="500000">500K</option>';
			for (var i=1;i<30;i++) {
				maxPriceDropdown += 	'<option value="'+i*1000000+'">'+i+'M</option>';
			}
			maxPriceDropdown +=		'</select>';

			priceRangeCont.append($(minPriceDropdown));
			priceRangeCont.append($(maxPriceDropdown));

			basicOpt.append(priceRangeCont);

			/* * *
			/*	Aggresion range
			/* */
			var aggressionRangeCont = $('<div class="aggression-range single-options-cont"></div>');

			aggressionRangeCont.append('<h3>Aggresion range:</h3>');

			var minAggressionDropdown = '<select name="min-aggresion">'+
										'<option value=""></option>';
			for (var i=1;i<101;i++) {
				minAggressionDropdown += 	'<option value="'+i+'">'+i+'%</option>';
			}
			minAggressionDropdown +=		'</select>';

			var maxAggressionDropdown = '<select name="max-aggresion">'+
										'<option value=""></option>';
			for (var i=1;i<101;i++) {
				maxAggressionDropdown += 	'<option value="'+i+'">'+i+'%</option>';
			}
			maxAggressionDropdown +=		'</select>';

			aggressionRangeCont.append($(minAggressionDropdown));
			aggressionRangeCont.append($(maxAggressionDropdown));

			attributesOpt.append(aggressionRangeCont);

			/* * *
			/*	Additional options
			/* */
			var additionalOptCont = $('<div class="additional-options single-options-cont"></div>');

			var buyNowCheckbox = $('<input type="checkbox" name="buy-now" value="buy-now" id="buy-now-input"><label for="buy-now-input" class="full-width">Only BUY NOW</label>');
			
				additionalOptCont.append('<h3>Additional options:</h3>');
				additionalOptCont.append(buyNowCheckbox);

			basicOpt.append(additionalOptCont);

			/* * *
			/*	Bid calculation
			/* */
			var bidCalculationCont 	= $('<div class="bid-calculation single-options-cont"></div>');
			var bidTrigger 			= $('<a href="" id="trigger-bid-calculation" class="button">SET THE BID</a>');

			bidCalculationCont.append(bidTrigger);
			bidOpt.append(bidCalculationCont);

			/* * *
			/* Append tabs
			/* */
			optionBox.append(basicOpt);
			optionBox.append(attributesOpt);
			optionBox.append(bidOpt);

			/* * *
			/*	Triggers
			/* */

			var triggerBtns = $('<div class="plugin-triggers single-options-cont"></div>');

			var pluginTrigger = $('<a href="" id="trigger-sale-form" class="button">TRIGGER SALE</a>');
			triggerBtns.append(pluginTrigger);

			var spinfoBtn = $('<a href="" id="spinfo-button" class="button">GENERATE SPINFO CODE</a>');
			triggerBtns.append(spinfoBtn);

			optionBox.append(triggerBtns);

			$('body').append(optionBox);

		}

		function buildLinks() {

			//Get ages and positions
			var checkedAges 		= $('.age-checkboxes input:checked'),
				checkedPositions 	= $('.position-checkboxes input:checked');

			var allAges 		= [],
				allPositions 	= [];

			if (checkedAges.length>0) {
				checkedAges.each(function(){
					allAges.push($(this).attr('value'));
				})
			} else {
				allAges = ['20'];
			}

			if (checkedPositions.length>0) {
				checkedPositions.each(function(){
					allPositions.push($(this).attr('value'));
				})
			} else {
				allPositions = ['0'];
			}

			var totNum 	= '',
				steps 	= '';

			var lastCallback 		= 0,
				numberCallbacks 	= allPositions.length * allAges.length;

			allPositions.forEach(function(position,index){

				allAges.forEach(function(age,index){

					$.post('https://www.soccerproject.com/spnewl_transfer_buy.php',{ 
						selage : age, 
						selpos : position,
					},
					function(returnedData){
						var headerLink = $("#buyform table th a", returnedData).attr('href');
							lastCallback++; //increase the number of callbacks to compare

						if (typeof headerLink != 'undefined') {
							var attributes = headerLink.split("&");

							attributes.forEach(function(attribute){
								if (attribute.includes("totn=")) {
									totNum 	= attribute.split("=")[1];
									steps 	= Math.ceil(totNum/15);
									for (var i=0; i < steps; i++) {
										theLinks.push(buildUrl(i,age,position,totNum));
									}
								}
							});

							//Links are finished
							if (numberCallbacks == lastCallback) {
								getLinksData(theLinks);
							}
						}

					});
				})

			})

		}

		function getLinksData(theLinks, currentLink=0) {

			var numberOfLinks = theLinks.length;

			if (numberOfLinks>currentLink) {

				$.ajax({
				    type: "POST",
				    url: theLinks[currentLink],
				    success: function (data) {
				    	var playersTable = $("#buyform table tr", data);
				    	processData(playersTable);
				    	currentLink++;
				    	getLinksData(theLinks,currentLink);
				    }
				});

			} else {
				newTableDiv.removeClass('loading');
			}

		}

		function processData (playersTable) {
			var buyNowON = $('.option-box input[name="buy-now"]').is(':checked');

			var minPrice = $('.option-box [name="min-price"]').val(),
				maxPrice = $('.option-box [name="max-price"]').val();

			var minAggresion = $('.option-box [name="min-aggresion"]').val(),
				maxAggresion = $('.option-box [name="max-aggresion"]').val();

			var playersSnaps = new cookieList("playersSnaps").items();

			playersTable.each(function(){
				if ($(this).find('th').length > 0) {
					return;
				}
				if ($(this).find('td').attr('colspan') != undefined) {
					return;
				}

				if (buyNowON) {
					var buyNowPrice = $(this).find('td:last-child').text();
					if (buyNowPrice == '') {
						return;
					}
				}

				//Compare prices
				if (minPrice != '' || maxPrice != '') {
					var thePrice 	= $(this).find('td').eq(5).text();
					var isInRange 	= comparePrices(minPrice,maxPrice,thePrice);

					if (!isInRange) {
						return;
					}
				}

				var mainRow 	= $(this).clone(),
					statsRow 	= $(this).next().clone();

				var addBtn 			= $('<a href="" class="createSnap">Create snapshot</a>'),
					rmvBtn 			= $('<a href="" class="removeSnap">Remove snapshot</a>');

				var playerId 		= mainRow.find('td:nth-child(2) a').attr('onclick').split('LoadPlayerInDiv(')[1].split(',')[0];

				if (playersSnaps.length>0) { //Avoid checking empty cookie array
					if (snapExist(playerId)[0]) {
						mainRow.find('td:last-child').append(rmvBtn.clone().attr('data-plid',playerId));
					} else {
						mainRow.find('td:last-child').append(addBtn.clone().attr('data-plid',playerId));
					}
				} else {
					mainRow.find('td:last-child').append(addBtn.clone().attr('data-plid',playerId));
				}

				newTableDiv.find('table').append(mainRow).append(statsRow);

			})
		}

		function comparePrices(min,max,price) {
			price = price.toString();

			price = price.replace(/ /g,'');
			price = price.replace(/€/g,'');

			if (typeof price == 'string' && price.includes("M")) {
				price = price.replace(/M/g,'');
				price = price.replace(/,/g,'.');
				price = price * 1000000;
			}

			if (typeof price == 'string' && price.includes("K")) {
				price = price.replace(/K/g,'');
				price = price * 1000;
			}

			if (typeof price == 'string' && !price.includes("K") && !price.includes("M") && !price.includes("free")) {
				price = parseInt(price.split(",")[0]);
			}

			if (typeof price == 'string' && price.includes("free")) {
				price = 0;
			}

			if (price<min) {
				return false;
			}
			if (price>max) {
				return false;
			}

			return true;
		}

		function buildUrl(step,age,selPos,totNum) {
			var newUrl = 'https://www.soccerproject.com/spnewl_transfer_buy.php?';

			//Page from
			newUrl += 'pagefrom='+(step*15);

			//Step
			newUrl += '&step=1';

			//Order Key
			newUrl += '&ord_key=gslot';

			//Order Dir
			newUrl += '&ord_dir=asc';

			//Sell age
			newUrl += '&selage='+age;

			//Sell position
			newUrl += '&selpos='+selPos;

			//Total num
			newUrl += '&totn='+totNum;

			return newUrl;
		}

		function copyClipboardText(text) {

			var dummy = document.createElement("textarea"); // Create a dummy input to copy the string array inside it
			dummy.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
			/*dummy.style.position = 'absolute';*/
			dummy.style.margin.left = '12rem'; // Move outside the screen to make it invisible

			document.body.appendChild(dummy); // Add it to the document

			dummy.setAttribute("id", "dummy_id"); // Set its ID

			document.getElementById("dummy_id").value=text; // Output the array into it

			dummy.select(); // Select it

			document.execCommand("copy"); // Copy its contents

			/*document.body.removeChild(dummy); // Remove it as its not needed anymore*/

			console.log(text);
		}

		function snapExist(plID) {
			var playersSnaps = new cookieList("playersSnaps").items();

			if (playersSnaps.length>0) {

				for (var i=0;i<playersSnaps.length;i++) {
					if (playersSnaps[i].id == plID) {
						return [true,playersSnaps[i]];
						break;
					}
				}

				return [false,null];
			}
		}

		var cookieList = function(cookieName) {
			
			var cookie = localStorage.getItem(cookieName);
			
			var items = cookie ? $.parseJSON(cookie) : new Array();

			return {
				"add": function(val) {
					items.push(val);

					localStorage.setItem(cookieName, JSON.stringify(items));;
				},
				"remove": function (val) { 
					removedPlayer = items.filter(function(el){
						return el.id !== val;
					})

					localStorage.setItem(cookieName, JSON.stringify(removedPlayer));
				},
				"clear": function() {
					items = [];
					localStorage.setItem(cookieName, JSON.stringify(items));
				},
				"items": function() {
					return items;
				}
			}
		}

		function setHighestBid() {
			var highestBid = $('table td:contains("Highest bid")').next().text().trim().split(',')[0].split('€')[1].trim().split('.').join("");
			var valueToBid = parseInt(highestBid)*1.05;
			$('#teamoffer').val(valueToBid);

			$('#duur').val('3');
		}

	})

})(jQuery);