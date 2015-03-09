$('document').ready(function() {

/*** MODEL ***/
	var modelComponent = {
		init: function(data) {
			this.kittehs = [];       // hold our kittehs with this
			this.currentKitteh = 0;  // start at the very beginning, a very good place to start

			// create kitteh objects from data and add to the kittehs array
			for (var i = 0; i < data.results.length; i++) {
				this.kittehs.push({
					score: 0,
					name: data.results[i].user.name.first,
					gender: data.results[i].user.gender,
					hooman: data.results[i].user.picture.thumbnail
				});
			}
			console.log(this);
			viewKittehs.init(this.kittehs); // this shouldn't be called from the model - refactor to the Octopus
		},
		getCurrentKitteh: function() {
			return this.kittehs[currentKitteh];
		},
		setCurrentKitteh: function(kitteh) {
			this.currentKitteh = kitteh;
		}
	};

/*** VIEWS ***/
	var viewKittehs = {
		init: function(kittehs) {
			var kittehList = $('#kittehList');

			// build our selectable list of kitteh names
			for (var i = 0; i < kittehs.length; i++) {
				$('<li class="ui-widget-content" id="'+i+'">'+kittehs[i].name+'</li>').appendTo(kittehList);
			}

			$('#kittehList').selectable({
				selected: function(event, ui) {
					// console.log(event);
					// console.log(ui);
					octopus.setCurrentKitteh(parseInt(ui.selected.id));
				}
			});
		},
		render: function() {}
	};

	var viewCurrentKitteh = {
		init: function() {
			this.currentKitteh = octopus.getCurrentKitteh();
		},
		render: function() {}
	};

	var viewScoreboard = {
		init: function() {},
		render: function() {}
	};

/*** OCTOPUS ***/
	var octopus = {
		init: function() {
			// find out how many cats we need and fire off an ajax request to RandomAPI for data
			var numKittehs = prompt("How many kittehs would you like?", 5);
			$.ajax({
				url: 'http://api.randomuser.me/?results='+numKittehs,
				dataType: 'json',
				success: function(data) {
					// hand data to model for kitteh creation during initialization
					modelComponent.init(data);
				}
			});
		},
		// pass data 
		setCurrentKitteh: function(kitteh) {
			modelComponent.setCurrentKitteh(kitteh);
			viewCurrentKitteh.render();
		},
		getCurrentKitteh: function () {
			return modelComponent.getCurrentKitteh();
		}
	};

	octopus.init(); // get this party started
});