const riddleData = [
 {
  question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
  answer: 'echo',
 },
 {
  question: 'What has keys, but no locks; space, but no room; and you can enter, but not go in?',
  answer: 'keyboard',
 },
 {
  question: 'The more you take, the more you leave behind. What am I?',
  answer: 'footsteps',
 },
 {
  question: 'What has a head and a tail that will never meet?',
  answer: 'coin',
 },
 {
  question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. I have roads, but no cars. What am I?',
  answer: 'map',
 },
 {
  question: "What is always in front of you but can't be seen?",
  answer: 'future',
 },
 {
  question: 'What gets wetter and wetter the more it dries?',
  answer: 'towel',
 },
 {
  question: 'I am taken from a mine and shut up in a wooden case, from which I am never released, and yet I am used by everyone. What am I?',
  answer: 'pencil lead',
 },
 {
  question: 'What can travel around the world while staying in a corner?',
  answer: 'stamp',
 },
 {
  question: "The person who makes it, sells it. The person who buys it never uses it. The person who uses it doesn't know they are. What is it?",
  answer: 'coffin',
 },
 {
  question: 'What has a head, a tail, is brown, and has no legs?',
  answer: 'Penny',
 },
 {
  question: 'This is needed both for courage and hardcover books.',
  answer: 'Spine',
 },
 {
  question: 'We are two brothers on opposite sides of the road, but we never see each other. Who are we?',
  answer: 'Eyes',
 },
 {
  question: 'What is it that has a power socket on one end and a corkscrew on the other?',
  answer: 'Pig',
 },
 {
  question: "It's shorter than the rest, but when you're happy, you raise it up like it's the best. What is it?",
  answer: 'Thumb',
 },
 {
  question: 'Green but not a lizard, white without being snow, and bearded without being a man.',
  answer: 'Leek',
 },
 {
  question: 'What has green hair, a round red head and a long thin white beard?',
  answer: 'Radish',
 },
 {
  question: 'I am always in front of you, but you will never see me. What am I?',
  answer: 'Future',
 },
 {
  question: "I am rarely touched but often held, and if you are smart you'll use me well. What am I?",
  answer: 'Tongue',
 },
 {
  question: 'What is so delicate that saying its name breaks it?',
  answer: 'Silence',
 },
 {
  question: 'What can you lose that will cause other people to lose theirs too?',
  answer: 'Temper',
 },
 {
  question: 'What must take a bow before it can speak?',
  answer: 'Violin',
 },
 {
  question: 'A shimmering field that reaches far. Yet it has no tracks, And is crossed without paths.',
  answer: 'Ocean',
 },
 {
  question: 'Has a tongue, but never talks. Has no legs, but sometimes walks.',
  answer: 'Shoe',
 },
 {
  question: 'I am not alive but seem so, because I dance and breathe with no legs or lungs of my own. What am I?',
  answer: 'Flame',
 },
 {
  question: 'Lives without a body, hears without ears, speaks without a mouth, to which the air alone gives birth. What is it?',
  answer: 'Echo',
 },
 {
  question: 'Diamonds and stress have this to thank for their existence.',
  answer: 'Pressure',
 },
 {
  question: 'What is it that no man ever saw, which never was, but always will be?',
  answer: 'Tomorrow',
 },
 {
  question: 'They are two brothers. However much they run, they do not reach each other.',
  answer: 'Wheels',
 },
];

class RiddleGame {
 constructor() {
  this.activeRiddles = new Map();
  this.hintTimeouts = new Map();
  this.scoreBoard = new Map();
  this.streaks = new Map();
  this.bot = null;
  this.usedRiddles = new Map();
  this.gameJid = null; // Track the JID where game is active
 }

 setBot(bot) {
  this.bot = bot;
 }

 getRandomRiddle(chatId) {
  let unusedRiddles = riddleData.filter((_, index) => !this.usedRiddles.get(chatId)?.includes(index));

  if (unusedRiddles.length === 0) {
   this.usedRiddles.set(chatId, []);
   unusedRiddles = riddleData;
  }

  const riddleIndex = Math.floor(Math.random() * unusedRiddles.length);
  const actualIndex = riddleData.indexOf(unusedRiddles[riddleIndex]);

  let used = this.usedRiddles.get(chatId) || [];
  used.push(actualIndex);
  this.usedRiddles.set(chatId, used);

  return riddleData[actualIndex];
 }

 startGame(chatId) {
  // Only allow game in one chat at a time
  if (this.gameJid && this.gameJid !== chatId) {
   return 'A game is already active in another chat!';
  }

  if (this.isGameActive(chatId)) {
   return "A riddle is already active! Solve it or use 'riddle end' to end it.";
  }

  const riddle = this.getRandomRiddle(chatId);
  this.streaks.set(chatId, 0);
  this.gameJid = chatId;

  this.activeRiddles.set(chatId, {
   question: riddle.question,
   answer: riddle.answer.toLowerCase(),
   startTime: Date.now(),
   hintsGiven: 0,
   attempts: 0,
   answered: false,
  });

  this.setHintTimeout(chatId);

  return `🤔 *Riddle Time!*\n\n${riddle.question}\n\n💡 First hint in 30 seconds\n❌ Max attempts: 3\n⏳ Time limit: 2 minutes`;
 }

 async nextRiddle(chatId) {
  const riddle = this.getRandomRiddle(chatId);

  this.activeRiddles.set(chatId, {
   question: riddle.question,
   answer: riddle.answer.toLowerCase(),
   startTime: Date.now(),
   hintsGiven: 0,
   attempts: 0,
   answered: false,
  });

  this.setHintTimeout(chatId);

  if (this.bot) {
   const streak = this.streaks.get(chatId);
   await this.bot.sendMessage(chatId, `🎯 *Current Streak: ${streak}*\n\n🤔 *Next Riddle:*\n\n${riddle.question}\n\n💡 First hint in 30 seconds\n❌ Max attempts: 3\n⏳ Time limit: 2 minutes`);
  }
 }

 async checkAnswer(chatId, userId, answer) {
  if (this.gameJid !== chatId) return null;

  const riddle = this.activeRiddles.get(chatId);
  if (!riddle) return null;

  riddle.attempts++;
  const normalizedAnswer = answer.toLowerCase().trim();
  const isCorrect = normalizedAnswer === riddle.answer;

  if (isCorrect) {
   riddle.answered = true;
   const timeTaken = Math.floor((Date.now() - riddle.startTime) / 1000);
   const score = this.calculateScore(riddle.hintsGiven, timeTaken);

   this.updateScore(userId, score);
   this.clearHintTimeout(chatId);

   const currentStreak = (this.streaks.get(chatId) || 0) + 1;
   this.streaks.set(chatId, currentStreak);

   const bonusPoints = this.calculateStreakBonus(currentStreak);
   this.updateScore(userId, bonusPoints);

   // First send the correct answer message
   const correctMessage = `🎉 Correct! The answer is "${riddle.answer}"\n⭐ Score: +${score} points\n🔥 Streak Bonus: +${bonusPoints} points\n⏱️ Time taken: ${timeTaken} seconds\n\nYour total score: ${this.getScore(userId)} points`;

   if (this.bot) {
    await this.bot.sendMessage(chatId, correctMessage);
   }

   // Then start the next riddle
   await this.nextRiddle(chatId);
   return { correct: true, message: correctMessage };
  } else if (riddle.attempts >= 3) {
   this.clearHintTimeout(chatId);
   this.activeRiddles.delete(chatId);
   const finalStreak = this.streaks.get(chatId) || 0;
   this.streaks.delete(chatId);
   this.gameJid = null;
   return {
    correct: false,
    message: `❌ Game Over!\nThe answer was: "${riddle.answer}"\n🔥 Final Streak: ${finalStreak}\n🏆 Total Score: ${this.getScore(userId)} points`,
   };
  }

  return {
   correct: false,
   message: `❌ Wrong answer! ${3 - riddle.attempts} attempts remaining.`,
  };
 }

 getHint(chatId) {
  if (this.gameJid !== chatId) return null;

  const riddle = this.activeRiddles.get(chatId);
  if (!riddle || riddle.answered) return null;

  riddle.hintsGiven++;
  const answer = riddle.answer;

  switch (riddle.hintsGiven) {
   case 1:
    return `First letter: ${answer[0]}`;
   case 2:
    return `Length: ${answer.length} letters`;
   case 3:
    const vowels = answer.match(/[aeiou]/gi)?.length || 0;
    return `Contains ${vowels} vowels`;
   default:
    return null;
  }
 }

 async setHintTimeout(chatId) {
  const hintIntervals = [30000, 30000, 30000];
  let currentHint = 0;

  const scheduleNextHint = () => {
   if (currentHint < hintIntervals.length) {
    const timeoutId = setTimeout(async () => {
     const hint = this.getHint(chatId);
     if (hint && this.bot && !this.activeRiddles.get(chatId)?.answered) {
      try {
       await this.bot.sendMessage(chatId, `💡 *Hint:* ${hint}`);
      } catch (error) {
       console.error('Error sending hint:', error);
      }
     }
     currentHint++;
     scheduleNextHint();
    }, hintIntervals[currentHint]);

    this.hintTimeouts.set(chatId, timeoutId);
   } else {
    this.endGame(chatId);
   }
  };

  scheduleNextHint();
 }

 clearHintTimeout(chatId) {
  const timeoutId = this.hintTimeouts.get(chatId);
  if (timeoutId) {
   clearTimeout(timeoutId);
   this.hintTimeouts.delete(chatId);
  }
 }

 calculateScore(hintsUsed, timeTaken) {
  const baseScore = 100;
  const hintPenalty = hintsUsed * 20;
  const timePenalty = Math.floor(timeTaken / 10) * 5;
  return Math.max(baseScore - hintPenalty - timePenalty, 10);
 }

 calculateStreakBonus(streak) {
  return Math.min(streak * 10, 100);
 }

 updateScore(userId, points) {
  const currentScore = this.scoreBoard.get(userId) || 0;
  this.scoreBoard.set(userId, currentScore + points);
 }

 getScore(userId) {
  return this.scoreBoard.get(userId) || 0;
 }

 getLeaderboard() {
  return Array.from(this.scoreBoard.entries())
   .sort(([, a], [, b]) => b - a)
   .slice(0, 10);
 }

 endGame(chatId) {
  if (this.gameJid !== chatId) {
   return 'No active riddle game in this chat!';
  }

  const riddle = this.activeRiddles.get(chatId);
  if (!riddle) return 'No active riddle game!';

  this.clearHintTimeout(chatId);
  this.activeRiddles.delete(chatId);
  const finalStreak = this.streaks.get(chatId) || 0;
  this.streaks.delete(chatId);
  this.gameJid = null;
  return `Game ended! The answer was: "${riddle.answer}"\n🔥 Final Streak: ${finalStreak}`;
 }

 isGameActive(chatId) {
  return this.activeRiddles.has(chatId) && this.gameJid === chatId;
 }
}

module.exports = RiddleGame;
