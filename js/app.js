var score = 0;
var scoreBoard = $('#scoreBoard');

$('#kitteh').click(function () {
	console.log('The kitteh was clicked!');
	score++;
	scoreBoard.text('Score: ' + score);
	$('#kitteh').effect("shake");
});
