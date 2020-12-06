// King's Corner
class KC {
    constructor(numPlayers, cardWidth, cardHeight) {
        this.numPlayers = numPlayers;
        this.players = [];
        this.curPlayer = null;
        this.turnStarted = false;
        this.playAreas = [];
        this.curPlayArea = null;
        this.curCard = null;
        this.selectedCard = null;
        this.selectedPile = null;

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
        
        // setup player's hand
        for(let i = 0; i < this.numPlayers; i++) {
            this.players.push(
                new Hand(width / 2, height - cardHeight + 30, width - 20, cardHeight + 10, 0)
            )
        }

        this.curPlayer = this.players[0];
    }

    dealCards() {
        this.playAreas.forEach(p => {
            if(["northPile", "eastPile", "southPile", "westPile"].includes(p.name)) {
                p.addTo(this.deck.getCard());
            }
        });
    
        this.players.forEach(p => {
            for(let i = 0; i < 7; i++) {
                p.addTo(this.deck.getCard());
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
            c.card.update();
            if(c.card.isActive) {
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
                possibleCards[i].card.isActive = false;
            }
            this.curCard = possibleCards[possibleCards.length - 1];
        }

        // update Hands
        this.players.forEach(p => p.update());
    }

    draw() {
        this.deck.draw();
        this.playAreas.forEach(p => p.draw());
        this.players.forEach(p => p.draw());
    }

    handleClick() {
        if(this.deck.isActive) {
            if(!this.deck.isEmpty) {
                let card = this.deck.getCard();
                this.curPlayer.addTo(card);
                if(this.deck.cards.length === 0) {
                    this.deck.isEmpty = true;
                }
            }
        } else {
            if(!this.selectedCard && !this.selectedPile) {
                if(this.curCard) {
                    this.curCard.card.isSelected = true;
                    this.selectedCard = this.curCard;
                } else if(this.curCard && this.selectedCard) {
                    if(this.curCard.card.isSelected) {
                        this.selectedCard.card.isSelected = false;
                        this.selectedCard = null;
                    } else {
                        this.selectedCard.card.isSelected = false;
                        this.selectedCard = null;
                        this.curCard.card.isSelected = true;
                        this.selectedCard = this.curCard;
                    }
                }
            } else if(this.selectedCard && !this.selectedPile) {
                if(this.curPlayArea) {
                    this.curPlayArea.isSelected = true;
                    this.selectedPile = this.curPlayArea;
                    
                    let card = this.selectedCard.card;
                    if(this.curPlayArea.canPlace(this.selectedCard)) {
                        this.curPlayArea.addTo(this.selectedCard);
                    } else {
                        card.setCoords(card.pile.x, card.pile.y);
                    }
                    
                    this.selectedCard.card.isSelected = false;
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