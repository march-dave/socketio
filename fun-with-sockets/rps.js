'use strict';

var userCount = 0;
var selections = [];


exports.initGame = function(io, socket) {
    userCount++;
  console.log('userCount:', userCount);

  if(userCount === 1 || userCount === 2) {
    socket.emit('playerNum', userCount);
  }

  if(userCount === 2) {
    io.emit('gameStart', null);
  }

  socket.on('selection', selection => {
    console.log('selection:', selection);
    selections.push(selection);

    if(selections.length === 2) {
      // decide a winner
      var winner = determineWinner(selections);
      io.emit('winner', winner);
      selections = [];
    }
  });

  socket.on('disconnect', function() {
    userCount--;
    console.log('userCount:', userCount);
  });
};


function determineWinner(selections) {
  var options = ['rock', 'paper', 'scissors'];

  if(selections[0] === selections[1]) {
    return 'draw';
  }

  for(var i = 0; i < options.length; i++) {
    if(selections.indexOf(options[i]) === -1) {
      return options[i - 1] || 'scissors';
    }
  }
};

