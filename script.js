//Classes
class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	distance(pos2) {
		return Math.sqrt(Math.pow(pos2.x - this.x, 2) + Math.pow(pos2.y - this.y, 2));
	}
}

class Branches {
	constructor(x1, y1, x2, y2) {
		this.position1 = new Position(x1, y1);
		this.position2 = new Position(x2, y2);
		this.type = "vein";
		this.open-ended = true;
		this.cAMP = 50;
	}

	changeType() {
		this.type = "translucent slime";
	}

	changeOpenEnded() {
		this.open-ended = false;
	}

	changeCAMP(add) {
		this.cAMP += add;
	} 
}

class Physarum {
	constructor(x, y, branchLenght) {
		this.startPos = new Position(x, y);
		this.branchLength = branchLength;
		this.branches = [];
	} 

	branching() {

	}

	senseFood(Foods) {
		//sense
		//branch towards
		//retract
	}
}

class Food {
	constructor(x, y, r, protein, carbohydrates, sensingRange) {
		this.position = new Position(x,y);
		this.radius = r;
		this.volume = Math.PI * Math.pow(this.radius, 2);
		this.protein = protein;
		this.carbohydrates = carbohydrates;
		let proteinPercentage = 100 / (protein + carbohydrates) * protein;
		this.foodRating = 100 - Math.sqrt(Math.pow(proteinPercentage - 66.66, 2));
		this.sensingRange = sensingRange;
	}

	sense(physarumPos) {
		if (physarumPos.distance(this.position) <= sensingRange)
			return true;
		else
			return false;
	}
}

//Utils
function drawLine(context, x1, y1, x2, y2)
{
    context.beginPath();
    context.moveTo(x1, y1); // Starting point
    context.lineTo(x2, y2); // Ending point
    context.stroke(); // Draw the line
    context.closePath();
}

//Get canvas element and context
const canvas = document.getElementById('Canvas');
canvas.width = window.innerWidth * 0.97;
canvas.height = window.innerHeight * 0.8;
const ctx = canvas.getContext('2d');

//Start the simulation
document.getElementById('startButton').addEventListener('click', () => {
	drawLine(ctx, 10, 10, 20, 20);	
});

//Stop the simulation
document.getElementById('stopButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
