(function($){
	
	$(document).ready(function(){

		var isTransferPage 	= window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_transfer_buy.php"),
			isTransferMade 	= window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_transfer_made.php"),
			isPlayerDetails = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_speler_detail.php");

		var playersSnaps 	= new cookieList("playersSnaps");


		if (isTransferPage) {

			createAddToWatchlistBtn();
			eventHandlers();

		}// IF isTrainingPage

		if (isPlayerDetails) {
			var curentID 		= window.location.href.split('=')[1].split('&')[0];
			var items = playersSnaps.items();

			if (snapExist(curentID)[0]) {
				var playerStats = snapExist(curentID)[1];

				populateSnapshotStats(playerStats);
			}

		}

	}) //Document ready

	function createAddToWatchlistBtn() {

		var playersTable = $('#buyform'),
			playersSnaps = new cookieList("playersSnaps"),
			rows 		= playersTable.find('tr:not([id^=id_]):not("first-child")');

		var addBtn 			= $('<a href="" class="createSnap">Create snapshot</a>'),
			rmvBtn 			= $('<a href="" class="removeSnap">Remove snapshot</a>'),
			clearWatchlist 	= $('<li><a href="" class="clearWatchlist">Clear watchlist</a></li>'),
			viewWatchlist 	= $('<li><a href="" class="viewWatchlist">View Watchlist</a></li>');

			rows.each(function(){
				var plID = $(this).find('td:nth-child(2) a').attr('onclick');

				if (typeof plID != 'undefined') {
					plID = plID.split('try { LoadPlayerInDiv(')[1].split(',')[0];

					if (playersSnaps.items().length>0) { //Avoid checking empty cookie array
						if (snapExist(plID)[0]) {
							$(this).find('td:last-child').append(rmvBtn.clone().attr('data-plid',plID));
						} else {
							$(this).find('td:last-child').append(addBtn.clone().attr('data-plid',plID));
						}
					} else {
						$(this).find('td:last-child').append(addBtn.clone().attr('data-plid',plID));
					}
				}
			})

		$('#lastgame').after(clearWatchlist);
		clearWatchlist.after(viewWatchlist);

	}

	function eventHandlers() {

		$('body').on('click','.createSnap',function(event){
			event.preventDefault();

			var playerId = $(this).attr('data-plid');
			addPlayerToWatchlist(playerId);

			$(this).removeClass('createSnap').addClass('removeSnap');

		});

		$('body').on('click','.removeSnap',function(event){
			event.preventDefault();

			var playerId = $(this).attr('data-plid'),
				watchlist = new cookieList('playersSnaps');

			watchlist.remove(playerId);
			$(this).removeClass('removeSnap').addClass('createSnap');

		});

		$('body').on('click','.clearWatchlist',function(event){
			event.preventDefault();

			var confirmDelete = confirm("Are you sure you want to clear the watchlist?");
			if (confirmDelete) {
				var watchlist = new cookieList("playersSnaps");
				watchlist.clear();

				alert('Watchlist is cleared');
			}
		});

		$('body').on('click','.viewWatchlist',function(event){
			event.preventDefault();

			viewWatchlist();
		});

	}

	function viewWatchlist() {
		var playersSnaps 	= new cookieList("playersSnaps").items(),
			watchlistCont 	= $('<div class="watchlist-cont"></div>'),
			innerCont 		= $('<div class="inner"></div>'),
			playersList 	= $('<table class="players-list"></table>');

		playersSnaps.forEach(function(item){
			var newRow = $('<tr></tr>');

			newRow.append('<td>'+item['position']+'</td>');
			newRow.append('<td>'+item['name']+'</td>');
			newRow.append('<td>'+item['age']+'</td>');
			newRow.append('<td><a href="https://www.soccerproject.com/spnewl_speler_detail.php?spid='+item['id']+'" target="_blank">View</a></td>');

			playersList.append(newRow);
		})

		innerCont.append(playersList);
		watchlistCont.append(innerCont);

		$('body').append(watchlistCont);
	}

	function addPlayerToWatchlist(plID) {
		var url = 'https://www.soccerproject.com/spnewl_speler_detail.php?spid='+plID;

		$.ajax({
		    type: "POST",
		    url: url,
		    success: function (data) {
		    	createPlayerRecord(data,plID);
		    }
		});
	}

	function createPlayerRecord(data,plID) {
		var statsRows 			= $(data).find('.player_detail_window:nth-child(4) tr').slice(-9),
			plPos 				= $(data).find('.player_detail_window:nth-child(2) tr:nth-child(1) td:nth-child(2)').text(),
			plName 				= $(data).find('h1').text().split('Details about player')[1].trim(),
			plAge 				= $(data).find('.player_detail_window:nth-child(2) tr:nth-child(3) td:nth-child(2)').text(),
			players 			= new Array,
			singlePlayer 		= {};

		var playersSnaps 	= new cookieList("playersSnaps");

		singlePlayer['id'] 			= plID;
		singlePlayer['position'] 	= plPos;
		singlePlayer['name'] 		= plName;
		singlePlayer['age'] 		= plAge;

		statsRows.each(function(){
			var key 	= $(this).find('td:first-child').text().toLowerCase().replace(' ','-'),
				value 	= $(this).find('.powerbar').attr('title').replace(' %','');

			singlePlayer[key] = value;
		})

		singlePlayer['dateAdded'] = new Date();

		playersSnaps.add(singlePlayer);

	}

	//This is not production quality, its just demo code.
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

	function populateSnapshotStats(stats) {

		var statsTable = $('.player_detail_window:nth-child(4)');

		for (var key in stats) {
			var title 	= uppercaseFirstLetter(key.replace('-',' ')),
				row 	= statsTable.find('td:contains("'+title+'")').closest('tr');

			if (row.length>0) {

				var currentPercentage 	= row.find('td:nth-child(2)').text().replace('%','').replace(' ',''),
					oldPercentage 		= stats[key],
					difference 			= currentPercentage-oldPercentage,
					differenceSpan 		= $('<span class="difference"></span>');

				if (difference>0) {
					differenceSpan.text(difference).addClass('higher');
				}
				if (difference<0) {
					differenceSpan.text(difference).addClass('lower');
				}
				if (difference==0) {
					differenceSpan.text(difference).addClass('equal');
				}

				row.find('.powerbar').after(differenceSpan);
			}
			
		}

		var oneDay 		= 24*60*60*1000, // hours*minutes*seconds*milliseconds
			today 		= new Date(),
			dateAdded 	= new Date(stats['dateAdded']),
			diffDays 	= Math.round(Math.abs((today.getTime() - dateAdded.getTime())/(oneDay)));

		var dateAdded = $('<span class="date-added">Days added to watchlist: <span>'+diffDays+'</span></span>');

		$('#content h1').append(dateAdded);

	}

	function uppercaseFirstLetter(str) {
	  return str = str.charAt(0).toUpperCase() + str.slice(1);
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


})(jQuery);