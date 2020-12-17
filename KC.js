// King's Corner
class KC {
    constructor(numPlayers, cardWidth, cardHeight, dk, colors, logger) {
        this.numPlayers = numPlayers;
        this.cardWidth = cardWidth;
        this.cardHeight = cardHeight;
        this.players = [];
        this.curPlayer = null;
        this.turnStarted = false;
        this.playerHasPulledFromDeck = false;
        this.playAreas = [];
        this.curPlayArea = null;
        this.curCard = null;
        this.selectedCard = null;
        this.selectedPile = null;
        this.colors = colors
        this.gameOver = false;
        this.message = new Message();
        this.strobeCounter = 5;
        this.initialStrobeCount = 5;
        this.winnerColor = color(random(255), random(255), random(255));
        this.logger = logger;
        this.btnText = "Start Turn";

        // setup Play Areas
        let pileWidth = cardWidth + 10;
        let pileHeight = cardHeight + 10;  
        let vCenter = width / 2;
        let hCenter = (height / 2 - pileHeight / 2);
        
        this.playAreas.push(
            new PlayArea(PlayArea.type.Pile, "northPile", vCenter, hCenter - pileHeight - 20, pileWidth, pileHeight, 0, this.colors.yellow, this.colors.yellowA),
            new PlayArea(PlayArea.type.Pile, "southPile", vCenter, hCenter + pileHeight + 20, pileWidth, pileHeight, 0, this.colors.yellow, this.colors.yellowA),
            new PlayArea(PlayArea.type.Pile, "eastPile", vCenter + pileWidth + 30, hCenter, pileWidth, pileHeight, 90, this.colors.yellow, this.colors.yellowA),
            new PlayArea(PlayArea.type.Pile, "westPile", vCenter - pileWidth - 30, hCenter, pileWidth, pileHeight, 90, this.colors.yellow, this.colors.yellowA),
            new PlayArea(PlayArea.type.Pile, "northEastPile", vCenter + pileWidth + 50, hCenter - pileHeight - 25, pileWidth, pileHeight, 45, this.colors.blue, this.colors.blueA),
            new PlayArea(PlayArea.type.Pile, "southEastPile", vCenter + pileWidth + 50, hCenter + pileHeight + 25, pileWidth, pileHeight, 135, this.colors.blue, this.colors.blueA),
            new PlayArea(PlayArea.type.Pile, "southWestPile", vCenter - pileWidth - 50, hCenter + pileHeight + 25, pileWidth, pileHeight, 45, this.colors.blue, this.colors.blueA),
            new PlayArea(PlayArea.type.Pile, "northWestPile", vCenter - pileWidth - 50, hCenter - pileHeight - 25, pileWidth, pileHeight, 135, this.colors.blue, this.colors.blueA)
        );

        // setup deck
        this.deck = new Deck(width / 2, height / 2 - pileHeight / 2, pileWidth, pileHeight, cardWidth, cardHeight, deckColorSel.value(), this.colors.salmon, this.colors.salmonA, dk.isSprite ? "sprite" : "img");
        this.deck.cards = [...dk.cards];
        if(!dk.isSprite) this.deck.img = dk.backs.find(b => b.name === deckColorSel.value()).img;
        this.deck.cards.forEach(c => c.backShowing = false);
        this.deck.shuffle();

        // setup player's hand
        for(let i = 0; i < this.numPlayers; i++) {
            this.players.push(
                new Hand(`Player${i + 1}`, width / 2, height - cardHeight + 30, width - 20, cardHeight + 10, 0)
            )
        }

        this.curPlayer = this.players[0];

        this.logger.addTo({ type: Logger.type.gameStarted });
    }

    undo() {
        if(this.logger.log.length === 1 || this.logger.log.length - this.logger.redoPointer === 1) {
            this.message.set(Message.type.error, "Cannot undo past start of game.");
            return;
        }
        if(this.logger.log[this.logger.log.length - 1].type === Logger.type.gameRestarted) {
            this.message.set(Message.type.error, "Cannot undo past the restart of a game.");
            return;
        }
        if(this.logger.log[this.logger.log.length - 1].type === Logger.type.gameWon) {
            this.message.set(Message.type.error, "Cannot undo once the game has been won.");
            return;
        }
        let lastState = this.logger.getUndoState();
        switch(lastState.type) {
            case(Logger.type.cardMoved):
                let card = this.deck.cardsInPlay.find(c => c.name === lastState.card);
                let pa;
                pa = this.playAreas.find(p => p.name === lastState.from);
                if(!pa) pa = this.players.find(p => p.name === lastState.from);
                if(card.pile) card.pile.removeFrom(card);
                pa.addTo(card);
                break;
            case(Logger.type.cardsMoved):
                lastState.cards.forEach(c => {
                    // c is the Card object, not just the card name
                    let pa;
                    pa = this.playAreas.find(p => p.name === lastState.from);
                    if(!pa) pa = this.players.find(p => p.name === lastState.from);
                    if(c.pile) c.pile.removeFrom(c);
                    pa.addTo(c);
                });
                break;
            case(Logger.type.pulledFromDeck):
                let cardPulled = this.deck.cardsInPlay.find(c => c.name === lastState.card);
                if(cardPulled.pile) cardPulled.pile.removeFrom(cardPulled);
                this.deck.cards.push(cardPulled);
                this.playerHasPulledFromDeck = false;
                break;
            case(Logger.type.turnStarted):
                this.turnStarted = false;
                this.btnText = "Start Turn";
                button.elt.innerText = this.btnText;
                break;
            case(Logger.type.turnEnded):
                this.curPlayer = this.players.find(p => p.name === lastState.player);
                this.turnStarted = true;
                // always true because we've already checked that this has happened by the time we get to the undo
                this.playerHasPulledFromDeck = true;
                this.btnText = "End Turn";
                button.elt.innerText = this.btnText;
                break;
        }
        this.logger.redoPointer++;
    }

    redo() {
        let redoState = this.logger.getRedoState();
        switch(redoState.type) {
            case(Logger.type.cardMoved):
                let card = this.deck.cardsInPlay.find(c => c.name === redoState.card);
                let pa;
                pa = this.playAreas.find(p => p.name === redoState.to);
                if(!pa) pa = this.players.find(p => p.name === redoState.to);
                if(card.pile) card.pile.removeFrom(card);
                pa.addTo(card);
                break;
            case(Logger.type.cardsMoved):
                redoState.cards.forEach(c => {
                    // c is the Card object, not just the card name
                    let pa;
                    pa = this.playAreas.find(p => p.name === redoState.to);
                    if(!pa) pa = this.players.find(p => p.name === redoState.to);
                    if(c.pile) c.pile.removeFrom(c.pile);
                    pa.addTo(c);
                });
                break;
            case(Logger.type.pulledFromDeck):
                let cardPulled = this.deck.cardsInPlay.find(c => c.name === redoState.card);
                if(cardPulled.pile) cardPulled.pile.removeFrom(cardPulled);
                this.curPlayer.addTo(cardPulled);
                if(this.deck.cards.includes(cardPulled)) {
                    let c = this.deck.cards.pop();
                    if(!this.deck.cardsInPlay.includes(cardPulled)) this.deck.cardsInPlay.push(c);
                }
                this.playerHasPulledFromDeck = true;
                break;
            case(Logger.type.turnStarted):
                this.turnStarted = true;
                this.btnText = "End Turn";
                button.elt.innerText = this.btnText;
                break;
            case(Logger.type.turnEnded):
                this.curPlayer.setCardsToNotVisible();
                this.curPlayer = this.nextPlayer();
                this.curPlayer.setCardsToVisible();
                this.turnStarted = false;
                this.playerHasPulledFromDeck = redoState.playerHasPulledFromDeck;
                this.btnText = "Start Turn";
                button.elt.innerText = this.btnText;
                break;
        }
        this.logger.redoPointer--;
    }

    getGameState(stateName) {
        return {
            name: stateName,
            player: this.curPlayer.name,
            playerCards: [...this.curPlayer.cards],
            playAreas: [...this.playAreas],
            deckCards: [...this.deck.cards],
            deckCardsInPlay: [...this.deck.cardsInPlay],
            turnStarted: this.turnStarted,
            playerHasPulledFromDeck: this.playerHasPulledFromDeck,
            gameOver: this.gameOver,
            btnText: this.btnText
        }
    }

    setGameState(state) {
        console.log(state);
        this.deck.cards = [];
        this.deck.cards = [...state.deckCards];
        this.cardsInPlay = [];
        this.cardsInPlay = [...state.deckCardsInPlay];
        let playerIndex = this.players.findIndex(p => p.name === state.player);
        this.curPlayer = this.players[playerIndex];
        this.curPlayer.cards = [];
        this.curPlayer.cards = [...state.playerCards];
        this.playAreas = [];
        this.playAreas = [...state.playAreas];
        this.playAreas.forEach(p => { p.pile = p });
        this.gameOver = state.gameOver;
        this.turnStarted = state.turnStarted;
        this.playerHasPulledFromDeck = state.playerHasPulledFromDeck;
        button.elt.innerText = state.btnText;
    }

    restartGame(cards) {
        this.deck.cards = [];
        this.deck.cards = [...cards];
        this.deck.cards.forEach(c => {
            c.pile = null
            c.backShowing = false;
        });
        this.deck.shuffle();
        this.deck.cardsInPlay = [];
        this.players.forEach(p => p.cards = []);
        this.playAreas.forEach(p => p.cards = []);
        this.curPlayer = this.players[0];
        this.gameOver = false;
        this.turnStarted = false;
        this.playerHasPulledFromDeck = false;
        this.dealCards();
        this.logger.addTo({ type: Logger.type.gameRestarted});
    }

    dealCards() {
        for(let i = 0; i < this.playAreas.length; i++) {
            let p = this.playAreas[i];
            if(["northPile", "eastPile", "southPile", "westPile"].includes(p.name)) {
                let c = this.deck.getCard();
                c.backShowing = false;
                p.addTo(c);
            }
        }
    
        for(let i = 0; i < this.players.length; i++) {
            let p = this.players[i];
            for(let k = 0; k < 7; k++) {
                let c = this.deck.getCard();
                c.backShowing = false;
                p.addTo(c);
            }
        }
    }

    setOffset(card, pa, offset) {
        switch(pa.name) {
            case "northPile":
                card.setCoords(pa.x, pa.y - offset);
                break;
            case "southPile":
                card.setCoords(pa.x, pa.y + offset);
                break;
            case "northEastPile":
                card.setCoords(pa.x + offset, pa.y - offset);
                break;
            case "southEastPile":
                card.setCoords(pa.x + offset, pa.y + offset);
                break;
            case "eastPile":
                card.setCoords(pa.x + offset, pa.y);
                break;
            case "northWestPile":
                card.setCoords(pa.x - offset, pa.y - offset);
                break;
            case "southWestPile":
                card.setCoords(pa.x - offset, pa.y + offset);
                break;
            case "westPile":
                card.setCoords(pa.x - offset, pa.y);
                break;
        }
    }

    update() {
        if(!this.gameOver) {
            // update deck
            this.deck.update();
            
            // update playAreas
            for(let p of this.playAreas) {
                p.update();

                if(p.cards.length > 1) {
                    let offset = 25
                    for(let i = 0; i < p.cards.length; i++) {
                        let card = p.cards[i];
                        if(i === 0) {
                            card.setCoords(p.x, p.y);
                        } else if(i === 1) {
                            this.setOffset(card, p, offset);
                        } else {
                            offset += 10;
                            this.setOffset(card, p, offset);
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
            this.curCard = null;
            let possibleCards = [];
            let pileCheck = null;
            for(let i = 0; i < this.deck.cardsInPlay.length; i++) {
                let c = this.deck.cardsInPlay[i];
                if(c.visible) {
                    c.update();
                    if(c.isActive) {
                        if(!pileCheck) pileCheck = c.pile;
                        possibleCards.push(c);
                    }
                }
            }

            if(pileCheck) {
                for(let i = pileCheck.cards.length - 1; i >= 0; i--) {
                    let c = pileCheck.cards[i];
                    if(!this.curCard) {
                        if(c.isActive && possibleCards.includes(c)) {
                            this.curCard = c;
                        }
                    } else {
                        c.isActive = false;
                    }
                }
            }

            // update Hands
            this.curPlayer.update();

            
            if(this.curPlayer.cards.length > 0) {
                let newX = 0;
                let stackRight = this.curPlayer.cards[this.curPlayer.cards.length - 1].right;
                if(stackRight + this.curPlayer.offset > this.curPlayer.right) {
                    this.curPlayer.offset -= 3;
                }
                this.curPlayer.cards.forEach(c => {
                    c.setCoords((this.curPlayer.left + this.cardWidth / 2 + 5) + newX, this.curPlayer.y);
                    newX += this.curPlayer.offset;
                });
            }

            redoBtn.elt.disabled = this.logger.redoPointer === 0;
        }
    }

    draw() {
        if(this.gameOver) {
            push();
            let ts = 64;
            textSize(ts);
            strokeWeight(2);
            this.strobeCounter -= 1;
            if(this.strobeCounter === 0) {
                this.winnerColor = color(random(255), random(255), random(255))
                this.strobeCounter = this.initialStrobeCount;
            }
            fill(this.winnerColor);
            let t = `${this.curPlayer.name} is the winrar!!!`;
            let tl = width / 2;
            let tt = height / 2;
            text(t, tl, tt);
            pop();
        } else {
            this.deck.draw();
            this.playAreas.forEach(p => p.draw());
            this.curPlayer.draw();

            this.logger.draw();
        }

        this.message.draw({
            leftOffset: this.curPlayer.left,
            top: this.curPlayer.top - this.curPlayer.topOffset - this.curPlayer.textSize
        });
    }

    handleClick() {
        if(!this.gameOver) {
            if(this.deck.isActive) {
                if(!this.deck.isEmpty) {
                    if(!this.turnStarted) {
                        this.message.set(Message.type.error, "Turn has not started yet.");
                    } else {
                        if(this.playerHasPulledFromDeck) {
                            this.message.set(Message.type.error, "You can only select 1 card from the deck per turn.");
                        } else {
                            let card = this.deck.getCard();
                            this.curPlayer.addTo(card);
                            if(this.deck.cards.length === 0) {
                                this.deck.isEmpty = true;
                            }
                            this.playerHasPulledFromDeck = true;
                            this.message.set(Message.type.normal, `Congrats on pulling the ${this.getValue(card.name)}!!!`);
                            this.logger.addTo({
                                type: Logger.type.pulledFromDeck,
                                player: this.curPlayer.name,
                                card: card.name
                            });
                        }
                    }
                }
            } else {
                if(!this.selectedCard && !this.selectedPile) {
                    if(this.curCard) {
                        this.curCard.isSelected = true;
                        this.selectedCard = this.curCard;
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
                        if(!this.turnStarted) {
                            this.message.set(Message.type.error, "Please start your turn before making any moves.");
                        } else {
                            if(this.canPlace(this.selectedPile, this.selectedCard)) {
                                if(this.selectedCard.pile instanceof PlayArea && this.selectedCard.pile.cards.length > 1) {
                                    let loggerData = {
                                        type: Logger.type.cardsMoved,
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
                                        type: Logger.type.cardMoved,
                                        card: this.selectedCard.name,
                                        from: this.selectedCard.pile.name,
                                        to: this.selectedPile.name,
                                    });
                                    this.curPlayArea.addTo(this.selectedCard);
                                }
                            } else {
                                this.message.set(Message.type.error, `Cannot play the ${this.getValue(card.name)} card in the ${this.curPlayArea.name}.`);
                                card.setCoords(card.pile.x, card.pile.y);
                            }
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

    handleButtonPress() {
        if(!this.gameOver) {
            if(this.turnStarted) {
                if(!this.playerHasPulledFromDeck) {
                    this.message.set(Message.type.error, "You have not yet pulled a card from the deck.");
                } else {
                    if(this.curPlayer.cards.length === 0) {
                        this.gameOver = true;
                        button.elt.hidden = true;
                        this.logger.addTo({
                            type: Logger.type.gameWon,
                            player: this.curPlayer.name
                        });
                    } else {
                        this.logger.addTo({
                            type: Logger.type.turnEnded,
                            player: this.curPlayer.name,
                            playerHasPulledFromDeck: this.playerHasPulledFromDeck
                        });
                        this.turnStarted = false;
                        this.playerHasPulledFromDeck = false;
                        this.message.set(Message.type.normal, `Great moves, ${this.curPlayer.name}!`);
                        this.curPlayer.setCardsToNotVisible();
                        this.btnText = "Start Turn";
                        this.curPlayer = this.nextPlayer();
                        this.curPlayer.setCardsToVisible();
                    }
                }
            } else {
                this.turnStarted = true;
                this.message.set(Message.type.normal, `Best of luck, ${this.curPlayer.name}!`);
                this.btnText = "End Turn";
                this.logger.addTo({ type: Logger.type.turnStarted, });
            }
        }
    }

    nextPlayer() {
        let player = null;
        let curPlayerIndex = this.players.findIndex(p => p.name === this.curPlayer.name);
        if(curPlayerIndex === this.players.length - 1) {
            player = this.players[0];
        } else {
            player = this.players[curPlayerIndex + 1];
        }
        return player;
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

    checkCards(topCard, playCard) {
        if(this.isRed(topCard.name) && this.isRed(playCard.name)) {
            return false;
        }
        if(this.isBlack(topCard.name) && this.isBlack(playCard.name)) {
            return false;
        }
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
        // check if corner spot
        if(["northEastPile", "southEastPile", "southWestPile", "northWestPile"].includes(playArea.name)) {
            return playArea.cards.length === 0 ? card.name.includes("K") : this.checkCards(topCard, card);
        }
        // not corner spot
        return playArea.cards.length === 0 ? true : this.checkCards(topCard, card);
    }






}