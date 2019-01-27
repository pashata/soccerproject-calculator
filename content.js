(function($){

	$(document).ready(function(){
		
		//Turn off autofill
		$('input[type="text"]').attr('autocomplete', 'off');

		var addonActive = $.cookie("scpr-extension");

		//Add button to activate plugin
		$('body').append('<a href="" id="activate-scpr-extension"></a>');

		$('#activate-scpr-extension').on('click',function(event){
			event.preventDefault();
			if (addonActive == '0' || addonActive == 'undefined' || addonActive == 'null') {
			    $.cookie("scpr-extension", '1');
			} else {
				$.cookie("scpr-extension", '0');
			}

			location.reload();
		})

		//Check and create cookie for enabled addon

		if (addonActive == '1') {

			$('body').addClass('scpr-extension');

			//move top inside content
			$('#top').detach().prependTo('#content');

			//Add ids for menu
			(function(){

				var secondaryMenus = $('#navigation li ul'),
					counter = 1;

				var secondaryMenusCont = $('<div class="secondary-menus-container"></div>');

				secondaryMenus.each(function(){
					$(this).parent().attr('data-for','menu-'+counter).attr('class','has-child');
					$(this).detach().attr('id','menu-'+counter).attr('class','secondary-menu').appendTo(secondaryMenusCont);
					counter++;
				})

				secondaryMenusCont.appendTo('#navigation');
			})();

			//Show secondary menus
			var listElemets = $('#navigation .has-child a');

			listElemets.on('click',function(){
				var menuId = $(this).parent().data('for');

				$('.secondary-menu').removeClass('active');
				$('#'+menuId).addClass('active');

				return false;
			})

			//Add classes to the player ratings
			var ratingsTable = $('h1:contains("Player ratings")').next();

			ratingsTable.find('tr').each(function(){
				if ($(this).find('td:first-child').attr('class')) { //it's not a header row 

					$(this).find('td').css('text-align','center').slice( 7, 16 ).each(function(){
						var rating = $(this).text();
						switch (true) {
							case (rating>90):
								$(this).addClass('color9');
								break;
							case (rating>80):
								$(this).addClass('color8');
								break;
							case (rating>70):
								$(this).addClass('color7');
								break;
							case (rating>60):
								$(this).addClass('color6');
								break;
							case (rating>50):
								$(this).addClass('color5');
								break;
							case (rating>40):
								$(this).addClass('color4');
								break;
						}
					})

				}
			})


		} // If addon is active
		//Rearange menus
		var mainNav = $('ul#navigation'),
			menusNeeded = {
				'Friednly pool'	:'spnewl_friendly_pool.php',
				'Fixtures'		:'spnewl_team_fixtures.php',
				'Results'		:'spnewl_team_results.php',
				'Transfers'		:'spnewl_menuinfo.php?mid=1_6',
				'Stadium'		:'spnewl_stadium_overview.php',
				'History'		:'spnewl_team_history.php',
				'Pl.Overview'	:'spnewl_speler_overview.php',
				'Ratings'		:'spnewl_speler_ratings.php',
				'Staff'			:'spnewl_staff_contracts.php',
				'Logout'		:'spnewl_logout.php.php',
			};

		mainNav.empty();

		for (var key in menusNeeded) {
			mainNav.append('<li><a href="'+menusNeeded[key]+'">'+key+'</a></li>');
		}
		
	})


})(jQuery);