class PlayArea {
    constructor(name, x, y, width, height, rotateDeg, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotateDeg = rotateDeg;
        this.color = color;
        this.isActive = false;
        this.isSelected = false;
        this.cards = [];
        if(this.rotateDeg === 0) {
            this.left = this.x - (this.width / 2);
            this.right = this.x + (this.width / 2);
            this.top = this.y - (this.height / 2);
            this.bottom = this.y + (this.height / 2);
        } else {
            // gross
            let rads = radians(this.rotateDeg);
            let rotX = this.x*cos(rads) - this.y*sin(rads);
            let rotY = this.x*sin(rads) + this.y*cos(rads);
            this.left = rotX - (this.width / 2);
            this.right = rotX + (this.width / 2);
            this.top = rotY - (this.height / 2);
            this.bottom = rotY + (this.height / 2);
        }
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

    canPlace(card) {
        let topCard;
        if(this.cards.length > 0) {
            topCard = this.cards[this.cards.length - 1];
        }
        // check if corner spot
        if(["northEastPile", "southEastPile", "southWestPile", "northWestPile"].includes(this.name)) {
            if(this.cards.length === 0) {
                return card.card.name.includes("K");
            } else {
                return this.checkCards(topCard, card);
            }
        }
        // not corner spot
        if(this.cards.length === 0) {
            return true;
        } else {
            return this.checkCards(topCard, card);
        }
    }

    addTo(card) {
        card.card.pile = this;
        card.card.setCoords(this.x, this.y);
        card.card.setRotation(this.rotateDeg);
        this.cards.push(card);
    }

    removeFrom(card) {
        let cardIndex = this.cards.indexOf(card);
        this.cards.splice(cardIndex, 1);
    }

    mouseIsOver() {
        return (mouseX >= this.left) && 
               (mouseX <= this.right) &&
               (mouseY >= this.top) &&
               (mouseY <= this.bottom);
    }

    update() {
        this.isActive = this.mouseIsOver();
    }

    draw() {
        push()
        if(this.isActive || this.isSelected) {
            fill(this.color);
        } else {
            noFill();
        }
        stroke(this.color);
        strokeWeight(2);
        translate(this.x, this.y);
        rotate(this.rotateDeg);
        rect(0, 0, this.width, this.height);
        pop();

        if(this.cards.length > 0) {
            for(let i = 0; i < this.cards.length; i++) {
                let card = this.cards[i].card;
                if(i === 0) {
                    card.setCoords(this.x, this.y);
                    card.draw();
                }
                if(i > 0 && i === this.cards.length - 1) {
                    // console.log(card);
                    let offset = 25;
                    switch(this.name) {
                        case "northPile":
                            card.setCoords(this.x, this.y - offset);
                            break;
                        case "southPile":
                            card.setCoords(this.x, this.y + offset);
                            break;
                        case "northEastPile":
                            card.setCoords(this.x + offset, this.y - offset);
                            break;
                        case "southEastPile":
                            card.setCoords(this.x + offset, this.y + offset);
                            break;
                        case "eastPile":
                            card.setCoords(this.x + offset, this.y);
                            break;
                        case "northWestPile":
                            card.setCoords(this.x - offset, this.y - offset);
                            break;
                        case "southWestPile":
                            card.setCoords(this.x - offset, this.y + offset);
                            break;
                        case "westPile":
                            card.setCoords(this.x - offset, this.y);
                            break;
                    }
                    card.draw();
                }
            }
        }
    }
}