class Deck {
    constructor(x, y, width, height, cardWidth, cardHeight, deckColor, borderColor, fillColor, drawType) {
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
        this.borderColor = borderColor;
        this.fillColor = fillColor;
        this.isActive = false;
        this.cards = [];
        this.cardsInPlay = [];
        this.isEmpty = false;
        this.drawType = drawType;
        this.img = null;
        this.spriteInfo = null;
    }

    changeDeck(dk, c) {
        this.backColors = dk.backColors;
        this.drawType = dk.isSprite ? "sprite" : "img";
        this.spriteInfo = dk.isSprite ? dk.backs.find(b => b.name === c).spriteInfo : null;
        this.img = dk.isSprite ? null : dk.backs.find(b => b.name === c).img;
        this.deckColor = c;
        if(this.cards) {
            if(dk.isSprite) {
                this.cards.forEach(cd => {
                    cd.backColor = this.deckColor;
                    cd.drawType = "sprite"
                    cd.spriteInfo = dk.cardInfo.find(t => t.name === cd.name).spriteInfo;
                    cd.backSpriteInfo = this.spriteInfo;
                });
                this.cardsInPlay.forEach(cd => {
                    cd.backColor = this.deckColor;
                    cd.drawType = "sprite"
                    cd.spriteInfo = dk.cardInfo.find(t => t.name === cd.name).spriteInfo;
                    cd.backSpriteInfo = this.spriteInfo;
                });
            } else {
                this.cardsInPlay.forEach(cd => {
                    cd.backImg = this.img;
                    cd.drawType = "img";
                    cd.spriteInfo = null;
                    cd.backSpriteInfo = null;
                    cd.img = dk.cards.find(t => t.name === cd.name).img;
                });
                this.cards.forEach(cd => {
                    cd.backImg = this.img;
                    cd.drawType = "img";
                    cd.spriteInfo = null;
                    cd.backSpriteInfo = null;
                    cd.img = dk.cards.find(t => t.name === cd.name).img;
                });
            }
        }
    }

    changeDeckColor(dk, c) {
        this.deckColor = c;
        this.img = dk.isSprite ? null : dk.backs.find(b => b.name === c).img;
        this.spriteInfo = dk.isSprite ? dk.backs.find(b => b.name === c).spriteInfo : null;
        if(dk.isSprite) {
            this.cardsInPlay.forEach(cd => {
                cd.backColor = c
                cd.backSpriteInfo = this.spriteInfo;
            });
        } else {
            this.cardsInPlay.forEach(cd => {
                cd.backImg = this.img;
                cd.backSpriteInfo = null;
            });
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
        if(this.drawType === "sprite") c.backColor = this.deckColor;
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
                image(this.spriteInfo.sprite, 0, 0, this.width, this.height, this.spriteInfo.x, this.spriteInfo.y, this.spriteInfo.w, this.spriteInfo.h);
            } else {
                image(this.img, 0, 0, this.cardWidth, this.cardHeight);
            }
        }
        pop();
    }
}