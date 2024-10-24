const axios = require('axios');

class TriviaGame {
 constructor() {
  this.activeGames = new Map();
  this.apiUrl = 'https://opentdb.com/api.php';
 }

 async startGame(chatId, difficulty = 'medium') {
  try {
   const response = await axios.get(`${this.apiUrl}?amount=1&type=multiple&difficulty=${difficulty}`);
   const question = response.data.results[0];

   const answers = [...question.incorrect_answers, question.correct_answer];
   this.shuffleArray(answers);

   const gameState = {
    question: question.question,
    answers: answers,
    correctAnswer: question.correct_answer,
    category: question.category,
    difficulty: question.difficulty,
    answered: false,
    startTime: Date.now(),
    score: 0,
   };

   this.activeGames.set(chatId, gameState);
   return this.formatQuestion(gameState);
  } catch (error) {
   console.error('Error fetching trivia question:', error);
   return 'Sorry, there was an error starting the trivia game.';
  }
 }

 checkAnswer(chatId, userAnswer) {
  const game = this.activeGames.get(chatId);
  if (!game) return 'No active game found!';
  if (game.answered) return 'This question has already been answered!';

  const isCorrect = this.normalizeString(userAnswer) === this.normalizeString(game.correctAnswer);
  game.answered = true;

  if (isCorrect) {
   game.score += this.calculateScore(game.difficulty, Date.now() - game.startTime);
   return `🎉 Correct! The answer is "${game.correctAnswer}"\nScore: ${game.score}`;
  }

  const finalScore = game.score;
  this.activeGames.delete(chatId);
  return `❌ Wrong! The correct answer was "${game.correctAnswer}"\nGame Over! Final Score: ${finalScore}`;
 }

 endGame(chatId) {
  const game = this.activeGames.get(chatId);
  if (!game) return 'No active game found!';

  const finalScore = game.score;
  this.activeGames.delete(chatId);
  return `Game ended! Final score: ${finalScore}`;
 }

 isGameActive(chatId) {
  return this.activeGames.has(chatId);
 }

 shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [array[i], array[j]] = [array[j], array[i]];
  }
 }

 formatQuestion(gameState) {
  return `📝 *Trivia Question*\nCategory: ${gameState.category}\nDifficulty: ${gameState.difficulty}\n\n${gameState.question}\n\nOptions:\n${gameState.answers.map((answer, index) => `${index + 1}. ${answer}`).join('\n')}`;
 }

 normalizeString(str) {
  return str.toLowerCase().trim();
 }

 calculateScore(difficulty, timeElapsed) {
  const baseScore =
   {
    easy: 100,
    medium: 200,
    hard: 300,
   }[difficulty] || 100;

  const timeMultiplier = Math.max(0, 1 - timeElapsed / 30000);
  return Math.round(baseScore * timeMultiplier);
 }
}
module.exports = TriviaGame;
