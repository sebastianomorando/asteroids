import Asteroid from "./Asteroid";
import Ship from "./Ship";
import { lerp, getIntersection } from "./utils";

interface Ray {
    0: { x: number; y: number };
    1: { x: number; y: number };
}

class Sensor {

    rayCount: number = 12;
    rayLength: number = 100;
    raySpread: number = Math.PI * 2 - Math.PI / this.rayCount * 2;

    rays: Array<Ray> = [];
    readings: Array<{x: number, y: number, offset: number} | null | undefined> = [];

    ship: Ship;

    constructor(ship: Ship) {
        this.ship = ship;
        
    }

    update(asteroids: Array<Asteroid>){
        this.castRays();
        this.readings=[];
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(
                this.getReading(
                    this.rays[i],
                    asteroids
                )
            );
        }
    }

    getReading(ray: Ray, asteroids: Array<Asteroid>){
        let touches=[];

        for(let i=0;i<asteroids.length;i++){
            const poly=asteroids[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value=getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value){
                    touches.push(value);
                }
            }
        }

        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset);
            const minOffset=Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }

    castRays() {
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            )+this.ship.angle;

            const start={x:this.ship.center.x, y:this.ship.center.y};
            const end={
                x:this.ship.center.x+
                    Math.cos(rayAngle)*this.rayLength,
                y:this.ship.center.y+
                    Math.sin(rayAngle)*this.rayLength
            };
            this.rays.push([start,end]);
        }
    }

    draw(ctx: CanvasRenderingContext2D){
        for(let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}

export default Sensor;