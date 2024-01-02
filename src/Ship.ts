import { drawPolygon, polysIntersect } from './utils';
import Controls from './Controls';
import Asteroid from './Asteroid';
import Sensor from './Sensor';
import NeuralNetwork from './Network';

const TURN_BEFORE_DEATH = 500;

class Ship {
    
    // public x: number =  window.innerWidth / 2;
    // public y: number = window.innerHeight / 2;
    public x: number = Math.random() * window.innerWidth;
    public y: number =  Math.random() * window.innerHeight;
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

    controls: Controls = new Controls();

    sensor = new Sensor(this);

    hitten:boolean=false;

    center: { x: number; y: number } = { x: 0, y: 0 };

    brain: NeuralNetwork = new NeuralNetwork([this.sensor.rayCount, 8, 6, 4]);

    turnsBeforeDeath: number = TURN_BEFORE_DEATH;

    update(asteroids:Array<Asteroid> = []) {
            
            // this.angle+=0.01;

            if (this.controls.forward) this.speed += this.acceleration;
            if (this.controls.backward) this.speed -= this.acceleration;
            
            if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
            if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;

            if (this.speed > 0) this.speed -= this.friction;
            if (this.speed < 0) this.speed += this.friction;

            if (Math.abs(this.speed) < this.friction) this.speed = 0;

            if (this.speed == 0) {
                this.turnsBeforeDeath--;
            } else {
                this.turnsBeforeDeath = TURN_BEFORE_DEATH;
            }

            if (this.controls.left) this.angle -= 0.05;
            if (this.controls.right) this.angle += 0.05;

            this.x+=Math.cos(this.angle)*this.speed;
            this.y+=Math.sin(this.angle)*this.speed;

            if (this.y < 0) this.y = window.innerHeight;
            if (this.y > window.innerHeight) this.y = 0;
            if (this.x < 0) this.x = window.innerWidth;
            if (this.x > window.innerWidth) this.x = 0;
    
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

            this.center = {
                x: centroid.x + this.x,
                y: centroid.y + this.y
            }
            

            this.hitten=false;
            asteroids.forEach((asteroid)=>{
                if(polysIntersect(this.polygon,asteroid.polygon)){
                    this.hitten=true;
                }
            });

            this.sensor.update(asteroids);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);

            this.controls.forward=outputs[0];
            this.controls.left=outputs[1];
            this.controls.right=outputs[2];
            this.controls.backward=outputs[3];
            
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.hitten ? 'red' : 'green';
        drawPolygon(ctx, this.polygon);
        ctx.strokeStyle = 'green';

        // this.sensor.draw(ctx);
    }

    destroy() {
        this.brain=null;
        this.sensor.destroy();
        this.sensor=null;
        this.controls.destroy();
        this.controls=null;

    }
}

export default Ship;