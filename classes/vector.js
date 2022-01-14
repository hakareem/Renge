export class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static create(o) {
        return new Vector(o.x, o.y);
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    addIn(v) {
        this.x += v.x;
        this.y += v.y;
    }
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    multiply(m) {
        return new Vector(this.x * m, this.y * m);
    }
    multiplyIn(m) {
        this.x *= m;
        this.y *= m;
    }
    static hypo(adjacent, opposite) {
        return Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
    }
    length() {
        return Vector.hypo(this.x, this.y);
    }
    distanceFrom(b) {
        return Vector.hypo(Math.abs(b.x - this.x), Math.abs(b.y - this.y));
    }
    normalise() {
        return new Vector(this.x / this.length(), this.y / this.length());
    }
}
//# sourceMappingURL=vector.js.map