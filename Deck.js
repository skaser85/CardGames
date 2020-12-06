class Deck {
    constructor(x, y, width, height, deckColor, borderColor, fillColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.left = this.x - (this.width / 2);
        this.right = this.x + (this.width / 2);
        this.top = this.y - (this.height / 2);
        this.bottom = this.y + (this.height / 2);
        this.deckColor = deckColor;
        this.borderColor = borderColor;
        this.fillColor = fillColor;
        this.isActive = false;
        // this.cards = [];
        this.cards = ["2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC","AC","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD","AD"];
        this.cardsInPlay = [];
        this.isEmpty = false;
        
        this.backColors = ["blue", "gray", "green", "purple", "red", "yellow"];
        this.img = loadImage(`cards/${this.deckColor}_back.png`);
    }

    getCard() {
        let cardIndex = Math.floor((Math.random() * this.cards.length));
        let cName = this.cards[cardIndex];
        return new Promise((resolve, reject) => {
            loadImage(`cards/${cName}.png`, img => {
                let c = new Card(cName, img, cardWidth, cardHeight, 0, 0);
                this.cards.splice(cardIndex, 1);
                this.cardsInPlay.push(c);
                resolve(c);
            });
        });
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
        rect(0, 0, this.width + 10, this.height + 10);
        if(!this.isEmpty) {
            image(this.img, 0, 0, this.width, this.height);
        }
        pop();
    }
}