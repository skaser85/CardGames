class Hand {
    constructor(x, y, width, height, rotateDeg) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotateDeg = rotateDeg;
        this.borderColor = color(100, 255, 200);
        this.fillColor = color(100, 255, 200, 125);
        this.isActive = false;
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

    addTo(card) {
        if(card.card.pile) {
            card.card.pile.removeFrom(card);
        }
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
        push();
        if(this.isActive) {
            fill(this.fillColor);
        } else {
            noFill();
        }
        stroke(this.borderColor);
        strokeWeight(2);
        translate(this.x, this.y);
        rotate(this.rotateDeg);
        rect(0, 0, this.width, this.height);
        pop();
        let offset;
        if(this.cards.length > 12) {
            offset = 30;
        }
        if(this.cards.length > 20) {
            offset = 20;
        }
        if(!offset) {
            offset = 50;
        }
        if(this.cards.length > 0) {
            let newX = 0;
            this.cards.forEach(c => {
                c.card.setCoords((this.left + cardWidth / 2 + 5) + newX, this.y);
                c.card.draw();
                newX += offset;
            });
        }
    }
}