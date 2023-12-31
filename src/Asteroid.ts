import { randomPolygon, drawPolygon } from './utils';

class Asteroid {

    public x: number = Math.random() * window.innerWidth;
    public y: number =  Math.random() * window.innerHeight;
    angle: number = Math.random() * 2 * Math.PI;
    speed: number = Math.random() * 2;

    vertices: Array<{ x: number; y: number }> = randomPolygon(8, 20);
    polygon: Array<{ x: number; y: number }> = [];

    public update() {

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;

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
    }

    public draw(ctx: CanvasRenderingContext2D) {
        drawPolygon(ctx, this.polygon);
    }
}

export default Asteroid;