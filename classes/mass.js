import { Vector } from "./vector.js";
export class Mass {
    position = new Vector(50, 50);
    velocity = new Vector(0, 0);
    //target: Vector = new Vector(0,0)
    index;
    constructor(game, position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.index = game.masses.length;
        //this.target = target
        game.masses.push(this);
    }
    highlight = new Array(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255));
    draw(game) {
        game.ctx?.beginPath();
        game.ctx?.arc(this.position.x, this.position.y, game.massRadius, 0, 2 * Math.PI);
        //  game.ctx!.fillStyle = "green"
        //  game.ctx?.fill()
        game.ctx.lineWidth = 2;
        game.ctx.strokeStyle = "#000000";
        game.ctx.strokeStyle =
            "rgba(" +
                this.highlight[0] +
                "," +
                this.highlight[1] +
                "," +
                this.highlight[2] +
                ",0.5)";
        game.ctx.stroke();
        game.ctx?.closePath();
    }
    move(game) {
        if (this.position.y < game.ground) {
            this.position = this.position.add(this.velocity);
        }
    }
}
//# sourceMappingURL=mass.js.map