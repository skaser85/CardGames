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
        this.offset = 50;
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
        if(card.pile) {
            card.pile.removeFrom(card);
        }
        card.pile = this;
        card.setCoords(this.x, this.y);
        card.setRotation(this.rotateDeg);
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
        if(this.cards.length > 0) {
            let newX = 0;
            let stackRight = this.cards[this.cards.length - 1].right;
            if(stackRight + this.offset > this.right) {
                this.offset -= 3;
            }
            this.cards.forEach(c => {
                c.setCoords((this.left + cardWidth / 2 + 5) + newX, this.y);
                c.draw();
                newX += this.offset;
            });
        }
    }
}