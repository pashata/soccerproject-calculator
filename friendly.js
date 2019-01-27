(function($){

	var isFriendlyPool 		= window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_friendly_pool.php"),
		isMatchSetup 		= window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_game_selectie.php"),
		friendlyBaseLink 	= 'https://www.soccerproject.com/spnewl_friendly_pool.php',
		theLinks 			= [],
		currentLink 		= 0,
		leagues 			= ['A','B','C','D','E','F','G','H'],
		confirmedTeams 		= [];

	$(document).ready(function(){


		if (isFriendlyPool) {

			var newTableDiv = $('<div id="newContent"><table><tbody></tbody></table></div>');

			createOptionBox();

			$('#inviteform table').after(newTableDiv);

			var daysLabels = $('.available-days label');

			daysLabels.find('input[type="radio"]').on('change',function(){
				var dayValue = $(this).attr('value');
				daysLabels.removeClass('active');
				$(this).closest('label').addClass('active');

				processDay(dayValue);
			})

			function processDay(dayValue) {
				var dayValues 	= dayValue.split(','),
					currentTime = 0,
					sizeOfTimes = dayValues.length;

				theLinks 	= []; //reset links in case it's not first click
				currentLink = 0; //reset link for processing links

				dayValues.forEach(function(hour){
					var theLink = friendlyBaseLink+'?pagefrom=0&step=1&selected_slot='+hour;
					$.ajax({
					    type: "POST",
					    url: theLink,
					    success: function (data) {
					    	currentTime++;
					    	buildLinks(data,hour);
					    	if (currentTime>=sizeOfTimes) {
					    		processLinks();
					    	}
					    }
					});
				})
			}

			function buildLinks(data,hour) {
				var paginator 	= $(data).find('#paginator'),
					anchorElem 	= paginator.find('a');
					
					theLinks.push(friendlyBaseLink + '?pagefrom=0&step=1&selected_slot='+hour);

				if (typeof paginator != 'undefined') {
					if (anchorElem.length>0) {
						if (anchorElem.last().text()=='Next') {
							numberPages = parseInt(anchorElem.last().prev().text());
							for (var i=1; i<numberPages; i++) {
								theLinks.push(friendlyBaseLink+'?pagefrom='+(i*15)+'&step=1&selected_slot='+hour);
							}
						}
					}
				}

			}

			function processLinks() {

				var theLink = theLinks[currentLink];
					currentLink++; //increase link index for proccesing the next one

				$.ajax({
				    type: "POST",
				    url: theLink,
				    success: function (data) {
				    	processSingleLink(data);
				    }
				});

			}

			function processSingleLink(data) {
				var gamesRows = $(data).find('#inviteform table tbody tr').slice(1),
					maxLeague = 'E',
					teamLinks = [];

				gamesRows.each(function(){
					var teamLeague = $(this).find('td:nth-child(3)').text().split('(')[1].split('.')[0];
					if (leagues.indexOf(teamLeague)>=leagues.indexOf(maxLeague)) {
						var relativeLink = $(this).find('td:nth-child(3) a:nth-child(1)').attr('href');
						teamLinks.push('https://www.soccerproject.com/'+relativeLink);
					}
				})

				if (teamLinks.length>0) {
					processTeamLinks(teamLinks,gamesRows);
				} else {
					processLinks();
				}

			}

			function processTeamLinks(teamLinks,gamesRows) {
				var maxTeamRating 		= 70,
					maxFanSatisfaction 	= 100;

				var currentTeamLink 	= 0,
					sizeOfTeamLinks 	= teamLinks.length;

				teamLinks.forEach(function(link){
					$.ajax({
					    type: "POST",
					    url: link,
					    success: function (data) {
					    	currentTeamLink++;

					    	var fanSatisfaction = $(data).find('table tr .powerbar').eq(0).attr('title').slice(0,2),
					    		teamRating 		= $(data).find('table tr .powerbar').eq(1).attr('title').slice(0,2);

					    	if (maxTeamRating>teamRating && maxFanSatisfaction>fanSatisfaction) {
					    		confirmedTeams.push(link.split('=')[1]);
					    	}

					    	if (currentTeamLink>=sizeOfTeamLinks) {
					    		if (confirmedTeams.length>0) {
					    			displayGames(confirmedTeams,gamesRows);
					    		} else {
					    			//There is no teams proccesed , try the next page in the paginator
					    			processLinks();
					    		}
					    	}
					    }
					});
				})	
			}

			function displayGames(confirmedTeams,gamesRows) {
				newTableDiv.find('table').empty();
				confirmedTeams.forEach(function(team){
					var gameRow = gamesRows.find('a[href*="tid='+team+'"]').closest('tr');
					
					var teamName 	= gameRow.find('td:nth-child(3) a:nth-child(1)').text(),
						acceptLink 	= 'https://www.soccerproject.com/'+gameRow.find('td:nth-child(7) a').attr('href');

					newTableDiv.find('table').append(gameRow);
					
				})
			}

			function createOptionBox() {

				/* * *
				/*	Create option box
				/* */
				var optionBox = $('<div class="option-box"></div>');

				/* * *
				/*	Age checkboxes
				/* */
				var availableHours 		= $('#selected_slot option'),
					availableDays 		= [];

				var availableDaysBox 	= $('<div class="available-days"></div>');

					availableDaysBox.append('<h3>Available days:</h3>');

					availableHours.each(function(){
						var dayValue = $(this).attr('value'),
							dayLabel = $(this).text();

							if (typeof availableDays[dayLabel.split("(")[0].trim()] == 'undefined') {
								availableDays[dayLabel.split("(")[0].trim()] = dayValue;
							} else {
								availableDays[dayLabel.split("(")[0].trim()] += ','+dayValue;
							}
					});

					availableDays.forEach(function(day,index){
					})

					for(var index in availableDays) {
						var newRadio = $('<label><input type="radio" name="available-day" value="'+availableDays[index]+'">'+index+'</label>');
						availableDaysBox.append(newRadio);
					}

					optionBox.append(availableDaysBox);


				$('body').append(optionBox);

			}

		}// IF isFriendlyPool

		if (isMatchSetup) {

			createHtml();

			$('.trigger-setup').on('click',function(event){
				event.preventDefault();

				var playersMoral = getPlayersMorale();

				processField(playersMoral);
			})

			function createHtml() {
				var triggerBtn = $('<a href="#" class="trigger-setup">Setup match</a>');

				$('body').append(triggerBtn);
			}

			function getPlayersMorale() {
				var playersTable 	= $('table.game_selectie'),
					playersRows 	= playersTable.find('tr[id^=trPlayer]');

				var moralArray 		= [];

				playersRows.each(function(){
					var plMoral = $(this).find('td:nth-child(4)').text(),
						plId 	= $(this).attr('id').replace('trPlayer','');

					moralArray[plId] = plMoral;
				})

				return moralArray;
			}

			function processField(plMoral) {
				var alreadyAdded = [];

				for (var i=1;i<12;i++) {
					var posPlayers 		= $('#player'+i).find('optgroup').eq(0).find('option'),
						selectedMoral 	= 101,
						selectedFitness	= -1,
						selectedId	 	= -1;

					posPlayers.each(function(){
						var plId 	= $(this).attr('value'),
							moral 	= parseInt($('#trPlayer'+plId).find('td:nth-child(4)').text().replace('%','')),
							fitnes 	= parseInt($('#trPlayer'+plId).find('td:nth-child(5)').text().replace('%',''));

							if (moral<100) {
								if (fitnes>80){
									if (selectedMoral>moral) {
										$('#player'+i).find('select').val(plId);
										selectedMoral = moral;
									}
								}
							}
					})

					if (selectedMoral>100) {
						$('#player'+i).find('select').val('0');
					}

					console.log('----');
				}
			}
		}

	})


})(jQuery);