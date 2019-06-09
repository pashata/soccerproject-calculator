(function($){

	var isRatingsPage 	= window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_speler_ratings.php");
	var isContractsPage = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_speler_contracts.php");

	var getSallaryBtn = $('<a href="" class="trigger-setup">Get sallary</a>');
	var getPottentialSallaryBtn = $('<a href="" class="trigger-setup">Potential Sallary</a>');

	if (isRatingsPage) {
		$('body').append(getSallaryBtn);

		getSallaryBtn.on('click',function(event){
			event.preventDefault();

			processPlayersSallary();

		})
	}

	if (isContractsPage) {
		$('body').append(getPottentialSallaryBtn);

		getPottentialSallaryBtn.on('click',function(event){
			event.preventDefault();

			appendPotentialSallaries();
		})
	}

	function processPlayersSallary() {
		let playersRows = $('#content table').eq(0).find('tr'),
			playersArr 	= [];
		playersRows.each(function(){
			let playerObj = {};

			playerObj['id']		= $(this).find('td:nth-child(2) a').attr('onclick');
			playerObj['rating'] = $(this).find('td:nth-child(3)').text().trim();
			playerObj['morale'] = $(this).find('td:nth-child(4)').text().trim();

			if (typeof(playerObj['id'])=='undefined') {
				return;
			}

			playerObj['id']		= playerObj['id'].split('?spid=')[1].split('\'')[0];

			playersArr.push(playerObj);
		})

		getSallary(playersArr);
	}

	function getSallary(playersArr) {

		let corsUrl = 'https://cors-anywhere.herokuapp.com/';
		let theLink = 'http://spinfo-tool.com/contract';

		if (playersArr.length>0) {

			let currentPlayer = playersArr.pop();
			let formData;
			
			formData = "rating="+currentPlayer['rating']+"&";
			formData += "morale="+currentPlayer['morale'];

			$.ajax({
			    type: "POST",
			    url: corsUrl + theLink,
			    data: formData,
				headers: {
					"x-requested-with": "xhr" 
				},
			    success: function (data) {
			    	processSallaryData(data,currentPlayer['id']);
			    	getSallary(playersArr);
			    },
				error:function (xhr, ajaxOptions, thrownError){
				    if(xhr.status==404) {
				        console.log('Nemat igrachi! 404 ERROR');
				    }
				}
			})
		}
	}

	function processSallaryData(data,plID) {

		let cookieSalaries = new cookieList("playersSalaries").items();

		let sallaryTable = $(data).find('table');
		let basicSallary = sallaryTable.find('tr:nth-child(2) td:nth-child(2)').text().split('€')[1].trim();


		if (cookieSalaries.length == 0) {
			let playerObject = {};
			playerObject[plID] = {
				'salary' 	: basicSallary,
			}

			cookieSalaries.push(playerObject);
			localStorage.setItem('playersSalaries', JSON.stringify(cookieSalaries));
		} else {

			cookieSalaries[0][plID] = {
				'salary' 	: basicSallary,
			}

			localStorage.setItem('playersSalaries', JSON.stringify(cookieSalaries));
		}

	}

	function appendPotentialSallaries() {
		let sallariesCookie = new cookieList("playersSalaries").items();
		if (sallariesCookie.length>0) {
			
			let sallariesObj = sallariesCookie[0];
			let playersRows = $('#content table tr[id^="id_"]');

			playersRows.each(function(){
				let plID 		= $(this).prev().find('td:nth-child(2) a').attr('onclick').split('LoadPlayerInDiv(')[1].split(',')[0].trim();
				let salary 		= sallariesObj[plID]['salary'];
				let tdClass 	= '';

				if (parseInt(salary.replace('.',''))<1000) {
					tdClass = 'salary1';
				}
				if (parseInt(salary.replace('.',''))<2000 && parseInt(salary.replace('.',''))>1000) {
					tdClass = 'salary2';	
				}

				let appendTD = '<td style="text-align:right" class="'+tdClass+'">'+salary+'</td>';

				$(this).prev().find('td:nth-child(6)').after(appendTD);
			})


		} else {
			alert('Get the sallaries first on ratings page!');
		}
	}

	var cookieList = function(cookieName) {
		
		var cookie = localStorage.getItem(cookieName);
		
		var items = cookie ? $.parseJSON(cookie) : new Array();

		return {
			"add": function(val) {
				items.push(val);

				localStorage.setItem(cookieName, JSON.stringify(items));
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

})(jQuery);
