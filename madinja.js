	let corsUrl = 'https://cors-anywhere.herokuapp.com/';
	let theLink = 'https://www.soccerproject.com/spnewl_transfer_buy.php';
	//let theLink	= 'http://spinfo-tool.com/';

	$.ajax({
	    type: "POST",
	    url: corsUrl + theLink,
	    username: 'pashata',
	    password: 'computerr',
		headers: {
			"x-requested-with": "xhr" 
		},
	    success: function (data) {
	    	$('#thePage').append(data);
	    },
		error:function (xhr, ajaxOptions, thrownError){
		    if(xhr.status==404) {
		        console.log('Nemat igrachi! 404 ERROR');
		    }
		}
	});