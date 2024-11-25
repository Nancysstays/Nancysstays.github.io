class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  getValue() {
    const rankValues = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    return rankValues[this.rank];
  }

  toString() {
    return this.rank + this.suit;
  }

  // Method to get the card's HTML representation
  getHTML() {
    const suitSymbols = {
      'H': '♥',
      'D': '♦',
      'C': '♣',
      'S': '♠'
    };
    return `<div class="card">${this.rank}${suitSymbols[this.suit]}</div>`;
  }
}

class Deck {
  constructor(numDecks = 1) {
    this.cards = [];
    this.numDecks = numDecks;
    this.createDeck();
    this.shuffleDeck();
  }

  createDeck() {
    const suits = ['H', 'D', 'C', 'S'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    this.cards = [];
    for (let d = 0; d < this.numDecks; d++) {
      for (let suit of suits) {
        for (let rank of ranks) {
          this.cards.push(new Card(rank, suit));
        }
      }
    }
  }

  shuffleDeck() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  dealCard() {
    return this.cards.pop();
  }
}

class Player {
  constructor(name, chips) {
    this.name = name;
    this.chips = chips;
    this.hand = [];
    this.currentBet = 0;
    this.hasFolded = false;
  }

  addChips(amount) {
    this.chips += amount;
  }

  removeChips(amount) {
    this.chips -= amount;
  }

  getHTML() {
    let handHTML = this.hand.map(card => card.getHTML()).join('');
    return `
            <div class="player">
                <h3>${this.name}</h3>
                <div class="player-hand">${handHTML}</div>
                <p>Chips: ${this.chips}</p>
                <p>Current Bet: ${this.currentBet}</p> 
            </div>
        `;
  }
}

class HandEvaluator {
  // ... (Implement full hand evaluation logic here)
  static evaluateHand(hand, communityCards) {
    let allCards = hand.concat(communityCards);

    // Sort cards by value in descending order
    allCards.sort((a, b) => b.getValue() - a.getValue());

    // Check for different hand types
    let isFlush = this.isFlush(allCards);
    let isStraight = this.isStraight(allCards);
    let rankCounts = this.getRankCounts(allCards);
    let ranks = Object.keys(rankCounts);

    if (isFlush && isStraight) {
      return {rank: 8, value: this.getHighCard(allCards)}; // Straight Flush
    }

    // Check for Four of a Kind
    if (ranks.some(rank => rankCounts[rank] === 4)) {
      let fourOfAKindRank = ranks.find(rank => rankCounts[rank] === 4);
      let kicker = ranks.find(rank => rank !== fourOfAKindRank);
      return {rank: 7, value: rankCounts[fourOfAKindRank], kickers: [kicker]}; // Four of a Kind
    }

    // Check for Full House
    let threeOfAKindRank = null;
    let pairRank = null;
    if (ranks.some(rank => rankCounts[rank] === 3)) {
      threeOfAKindRank = ranks.find(rank => rankCounts[rank] === 3);
    }
    if (ranks.some(rank => rankCounts[rank] === 2)) {
      pairRank = ranks.find(rank => rankCounts[rank] === 2);
    }
    if (threeOfAKindRank && pairRank) {
      return {rank: 6, value: rankCounts[threeOfAKindRank], kickers: [pairRank]}; // Full House
    }

    // Check for Three of a Kind
    if (threeOfAKindRank) {
      let kickers = ranks.filter(rank => rank !== threeOfAKindRank)
        .map(rank => rankCounts[rank])
        .sort((a, b) => b - a)
        .slice(0, 2); // Sort kickers in descending order
      return {rank: 3, value: rankCounts[threeOfAKindRank], kickers: kickers}; // Three of a Kind
    }

    // Check for Pairs
    let pairs = ranks.filter(rank => rankCounts[rank] === 2);
    if (pairs.length === 1) {
      let pairRank = pairs[0];
      let kickers = ranks.filter(rank => rank !== pairRank)
        .map(rank => rankCounts[rank])
        .sort((a, b) => b - a)
        .slice(0, 3); // Sort kickers in descending order
      return {rank: 1, value: rankCounts[pairRank], kickers: kickers}; // One Pair
    } else if (pairs.length === 2) {
      let highPairRank = pairs[0];
      let lowPairRank = pairs[1];
      let kicker = ranks.find(rank => rank !== highPairRank && rank !== lowPairRank);
      return {
        rank: 2,
        value: rankCounts[highPairRank],
        kickers: [lowPairRank, kicker]
      }; // Two Pair
    }

    if (isFlush) {
      return {rank: 5, value: this.getHighCard(allCards)}; // Flush
    }
    if (isStraight) {
      return {rank: 4, value: this.getHighCard(allCards)}; // Straight
    }

    // High Card
    let kickers = ranks.map(rank => rankCounts[rank])
      .sort((a, b) => b - a)
      .slice(0, 5); // Sort kickers in descending order
    return {rank: 0, value: this.getHighCard(allCards), kickers: kickers}; // High Card
  }

  static isFlush(cards) {
    let suit = cards[0].suit;
    return cards.every(card => card.suit === suit);
  }

  static isStraight(cards) {
    let uniqueValues = [...new Set(cards.map(card => card.getValue()))];
    if (uniqueValues.includes(14) && uniqueValues.includes(2) && uniqueValues.includes(3) &&
      uniqueValues.includes(4) && uniqueValues.includes(5)) {
      // Handle Ace-low straight (A-2-3-4-5)
      return true;
    }
    for (let i = 0; i < uniqueValues.length - 4; i++) {
      if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
        return true;
      }
    }
    return false;
  }

  static getRankCounts(cards) {
    let rankCounts = {};
    for (let card of cards) {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    }
    return rankCounts;
  }

  static getHighCard(cards) {
    return cards[0].getValue();
  }
}


class Game {
  constructor() {
    this.communityCards = [];
    this.players = [];
    this.pot = 0;
    this.currentPlayerIndex = 0;
    this.gameData = {};
    this.settings = this.loadSettings();
    this.stats = this.loadStats();
    this.currentBet = 0;
    this.roundHistory = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  dealCards() {
    for (let player of this.players) {
      player.hand = [this.deck.dealCard(), this.deck.dealCard()];
    }
  }

  dealCommunityCards(stage) {
    let numCards = 0;
    switch (stage) {
      case 'flop':
        numCards = 3;
        break;
      case 'turn':
      case 'river':
        numCards = 1;
        break;
    }
    for (let i = 0; i < numCards; i++) {
      this.communityCards.push(this.deck.dealCard());
    }
  }

  startGame() {
    this.deck = new Deck(this.settings.numDecks);
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.currentPlayerIndex = 0;
    this.roundHistory = [];

    this.players = [];
    this.addPlayer(new Player("You", this.settings.startingChips));

    const numOpponents = parseInt(document.getElementById('numOpponents').value);
    for (let i = 1; i <= numOpponents; i++) {
      this.addPlayer(new Player(`CPU ${i}`, this.settings.startingChips));
    }

    for (let player of this.players) {
      player.hand = [];
      player.chips = this.settings.startingChips;
      player.hasFolded = false;
      player.currentBet = 0;
    }

    this.dealCards();
    this.updatePot(0);
    this.updatePlayerInfo();
    this.renderCommunityCards();
    this.renderPlayerHands();
  }

  endRound() {
    let winners = this.determineWinner();
    let winningsPerPlayer = this.pot / winners.length;
    for (let winner of winners) {
      winner.addChips(winningsPerPlayer);
    }

    this.roundHistory.push({
      winners: winners.map(winner => winner.name),
      pot: this.pot,
      communityCards: this.communityCards.map(card => card.toString())
    });

    this.stats.roundsPlayed++;
    this.stats.totalWinnings += this.pot;
    this.saveStats();
    this.updateStatsDisplay();

    this.pot = 0;
    this.currentBet = 0;
    this.deck = new Deck(this.settings.numDecks);
    this.communityCards = [];
    this.currentPlayerIndex = 0;
    for (let player of this.players) {
      player.hand = [];
      player.hasFolded = false;
      player.currentBet = 0;
    }

    this.dealCards();
    this.updatePot(0);
    this.updatePlayerInfo();
    this.renderCommunityCards();
    this.renderPlayerHands();
  }

  handlePlayerAction(action, amount = 0) {
    let currentPlayer = this.players[this.currentPlayerIndex];

    switch (action) {
      case 'check':
        if (this.currentBet === currentPlayer.currentBet) {
          this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        } else {
          alert("You need to call or raise to match the current bet.");
        }
        break;
      case 'fold':
        currentPlayer.hasFolded = true;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        break;
      case 'bet':
        if (amount > this.currentBet) {
          currentPlayer.removeChips(amount);
          this.pot += amount;
          this.currentBet = amount;
          currentPlayer.currentBet = amount;
          this.updatePot(this.pot);
          this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        } else {
          alert("Bet amount must be greater than the current bet.");
        }
        break;
      case 'call':
        const amountToCall = this.currentBet - currentPlayer.currentBet;
        currentPlayer.removeChips(amountToCall);
        this.pot += amountToCall;
        currentPlayer.currentBet = this.currentBet;
        this.updatePot(this.pot);
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        break;
    }

    this.updatePlayerInfo();

    const activePlayers = this.players.filter(player => !player.hasFolded);
    if (activePlayers.length === 1 || activePlayers.every(player => player.currentBet === this.currentBet)) {
      this.endRound();
    }
  }

  determineWinner() {
    let bestHand = {rank: -1, value: -1};
    let winners = [];

    for (let player of this.players) {
      if (!player.hasFolded) {
        let handRank = HandEvaluator.evaluateHand(player.hand, this.communityCards);
        if (handRank.rank > bestHand.rank ||
          (handRank.rank === bestHand.rank && handRank.value > bestHand.value)) {
          bestHand = handRank;
          winners = [player];
        } else if (handRank.rank === bestHand.rank && handRank.value === bestHand.value) {
          winners.push(player);
        }
      }
    }

    return winners;
  }

  loadSettings() {
    let settings = localStorage.getItem('pokerSettings');
    if (settings) {
      return JSON.parse(settings);
    } else {
      return {
        numOpponents: 3,
        numDecks: 1,
        startingChips: 1000,
        smallBlind: 10,
        bigBlind: 20,
      };
    }
  }

  saveSettings(settings) {
    localStorage.setItem('pokerSettings', JSON.stringify(settings));
  }

  loadStats() {
    let stats = localStorage.getItem('pokerStats');
    if (stats) {
      return JSON.parse(stats);
    } else {
      return {
        roundsPlayed: 0,
        handsWon: 0,
        biggestPot: 0,
        totalWinnings: 0
      };
    }
  }

  saveStats() {
    localStorage.setItem('pokerStats', JSON.stringify(this.stats));
  }

  updateStatsDisplay() {
    const statsDisplay = document.getElementById('stats-display');
    statsDisplay.innerHTML = `
            <p>Rounds Played: ${this.stats.roundsPlayed}</p>
            <p>Hands Won: ${this.stats.handsWon}</p>
            <p>Biggest Pot: ${this.stats.biggestPot}</p>
            <p>Total Winnings: ${this.stats.totalWinnings}</p>
        `;
  }

  updatePot(amount) {
    document.getElementById('pot-value').textContent = amount;
  }

  updatePlayerInfo() {
    const playerInfoArea = document.querySelector('.player-info');
    playerInfoArea.innerHTML = this.players.map(player => player.getHTML()).join('');
  }

  renderCommunityCards() {
    const communityCardsArea = document.querySelector('.community-cards');
    communityCardsArea.innerHTML = this.communityCards.map(card => card.getHTML()).join('');
  }

  renderPlayerHands() {
    const playerArea = document.querySelector('.player-area');
    playerArea.innerHTML = this.players.map(player => player.getHTML()).join('');
  }
}

// Initialize game and event listeners
let game = new Game();

document.getElementById('start-game').addEventListener('click', () => {
  game.startGame();
});

document.getElementById('check').addEventListener('click', () => {
  game.handlePlayerAction('check');
});

document.getElementById('fold').addEventListener('click', () => {
  game.handlePlayerAction('fold');
});

document.getElementById('bet').addEventListener('click', () => {
  const betAmount = parseInt(document.getElementById('bet-amount').value);
  game.handlePlayerAction('bet', betAmount);
});

document.getElementById('saveSettings').addEventListener('click', () => {
  let newSettings = {
