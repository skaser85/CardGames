class Solitaire {
    constructor(numPlayAreas, cardWidth, cardHeight, cards, colors, logger) {
        this.numPlayAreas = numPlayAreas;
        this.playAreas = [];

        this.curCard = null;
        this.curPlayArea = null;
        this.selectedCard = null;
        this.selectedPile = null;

        this.logger = logger;

        this.colors = colors;
        
        this.message = "";
        this.messageType = "";
        this.messageAlpha = 0;
        this.initialMessageAlpha = 400;

        this.gameOver = false;
        this.strobeCounter = 5;
        this.initialStrobeCount = 5;
        this.winnerColor = color(random(255), random(255), random(255));

        // setup Play Areas
        let pileWidth = cardWidth + 10;
        let pileHeight = cardHeight + 10;
        let spacing = (width / this.numPlayAreas);
        let paY = height / 3;

        for(let i = 0; i < this.numPlayAreas; i++) {
            let pa = new PlayArea(`Pile${i + 1}`, spacing * i + (spacing / 2), paY, pileWidth, pileHeight, 0, this.colors.yellow, this.colors.yellowA);
            this.playAreas.push(pa);
        }

        let gutter = 20;
        let totalSuiteWidth = (gutter * 4) + (pileWidth * 4);
        let suiteX = width - totalSuiteWidth + (pileWidth / 2);
        for(let i = 0; i < 4; i++) {
            let suiteArea = new PlayArea(`Suite${i + 1}`, suiteX, pileHeight / 2 + gutter, pileWidth, pileHeight, 0, this.colors.blue, this.colors.blueA);
            this.playAreas.push(suiteArea);
            suiteX += gutter + pileWidth;
        }

        this.deck = new Deck(pileWidth / 2 + 50, 150, pileWidth, pileHeight, "purple", this.colors.salmon, this.colors.salmonA);
        this.deck.cards = cards;
        this.deck.shuffle();

        this.playerPile = new Hand("Player1", this.deck.right + 60, 150, pileWidth, pileHeight, 0);
        this.playerPile.showName = false;

    }

    addMessage(msgType, msgText) {
        this.messageType = msgType;
        this.message = msgText;
        this.messageAlpha = this.initialMessageAlpha;
    }

    isRed(cardName) {
        return (cardName.includes("D")) || (cardName.includes("H"));
    }

    isBlack(cardName) {
        return (cardName.includes("S")) || (cardName.includes("C"));
    }

    makeNumeric(cardValue) {
        switch(cardValue) {
            case("A"):
                return 1;
            case("J"):
                return 11
            case("Q"):
                return 12
            case("K"):
                return 13
        }
    }

    getValue(cardName) {
        let cardValue = cardName.slice(0, cardName.length - 1);
        let suite = cardName.slice(-1);
        let cardValueText = "";
        let suiteValueText = "";
        switch(cardValue) {
            case("A"):
                cardValueText = "Ace";
                break;
            case("J"):
                cardValueText = "Jack";
                break;
            case("Q"):
                cardValueText = "Queen";
                break;
            case("K"):
                cardValueText = "King";
                break;
            default:
                cardValueText = cardValue;
        }
        switch(suite) {
            case("C"):
                suiteValueText = "Clubs";
                break;
            case("D"):
                suiteValueText = "Diamonds";
                break;
            case("H"):
                suiteValueText = "Hearts";
                break;
            case("S"):
                suiteValueText = "Spades";
                break;
        }
        if(cardValueText && suiteValueText) {
            return cardValueText + " of " + suiteValueText;
        } else {
            return cardName;
        }
    }

    checkCards(topCard, playCard, pa) {
        if(pa.name.startsWith("Pile") && this.isRed(topCard.name) && this.isRed(playCard.name)) return false;
        if(pa.name.startsWith("Pile") && this.isBlack(topCard.name) && this.isBlack(playCard.name)) return false;
        if(pa.name.startsWith("Suite") && !this.isRed(topCard.name) && !this.isRed(playCard.name)) return false;
        if(pa.name.startsWith("Suite") && !this.isBlack(topCard.name) && !this.isBlack(playCard.name)) return false;
        let topCardValue = parseInt(topCard.name.slice(0, topCard.name.length - 1)) || topCard.name.slice(0, topCard.name.length - 1);
        let playCardValue = parseInt(playCard.name.slice(0, playCard.name.length - 1)) || playCard.name.slice(0, playCard.name.length - 1);
        if(isNaN(topCardValue)) {
            topCardValue = this.makeNumeric(topCardValue);
        }
        if(isNaN(playCardValue)) {
            playCardValue = this.makeNumeric(playCardValue);
        }
        return topCardValue - playCardValue === 1
    }

    canPlace(playArea, card) {
        let topCard;
        if(playArea.cards.length > 0) {
            topCard = playArea.cards[playArea.cards.length - 1];
        }
        // check if it's a Suite PlayArea
        if(playArea.name.startsWith("Suite")) {
            return playArea.cards.length === 0 ? card.name.includes("K") : this.checkCards(topCard, card, playArea);
        }
        // regular PlayArea
        return playArea.cards.length === 0 ? true : this.checkCards(topCard, card, playArea);
    }

    dealCards() {
        for(let i = 0; i < 7; i++) {
            let pileNum = i + 1;
            let pa = this.playAreas.find(p => p.name === `Pile${pileNum}`);
            if(pileNum === 1) {
                pa.addTo(this.deck.getCard());
            } else {
                for(let k = 0; k < pileNum; k++) {
                    let card = this.deck.getCard();
                    if(k < pileNum - 1) card.backShowing = true;
                    pa.addTo(card);
                }
            }
        }
    }

    handleClick() {
        if(!this.gameOver) {
            if(this.deck.isActive) {
                if(this.deck.isEmpty) {
                    this.deck.cards = [...this.playerPile.cards];
                    this.deck.isEmpty = false;
                    this.playerPile.cards.forEach(c => c.pile = null);
                    this.playerPile.cards = [];
                } else {
                    let card = this.deck.getCard();
                    this.playerPile.addTo(card);
                    if(this.deck.cards.length === 0) {
                        this.deck.isEmpty = true;
                    }
                    this.addMessage("normal", `Congrats on pulling the ${this.getValue(card.name)}!!!`);
                    this.logger.addTo({
                        type: "pulled from deck",
                        card: card.name
                    });
                }
            } else {
                if(!this.selectedCard && !this.selectedPile) {
                    if(this.curCard) {
                        if(this.curCard.backShowing && 
                           this.curCard.name === this.curCard.pile.cards[this.curCard.pile.cards.length - 1].name) {
                            this.curCard.backShowing = false;
                        } else {
                            this.curCard.isSelected = true;
                            this.selectedCard = this.curCard;
                        }
                    } else if(this.curCard && this.selectedCard) {
                        if(this.curCard.isSelected) {
                            this.selectedCard.isSelected = false;
                            this.selectedCard = null;
                        } else {
                            this.selectedCard.isSelected = false;
                            this.selectedCard = null;
                            this.curCard.isSelected = true;
                            this.selectedCard = this.curCard;
                        }
                    }
                } else if(this.selectedCard && !this.selectedPile) {
                    if(this.curPlayArea) {
                        this.curPlayArea.isSelected = true;
                        this.selectedPile = this.curPlayArea;
                        
                        let card = this.selectedCard;
                        if(this.canPlace(this.selectedPile, this.selectedCard)) {
                            if(this.selectedCard.pile instanceof PlayArea && this.selectedCard.pile.cards.length > 1) {
                                let loggerData = {
                                    type: "cards moved",
                                    cards: null,
                                    from: this.selectedCard.pile.name,
                                    to: this.selectedPile.name
                                };
                                let cardsToMove = [];
                                let selectedCardFound = false;
                                let cards = [...this.selectedCard.pile.cards];
                                cards.forEach(c => {
                                    if(!selectedCardFound && c === this.selectedCard) {
                                        selectedCardFound = true;
                                    }
                                    if(selectedCardFound) {
                                        cardsToMove.push(c);
                                        this.curPlayArea.addTo(c);
                                    }
                                });
                                loggerData.cards = cardsToMove;
                                this.logger.addTo(loggerData);
                            } else {
                                this.logger.addTo({
                                    type: "card moved",
                                    card: this.selectedCard.name,
                                    from: this.selectedCard.pile.name,
                                    to: this.selectedPile.name,
                                });
                                this.curPlayArea.addTo(this.selectedCard);
                            }
                        } else {
                            this.addMessage("error", `Cannot play the ${this.getValue(card.name)} card in the ${this.curPlayArea.name}.`);
                            card.setCoords(card.pile.x, card.pile.y);
                        }
                        
                        this.selectedCard.isSelected = false;
                        this.selectedCard = null;
                        this.selectedPile.isSelected = false;
                        this.selectedPile = null;   
                    } else if(this.curPlayArea && this.selectedPile) {
                        if(this.curPlayArea.isSelected) {
                            this.selectedPile.isSelected = false;
                            this.selectedPile = null;
                        } else {
                            this.selectedPile.isSelected = false;
                            this.selectedPile = null;   
                            this.curPlayArea.isSelected = true;
                            this.selectedPile = this.curPlayArea;             
                        }
                    }
                }
            }
        }
    }

    restartGame() {

    }

    undo() {

    }

    redo() {

    }

    update() {
        this.playAreas.forEach(p => p.update());
        
        this.deck.update();
        this.playerPile.update();

        // update playAreas
        for(let p of this.playAreas) {
            p.update();

            if(p.cards.length > 1) {
                let offset = 0;
                for(let i = 0; i < p.cards.length; i++) {
                    let card = p.cards[i];
                    if(i === 0) {
                        card.setCoords(p.x, p.y);
                    } else {
                        offset += 25;
                        card.setCoords(p.x, p.y + offset)
                    }
                    
                }
            }

            if(this.curPlayArea === null) {
                if(p.isActive) {
                    this.curPlayArea = p;
                }
            } else {
                if(this.curPlayArea === p) {
                    if(!p.isActive) {
                        this.curPlayArea = null;
                    }
                }
            }
        }

        // update cards
        // figure out which cards have the mouse over them
        let possibleCards = [];
        for(let c of this.deck.cardsInPlay) {
            if(c.visible) {
                c.update();
            }
            if(c.isActive) {
                possibleCards.push(c);
            }
        }

        // if no cards have the mouse over them, then curCard is nothing
        // if only one card has the mouse over it, then curdCard is that card
        // otherwise, loop over the array and set the isActive property to
        // false except for the last one, because that's the card that we're
        // going to set as the curCard
        if(possibleCards.length === 0) {
            this.curCard = null;
        } else if(possibleCards.length === 1) {
            this.curCard = possibleCards[0];
        } else {
            // minus 1 because we don't want to do this to the last
            // card in this array
            for(let i = 0; i < possibleCards.length - 1; i++) {
                possibleCards[i].isActive = false;
            }
            this.curCard = possibleCards[possibleCards.length - 1];
        }
    }

    draw() {
        this.playAreas.forEach(p => p.draw());

        this.deck.draw();
        this.playerPile.draw();
    }


}