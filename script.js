//Classes
class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
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
			for (i in Foods) {
				this.sensedFood += Foods[i].sense(this);
				if (!this.inFood && Foods[i].arrived(this)) { 
					this.inFood = true; 
				}
			}
		}
	}

	intersect(branch2) {
		let determinant = this.directionVector.x * branch2.directionVector.y
					- branch2.directionVector.x * this.directionVector.y;
		if (determinant === 0) {
			if (this.position1.x === branch2.position1.x && 
					this.position1.y === branch2.position1.y 
					|| this.position1.x === branch2.position2.x &&
					this.position1.y === branch2.position2.y
					|| this.position2.x === branch2.position1.x &&
					this.position2.y === branch2.position1.y
					|| this.position2.x === branch2.position2.x &&
					this.position2.y === branch2.position2.y) {
				return true;
			}
			return false;
		}
		const t1 = ((branch2.position1.x - this.position1.x) * 
			branch2.directionVector.y - 
			(branch2.position1.y - this.position1.y) * 
			branch2.directionVector.x) / determinant;
		const t2 = ((branch2.position1.x - this.position1.x) * 
			this.directionVector.y - 
			(branch2.position1.y - this.position1.y) * 
			this.directionVector.x) / determinant;
		if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
			return true;
		}
		return false;
	}
}

class Physarum {
	constructor(x, y, branchLenght) {
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
			if (branch.intersect(newBranch)) {
				return true;
			}
		}
		return false;
	}

	_open_ended(branch) {
		for (i in this.branches) {
			if (branch.position2.isEqual(this.branches[i].position1)) {
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
			if (branch.type === "translucent slime") { break; }
			if (index < 4) { break; }
			branch.changeType();
			if (branch.open_ended === false) {
				for (i in this.branches) {
					if (branch.position2.isEqual(this.branches[i].position1)
							&& this.branches[i].type === "vein") {
						this.branches[i].changeType();
					}
				}
			}
			for (i in this.branches) {
				if (branch.position1.isEqual(this.branches[i].position2)) {
					branch = this.branches[i];
					index = i;
					break;
				}
			}
			this._open_ended(branch);
		}
	}

	_branch(from) {
		var iterations = 0;
		if (from.cAMP >= 100) { iterations = 3; } 
		else if (from.cAMP >= 75) { iterations = 2; }
		else if (from.cAMP >= 50) { iterations = 1; }
		for (let i=0; i < iterations; i++) {
			from.changeOpenEnded();
			let endPoint1 = from.position2.addition(from.directionVector);
			let newBranch1 = new Branch(from.position2.x, from.position2.y,
										endPoint1.x, endPoint1.y);
			if (!this._branch_intersect(newBranch1)) {
				this.branches.push(newBranch1);
			}
			let vector135degrees = new Position(-0.7071, 0.7071);
			let endPoint2 = from.position2.addition(
				from.directionVector.multiplication(vector135degrees));
			let newBranch2 = new Branch(from.position2.x, from.position2.y,
										endPoint2.x, endPoint2.y);
			if (!this._branch_intersect(newBranch2)) {
				this.branches.push(newBranch2);
			}
			let vector225degrees = new Position(0.7071, -0.7071);
			let endPoint3 = from.position2.addition(
				from.directionVector.multiplication(vector225degrees));
			let newBranch3 = new Branch(from.position2.x, from.position2.y,
										endPoint3.x, endPoint3.y);
			if (!this._branch_intersect(newBranch3)) {
				this.branches.push(newBranch3);
			}
			from = newBranch1;
		}
	}

	_branchingAndRetracting() {
		for (i in this.branches) {
			if (this.branches[i].open_ended === true 
						&& this.branches[i].type === "vein") {
				this._retract(this.branches[i]);
				this._branch(this.branches[i]);
			}
		}
	}

	//Find food with most value relative to its quantity and quality
	//Adapt cAMP in open_ended branches accordingly		
	//No branches sense a food source => 50cAMP
	//Branches that sense the best food source => 75cAMP
	//Branches that sense a food source that isn't the best => 25cAMP
	//Branches that don't sense a food source while other do => 0cAMP
	//Branches that don't sense a food source while others are in one => -25cAMP
	//Once the best food source starts to be eaten, 
	//its volume and range start to decrease.
	_adapt_branch_cAMP_to_foods(Foods) {
		for (i in this.branches) {
			this.branches[i].getSensedFood(Foods);
		}
		let highestSensedFood = 0;
		let inFood = false;
		//Find highest sensedFood
		for (i in this.branches) {
			if (highestSensedFood < this.branches[i].sensedFood) {
				highestSensedFood = this.branches[i].sensedFood;
			}
			if (this.branches[i].inFood) { inFood = true; }
		}
		//Give cAMP accordingly
		for (i in this.branches) {
			if (highestSensedFood === 0) {
				this.branches[i].changeCAMP(50);
			} else if (this.branches[i].sensedFood === highestSensedFood) {
				if (this.branches[i].inFood) { 
					this.branches[i].changeCAMP(25);	
				} else { this.branches[i].changeCAMP(75); }
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
	constructor(x, y, r, protein, carbohydrates, sensingRange) {
		this.position = new Position(x,y);
		this.radius = r;
		this._get_volume_and_sensingRange_and_foodValue();
		let proteinPercentage = 100 / (protein + carbohydrates) * protein;
		this.foodRating = 100 - Math.sqrt(Math.pow(proteinPercentage - 66.66, 2));
	}

	_get_volume_and_sensingRange_and_foodValue() {
		this.volume = Math.PI * Math.pow(this.radius, 2);
		this.sensingRange = (this.radius * 2) * 4.5;
		this.foodValue = this.foodRating * this.radius;
	}

	_eat() {
		this.radius -= (this.radius / 100 * 5);
		if (this.radius < 0) { this.radius = 0; }
		this._get_volume_and_sensingRange();
	}

	sense(branch) {
		if (this.radius <= 0) { return 0; }
		if (branch.position2.distance(this.position) <= this.sensingRange) {
			return this.foodValue;
		}
		return 0;
	}

	arrived(branch) {
		if (this.radius <= 0) { return false; }
		if (branch.position2.distance(this.position) <= this.radius) {
			this._eat();
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
	context.beginPath(); // Start a new path
	context.arc(x, y, radius, 0, 2 * Math.PI); // Create a circle
	context.stroke(); // Stroke the circle outline
	context.fill() //fill the circle
}

function drawMap(ctx, Physarums, Foods) {
	for (physarum of Physarums) {
		drawCircle(ctx, physarum.startPos.x, physarum.startPos.y,
					physarum.branchLength, '#F9DC5C');
		for (branch of physarum.branches) {
			if (branch.type === "vein") {
				drawLine(ctx, branch.position1.x, branch.position1.y,
					branch.position2.x, branch.position2.y, '#F9DC5C');
			} else {
				drawLine(ctx, branch.position1.x, branch.position1.y,
					branch.position2.x, branch.position2.y, '#F3FFBD');
			}
		}
	}
	for (food in Foods) {
		if (food.radius > 0) {
			drawCircle(ctx, food.position.x, food.position.y, food.radius,
				'#DF928E');
		}
	}
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
