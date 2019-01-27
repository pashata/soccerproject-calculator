(function($){

	var isPlayerOverview 		= window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_speler_overview.php");

	var playersScreenshots = $.cookie("players-screenshots");

	$(document).ready(function(){


		if (isPlayerOverview) {

			addRatingInPlayersTable();
			addPositionFilter();

			var filterTabs = $('#content .position-filter a');

			filterTabs.on('click',function(event){
				event.preventDefault();

				filterRows($(this));
			})

			function filterRows(clickedBtn) {

				var filterPos 	= clickedBtn.attr('data-position'),
					playerRows 	= $('#player_overview tr[id^="id_"]:not(:first-child)');

					console.log(playerRows.length);
				
				filterTabs.removeClass('active');
				clickedBtn.addClass('active');

				playerRows.each(function(){
					if ($(this).find('td:first-child').hasClass(filterPos)) {
						$(this).removeClass('hidden');
					} else {
						$(this).addClass('hidden');
					}
				})
			}

			function addRatingInPlayersTable() {

				var plTable 		= $('#player_overview'),
					playersRatings 	= plTable.find('td .powerbar');

				playersRatings.each(function(){
					var percentage = $(this).attr('title').replace(" %", "");

					switch (true) {
						case (percentage>=88):
							var percentageClass = 'color7';
							break;
						case (percentage>=85):
							var percentageClass = 'color6';
							break;
						case (percentage>=80):
							var percentageClass = 'color5';
							break;
						case (percentage>=70):
							var percentageClass = 'color4';
							break;
						case (percentage>=55):
							var percentageClass = 'color3';
							break;
						case (percentage>=40):
							var percentageClass = 'color2';
							break;
						case (percentage<40):
							var percentageClass = 'color1';
							break;
					}

					$(this).after('<div class="numrating '+percentageClass+'">'+percentage+'</div>');

					if (percentage>=85) {
						$(this).closest('tr').addClass('star-player');
					}
				})

			}

			function addPositionFilter() {

				var plTable 		= $('#player_overview'),
					allPositions	= plTable.find('[class^="pos"]'),
					filteredPos 	= [],
					filterCont 		= $('<div class="position-filter"></div>');

				allPositions.each(function(){
					var singleClass = $(this).attr('class');

					if ($.inArray(singleClass,filteredPos)===-1) {
						var filterLink = $('<a href="" data-position="'+singleClass+'">'+singleClass.replace("pos", "")+'</a>');

						filteredPos.push(singleClass);
						filterCont.append(filterLink);
					}
				});

				plTable.before(filterCont);

			}


		}// IF isPlayerOverview

	})


})(jQuery);