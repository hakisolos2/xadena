class TicTacToe {
 constructor() {
  this.games = new Map();
 }

 createGame(chatId) {
  const game = new Game();
  this.games.set(chatId, game);
  return game;
 }

 getGame(chatId) {
  return this.games.get(chatId);
 }

 deleteGame(chatId) {
  this.games.delete(chatId);
 }
}
class Game {
 constructor() {
  this.board = Array(9).fill(null);
  this.players = { X: null, O: null };
  this.currentTurn = 'X';
  this.status = 'waiting';
  this.winner = null;
 }

 addPlayer(playerId) {
  if (this.status !== 'waiting') return false;

  if (!this.players.X) {
   this.players.X = playerId;
   return 'X';
  } else if (!this.players.O && playerId !== this.players.X) {
   this.players.O = playerId;
   this.status = 'active';
   return 'O';
  }
  return false;
 }

 makeMove(playerId, position) {
  if (this.status !== 'active') {
   return { valid: false, reason: '*_Game is not active_*' };
  }

  if (playerId !== this.players[this.currentTurn]) {
   return { valid: false, reason: '*_Not your turn_*' };
  }

  if (position < 1 || position > 9) {
   return { valid: false, reason: '*_Invalid position (use 1-9)_*' };
  }

  const boardIndex = position - 1;
  if (this.board[boardIndex] !== null) return { valid: false, reason: '*_Position already taken*_' };

  this.board[boardIndex] = this.currentTurn;

  if (this.checkWin()) {
   this.status = 'ended';
   this.winner = this.currentTurn;
   return {
    valid: true,
    gameEnd: true,
    reason: 'win',
    winner: this.players[this.currentTurn],
   };
  }

  if (this.checkDraw()) {
   this.status = 'ended';
   return {
    valid: true,
    gameEnd: true,
    reason: 'draw',
   };
  }
  this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';
  return { valid: true };
 }

 checkWin() {
  const winPatterns = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8], // Rows
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8], // Columns
   [0, 4, 8],
   [2, 4, 6], // Diagonals
  ];

  return winPatterns.some((pattern) => {
   const [a, b, c] = pattern;
   return this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c];
  });
 }

 checkDraw() {
  return !this.board.includes(null);
 }

 renderBoard() {
  let display = '```\n';
  for (let i = 0; i < 9; i += 3) {
   display += ` ${this.board[i] || i + 1} │ ${this.board[i + 1] || i + 2} │ ${this.board[i + 2] || i + 3}\n`;
   if (i < 6) display += '───┼───┼───\n';
  }
  display += '```';
  return display;
 }

 getStatus() {
  return {
   board: this.renderBoard(),
   currentTurn: this.currentTurn,
   currentPlayer: this.players[this.currentTurn],
   status: this.status,
  };
 }
}
module.exports = TicTacToe;
