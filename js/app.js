var Kitteh = function(name) {
	this.score = 0;
	this.name = name;
};

// add our meows to the page by inserting html
$('<audio id="meow1" src="lib/audio/1.mp3" type="audio/mpeg"></audio>').appendTo('body');
$('<audio id="meow2" src="lib/audio/2.mp3" type="audio/mpeg"></audio>').appendTo('body');
$('<audio id="meow3" src="lib/audio/3.mp3" type="audio/mpeg"></audio>').appendTo('body');
$('<audio id="meow4" src="lib/audio/4.mp3" type="audio/mpeg"></audio>').appendTo('body');

var kittehs = [];
kittehs.push(new Kitteh("Paul"));
kittehs.push(new Kitteh("John"));
kittehs.push(new Kitteh("George"));
kittehs.push(new Kitteh("Ringo"));


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
	var currentKitteh = $('#currentKitteh').val();
	$('#scoreboard').text('Score: ' + kittehs[currentKitteh].score)
});