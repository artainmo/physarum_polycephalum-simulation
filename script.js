//Classes
class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	show() {
		return `(${this.x}, ${this.y})`;
	}

	isEqual(pos2) {
		return (this.x === pos2.x && this.y === pos2.y);
	}

	distance(pos2) {
		return Math.sqrt(Math.pow(pos2.x - this.x, 2) +
			Math.pow(pos2.y - this.y, 2));
	}

	substraction(pos2) {
		return new Position(this.x - pos2.x, this.y - pos2.y);
	}

	addition(pos2) {
		return new Position(this.x + pos2.x, this.y + pos2.y);
	}

	multiplication(pos2) {
		return new Position(this.x * pos2.x, this.y * pos2.y);
	}

	directionVector(pos2) {
		return new Position(pos2.x - this.x, pos2.y - this.y);
	}
}

class Branch {
	constructor(x1, y1, x2, y2) {
		this.position1 = new Position(x1, y1);
		this.position2 = new Position(x2, y2);
		this.type = "vein";
		this.open_ended = true;
		this.cAMP = 50;
		this.sensedFood = 0;
		this.inFood = false;
		this.length = this.position1.distance(this.position2);
		this.directionVector = this.position1.directionVector(this.position2,
																this.length);
		this.angle = Math.atan2(this.directionVector.x, this.directionVector.y);
	}

	show() {
		return "(" + this.position1.show() + " - " + this.position2.show() + ")";
	}

	changeType() {
		this.type = "translucent slime";
	}

	changeOpenEnded() {
		if (this.open_ended === true) {
			this.open_ended = false;
		} else { this.open_ended = true; }
	}

	changeCAMP(newCAMP) {
		this.cAMP = newCAMP;
	}

	getSensedFood(Foods) {
		if (this.type === "translucent slime" || this.open_ended === false) {
			this.sensedFood = 0;
		} else {
			this.sensedFood = 0;
			for (let i in Foods) {
				this.sensedFood += Foods[i].sense(this);
				if (Foods[i].arrived(this) && !this.inFood) {
					this.inFood = true;
				}
			}
		}
	}

	intersect(branch2) {
		if (branch2.position1.isEqual(this.position1) &&
				branch2.position2.isEqual(this.position2)) {
			if (branch2.inFood) { return false; } else { return true; }
		} else if (branch2.position1.isEqual(this.position1)) {
			return false;
		} else if (branch2.position2.isEqual(this.position1)) {
			return false;
		} else if (this.position2.distance(branch2.position1) < this.length
				|| this.position2.distance(branch2.position2) < this.length) {
			if (branch2.inFood) { return false; } else { return true; }
		} else {
			return false;
		}
	}
}

class Physarum {
	constructor(x, y, branchLength) {
		this.startPos = new Position(x, y);
		this.branchLength = branchLength;
		this.branches = [
			new Branch(x, y, x, y + branchLength),
			new Branch(x, y, x, y - branchLength),
			new Branch(x, y, x + branchLength, y),
			new Branch(x, y, x - branchLength, y)
		];
	}

	_branch_intersect(newBranch) {
		for (branch of this.branches) {
			if (newBranch.intersect(branch)) {
				return true;
			}
		}
		return false;
	}

	_open_ended(branch) {
		for (let i in this.branches) {
			if (this.branches[i].type === "vein" &&
						branch.position2.isEqual(this.branches[i].position1)) {
				if (branch.open_ended === true) { branch.changeOpenEnded(); }
				return false;
			}
		}
		if (branch.open_ended === false) { branch.changeOpenEnded(); }
		return true;
	}

	_retract(branch, index) {
		var iterations = 0;
		if (branch.cAMP < 0) { iterations = 2; }
		else if (branch.cAMP < 25) { iterations = 1; }
		for (let l=0; l < iterations; l++) {
			if (branch.type === "translucent slime"
					|| branch.open_ended === false
					|| branch.inFood) { break; }
			if (index < 4) { break; }
			branch.changeType();
			//Find prior branch for next round and to potentially set as open-ended
			for (let i in this.branches) {
				if (branch.position1.isEqual(this.branches[i].position2)) {
					branch = this.branches[i];
					index = i;
					break;
				}
			}
			this._open_ended(branch);
		}
	}

	_degrees_branch(from, degrees) {
		const radians = (degrees * Math.PI) / 180;
		const newAngle = from.angle + radians;
		const endPoint = from.position2.substraction(new Position(
			from.length * Math.sin(newAngle),
			from.length * Math.cos(newAngle)));
		let newBranch = new Branch(from.position2.x, from.position2.y,
									endPoint.x, endPoint.y);
		if (!this._branch_intersect(newBranch)) {
			this.branches.push(newBranch);
			return newBranch;
		}
		return null;
	}

	_branch(from) {
		var iterations = 0;
		if (from.cAMP >= 100) { iterations = 3; }
		else if (from.cAMP >= 75) { iterations = 2; }
		else if (from.cAMP >= 50) { iterations = 1; }
		for (let i=0; i < iterations; i++) {
			let newBranch = this._degrees_branch(from, 180);
			this._degrees_branch(from, 135);
			this._degrees_branch(from, 225);
			if (!newBranch) { break; }
			if (from.open_ended === true) { from.changeOpenEnded(); }
			from = newBranch;
		}
	}

	_branchingAndRetracting() {
		for (let i in this.branches) {
			if (this.branches[i].open_ended === true
						&& this.branches[i].type === "vein") {
				this._retract(this.branches[i], i);
				this._branch(this.branches[i]);
			}
		}
	}

	//Find food with most value relative to its quantity, quality and distance
	//Adapt cAMP in open_ended branches accordingly
	//No branches sense a food source => 50cAMP
	//Branches that sense the best food source => 75cAMP
	//Branches that sense a food source that isn't the best => 25cAMP
	//Branches that don't sense a food source while other do => 0cAMP
	//Branches that don't sense a food source while others are in one => -25cAMP
	//Once the best food source starts to be eaten,
	//its volume and range start to decrease.
	_adapt_branch_cAMP_to_foods(Foods) {
		for (let i in this.branches) {
			this.branches[i].getSensedFood(Foods);
		}
		let highestSensedFood = 0;
		let inFood = false;
		//Find highest sensedFood
		for (let i in this.branches) {
			if (highestSensedFood < this.branches[i].sensedFood) {
				highestSensedFood = this.branches[i].sensedFood;
			}
			if (this.branches[i].inFood) { inFood = true; }
		}
		//Give cAMP accordingly
		for (let i in this.branches) {
			if (highestSensedFood === 0) {
				this.branches[i].changeCAMP(50);
			} else if (this.branches[i].sensedFood === highestSensedFood) {
				this.branches[i].changeCAMP(75);
			} else if (this.branches[i].sensedFood > 0) {
				this.branches[i].changeCAMP(25);
			} else if (!inFood) {
				this.branches[i].changeCAMP(0);
			} else { this.branches[i].changeCAMP(-25); }
		}
	}

	advance(Foods) {
		//First adapt all open_ended branches cAMP levels in relation to food
		this._adapt_branch_cAMP_to_foods(Foods);
		//Second branch out the open_ended branches in relation to own cAMP levels
		this._branchingAndRetracting();
	}
}

class Food {
	constructor(x, y, r, protein, carbohydrates) {
		this.position = new Position(x,y);
		this.radius = r;
		let proteinPercentage = 100 / (protein + carbohydrates) * protein;
		this.foodRating = 100 - Math.sqrt(Math.pow(proteinPercentage - 66.66, 2));
		this._get_sensingRange_and_foodValue();
	}

	_get_sensingRange_and_foodValue() {
		// this.volume = Math.PI * Math.pow(this.radius, 2);
		this.sensingRange = (this.radius * 2) * 4.5;
		this.foodValue = this.foodRating * this.radius;
	}

	_eat(branch) {
		this.radius -= (this.radius / 100 * 5);
		if (this.radius <= branch.length*2) {
			this.radius = 0;
		}
		this._get_sensingRange_and_foodValue();
	}

	sense(branch) {
		if (this.radius <= 0) { return 0; }
		const distance = branch.position2.distance(this.position);
		if (distance <= this.sensingRange) {
			return (this.foodValue / (distance/10));
		}
		return 0;
	}

	arrived(branch) {
		if (this.radius <= 0) { return false; }
		if (branch.position2.distance(this.position) <= this.radius) {
			this._eat(branch);
			return true;
		}
		return false;
	}
}

//Utils
function drawLine(context, x1, y1, x2, y2, color='#000000')
{
	context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x1, y1); // Starting point
    context.lineTo(x2, y2); // Ending point
    context.stroke(); // Draw the line
    context.closePath();
}

function drawCircle(context, x, y, radius, color='#000000')
{
	context.strokeStyle = color;
	context.fillStyle = color;
	context.beginPath(); // Start a new path
	context.arc(x, y, radius, 0, 2 * Math.PI); // Create a circle
	context.stroke(); // Stroke the circle outline
	context.fill() //fill the circle
}

function drawMap(ctx, Physarums, Foods) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (food of Foods) {
		if (food.radius > 0) {
			drawCircle(ctx, food.position.x, food.position.y, food.radius,
				'#CCE2A3');
		}
	}
	for (physarum of Physarums) {
		drawCircle(ctx, physarum.startPos.x, physarum.startPos.y,
					physarum.branchLength, '#F9DC5C');
		for (branch of physarum.branches) {
			if (branch.type === "translucent slime") {
				drawLine(ctx, branch.position1.x, branch.position1.y,
					branch.position2.x, branch.position2.y, '#F3FFBD');
			} else if (branch.open_ended === false) {
				drawLine(ctx, branch.position1.x, branch.position1.y,
					branch.position2.x, branch.position2.y, '#F9DC5C');
			} else {
				drawLine(ctx, branch.position1.x, branch.position1.y,
					branch.position2.x, branch.position2.y, '#DF928E');
			}
		}
	}
}

//Get canvas element and context
const canvas = document.getElementById('Canvas');
canvas.width = window.innerWidth * 0.97;
canvas.height = window.innerHeight * 0.8;
const ctx = canvas.getContext('2d');
var g_interval;

//Start simulation
var g_slime_molds;
var g_foods;

function define_obj1() {
	slime_mold = new Physarum(canvas.width/2, canvas.height/2,
				Math.min(canvas.width, canvas.height)/100);
	g_slime_molds = [slime_mold];
	food = new Food(canvas.width - (canvas.width/15),
							canvas.height - (canvas.height/6),
							Math.min(canvas.width, canvas.height)/15,
							34, 25);
	g_foods = [food];
}

function define_obj2() {
	slime_mold = new Physarum(canvas.width/2, canvas.height/2,
				Math.min(canvas.width, canvas.height)/100);
	g_slime_molds = [slime_mold];
	food = new Food(canvas.width - (canvas.width/15),
							canvas.height - (canvas.height/6),
							Math.min(canvas.width, canvas.height)/15,
							34, 25);
	food2 = new Food(canvas.width - (canvas.width/15),
							canvas.height/6,
							Math.min(canvas.width, canvas.height)/15,
							34, 25);
	g_foods = [food, food2];
}

var g_maps = [define_obj1, define_obj2];
var g_map_index = 0;

function run() {
	if (!g_foods.some((fo) => { return fo.radius !== 0 })) {
		clearInterval(g_interval);
		startButton.childNodes[0].nodeValue = "Start";
	}
	drawMap(ctx, g_slime_molds, g_foods);
	for (let i in g_slime_molds) {
		g_slime_molds[i].advance(g_foods);
	}
	console.log(g_foods[1]);
	console.log(Math.min(canvas.width, canvas.height)/100);
}

//Handle HTML buttons
var startButton = document.getElementById('startButton');
var nextButton = document.getElementById('nextButton');

function continues() {
	startButton.childNodes[0].nodeValue = "Pause";
	g_interval = setInterval(() => {
		run()
	}, 300);
}
function start() { //Draw static map to show
	g_maps[g_map_index]();
	drawMap(ctx, g_slime_molds, g_foods);
}

function pause() {
	startButton.childNodes[0].nodeValue = "Continue";
	clearInterval(g_interval);
}

startButton.addEventListener('click', () => {
	if (startButton.childNodes[0].nodeValue === "Start") {
		start();
		continues();
	} else if (startButton.childNodes[0].nodeValue === "Pause") {
		pause();
	} else if (startButton.childNodes[0].nodeValue === "Continue") {
		continues();
	}
});

start(); //Draw inital static map to show

nextButton.addEventListener('click', () => {
	startButton.childNodes[0].nodeValue = "Start";
	clearInterval(g_interval);
	if (g_map_index >= g_maps.length-1) {
		g_map_index = 0;
	} else {
		g_map_index++;
	}
	start();
});
