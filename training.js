(function($){

	var isTrainingPage = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1').includes("spnewl_speler_training.php");

	$(document).ready(function(){


		if (isTrainingPage) {

			createOptionBox();
			eventHandlers();

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

				var setTrainingBox 	= $('<div class="settraining-days"></div>');

					setButton = $('<a href="" id="settraining">Set training</a>');
					setTrainingBox.append(setButton);

					optionBox.append(setTrainingBox);


				$('body').append(optionBox);

			}

			function eventHandlers() {

				$('#settraining').on('click',function(event){
					event.preventDefault();

					setTraining();
				})

			}

			function setTraining() {
				var playerDropdowns = $('select[name^="train"]');

				playerDropdowns.each(function(){
					var playerAttributes = $(this).find('option'),
						numberAttributes = playerAttributes.length;

					for (var i=numberAttributes;i>1;i--) {
						if (!playerAttributes.eq(i-1).hasClass('maxed') || i==2) {
							playerAttributes.eq(i-1).attr('selected','selected');
							break;
						}
						
					}
				});
			}

		}// IF isTrainingPage

	})


})(jQuery);