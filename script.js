//Imports
import { drawLine } from './src/utils.js';

// Get canvas element and context
const canvas = document.getElementById('Canvas');
canvas.width = window.innerWidth * 0.97;
canvas.height = window.innerHeight * 0.8;
const ctx = canvas.getContext('2d');

//Start the simulation
document.getElementById('startButton').addEventListener('click', () => {
	drawLine(ctx, 10, 10, 20, 20);	
});

// Stop the simulation
document.getElementById('stopButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
