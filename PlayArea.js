class PlayArea {
    static type = {
        "Pile": 0,
        "Suit": 1,
        "Cell": 2
    }

    constructor(kind, name, x, y, width, height, rotateDeg, borderColor, fillColor) {
        this.kind = kind;
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotateDeg = rotateDeg;
        this.borderColor = borderColor;
        this.fillColor = fillColor;
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
        this.offset = 25;
    }

    addTo(card) {
        if(card.pile) card.pile.removeFrom(card);
        card.pile = this;
        card.setCoords(this.x, this.y);
        card.setRotation(this.rotateDeg);
        this.cards.push(card);
    }

    removeFrom(card) {
        let cardIndex = this.cards.indexOf(card);
        this.cards.splice(cardIndex, 1);
        card.pile = null;
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

        push()
        fill(255, 255, 255);
        stroke(0, 0, 0);
        let tSize = 16
        textSize(tSize);
        text(this.name, this.x, this.top - tSize / 2);
        pop();

        this.cards.forEach(c => {
            if(c.visible) c.draw()
        });
    }
}