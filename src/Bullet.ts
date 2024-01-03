import { regularPolygon, drawPolygon } from "./utils";

class Bullet {

    public x: number = Math.random() * window.innerWidth;
    public y: number =  Math.random() * window.innerHeight;
    angle: number = Math.random() * 2 * Math.PI;
    speed: number = 5;

    vertices: Array<{ x: number; y: number }> = regularPolygon(8, 5);
    polygon: Array<{ x: number; y: number }> = [];

    constructor(x:number,y:number,angle:number){
        this.x=x;
        this.y=y;
        this.angle=angle;
    }

    public update(bullets:Array<Bullet>) {

        this.x+=Math.cos(this.angle)*this.speed;
        this.y+=Math.sin(this.angle)*this.speed;

        // find the centroid
        const centroid = this.vertices.reduce((acc, vertex) => {
            return {
                x: acc.x + vertex.x,
                y: acc.y + vertex.y
            }
        }, { x: 0, y: 0 });
        centroid.x /= this.vertices.length;
        centroid.y /= this.vertices.length;

        // rotate vertices
        this.polygon = this.vertices.map((vertex) => {
            const x = vertex.x - centroid.x;
            const y = vertex.y - centroid.y;
            return {
                x: x * Math.cos(this.angle) - y * Math.sin(this.angle) + centroid.x + this.x,
                y: x * Math.sin(this.angle) + y * Math.cos(this.angle) + centroid.y + this.y
            }
        });

        if (this.y < 0) bullets.splice(bullets.indexOf(this),1);
        if (this.y > window.innerHeight) bullets.splice(bullets.indexOf(this),1);
        if (this.x < 0) bullets.splice(bullets.indexOf(this),1);
        if (this.x > window.innerWidth) bullets.splice(bullets.indexOf(this),1);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'green';
        drawPolygon(ctx, this.polygon);
        ctx.strokeStyle = 'green';
    }
}

export default Bullet;