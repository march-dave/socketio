'use strict';

var socket, player, selection;

$(() => {
  socket = io();

  socket.on('playerNum', playerNum => {
    player = playerNum;
    $('#status').text(`Waiting for opponent.`);
  });

  socket.on('gameStart', () => {
    if(player) {
      $('#rpsButtons').show();
      $('#status').text(`Rock Paper Scissors!!!`);
    }
  });

  socket.on('winner', winner => {
    if(winner === 'draw') {
      $('#status').text("It's a draw! Try again!");
    } else if (winner === selection) {
      $('#status').text("You win! Try again!");
    } else {
      $('#status').text("You lose! Try again!");
    }
    $('button.rpsButton').on('click', makeSelection);
    $('.active').removeClass('active');
  });

  $('button.rpsButton').on('click', makeSelection);
});

function makeSelection(e) {
  $('.rpsButton').off('click');
  $(e.target).addClass('active');

  selection = $(e.target).data('rps');
  socket.emit('selection', selection);
}

