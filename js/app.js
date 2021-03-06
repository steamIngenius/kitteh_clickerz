var Kitteh = function(name, gender, hooman) {
	this.score = 0;
	this.name = name;
	this.gender = gender;
	this.hooman = hooman;
};

var kittehs = [];
var currentKitteh;

function setupMenu() {
	for (var i = 0; i < kittehs.length; i++) {
		$('<li class="ui-widget-content" id="'+i+'">'+kittehs[i].name+'</li>').appendTo($('#currentKitteh'));
	}
	$('#currentKitteh').selectable({
		selected: function(event, ui) {
			// console.log(event);
			console.log(ui);
			currentKitteh = parseInt(ui.selected.id);
			updateUI();
		}
	});
}

function updateUI() {
	$('#score').text('Score: ' + kittehs[currentKitteh].score);
	$('#kittehGender').text('Gender: ' + kittehs[currentKitteh].gender);
	$('#kittehHooman').text('Slave hooman:');
	$('<br><img src="' + kittehs[currentKitteh].hooman + '">').appendTo($('#kittehHooman'));
}

// add our meows to the page by inserting html
$('<audio id="meow1" src="lib/audio/1.mp3" type="audio/mpeg"></audio>').appendTo('body');
$('<audio id="meow2" src="lib/audio/2.mp3" type="audio/mpeg"></audio>').appendTo('body');
$('<audio id="meow3" src="lib/audio/3.mp3" type="audio/mpeg"></audio>').appendTo('body');
$('<audio id="meow4" src="lib/audio/4.mp3" type="audio/mpeg"></audio>').appendTo('body');


function createKittehs(numKittehs) {
	$.ajax({
		url: 'http://api.randomuser.me/?results='+numKittehs,
		dataType: 'json',
		success: function(data) {
			console.log(data);
			for (var i = 0; i < numKittehs; i++) {
				kittehs.push(new Kitteh(
					data.results[i].user.name.first,
					data.results[i].user.gender,
					data.results[i].user.picture.thumbnail
					));
			}
			setupMenu();
		}
	});
}

$('#kitteh').click(function () {
	// log this event
	var kitteh = kittehs[currentKitteh];
	console.log(kittehs[currentKitteh]);
	// score!
	kitteh.score++;
	$('#score').text('Score: ' + kitteh.score);
	// visual feedback
	$('#kitteh').effect("shake");
	// audio feedback
	var sound = Math.floor(Math.random()*4)+1; // random cat sound
	$('#meow'+sound)[0].play();
});

$('#document').ready( function() {
	// make some kittehs
	// alert with select your number of kittehs
	numKittehs = prompt("How many kittehs would you like?", 5);
	createKittehs(numKittehs);
	console.log("The page has loaded.");
});