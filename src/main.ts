import './style.css';
import Asteroid from './Asteroid';
import Ship from './Ship';
import NeuralNetwork from './Network';
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export const ctx = canvas.getContext('2d')!;

const NUMBER_OF_ASTEROIDS = 20;
const NUMBER_OF_SHIPS = 100;

const asteroids = Array();
for (let i = 0; i < 20; i++) asteroids.push(new Asteroid());
const ships: Array<Ship> = [];
for (let i = 0; i < NUMBER_OF_SHIPS; i++) ships.push(new Ship());
let bestBrain = ships[0].brain;
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

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    asteroids.forEach((entity: any) => {
        entity.update();
        entity.draw(ctx);
    });
    ships.forEach((entity: any) => {
        entity.update(asteroids);
        entity.draw(ctx);
        if (entity.hitten) {
            entity.destroy();
            ships.splice(ships.indexOf(entity), 1);
        }
    });



    if (ships.length === 1) {
        bestBrain = ships[0].brain;
    }
    if (ships.length <= 1) {
        for (let i = 0; i < NUMBER_OF_SHIPS; i++) ships.push(new Ship());
        for (let i = 0; i < ships.length; i++) {
            ships[i].brain = JSON.parse(JSON.stringify(bestBrain));
            if (i > 0) {
                NeuralNetwork.mutate(ships[i].brain, 1);
            }
        }
    }


    requestAnimationFrame(animate);
}
animate();

const saveButton = document.getElementById('save') as HTMLButtonElement;

saveButton.addEventListener('click', () => {
    const data = JSON.stringify(ships[0].brain);
    localStorage.setItem('brain', data);
});