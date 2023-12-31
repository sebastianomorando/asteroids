import { randomPolygon, drawPolygon, polysIntersect } from './utils';
import Bullet from './Bullet';
class Asteroid {

    public x: number = Math.random() * window.innerWidth;
    public y: number =  Math.random() * window.innerHeight;
    angle: number = Math.random() * 2 * Math.PI;
    speed: number = Math.random() * 2;

    vertices: Array<{ x: number; y: number }> = randomPolygon(8, 20);
    polygon: Array<{ x: number; y: number }> = [];

    hitten:boolean=false;

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

        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;

        bullets.forEach((bullet)=>{
            if(polysIntersect(this.polygon,bullet.polygon)){
                this.hitten=true;
            }
        });
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'green';
        drawPolygon(ctx, this.polygon);
        ctx.strokeStyle = 'green';
    }

    public destroy(){
        // this.vertices=[];
        // this.polygon=[];
    }

}

export default Asteroid;