
export class Vector {
    x: number;
    y: number;


    constructor(x: number, y: number){
    this.x = x
    this.y = y
    }

    static create(o:any){
        return new Vector(o.x,o.y)
    
    }
    add(v: Vector){
    return new Vector(this.x + v.x, this.y + v.y)
    }
    addIn(v: Vector){
        this.x += v.x
        this.y += v.y

    }
    subtract(v: Vector){
    return new Vector(this.x - v.x , this.y - v.y)
    }

    multiply(m: number){
    return new Vector(this.x * m, this.y * m)
    }
    multiplyIn(m: number){
        this.x *= m
        this.y *= m
    }

    static hypo (adjacent: number, opposite: number){
    return Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite,2))
    }

    length (){
    return Vector.hypo(this.x,this.y)
    }

    distanceFrom(b:Vector){
    return Vector.hypo(Math.abs(b.x-this.x), Math.abs(b.y - this.y))
    }

    normalise(){
    return new Vector (this.x / this.length(), this.y / this.length())
    }

}