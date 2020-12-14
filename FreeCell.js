// ToDo:
// need to add the ability to drop cards in the Cells
// need to add win condition
// need to work on undo/redo

class FreeCell {
    constructor(cardWidth, cardHeight, cards, colors, logger) {
        this.numPlayAreas = 8;
        this.playAreas = [];

        this.curCard = null;
        this.curPlayArea = null;
        this.selectedCard = null;
        this.selectedPile = null;

        this.logger = logger;

        this.colors = colors;
        
        this.message = new Message();

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
            let pa = new PlayArea(PlayArea.type.Pile, `Pile${i + 1}`, spacing * i + (spacing / 2), paY, pileWidth, pileHeight, 0, this.colors.yellow, this.colors.yellowA);
            this.playAreas.push(pa);
        }

        // set up cells & suits
        for(let i = 0; i < 8; i++) {
            let name;
            let bc;
            let fc;
            let kind;
            if(i < 4) {
                name = `Cell${i + 1}`
                bc = this.colors.salmon;
                fc = this.colors.salmonA;
                kind = PlayArea.type.Cell;
            } else {
                name = i === 7 ? "Suit4" : `Suit${(i + 1) % 4}`
                bc = this.colors.blue;
                fc = this.colors.blueA;
                kind = PlayArea.type.Suit;
            }
            let area = new PlayArea(kind, name, spacing * i + (spacing / 2), 150, pileWidth, pileHeight, 0, bc, fc);
            this.playAreas.push(area);
        }

        this.deck = new Deck(0, 0, 0, 0, cardWidth, cardHeight, globalDeck.folder, deckColorSel.value(), this.colors.salmon, this.colors.salmonA);
        this.deck.cards = [...cards];
        this.deck.cards.forEach(c => c.backShowing = false);
        this.deck.shuffle();

        this.logger.addTo({ type: Logger.type.gameStarted, name: Logger.getTypeName(Logger.type.gameStarted) });

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
            default:
                return null;
        }
    }

    getSuit(cardName) {
        let suit = cardName.slice(-1);
        let suitValueText = "";        
        switch(suit) {
            case("C"):
                suitValueText = "Clubs";
                break;
            case("D"):
                suitValueText = "Diamonds";
                break;
            case("H"):
                suitValueText = "Hearts";
                break;
            case("S"):
                suitValueText = "Spades";
                break;
        }
        return suitValueText;
    }

    getValue(cardName) {
        let suitValueText = this.getSuit(cardName);
        let cardValue = cardName.slice(0, cardName.length - 1);
        let cardValueText = "";
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
        if(cardValueText && suitValueText) {
            return cardValueText + " of " + suitValueText;
        } else {
            return cardName;
        }
    }

    checkCards(topCard, playCard, pa) {
        if(pa.kind === PlayArea.type.Pile && this.isRed(topCard.name) && this.isRed(playCard.name)) return false;
        if(pa.kind === PlayArea.type.Pile && this.isBlack(topCard.name) && this.isBlack(playCard.name)) return false;
        if(pa.kind === PlayArea.type.Suit) {
            if(this.isRed(topCard.name)) {
                if(!this.isRed(playCard.name)) return false;
            } else {
                if(this.isBlack(topCard.name)) {
                    if(!this.isBlack(playCard.name)) return false;
                }
            }
            if(this.getSuit(topCard.name) !== this.getSuit(playCard.name)) return false;
        }
        let topCardValue = parseInt(topCard.name.slice(0, topCard.name.length - 1)) || topCard.name.slice(0, topCard.name.length - 1);
        let playCardValue = parseInt(playCard.name.slice(0, playCard.name.length - 1)) || playCard.name.slice(0, playCard.name.length - 1);
        if(isNaN(topCardValue)) {
            topCardValue = this.makeNumeric(topCardValue);
        }
        if(isNaN(playCardValue)) {
            playCardValue = this.makeNumeric(playCardValue);
        }
        if(pa.kind === PlayArea.type.Pile) {
            return topCardValue - playCardValue === 1;
        } else {
            return playCardValue - topCardValue === 1;
        }
    }

    canPlace(playArea, card) {
        let topCard;
        if(playArea.cards.length > 0) {
            topCard = playArea.cards[playArea.cards.length - 1];
        }
        // check if it's a suit PlayArea
        if(playArea.kind === PlayArea.type.Suit) {
            return playArea.cards.length === 0 ? card.name.includes("A") : this.checkCards(topCard, card, playArea);
        }
        // check if it's a Cell PlayArea
        if(playArea.kind === PlayArea.type.Cell) {
            return playArea.cards.length === 0;
        }
        // regular PlayArea
        return playArea.cards.length === 0 ? true : this.checkCards(topCard, card, playArea);
    }

    dealCards() {
        for(let i = 0; i < this.numPlayAreas; i++) {
            let pileAmt = i < 4 ? 7 : 6;
            let pa = this.playAreas.find(p => p.name === `Pile${i + 1}`);
            for(let k = 0; k < pileAmt; k++) {
                pa.addTo(this.deck.getCard());
            }
        }
        this.deck.isEmpty = true;
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
                    if(this.deck.cards.length === 0) this.deck.isEmpty = true;
                    this.message.set(Message.type.normal, `Congrats on pulling the ${this.getValue(card.name)}!!!`);
                    this.logger.addTo({
                        type: Logger.type.pulledFromDeck,
                        name: Logger.getTypeName(Logger.type.pulledFromDeck),
                        card: card.name
                    });
                }
            } else {
                if(!this.selectedCard) {
                    if(this.curCard) {
                        if(this.curCard.backShowing && 
                           this.curCard.name === this.curCard.pile.cards[this.curCard.pile.cards.length - 1].name) {
                            this.curCard.backShowing = false;
                            this.logger.addTo({
                                type: Logger.type.cardFlipped,
                                name: Logger.getTypeName(Logger.type.cardFlipped),
                                card: this.curCard.name
                            });
                        } else {
                            this.curCard.isSelected = true;
                            this.selectedCard = this.curCard
                        }
                    }
                } else {
                    if(this.selectedCard === this.curCard) {
                        this.curCard.isSelected = false;
                        this.selectedCard = null;
                    } else {
                        if(this.curPlayArea) {
                            if(!this.selectedPile) {
                                this.selectedPile = this.curPlayArea;
                            }
                        } else {
                            if(this.curCard) {
                                if(this.curCard.pile) {
                                    this.curPlayArea = this.curCard.pile;
                                    this.selectedPile = this.curPlayArea;
                                }
                            } else {
                                if(this.curPlayArea) {
                                    this.curPlayArea.isActive = true;
                                    this.selectedPile = this.curPlayArea;
                                }
                            }
                        }
                        if(this.selectedPile) {
                            let card = this.selectedCard;
                            if(this.canPlace(this.selectedPile, this.selectedCard)) {
                                let loggerData = {
                                    type: Logger.type.cardsMoved,
                                    name: Logger.getTypeName(Logger.type.cardsMoved),
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
                                        this.selectedPile.addTo(c);
                                    }
                                });
                                loggerData.cards = cardsToMove;
                                this.logger.addTo(loggerData);
                                // set the card under the last one laid down to be not visible so that it doesn't draw
                                if(this.selectedPile.kind === PlayArea.type.Suit && this.selectedPile.cards.length > 1) {
                                    this.selectedPile.cards[this.selectedPile.cards.length - 2].visible = false;
                                }
                                if(this.deck.isEmpty) {
                                    let pileExists = false;
                                    for(let i = 0; i < this.playAreas.length; i++) {
                                        let pa = this.playAreas[i];
                                        if(pa.kind === PlayArea.type.Pile && pa.cards.length) {
                                            pileExists = true;
                                            break;
                                        }
                                    }
                                    if(!pileExists) {
                                        this.gameOver = true;
                                        this.logger.addTo({ type: Logger.type.gameWon, name: Logger.getTypeName(Logger.type.gameWon) });
                                    }
                                }
                            } else {
                                this.message.set(Message.type.error, `Cannot play the ${this.getValue(card.name)} card in the ${this.curPlayArea.name}.`);
                                card.setCoords(card.pile.x, card.pile.y);
                            }
                            
                            this.selectedCard.isSelected = false;
                            this.selectedCard = null;
                            this.selectedPile.isSelected = false;
                            this.selectedPile = null;
                        }
                    }
                }
            }
        }
    }

    restartGame() {
        this.deck.cards = [];
        this.deck.cards = [...cards];
        this.deck.shuffle();
        this.deck.cardsInPlay.forEach(c => {
            c.pile.removeFrom(c)
            c.backShowing = false;
        });
        this.deck.cardsInPlay = [];
        this.dealCards();
        this.gameOver = false;
        this.logger.addTo({ type: Logger.type.gameRestarted, name: Logger.getTypeName(Logger.type.gameRestarted) });
    }

    undo() {
        let nextUndo = this.logger.log[this.logger.log.length - 1 - this.logger.redoPointer]
        if(nextUndo.type === Logger.type.gameStarted) {
            this.message.set(Message.type.error, "Cannot undo past start of game.");
            return;
        }
        if(nextUndo.type === Logger.type.gameRestarted) {
            this.message.set(Message.type.error, "Cannot undo past the restart of a game.");
            return;
        }
        if(nextUndo.type === Logger.type.gameWon) {
            this.message.set(Message.type.error, "Cannot undo once the game has been won.");
            return;
        }
        let lastState = this.logger.getUndoState();
        switch(lastState.type) {
            case(Logger.type.cardsMoved):
                lastState.cards.forEach(c => {
                    // c is the Card object, not just the card name
                    let pa = this.playAreas.find(p => p.name === lastState.from);
                    pa.addTo(c);
                    if(lastState.to.startsWith("Suit")) {
                        let sa = this.playAreas.find(p => p.name === lastState.to);
                        if(sa.cards.length) sa.cards[sa.cards.length - 1].visible = true;
                    }
                });
                break;
            case(Logger.type.pulledFromDeck):
                let cardPulled = this.deck.cardsInPlay.find(c => c.name === lastState.card);
                if(cardPulled.pile) cardPulled.pile.removeFrom(cardPulled);
                this.deck.cards.unshift(cardPulled);
                if(this.deck.cards.length && this.deck.isEmpty) this.deck.isEmpty = false; 
                break;
            case(Logger.type.cardFlipped):
                let card = this.deck.cardsInPlay.find(c => c.name === lastState.card);
                card.backShowing = true;
                break;
        }
        this.logger.redoPointer++;
    }

    redo() {
        let lastState = this.logger.getRedoState();
        switch(lastState.type) {
            case(Logger.type.cardsMoved):
                lastState.cards.forEach(c => {
                    // c is the Card object, not just the card name
                    let pa = this.playAreas.find(p => p.name === lastState.to);
                    pa.addTo(c);
                    if(lastState.from.startsWith("Suit")) {
                        let sa = this.playAreas.find(p => p.name === lastState.from);
                        if(sa.cards.length) sa.cards[sa.cards.length - 2].visible = false;
                    }
                });
                break;
            case(Logger.type.pulledFromDeck):
                let theCard = this.deck.getCard()
                this.playerPile.addTo(theCard);
                if(!this.deck.cards.length) this.deck.isEmpty = true;
                break;
            case(Logger.type.cardFlipped):
                let card = this.deck.cardsInPlay.find(c => c.name === lastState.card);
                card.backShowing = false;
                break;
        }
        this.logger.redoPointer--;
    }

    update() {
        this.playAreas.forEach(p => p.update());
        
        this.deck.update();

        // update playAreas
        for(let p of this.playAreas) {
            p.update();

            if(p.kind === PlayArea.type.Pile) {
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

        redoBtn.elt.disabled = this.logger.redoPointer === 0;
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
            let t = `You is the winrar!!!`;
            let tl = width / 2;
            let tt = height / 2;
            text(t, tl, tt);
            pop();
        } else {
            this.playAreas.forEach(p => p.draw());

            this.deck.draw();

            this.logger.draw();
        }

        this.message.draw({ leftOffset: this.playAreas[0].left });
    }


}