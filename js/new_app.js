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
			return this.kittehs; // return the list of kittehs to the Octopus so he can pass it to the proper view
		},
		getCurrentKitteh: function() {
			return this.kittehs[this.currentKitteh];
		},
		setCurrentKitteh: function(kitteh) {
			this.currentKitteh = kitteh;
		}
	};

/*** VIEWS ***/
	var viewKittehs = {
		init: function(kittehs) {
			this.kittehList = $('#kittehList');
			this.kittehs = kittehs;

			// build our selectable list of kitteh names
			this.render();

			// make the list selectable and attach Octopus for handling select event
			$(this.kittehList).selectable({
				selected: function(event, ui) {
					// console.log(event);
					// console.log(ui);
					octopus.setCurrentKitteh(parseInt(ui.selected.id));
				}
			});
		},
		render: function() {
			for (var i = 0; i < this.kittehs.length; i++) {
				$('<li class="ui-widget-content" id="'+i+'">'+this.kittehs[i].name+'</li>').appendTo(this.kittehList);
			}
		}
	};

	var viewCurrentKitteh = {
		init: function() {
			this.currentKitteh = octopus.getCurrentKitteh();
			// event handler for clicking the kitteh
			// call my render
		},
		render: function() {}
	};

	var viewScoreboard = {
		init: function() {
			// get current kitteh info
			// call my render to show info
		},
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
					viewKittehs.init(modelComponent.init(data));
					// initiallize our current kitteh
					viewCurrentKitteh.init();
					// initiallize our scoreboard
					viewScoreboard.init();
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