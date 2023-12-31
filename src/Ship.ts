import { drawPolygon, polysIntersect } from './utils';
import Controls from './Controls';
import Asteroid from './Asteroid';

class Ship {

    public x: number =  window.innerWidth / 2;
    public y: number = window.innerHeight / 2;
    angle: number = 3 * Math.PI / 2;
    speed: number = 0;
    acceleration: number = 0.1;
    maxSpeed: number = 5;
    friction: number = 0.05;

    vertices: Array<{ x: number; y: number }> = [
        { x: 0, y: 0 },
        { x: 0, y: 20 },
        { x: 30, y: 10 }
    ];
    polygon: Array<{ x: number; y: number }> = [];

    constrols: Controls = new Controls();

    hitten:boolean=false;

    update(asteroids:Array<Asteroid> = []) {
            
            // this.angle+=0.01;

            if (this.constrols.forward) this.speed += this.acceleration;
            if (this.constrols.backward) this.speed -= this.acceleration;
            
            if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
            if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;

            if (this.speed > 0) this.speed -= this.friction;
            if (this.speed < 0) this.speed += this.friction;

            if (Math.abs(this.speed) < this.friction) this.speed = 0;

            if (this.constrols.left) this.angle -= 0.05;
            if (this.constrols.right) this.angle += 0.05;

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
            

            this.hitten=false;
            asteroids.forEach((asteroid)=>{
                if(polysIntersect(this.polygon,asteroid.polygon)){
                    this.hitten=true;
                }
            });
            
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.hitten ? 'red' : 'black';
        drawPolygon(ctx, this.polygon);
        ctx.strokeStyle = 'black';
    }
}

export default Ship;