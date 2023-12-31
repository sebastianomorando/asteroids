import './style.css';
import Asteroid from './Asteroid';
import Ship from './Ship';
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const ctx = canvas.getContext('2d')!;

const asteroids = Array();
for (let i = 0; i < 10; i++) asteroids.push(new Asteroid());
const ship = new Ship();

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    asteroids.forEach((entity: any) => {
        entity.update();
        entity.draw(ctx);
    });
    ship.update(asteroids);
    ship.draw(ctx);

    requestAnimationFrame(animate);
}
animate();