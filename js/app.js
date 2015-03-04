var Kitteh = function(name) {
	this.score = 0;
	this.name = name;
};

var kittehs = [];

function setupMenu() {
	for (var i = 0; i < kittehs.length; i++) {
		$('<option>'+i+'</option>').appendTo($('#currentKitteh'));
	}
}

function updateUI() {
	currentKitteh = $('#currentKitteh').val();
	$('#scoreboard').text('Score: ' + kittehs[currentKitteh].score)
	$('#kittehName').text(kittehs[currentKitteh].name);
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
				kittehs.push(new Kitteh(data.results[i].user.name.first));
			}
			setupMenu();
			updateUI();
		}
	});
}

$('#kitteh').click(function () {
	// log this event
	var currentKitteh = $('#currentKitteh').val();
	var kitteh = kittehs[currentKitteh];
	console.log(kittehs[currentKitteh]);
	// score!
	kitteh.score++;
	$('#scoreboard').text('Score: ' + kitteh.score);
	// visual feedback
	$('#kitteh').effect("shake");
	// audio feedback
	var sound = Math.floor(Math.random()*4)+1; // random cat sound
	$('#meow'+sound)[0].play();
});

$('#currentKitteh').change( function() {
	updateUI();
});

$('#document').ready( function() {
	// make some kittehs
	// alert with select your number of kittehs
	numKittehs = prompt("How many kittehs would you like?", 5);
	createKittehs(numKittehs);
	$('#currentKitteh').selectable();
	console.log("The page has loaded.");
});