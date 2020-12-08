// King's Corner
class KC {
    constructor(numPlayers, cardWidth, cardHeight, cards) {
        this.numPlayers = numPlayers;
        this.players = [];
        this.curPlayer = null;
        this.turnStarted = false;
        this.playerHasPulledFromDeck = false;
        this.playAreas = [];
        this.curPlayArea = null;
        this.curCard = null;
        this.selectedCard = null;
        this.selectedPile = null;
        this.message = "";
        this.messageType = "";
        this.messageAlpha = 0;
        this.initialMessageAlpha = 400;

        // colors
        let yellow = color(255, 255, 100);
        let yellowA = color(255, 255, 100, 125);
        let blue = color(0, 255, 255);
        let blueA = color(0, 255, 255, 125);
        let salmon = color(200, 100, 0);
        let salmonA = color(200, 100, 0, 125);

        // setup Play Areas
        let pileWidth = cardWidth + 10;
        let pileHeight = cardHeight + 10;  
        let vCenter = (width / 2 - pileWidth / 2);
        let hCenter = (height / 2 - pileHeight / 2);
        
        this.playAreas.push(
            new PlayArea("northPile", vCenter, hCenter - pileHeight - 20, pileWidth, pileHeight, 0, yellow, yellowA),
            new PlayArea("southPile", vCenter, hCenter + pileHeight + 20, pileWidth, pileHeight, 0, yellow, yellowA),
            new PlayArea("eastPile", vCenter + pileWidth + 30, hCenter, pileWidth, pileHeight, 90, yellow, yellowA),
            new PlayArea("westPile", vCenter - pileWidth - 30, hCenter, pileWidth, pileHeight, 90, yellow, yellowA),
            new PlayArea("northEastPile", vCenter + pileWidth + 50, hCenter - pileHeight - 25, pileWidth, pileHeight, 45, blue, blueA),
            new PlayArea("southEastPile", vCenter + pileWidth + 50, hCenter + pileHeight + 25, pileWidth, pileHeight, 135, blue, blueA),
            new PlayArea("southWestPile", vCenter - pileWidth - 50, hCenter + pileHeight + 25, pileWidth, pileHeight, 45, blue, blueA),
            new PlayArea("northWestPile", vCenter - pileWidth - 50, hCenter - pileHeight - 25, pileWidth, pileHeight, 135, blue, blueA)
        );

        // setup deck
        this.deck = new Deck(width / 2 - pileWidth / 2, height / 2 - pileHeight / 2, cardWidth, cardHeight, "purple", salmon, salmonA);
        this.deck.cards = cards;

        // setup player's hand
        for(let i = 0; i < this.numPlayers; i++) {
            this.players.push(
                new Hand(`Player${i + 1}`, width / 2, height - cardHeight + 30, width - 20, cardHeight + 10, 0)
            )
        }

        this.curPlayer = this.players[0];

        

        button = createButton("Start Turn");
        let p1 = this.players[0];
        button.position(p1.textRight - 20, p1.top - p1.topOffset);
        button.mousePressed(() => {
            button.elt.innerText = this.handleButtonPress(button.elt.innerText);
        });
    }

    dealCards() {
        this.playAreas.forEach(async p => {
            if(["northPile", "eastPile", "southPile", "westPile"].includes(p.name)) {
                let c = await this.deck.getCard();
                c.visible = true;
                p.addTo(c);
            }
        });
    
        this.players.forEach(async p => {
            for(let i = 0; i < 7; i++) {
                let c = await this.deck.getCard();
                c.visible = true;
                p.addTo(c);
            }
        });
    }

    update() {
        // update deck
        this.deck.update();
        
        // update playAreas
        for(let p of this.playAreas) {
            p.update();
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

        // update Hands
        this.curPlayer.update();
    }

    draw() {
        this.deck.draw();
        this.playAreas.forEach(p => p.draw());
        this.curPlayer.draw();

        // display error
        push();
        if(this.message) {
            switch(this.messageType) {
                case "error":
                    stroke(0, 0, 0, this.messageAlpha);
                    fill(255, 0, 175, this.messageAlpha);
                    break;
                case "normal":
                    stroke(0, 0, 0, this.messageAlpha);
                    fill(255, 255, 255, this.messageAlpha);
            }
            textSize(32);
            strokeWeight(2);
            let eTextW = textWidth(this.message);
            let eTextL = this.curPlayer.left + (eTextW / 2);
            let eTextT = this.curPlayer.top - this.curPlayer.topOffset - this.curPlayer.textSize;
            text(this.message, eTextL, eTextT);
            if(this.messageAlpha > 0) {
                this.messageAlpha -= 1;
            } else {
                this.messageAlpha = this.initialMessageAlpha;
                this.message = "";
            }
        }
        pop();
    }

    async handleClick() {
        if(this.deck.isActive) {
            if(!this.deck.isEmpty) {
                if(!this.turnStarted) {
                    this.addMessage("error", "Turn has not started yet.");
                } else {
                    if(this.playerHasPulledFromDeck) {
                        this.addMessage("error", "You can only select 1 card from the deck per turn.");
                    } else {
                        let card = await this.deck.getCard();
                        this.curPlayer.addTo(card);
                        if(this.deck.cards.length === 0) {
                            this.deck.isEmpty = true;
                        }
                        this.playerHasPulledFromDeck = true;
                        this.addMessage("normal", `Congrats on pulling the ${this.getValue(card.name)}!!!`);
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
                        this.addMessage("error", "Please start your turn before making any moves.");
                    } else {
                        if(this.canPlace(this.selectedPile, this.selectedCard)) {
                            this.curPlayArea.addTo(this.selectedCard);
                        } else {
                            this.addMessage("error", `Cannot play the ${this.getValue(card.name)} card in the ${this.curPlayArea.name}.`);
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

    handleButtonPress(btnText) {
        if(this.turnStarted) {
            if(!this.playerHasPulledFromDeck) {
                this.addMessage("error", "You have not yet pulled a card from the deck.");
            } else {
                this.turnStarted = false;
                this.playerHasPulledFromDeck = false;
                this.addMessage("normal", `Great moves, ${this.curPlayer.playerName}!`);
                this.curPlayer.setCardsToNotVisible();
                this.nextPlayer();
                btnText = "Start Turn";
            }
        } else {
            this.turnStarted = true;
            this.addMessage("normal", `Best of luck, ${this.curPlayer.playerName}!`);
            btnText = "End Turn";
        }
        return btnText;
    }

    nextPlayer() {
        let curPlayerIndex = this.players.findIndex(p => p.playerName === this.curPlayer.playerName);
        if(curPlayerIndex === this.players.length - 1) {
            this.curPlayer = this.players[0];
        } else {
            this.curPlayer = this.players[curPlayerIndex + 1];
        }
        this.curPlayer.setCardsToVisible();
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