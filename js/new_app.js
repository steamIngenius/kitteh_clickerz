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
					name: data.results[i].user.name.first.capitalizeFirstLetter(),
					gender: data.results[i].user.gender,
					hooman: data.results[i].user.picture.thumbnail,
					kittehURL: ""
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
		updateCurrentKitteh: function(kitteh) {
			this.kittehs[currentKitteh] = kitteh;
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
			// blank out the list and redraw it
			this.kittehList.html("");
			for (var i = 0; i < this.kittehs.length; i++) {
				$('<li class="ui-widget-content" data-id="'+i+'">'+this.kittehs[i].name+'</li>').appendTo(this.kittehList);
			}
			// show the correct cat selected 
			var someIndex = octopus.getCurrentKittehIndex() + 1;
			this.kittehList.children(":nth-child("+someIndex+")").addClass('ui-selected');
		}
	};

	var viewCurrentKitteh = {
		init: function(numKittehs) {
			// get some kitteh images from the Cat API http://thecatapi.com/
			// add these images to the dom and hide them
			// this should be refactored into the octopus and the kitteh urls need to be added to their
			// kitteh objects
			// the view shouldn't be handling this kind of data operation
			$.ajax({
				type: "GET",
				url: "http://thecatapi.com/api/images/get?format=xml&results_per_page=" +
					numKittehs +
					"&size=med&type=gif",
				dataType: "xml",
				xhrFields: {
					withCredentials: true,
				},
				success: function(data) {
					console.log(data); // for checking response
					// build our kitteh display area with hidden images
					// use data-id to show/hide the correct kitteh
					$(data).find('url').each( function(index) {
						// console.log($(this).text());
						$('<img class="hidden" data-id="'+index+'" src="'+$(this).text()+'" length="300" width="300">').appendTo($('#currentKitteh > div'));
						octopus.addURL(index, $(this).text());
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
			// currently we load all images in the beginning and show/hide the correct one
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

	var viewAdmin = {
		init: function() {
			// grab adminConsole div
			this.adminConsoleArea = $('#adminConsoleArea');
			this.adminConsole = $('#adminConsole');

			// add html elements with correct default values for name, clicks# and url
			this.adminButton = $("<button id=\"adminButton\">Admin</button>").appendTo(this.adminConsoleArea);

			// my new favorite way to code up HTML and simultaneously make everything available to jQuery/JS
			// it's really ugly though... kinda makes my eyes cross
			this.saveButton = $("<button id=\"saveButton\">Save</button>").appendTo(this.adminConsole);
			this.cancelButton = $("<button id=\"cancelButton\">Cancel</button>").appendTo(this.adminConsole);
			this.adminConsoleForm = $("<form id=\"adminConsoleForm\" class=\"adminConsoleForm\"></form>").appendTo(this.adminConsole);

			this.adminName = $("<label for=\"adminName\">Name: </label><input type=\"text\" id=\"adminName\" value=\"\"><br>")
				.appendTo(this.adminConsoleForm);
        	this.adminClicks = $("<label for=\"adminClicks\">Clicks: </label><input type=\"text\" id=\"adminClicks\" value=\"\"><br>")
        		.appendTo(this.adminConsoleForm);
        	this.adminURL = $("<label for=\"adminURL\">URL: </label><input type=\"text\" id=\"adminURL\" value=\"\">")
        		.appendTo(this.adminConsoleForm);

			// hook up buttons for open/save/cancel
			// refactor into render later if needed
			this.adminButton.button().click(function(event) {
				viewAdmin.show();
				// console.log(event);
			});

			this.saveButton.button().click(function(event) {
				octopus.updateCurrentKitteh();
				viewAdmin.hide();
				// console.log(event);
			});

			this.cancelButton.button().click(function(event) {
				viewAdmin.hide();	
			});

			// render
			this.render();
		},
		show: function() {
			this.adminConsole.animate( { left: "66.6666666%" }, 600, "easeOutBounce");
			this.render();
		},
		hide: function() {
			this.adminConsole.animate({ left:"100%" }, 300, "easeInSine" );
		},
		render: function() {
			// update fields with correct information
			var currentKitteh = octopus.getCurrentKitteh();
			this.adminName.val(currentKitteh.name);
			this.adminClicks.val(currentKitteh.score);
			this.adminURL.val(currentKitteh.kittehURL);
		}
	};

/*** AUDIO ***/
	var kittehAudio = {
		init: function() {
			// add our meows to the page by inserting html
			$('<audio id="meow1" src="lib/audio/1.mp3" type="audio/mpeg"></audio>').appendTo('body');
			$('<audio id="meow2" src="lib/audio/2.mp3" type="audio/mpeg"></audio>').appendTo('body');
			$('<audio id="meow3" src="lib/audio/3.mp3" type="audio/mpeg"></audio>').appendTo('body');
			$('<audio id="meow4" src="lib/audio/4.mp3" type="audio/mpeg"></audio>').appendTo('body');
		},
		meow: function() {
			var sound = Math.floor(Math.random()*4)+1; // random cat sound
			$('#meow'+sound)[0].play();	
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
					// initiallize our scoreboard and finally our admin console
					viewScoreboard.init();
					viewAdmin.init();
				}
			});

			// set up meows
			kittehAudio.init();

			String.prototype.capitalizeFirstLetter = function() {
    			return this.charAt(0).toUpperCase() + this.slice(1);
			}
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
		getCurrentKittehIndex: function() {
			return modelComponent.currentKitteh;
		},
		updateCurrentKitteh: function() {
			modelComponent.kittehs[modelComponent.currentKitteh].score = viewAdmin.adminClicks[1].value;
			viewScoreboard.render();

			modelComponent.kittehs[modelComponent.currentKitteh].name = viewAdmin.adminName[1].value;
			viewKittehs.render();

			modelComponent.kittehs[modelComponent.currentKitteh].kittehURL = viewAdmin.adminURL[1].value;
			var childIndex = modelComponent.currentKitteh + 1;
			$("#currentKitteh > div").children(':nth-child('+childIndex+')').attr('src', modelComponent.kittehs[modelComponent.currentKitteh].kittehURL);
		},
		click: function() {
			kittehAudio.meow();
			modelComponent.click();
			viewCurrentKitteh.shake();
			viewScoreboard.render();
		},
		addURL: function(kitteh, kittehURL) {
			modelComponent.kittehs[kitteh].kittehURL = kittehURL;
		}
	};

	octopus.init(); // get this party started
});