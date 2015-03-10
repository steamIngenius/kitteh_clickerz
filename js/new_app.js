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
		},
		click: function() {
			this.kittehs[this.currentKitteh].score++;
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
					octopus.setCurrentKitteh(parseInt(ui.selected.dataset.id));
				}
			});
		},
		render: function() {
			for (var i = 0; i < this.kittehs.length; i++) {
				$('<li class="ui-widget-content" data-id="'+i+'">'+this.kittehs[i].name+'</li>').appendTo(this.kittehList);
			}
		}
	};

	var viewCurrentKitteh = {
		init: function(numKittehs) {
			// get some kitteh images from the Cat API http://thecatapi.com/
			// add these images to the dom and hide them
			$.ajax({
				type: "GET",
				url: "http://thecatapi.com/api/images/get?format=xml&results_per_page=" +
					numKittehs +
					"&size=med&type=gif",
				dataType: "xml",
				/* xhrFields: {
					withCredentials: true,
				}, */
				success: function(data) {
					console.log(data); // for checking response
					// build our kitteh display area with hidden images
					// use data-id to show/hide the correct kitteh
					$(data).find('url').each( function(index) {
						// console.log($(this).text());
						$('<img class="hidden" data-id="'+index+'" src="'+$(this).text()+'" length="300" width="300">').appendTo($('#currentKitteh > div'));
					});

					// grab dom element for the kitteh
					viewCurrentKitteh.kittehClick = $('#currentKitteh > div > img');
					// console.log(viewCurrentKitteh.kittehClick);
					// set up event handler for clicking
					viewCurrentKitteh.kittehClick.click(function() {
						octopus.click();
					});

					viewCurrentKitteh.render(0);
				}
			});

			/* var url = "http://thecatapi.com/api/images/get?format=xml&results_per_page=10&size=small&type=jpg"

			var xhr = this.createCORSRequest('GET', url);
			xhr.onload = function(data) {
				console.log(data);
			};
			xhr.send();

			console.log(xhr);

			if (!xhr) {
			  throw new Error('CORS not supported');
			} */


		},
		shake: function() {
			this.kittehClick.effect('shake');
		},
		render: function(kitteh) {
			// $("#tab > div > div") - reference for grabbing child divs for an id
			// hide all the images then show the correct one
			// animate this with jQuery UI
			var kittehs = $('#currentKitteh > div > img');
			// console.log(kittehs);
			kittehs.each(function(index) {
				if (index === kitteh) {
					$(this).removeClass('hidden');
					$(this).addClass('visible');
				} else {
					$(this).removeClass('visible');
					$(this).addClass('hidden');
				}
			});
		},
		// this function is unused - it's here for posterity and future reference
		createCORSRequest: function (method, url) {
			var xhr = new XMLHttpRequest();
		  	if ("withCredentials" in xhr) {
		    	// Check if the XMLHttpRequest object has a "withCredentials" property.
		    	// "withCredentials" only exists on XMLHTTPRequest2 objects.
		    	xhr.open(method, url, true);
		  	} else if (typeof XDomainRequest != "undefined") {
			    // Otherwise, check if XDomainRequest.
			    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
			    xhr = new XDomainRequest();
			    xhr.open(method, url);
			} else {
			    // Otherwise, CORS is not supported by the browser.
			    xhr = null;
			}
			return xhr;
		}
	};

	var viewScoreboard = {
		init: function() {
			// get current kitteh info
			// call my render to show info
			this.render();
		},
		render: function() {
			var kitteh = octopus.getCurrentKitteh();
			$('#score').text('Score: ' + kitteh.score);
			$('#kittehGender').text('Gender: ' + kitteh.gender);
			$('#kittehHooman').text('Slave hooman:');
			$('<br><img src="' + kitteh.hooman + '">').appendTo($('#kittehHooman'));
		}
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
					viewCurrentKitteh.init(numKittehs);
					// initiallize our scoreboard
					viewScoreboard.init();
				}
			});
		},
		// pass data 
		setCurrentKitteh: function(kitteh) {
			modelComponent.setCurrentKitteh(kitteh);
			viewCurrentKitteh.render(kitteh);
			viewScoreboard.render();
		},
		getCurrentKitteh: function () {
			return modelComponent.getCurrentKitteh();
		},
		click: function() {
			modelComponent.click();
			viewCurrentKitteh.shake();
			viewScoreboard.render();
		}
	};

	octopus.init(); // get this party started
});