var score1 = 0;
var score2 = 0;

$('#kitteh1').click(function () {
	console.log('The kitteh was clicked!');
	score1++;
	$('#scoreBoard1').text('Score: ' + score1);
	$('#kitteh1').effect("shake");
});

$('#kitteh2').click( function () {
	console.log("Another kitteh was clicked!!");
	score2++;
	$('#scoreBoard2').text('Score: ' + score2);
	$('#kitteh2').effect("shake");
});