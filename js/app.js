var score = 0;
var scoreBoard = $('#scoreBoard');

function kittehClicker() {
	console.log('The kitteh was clicked!');
	score++;
	scoreBoard.text('Score: ' + score);
}

$('#kitteh').click(kittehClicker);