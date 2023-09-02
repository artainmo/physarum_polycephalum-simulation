# Physarum Polycephalum simulation

Visual simulation of an intelligent slime-mold named Physarum Polycephalum, a biological form of intelligence without a nervous system.<br>
Has implications for intrinsic motivation of intelligent systems and path traversal.

## Workings
Here are the main characteristics of the Physarum polycephalum who are important for programming its simulation:
* It starts of at one point, branches like a coral until it senses from a distance food and starts to develop one branch towards that food. In the meanwhile the branches that went on wrong path retract and leave translucent slime, which signals the blob to not expand in that 'wrong' path again. When finding path to food, it finds the shortest path. Longer paths retract while the shortest one gains volume.
	* [See image](https://wyss-prod.imgix.net/app/uploads/2021/07/09120744/Physarum-spatial-decision-making-figure-1B.jpg?w=800&h=389&auto=format&q=90&fit=crop&crop=faces%2Centropy)
* Rhythmic pulsations are what makes the blob move. cAMP is responsible for those pulsations also called cytoplasmic streaming. The more cAMP the thicker and longer a vein/path becomes. Attractants increase cAMP while repellants decrease it.
	* When encountering food cAMP increases and the vein that transports the food becomes bigger. On the other hand open-ended tubes, which are not connected between the two food sources, are likely to disappear. Also, when two or more tubes connect the same two food sources, the longer tube is likely to disappear.
		* Slime mold prefer food 2/3 protein and 1/3 carbohydrates. If having the choice it will move faster and thus prioritize food with more optimal macronutrient composition. Or in general the largest food source.
	* On the other hand light has an aversive effect, slows down the blob at the place of light while branches outside the light still move at normal speed.
* The blob has an internal clock, the rhythmic pulsations may allow this. If temperature and/or humidity drops it must move more slowly to save energy. If this environmental change happens every hour it will learn to automatically slow down at those times.
* Blobs can also sense other blobs and in such times of competition will start moving faster to food source.

## Documentation
[A memory without a brain](https://www.sciencedaily.com/releases/2021/02/210223121643.htm)<br>
[How brainless slime molds redefine intelligence](https://www.nature.com/articles/nature.2012.11811)<br>
[This Weirdly Smart, Creeping Slime Is Redefining How We Understand Intelligence](https://www.sciencealert.com/this-weirdly-smart-creeping-slime-is-redefining-how-we-understand-intelligence)<br>
[Thinking without a brain](https://wyss.harvard.edu/news/thinking-without-a-brain/)<br>
[A survey on physarum polycephalum intelligent foraging behaviour and bio-inspired applications](https://link.springer.com/article/10.1007/s10462-021-10112-1)<br>
[Characteristics of Pattern Formation and Evolution in Approximations of Physarum Transport Networks](https://uwe-repository.worktribe.com/preview/980585/artl.2010.16.2.pdf)
