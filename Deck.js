class Deck {
    constructor(x, y, width, height, cardWidth, cardHeight, folder, deckColor, borderColor, fillColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.left = this.x - (this.width / 2);
        this.right = this.x + (this.width / 2);
        this.top = this.y - (this.height / 2);
        this.bottom = this.y + (this.height / 2);
        this.cardWidth = cardWidth;
        this.cardHeight = cardHeight;
        this.deckColor = deckColor;
        this.folder = folder;
        this.borderColor = borderColor;
        this.fillColor = fillColor;
        this.isActive = false;
        this.cards = [];
        this.cardsInPlay = [];
        this.isEmpty = false;
        this.drawType = globalDeck.isSprite ? "sprite" : "img";
        this.img = null;
    }

    changeDeck(c) {
        this.folder = globalDeck.folder;
        this.backColors = globalDeck.backColors;
        this.drawType = globalDeck.isSprite ? "sprite" : "img";
        this.img = globalDeck.backs.find(b => b.name === c).img;
        this.deckColor = c;
        if(this.cards) {
            if(globalDeck.isSprite) {
                this.cards.forEach(cd => {
                    cd.backColor = this.deckColor;
                    cd.drawType = "sprite"
                    cd.spriteInfo = globalDeck.cardInfo[cd.name].spriteInfo;
                });
                this.cardsInPlay.forEach(cd => {
                    cd.backColor = this.deckColor;
                    cd.drawType = "sprite"
                    cd.spriteInfo = globalDeck.cardInfo[cd.name].spriteInfo;
                });
            } else {
                this.cardsInPlay.forEach(cd => {
                    cd.backImg = this.img;
                    cd.drawType = "img";
                    cd.spriteInfo = null;
                    cd.img = globalDeck.cards.find(t => t.name === cd.name).img;
                });
                this.cards.forEach(cd => {
                    cd.backImg = this.img;
                    cd.drawType = "img";
                    cd.spriteInfo = null;
                    cd.img = globalDeck.cards.find(t => t.name === cd.name).img;
                });
            }
        }
    }

    changeDeckColor(c) {
        this.deckColor = c;
        this.img = globalDeck.backs.find(b => b.name === c).img;
        if(globalDeck.isSprite) {
            this.cardsInPlay.forEach(cd => cd.backColor = c);
        } else {
            this.cardsInPlay.forEach(cd => cd.backImg = this.img);
        }
    }

    shuffle() {
        for(let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            let temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    getCard() {
        let c = this.cards[0];
        this.cards.splice(0, 1);
        c.visible = true;
        if(!c.backImg) c.backImg = this.img;
        if(globalDeck.isSprite) c.backColor = this.deckColor;
        this.cardsInPlay.push(c);
        return(c)
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
        if(this.isActive) {
            fill(this.fillColor);
        } else {
            noFill();
        }
        stroke(this.borderColor);
        strokeWeight(2);
        translate(this.x, this.y)
        rect(0, 0, this.width, this.height);
        if(!this.isEmpty) {
            if(this.drawType === "sprite") {
                let back = globalDeck.backs.find(b => b.name === this.deckColor);
                let backX = back.c * globalDeck.spriteInfo.w + back.xPad;
                let backY = back.r * globalDeck.spriteInfo.h + back.yPad;
                image(globalDeck.spriteInfo.sprite, 0, 0, this.width, this.height, backX, backY, globalDeck.spriteInfo.w, globalDeck.spriteInfo.h);
            } else {
                if(!this.img) {
                    loadImage(`cards/${this.folder}/${this.deckColor}_back.png`, img => {
                        this.img = img;
                        image(this.img, 0, 0, this.cardWidth, this.cardHeight);
                    });
                } else {
                    image(this.img, 0, 0, this.cardWidth, this.cardHeight);
                }
            }
        }
        pop();
    }
}