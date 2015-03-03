var score1 = 0;
var score2 = 0;

$('<audio id="meow1" src="lib/audio/1.mp3" type="audio/mpeg"></audio>').appendTo('body');
$('<audio id="meow2" src="lib/audio/2.mp3" type="audio/mpeg"></audio>').appendTo('body');
$('<audio id="meow3" src="lib/audio/3.mp3" type="audio/mpeg"></audio>').appendTo('body');
$('<audio id="meow4" src="lib/audio/4.mp3" type="audio/mpeg"></audio>').appendTo('body');

$('#kitteh1').click(function () {
	console.log('The kitteh was clicked!');
	score1++;
	$('#scoreBoard1').text('Score: ' + score1);
	$('#kitteh1').effect("shake");
	var sound = Math.floor(Math.random()*4)+1;
	$('#meow'+sound)[0].play();
});

$('#kitteh2').click( function () {
	console.log("Another kitteh was clicked!!");
	score2++;
	$('#scoreBoard2').text('Score: ' + score2);
	$('#kitteh2').effect("shake");
	var sound = Math.floor(Math.random()*4)+1;
	$('#meow'+sound)[0].play();
});