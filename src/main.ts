import './style.css';
import Asteroid from './Asteroid';
import Ship from './Ship';
import NeuralNetwork from './Network';
import { pointInPolygon } from './utils';
import Bullet from './Bullet';
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const ctx = canvas.getContext('2d')!;

const MODE: 'AI' | 'PLAYER' = "AI";
const NUMBER_OF_ASTEROIDS = 40;
const NUMBER_OF_SHIPS = 100;

const asteroids = Array();
for (let i = 0; i < NUMBER_OF_ASTEROIDS; i++) asteroids.push(new Asteroid());
const ships: Array<Ship> = [];
for (let i = 0; i < NUMBER_OF_SHIPS; i++) ships.push(new Ship());
let bestBrain = ships[0].brain;
let bestBrains = [];
if (localStorage.getItem('brain')) {
    const data = localStorage.getItem('brain');
    bestBrain = JSON.parse(data!);
    for (let i = 0; i < ships.length; i++) {
        ships[i].brain = JSON.parse(data!);
        if (i > 0) {
            NeuralNetwork.mutate(ships[i].brain, 0.1);
        }
    }
}

const player = new Ship();
player.player = true;

const bullets: Array<Bullet> = [];

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    asteroids.forEach((entity: any) => {
        entity.update(bullets);
        entity.draw(ctx);
        if (entity.hitten) {
            entity.destroy();
            asteroids.splice(asteroids.indexOf(entity), 1);
        }
    });
    ships.forEach((entity: any) => {
        entity.update(asteroids, bullets);
        entity.draw(ctx);
        if (entity.hitten || entity.turnsBeforeDeath <= 0) {
            entity.destroy();
            ships.splice(ships.indexOf(entity), 1);
        }
    });
    player.update(asteroids, bullets);
    player.draw(ctx);

    bullets.forEach((bullet) => {
        bullet.update(bullets);
        bullet.draw(ctx);
    });


    if (ships.length < 5 && ships.length > 0) {
        bestBrain = ships[0].brain;
        for (let i = 0; i < ships.length; i++) {
            bestBrains.push(ships[i].brain);
        }
    }
    if (ships.length < 5) {
        for (let i = 0; i < NUMBER_OF_SHIPS; i++) ships.push(new Ship());
        for (let i = 0; i < ships.length; i++) {
            ships[i].brain = JSON.parse(JSON.stringify(bestBrains[i % bestBrains.length]));
            if (i > 0) {
                NeuralNetwork.mutate(ships[i].brain, 0.1);
            }
        }
    }

    if (asteroids.length < NUMBER_OF_ASTEROIDS) {
        asteroids.push(new Asteroid());
    }

    requestAnimationFrame(animate);
}
animate();

let shipUnderMouse: Ship | null = null;
const saveButton = document.getElementById('save') as HTMLButtonElement;

saveButton.addEventListener('click', () => {
    let data = JSON.stringify(bestBrain);
    if (shipUnderMouse) {
        data = JSON.stringify(shipUnderMouse.brain);
    }
    localStorage.setItem('brain', data);
});


document.addEventListener('mousedown', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    // asteroids.push(new Asteroid(x, y));
    if (shipUnderMouse) shipUnderMouse.selected = false;
    shipUnderMouse = ships.find((ship) => {
        return pointInPolygon({ x, y }, ship.polygon);
    }) || null;
    if (shipUnderMouse) {
        shipUnderMouse.selected = true;
    }
});