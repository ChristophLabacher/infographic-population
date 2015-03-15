 /*-----------------------------------------------------------------------------
	 						infographic: population
--------------------------------------------------------------------------------
Christoph Labacher		IG2		Sommersemester 2014		V. 5.0 – 140709 2126
------------------------------------------------------------------------------*/

////////////////////////////////////
////	COUNTRY					////
////////////////////////////////////

function Country(i, n, c, a, p, r, e, m, g) {
	// Basic Info
	this.id = i;
	this.name = n;
	this.color = new Color(c);
	this.addSpeed = a;

	// Rhythm Info
	this.rhythm = this.addSpeed/1000;
	this.isRhythm = false;

	// Basic Vars
	this.ballIds = 1;
	this.ball1Count = 0;
	this.ball10Count = 0;
	this.ball100Count = 0;
	this.ballRadius = 20;
	this.joinId = 1;

	this.radius = r;
	this.minRadius = r;
	this.maxRadius = r;
	this.positionNo = p;
	this.position = new Point();
	this.velocity = new Point();

	this.counter = 0;

	// Special Vars
	this.mortality = m;
	this.male = g;

	// Switch to countryLayer
	countryLayer.activate();

	// Looks
	this.color = c;
	this.path = new Path();
   	this.path.fillColor = this.color;
   	this.path.fillColor.alpha = 0;
   	this.minBrightness = 0.35;
   	this.path.fillColor.brightness = this.minBrightness;
   	this.path.strokeColor = this.color;
   	this.path.strokeColor.alpha = 0;
   	this.path.strokeColor.brightness = this.minBrightness;
   	this.path.strokeWidth = this.radius / 8;
   	this.lightUp = false;

	// Shape
	this.goodToGo = false;
	this.maxNumSegment = e;
	this.numSegment = 40;
	this.boundOffset = [];
	this.sidePoints = [];

	// For each segment create a new point, and a corresponding direction and offset from the center
	for (var i = 0; i < this.numSegment; i ++) {
		this.path.add(new Point());

		// Initial segment-direction
		this.sidePoints.push(new Point({
			angle: 360 / this.numSegment * i,
			length: 1
		}));

		// Initial offset is the radius
		this.boundOffset.push(this.radius);	// On change: Update ball's react2 function!
	}

	this.path.closed = true;

	// Setup debugging Text
	this.text = new PointText(this.position);
	this.text.fillColor = 'black';

	// Toggle mouse down
	this.path.onMouseDown = function(event) {
		countryMouseDownId = this.id;
	}
}

Country.prototype = {
	// Update the country
	iterate: function() {

		// Debugging Text
		//this.text.content = "1: " + this.ball1count + "\n 10: " + this.ball10count + "\n 100: " + this.ball100count;
		//this.text.position = this.position;

		// If the max Radius hasn't been reached yet increase radius
		this.maxRadius = this.minRadius * (screenPosition*screenPosition)/5 + this.minRadius;
		if (this.radius < this.maxRadius)	{
		 	this.radius += (this.maxRadius-this.radius) / 100;
		}

	   	// Get the lightUpSpeed according to the current global rhythm
	   	var lightUpSpeed = (rhythm / this.rhythm) * 0.005;
	   	if (lightUpSpeed > 0.2)	{
				lightUpSpeed = 0.2;
	   	} else if (lightUpSpeed < 0.01)	{
				lightUpSpeed = 0.01;
	   	}

	   	// Light up the country
	   	var brightness = this.path.fillColor.brightness;
	   	if (this.lightUp)	{
	   		if (brightness < this.minBrightness + 0.2)	{
					brightness += lightUpSpeed;
	   		}
				else	{
				 	this.lightUp = false;
				}
	   	} else if (brightness > this.minBrightness)	{
				brightness -= lightUpSpeed;
	   	}
	   	this.path.fillColor.brightness = brightness;
	   	this.path.strokeColor.brightness = brightness;

	   	// If the country is clicked upon make this countrys rhythm the global rhythm
	   	if (countryMouseDownId == this.path.id)	{
				for (var i = 0; i < countries.length; i++) {
		 	   countries[i].isRhythm = false;
			}
			 this.isRhythm = true;
			 countryMouseDownId = 20000;
			 console.log(this.name + " isRhythm");
	   	}

	   	// If this country is setting the global rhythm give it a border
	   	if (this.isRhythm)	{
	   		this.path.strokeColor.brightness = brightness-0.2;
	   	} else	{
				this.path.strokeColor.brightness = brightness;
	   	}

		 // Add new balls in the defined interval
		 if (this.counter >= this.addSpeed)	{
			 if(this.id != 0)	{
		 		this.addBall();
		 	}
		 	this.counter = 0;
		 	this.lightUp = true;
		 }

		 //! Join Check
		 // After ten balls have been created, tell them to join each other
		 if (this.ball1Count >= 10)	{
		 	var joinCount = 0;
		 	var color = Math.random() * 360;
		 	for (var i = 0; i < balls.length; i++) {
		 		// Get ten of this country's size 1 balls, that aren't joining yet
		 		if (balls[i].countryId == this.id && balls[i].size == 1 && joinCount < 10 && balls[i].shouldJoin == false)	{
		 			balls[i].shouldJoin = true;
		 			balls[i].shouldJoinId = this.joinId;
		 			balls[i].maxSize = 10;
		 			joinCount++;
		 		}
		 	}

		 	// Reset the ball count, increase the join id
		 	this.ball1Count -= 10;
		 	this.joinId++;
		 }

		 // After ten balls size ten have been created, tell them to join each other
		 if (this.ball10Count >= 10)	{
		 	var joinCount = 0;
		 	for (var i = 0; i < balls.length; i++) {
		 		// Get ten of this country's size 10 balls, that aren't joining yet
		 		if (balls[i].countryId == this.id && balls[i].size == 10 && joinCount < 10 && balls[i].shouldJoin == false)	{
		 			balls[i].shouldJoin = true;
		 			balls[i].shouldJoinId = this.joinId;
		 			balls[i].maxSize = 100;
		 			balls[i].isDying = false;
		 			balls[i].hasTarget = false;
		 			joinCount++;
		 		}
		 	}

		 	// Reset the ball count, increase the join id
		 	this.ball10Count -= 10;
		 	this.joinId++;
		 }

		 // After ten balls size 100 have been created, tell them to join each other
		 if (this.ball100Count >= 10)	{
		 	var joinCount = 0;
		 	for (var i = 0; i < balls.length; i++) {
		 		// Get ten of this country's size 100 balls, that aren't joining yet
		 		if (balls[i].countryId == this.id && balls[i].size == 100 && joinCount < 10 && balls[i].shouldJoin == false)	{
		 			balls[i].shouldJoin = true;
		 			balls[i].shouldJoinId = this.joinId;
		 			balls[i].maxSize = 1000;
		 			balls[i].isDying = false;
		 			balls[i].hasTarget = false;
		 			joinCount++;
		 		}
		 	}

		 	// Reset the ball count, increase the join id
		 	this.ball100Count -= 10;
		 	this.joinId++;
		 }

		this.updateShape();
	},

	// Initialisation sqeuence
	buildUp: function()	{

			// If this is not visible yet fade it in
  		   	if (this.path.fillColor.alpha < 1)	{
			  	this.path.fillColor.alpha += 0.01;
			  	this.path.strokeColor.alpha += 0.01	;
		 	} else	{
			  	if (this.numSegment > this.maxNumSegment)	{

					// Shape
					this.boundOffset = [];
					this.sidePoints = [];

					// For each segment create a new point, and a corresponding direction and offset from the center
					for (var i = 0; i < this.numSegment; i ++) {
						this.path.add(new Point());

						// Initial segment-direction
						this.sidePoints.push(new Point({
							angle: 360 / this.numSegment * i,
							length: 1
						}));

						// Initial offset is the radius
						this.boundOffset.push(this.radius);
					}

					// In the defined interval remove a segment
					this.removeInterval = Math.round(150 / (40 - this.maxNumSegment +1));
				   if(frameCount % this.removeInterval == 0)	{
				   		this.numSegment--;
					}

			  	} else	{
				   	this.goodToGo = true;
			  	}

				}
		this.updateShape();
	},


	// Add a new ball
	addBall: function()	{
		 var position = new Point(this.position.x, this.position.y)
		 var velocity = new Point({
		 	angle: 360 * Math.random(),
		 	length: Math.random() * 2 + 4
		 });
		 balls.push(new Ball(this.ballIds, this.id, position, velocity, this.ballRadius, this.color, this.mortality, this.male));
		 this.ballIds++;
		 this.ball1Count++;
	},

	// Update shape
	updateShape: function()	{

		// Update position
		var x = view.center.x + (view.size.width/(countries.length+1))*this.positionNo;
		var y = height / 2;
		this.position = new Point(x, y);

		// Switch to countryLayer
		countryLayer.activate();

		// For each segment
		var segments = this.path.segments;
		for (var i = 0; i < segments.length; i ++)	{
			this.boundOffset[i] = this.radius;
			// Calculate the position of the segment
			segments[i].point = this.getSidePoint(i);
		}
   	},

	// Calculate the points of the segment (Ball center + segment-direction * this segments distance from the center)
	getSidePoint: function(index) {
		return this.position + this.sidePoints[index] * this.boundOffset[index];
	},

	// Get the offset of the passed point
	getBoundOffset: function(b) {
		 var diff = this.position - b;
		 var angle = (diff.angle + 180) % 360;
		 return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
	}
}


////////////////////////////////////
////	BALL					////
////////////////////////////////////

function Ball(id, cId, p, v, r, c, m, g) {
	// Basic info
	this.id = id;
	this.countryId = cId;
	this.size = 1;
	this.isAlive = true;
	this.isDying = false;

	// Basic vars
	this.position = p;
	this.velocity = v;
	this.maxVelocity = 3;
	this.minVelocity = 2;
	this.radius = 1;
	this.maxRadius = r;

	// Special Vars
	this.mortality = m;
	this.male = g;

	// Target
	// Target is set once the ball has touched the ball its supposed to join and is dying
	this.hasTarget = false;
	this.target = new Point();
	this.targetRadius;
	this.targetId;

	// MoveTo
	// MoveTo is set once the ball is supposed to be joining
	this.hasMoveTo = false;
	this.moveTo = new Point();
	this.moveToRadius;
	this.moveToId;

	// Join
	this.shouldJoin = false;
	this.shouldJoinId;
	this.maxSize = 1;

	// Switch to ballLayer
	ballLayer.activate();

	// Looks
	this.color = c;
	this.path = new Path();
   	this.path.fillColor = this.color;
   	this.path.strokeColor = this.color;
   	this.path.strokeWidth = 2;

	// Shape
	this.numSegment = Math.floor((2*this.maxRadius*Math.PI)/(this.maxRadius/2));
	this.boundOffset = [];
	this.boundOffsetBuff = [];
	this.sidePoints = [];

	// For each segment create a new point, and a corresponding direction and offset from the center
	for (var i = 0; i < this.numSegment; i ++) {
		this.path.add(new Point());

		// Initial segment-direction
		this.sidePoints.push(new Point({
			angle: 360 / this.numSegment * i,
			length: 1
		}));

		// Initial offset is the radius
		this.boundOffset.push(this.radius);
		this.boundOffsetBuff.push(this.radius);
	}

	this.path.closed = true;

	// Setup debugging text
	this.text = new PointText(this.position);
	this.text.fillColor = 'black';

	// Toggle mouse down
	this.path.onMouseDown = function(event) {
		ballMouseDownId = this.id;
	}

}

Ball.prototype = {
	// Update the Ball
	iterate: function() {

		// Debugging size
		//this.text.content = "Size: " + this.size + "\n MaxSize: " + this.maxSize + "\n ID: " + this.id + "\n JID: " + this.shouldJoinId + "\n C: " + this.countryId + "\n SJ+: " + this.shouldJoin;
		//this.text.position = this.position;

		// If the country has reached its final size reset all values
		if (this.size >= this.maxSize) {
			this.hasMoveTo = false;
			this.hasTarget = false;
			this.shouldJoin = false;
		}

		// If the max Radius hasn't been reached yet increase radius
		if (this.radius < this.maxRadius)	{
		 	this.radius += 0.5;
		}

		// Keep the speed below the max and above the min speed
		if (this.velocity.length > this.maxVelocity)	{
			this.velocity.length = this.maxVelocity;
		}
		if (this.velocity.length < this.minVelocity)	{
			this.velocity.length = this.minVelocity;
		}

		//! Target and MoveTo finding

		// If it has reached is destination give it a new random direction
		if (this.position.getDistance(this.moveTo) <= this.radius)	{
		 	this.hasMoveTo = false;
		}

		// If it has a target align the velocity to get there
		if (this.hasTarget)	{
			var buff = this.velocity.length;
		 	this.velocity = (this.target - this.position);
		 	this.velocity.length = buff+2;
		}

		// Get move to
		for (var i = 0; i < balls.length; i++)	{
			// If this has no target yet
			// If the balls should be joining, come from the same country, have the same join Id and the other ball is bigger set it as a moveTo
			if (this.isDying == false && this.shouldJoin && balls[i].shouldJoin && this.shouldJoinId == balls[i].shouldJoinId && this.countryId == balls[i].countryId) {
				// && this.size <= balls[i].size)	{

		 		var smallestDist = 50000000;
		 		var dist = this.position.getDistance(balls[i].position);

		 		if (dist > 0 && dist < smallestDist && dist > this.radius + balls[i].radius)	{
			  		smallestDist = dist;
			  		this.hasMoveTo = true;
			  		this.moveTo = balls[i].position;
			  		this.moveToRadius = balls[i].radius;
			  		this.moveToId = balls[i].id;
		 		}

			}
		}


		// If it has a moveTo align the velocity to get there
		if (this.hasMoveTo == true && this.isDying == false)	{
			var dist = this.position.getDistance(this.moveTo);

			if (dist > this.radius + this.moveToRadius && this.id != this.moveToId)	{
		 		var buff = this.velocity.length;
			  	this.velocity = (this.moveTo - this.position);
			  	this.velocity.length = buff;
		 	}
		}

		// Move
		this.position += this.velocity;

		// Update the shaper
		this.updateShape();

		// Bounce from Borders
		this.checkBorders();

		// If this ball is dead remove it's path
		if (this.isAlive == false)	{
		 	this.path.remove();
		 	this.text.remove()
		}

		//! On mouse down toggle zoom in
	   	if (ballMouseDownId == this.path.id)	{

	   		if (this.size > 1)	{
				zoom.position = this.position;
				zoom.isActive = true;
				zoom.size = this.size;
				zoom.color = this.color;
				zoom.minRadius = this.radius;
				zoom.mortality = this.mortality;
				zoom.male = this.male;
			}
	   	}

	},

	// Update shape
	updateShape: function()	{
		// Switch to ballLayer
		ballLayer.activate();

		// For each segment
		var segments = this.path.segments;
		for (var i = 0; i < segments.length; i ++)	{
			// Calculate the position of the segment
			segments[i].point = this.getSidePoint(i);
		}

		this.path.smooth();

		// For each segment of the shape
		for (var i = 0; i < this.numSegment; i ++) {
			// If the segment is closer to the center than 1/4th of the radius reset it to 1/4th of the radius
			  if (this.boundOffset[i] < this.radius / 4)	{
			  	this.boundOffset[i] = this.radius / 4;
			  }

			  var next = (i + 1) % this.numSegment;
			  var prev = (i > 0) ? i - 1 : this.numSegment - 1;
			  var offset = this.boundOffset[i];

			  // Move the offset of the segment towards the radius (make the shape reset itself)
			  offset += (this.radius - offset) / 15;
			  // Move the offset towards the offset of the previous and next segment
			  offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
			 this.boundOffsetBuff[i] =	this.boundOffset[i] = offset;
		}
	},

	// Make the balls react to each other
	react: function(b) {
		if (b.isDying == false && this.targetId != b.id && this.moveToId != b.id)	{
			// Get the distance of the two balls
			  var dist = this.position.getDistance(b.position);

			  // If the balls touch
			  if (dist < this.radius + b.radius && dist != 0) {

			  	// Get the size of the overlapping part
			  	var overlap = this.radius + b.radius - dist;
			  	// Get the direction in which they overlap
			  	var direc = (this.position - b.position).normalize(overlap * 0.015);
			  	// Make them bounce of each other
			  	this.velocity += direc;
			  	b.velocity -= direc;

				// Calculate and update the bounds for both
			  	this.calcBounds(b);
			  	b.calcBounds(this);
			  	this.updateBounds();
			  	b.updateBounds()
		 	}
		 }
	},

	// Make the balls react to countries
	reactTwo: function(b) {
			  var dist = this.position.getDistance(b.position);

			  // If the ball touches the country
			  if (dist < this.radius + b.radius + b.path.strokeWidth && dist != 0) {

			  	// Get the size of the overlapping part
			  	var overlap = this.radius + b.radius - dist;
			  	// Get the direction in which they overlap
			  	var direc = (this.position - b.position).normalize(overlap * 0.015);
			  	// Make the ball bounce off
			  	this.velocity += direc;

				// Calculate and update the bounds for the ball
			  	this.calcBounds(b);
			  	this.updateBounds();
		 	}
	},

	join: function(b) {
		// Get the distance of the two balls
		var dist = this.position.getDistance(b.position);

		// If the balls touch
		if (dist < this.radius + b.radius && this.id != b.id) {

			// If the balls should be joining, come from the same country and have the same join Id (= are from the same pack of 10) join them
			if(this.isDying == false && this.shouldJoin && b.shouldJoin && this.shouldJoinId == b.shouldJoinId && this.countryId == b.countryId) 	{
				// && this.radius >= b.radius)	{

				// Only if b is touching the ball for the first time
				if (b.isDying == false)	{

					// Calculate and set the new radius
					// Surface area of a + surface area of b
					var aA = Math.PI * (this.maxRadius*this.maxRadius);
					var aB = Math.PI * (b.maxRadius*b.maxRadius);
					var aAnew = aA + aB;
					// Squareroot of new surface area divided by Pi
					var rAnew = Math.sqrt((aAnew / Math.PI));
					this.maxRadius = rAnew;

					// Calculate the new amount of segments
					this.numSegment = Math.floor((2*this.maxRadius*Math.PI)/(this.maxRadius/2));

					// Clear all previous data
					this.boundOffset = [];
					this.boundOffsetBuff = [];
					this.sidePoints = [];
					 	this.path.removeSegments();

					// For each segment create a new point, and a corresponding direction and offset from the center
					for (var i = 0; i < this.numSegment; i ++) {
						this.path.add(new Point());

						// Initial segment-direction
						this.sidePoints.push(new Point({
							angle: 360 / this.numSegment * i,
							length: 1
						}));

						// Initial offset is the radius
						this.boundOffset.push(this.radius);
						this.boundOffsetBuff.push(this.radius);
					}

					this.path.closed = true;

					// Mark b as touched ("is dying")
					b.isDying = true;
					b.hasTarget = true;
					b.targetId = this.id;
					b.hasMoveTo = false;
				}

				// Set this ball as b's target
				b.target = this.position;
				b.targetRadius = this.radius;
				b.targetId = this.id;

			}

			// If b has been touched
			if (b.isDying && b.targetId == this.id)	{
				// Set this ball as b's target∏
				b.target = this.position;
				b.targetRadius = this.radius;
			}

			// If b has reached the ball kill it
			if (b.targetId == this.id && b.isDying && dist <= this.radius - b.radius)	{

				// Increase the balls size
				this.size += b.size;

				// Increase the countries ball count
				if (this.size == 10)	{
		 			countries[this.countryId].ball10Count++;
				}

				if (this.size == 100)	{
		 			countries[this.countryId].ball100Count++;
				}

				// Before b i killed make sure no ball is searching for it
				for (var i = 0; i < balls.length; i++)	{
					if (balls[i].targetId == b.id && balls[i].shouldJoinId == b.shouldJoinId && balls[i].countryId == b.countryId)	{
						balls[i].isDying == false;
						balls[i].hasTarget == false;
					}
				}

				   // Kill b
				   b.isAlive = false;
			}
		}
	},

	// Bounce from borders
	checkBorders: function() {
		 var size = view.viewSize;

		 // Right
		 if (this.position.x + (this.radius) >= view.center.x + view.size.width/2)	{
		 	if (this.velocity.angle > 180)	{
		 		this.velocity.angle += (180-this.velocity.angle) + this.velocity.angle;
		 	} else	{
			  	this.velocity.angle += (180-this.velocity.angle) - this.velocity.angle;
		 	}
		 	this.position.x = (view.center.x + view.size.width/2) - this.radius - 1;
		 }

		 // Left
		 if (this.position.x - (this.radius) <= view.center.x - view.size.width/2)	{
		 	if (this.velocity.angle > 180)	{
		 		this.velocity.angle += (180-this.velocity.angle) + this.velocity.angle;
		 	} else	{
			  	this.velocity.angle += (180-this.velocity.angle) - this.velocity.angle;
		 	}
		 	this.position.x = (view.center.x - view.size.width/2) + this.radius + 1;
		 }

		// Bottom
		 if (this.position.y + (this.radius) >= view.center.y + view.size.height/2)	{
			  	this.velocity.angle *= -1;
			  	this.position.y = (view.center.y + view.size.height/2) - this.radius - 1;
		 }

		 // Top
		 if (this.position.y - (this.radius) <= view.center.y - view.size.height/2)	{
			  	this.velocity.angle *= -1;
			  	this.position.y = (view.center.y - view.size.height/2) + this.radius + 1;
		 }
	},

	// Calculate the points of the segment (Ball center + segment-direction * this segments distance from the center)
	getSidePoint: function(index) {
		return this.position + this.sidePoints[index] * this.boundOffset[index];
	},


	// Update the bounds of the ball
	updateBounds: function() {
		// For each segments set the offset equal to the offset it should have.
		 for (var i = 0; i < this.numSegment; i ++)
		 	this.boundOffset[i] = this.boundOffsetBuff[i];
	},

	// Get the offset of the passed point
	getBoundOffset: function(b) {
		 var diff = this.position - b;
		 var angle = (diff.angle + 180) % 360;
		 return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
	},

	// Calculate the new bounds
	calcBounds: function(b) {
		// For each segment
		 for (var i = 0; i < this.numSegment; i ++) {

		 	// Get the position of the segment
		 	var tp = this.getSidePoint(i);

		 	// Get the bound offset of the segment of ball b closest to this segment
		 	var bLen = b.getBoundOffset(tp);

		 	// Get the distance of the segment point and ball b
		 	var td = tp.getDistance(b.position);

		 	// If the point is closer to the center of ball b than its own bound
		 	if (td < bLen) {

		 		// This segments bound offset should shrink by half the difference
		 		this.boundOffsetBuff[i] -= (bLen	 - td) / 2;
		 	}
		 }
	}
}

////////////////////////////////////
////	Zoom					////
////////////////////////////////////

function Zoom() {
	this.position = new Point();
	this.isActive = false;
	this.radius = 1;
	this.size = 10;
	this.color = new Color("#FF0000");
	this.path = new Path();
	this.minRadius = 10;
	this.fullSize = false;
	this.isSetup = false;
	this.balls = [];
	this.mortality = 1;
	this.male = 1;
}

Zoom.prototype = {
	iterate: function() {

		// Activate zoom layer
	   	zoomLayer.activate();

	   	// Remove the path and create it new
		this.path.remove();
		this.path = new Path.Circle(this.position, this.radius)
		this.path.fillColor = this.color;

		// If the zoom is active
		if (this.isActive)	{
			// If it hasn't reached the full size yet make it grow
		 	if (this.radius < view.size.width*1.5 || this.radius < view.size.height*1.5)	{
			  	this.radius += view.size.width/70;
			  	zoomTick = false;
		 	} else	{
				 	this.fullSize = true;
		 	}
		 // If the zoom is inactive
		 } else	{
			// If it hasn't reached the minimal size yet make it shrink
		 	if (this.radius > this.minRadius)	{
			  	this.radius -= view.size.width/70;
				   this.fullSize = false;
			  }
			  else	{
			  	// If th minRadius is reached reset everything
		 		zoomTick = true;
			  	ballMouseDownId = 200000;
			  	this.path.remove();
				this.path = new Path();
				this.isSetup = false;
			  }
		 }

		// If the fullSize is reached
			if (this.fullSize)	{
				// and the setup isn't finished yet
				if(this.isSetup == false)	{

					// Activeate zoom layer
			 		zoomLayerTop.activate();

			 		// Reset baals array
				  	this.balls = [];

				  	// Create small shapes
				  	for (var i = 0; i < this.size; i++)	{

				  		// Get random gender
				  		if (Math.random() < this.male)	{
				   	   	this.balls[i] = new Path.RegularPolygon(new Point (10,10), 4, 30);
				  		} else	{
		 				 	this.balls[i] = new Path.RegularPolygon(new Point (10,10), 3, 30);
				  		}

				  		// Get child mortality
				   	this.balls[i].fillColor = this.color;
				   	if (Math.random() < this.mortality)	{
							this.balls[i].fillColor.brightness -= 0.6;
				   	} else	{
							this.balls[i].fillColor.brightness -= 0.1;
				   	}
				   	this.balls[i].fillColor.alpha = 0;
				  	}

				  	// Set up the grid
				  	var ySpace = height / (Math.ceil(this.balls.length / 10));
				  	var xSpace = (width / 11);

				  	if (ySpace < xSpace)	{
				   	var space = ySpace;
				  	} else	{
				   	var space = xSpace;
				  	}

				  	// Set up the balls in the grid
				for (var j = 0; j < Math.ceil(this.balls.length / 10); j++) 	{
				  		for (var i = 0; i < 10; i++)	{
				  			if (j*10 + i < this.balls.length)	{
				  				var x = space * i + (width - 9 * space)/2;
				  				var y = space * j + (height - (Math.ceil(this.balls.length / 10)-1) * space)/2;
				   			this.balls[j*10 + i].position = new Point(x, y);
				   		}
				  		}
				}

				  	this.isSetup = true;
			}

			// Fade the balls in
			for (var i = 0; i < this.balls.length; i++) 	{
				  	if(this.balls[i].fillColor.alpha < 1)	{
				  		this.balls[i].fillColor.alpha += 0.05;
				  	}
			}

			text.content = "Click again to zoom out.";


			} else	{
				// Fade the balls out
			for (var i = 0; i < this.balls.length; i++) 	{
				  	if(this.balls[i].fillColor.alpha > 0)	{
				  		this.balls[i].fillColor.alpha -= 0.025;
				  	} else	{
					zoomLayerTop.removeChildren();
				  	}
			}
			}

   	}
}

////////////////////////////////////
////	SCALE & SIZE			////
////////////////////////////////////

// Initialize the scale
var scale = 1;
getScale();

// Initialize the canvas scale
var width;
var height;

// Map scale according to the windows scrollTop
function getScale()	{
	var scrollTop = $(window).scrollTop();
	scale = map(scrollTop, 0, 8000, 1, 0);
	return scale;
}

// Update canvas size when the window is resized
$(window).resize(function() {
	width = $("#canvas").width();
	height = $("#canvas").height();
});

////////////////////////////////////
////	COUNTER					////
////////////////////////////////////

function incrementCounter()	{
	if (tick && zoomTick)	{
		for (var i = 0; i < countries.length; i++) {
			  // Update the countries
			  countries[i].counter += 100*rhythm;
		}
	}
}

function incrementTimeCounter()	{
	if (tick || zoomTick == false)	{
		timeCounter += 1000;
	}
}

////////////////////////////////////
////	TOOLS					////
////////////////////////////////////

// Map a number
function map(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

////////////////////////////////////
////	FULLSCREEN				////
////////////////////////////////////

var vendor_prefix = ["moz", "webkit", "ms", "o", ""];
function VendorPrefixMethod(obj, method) {
	var p = 0, m, t;
	while (p < vendor_prefix.length && !obj[m]) {
		m = method;
		if (vendor_prefix[p] == "") {
			m = m.substr(0,1).toLowerCase() + m.substr(1);
		}
		m = vendor_prefix[p] + m;
		t = typeof obj[m];
		if (t != "undefined") {
			vendor_prefix = [vendor_prefix[p]];
			return (t == "function" ? obj[m]() : obj[m]);
		}
		p++;
	}
}

var e = document.getElementById("wrapper");

function toggleFullScreen() {
	if (VendorPrefixMethod(document, "FullScreen") ||
			  VendorPrefixMethod(document, "IsFullScreen")) {
		VendorPrefixMethod(document, "CancelFullScreen");
	}
	else {
		VendorPrefixMethod(e, "RequestFullScreen");
	}
}

////////////////////////////////////
////	KEY INPUT				////
////////////////////////////////////

//! Key & Mouse Input

document.addEventListener("keydown", function(e) {
  	// Enter toggles FullScreen
  	if (e.keyCode == 13) {
  		 toggleFullScreen();
	}
	else if (e.keyCode == 39) {
		go = true;
	// Left arrow toggles go
	}	else if (e.keyCode == 37) {
		go = true;
	}

}, false);

// Get the mouseclick to toggle zoom
document.addEventListener("click", function(e) {
  	if (go == false) {
		go = true;
	}

	if (zoom.isActive && zoom.fullSize)	{
		zoom.isActive = false;
	}

	console.log("click");

}, false);


////////////////////////////////////
////	SETUP					////
////////////////////////////////////

	//! Global vars
	
	var balls = [];
	countries = [];
	var rhythm = 1;
	var counter = 0;
	var countryMouseDownId = 200000;
	var ballMouseDownId = 200000;
	var size;
	var frameCount = 0;
	var go = false;
	var tick = false;
	var zoomTick = true;
	screenPosition = 0;
	screenPositionBuff = 0;
	var zoom;
	var timeCounter = 0;
	var text;
	var text2;


	$('html, body').scrollTop(0);
	width = $("#canvas").width();
	height = $("#canvas").height();

	// Create Paper.js Layers
	ballLayer = new Layer();
	ballLayer.setName('ballLayer');
	countryLayer = new Layer();
	countryLayer.setName('countryLayer');
	zoomLayer = new Layer();
	zoomLayer.setName('zoomLayer');
	zoomLayerTop = new Layer();
	zoomLayerTop.setName('zoomLayerTop');
	textLayer = new Layer();
	textLayer.setName('textLayer');

	// ID, Name, Color, AddSpeed, Position, Size, 10 million inhabitants, Mortaltiy, Probability to be male
	countries.push(new Country(0, "Center", "#FFFFFF", 1000, 0, 30, 50, 0, 0));
	countries.push(new Country(1, "China", "#dd5570", 2000, -1, 70, 135, 0.0147, 0.555));
	countries.push(new Country(2, "Deutschland", "#4691b5", 46000, 1, 70, 8, 0.00346, 0.53));
	countries.push(new Country(3, "Großbritannien", "#46bbac", 40000, -2, 70, 6, 0.00444, 0.525));
	countries.push(new Country(4, "USA", "#f28a4f", 7000, 2, 70, 15, 0.00617, 0.525));

	countries[0].isRhythm = true;

	zoom = new Zoom();

	// Switch to ballLayer
	textLayer.activate();

	// Setup debugging text
	text = new PointText(new Point(width/2, (view.center.y + view.size.height/2)*0.95));
	text.position = new Point(width/2, (view.center.y + view.size.height/2)*0.9);
	text.fontSize =  view.size.height/55;
	text.justification = "center";
	text.fontWeight = "300";
	text.fillColor = 'white';
	text.content = "Click to start the simulation";

	text2 = new PointText(new Point(width/2, (view.center.y + view.size.height/2)*0.05));
	text2.position = new Point(width/2, (view.center.y + view.size.height/2)*0.9);
	text2.fontSize =  view.size.height/55;
	text2.justification = "center";
	text2.fontWeight = "300";
	text2.fillColor = 'white';
	text2.content = "";


	// Initiate interval for counter incremention
	setInterval(function(){incrementCounter()},100);
	setInterval(function(){incrementTimeCounter()},1000);



////////////////////////////////////
////	DRAW					////
////////////////////////////////////

//! Draw

function onFrame() {
	// Update the view's zoom
	view.zoom = getScale();
	view.center.x = width/2;
	view.center.y = height/2;


	// If the visualisation should be running
	if (tick && zoomTick)	{

		text.content = "Click on one of the centers to make it control the rhythm. \n Click on a cluster to zoom in.";
		text.position = new Point(width/2, (view.center.y + view.size.height/2)*0.95);
		text.fontSize =  view.size.height/55;

		text2.position = new Point(width/2, (view.center.y + view.size.height/2)*0.05);
		text2.fontSize =	view.size.height/55;

		for (var i = 0; i < countries.length; i++) {
			  // Update the countries
			  countries[i].iterate();

			  // Set the global rhythm to the active countries rhythmπ
			  if (countries[i].isRhythm)	{
				  rhythm = countries[i].rhythm;
			  }
		}

		for (var i = 0; i < balls.length; i++) {
			// Make the balls react to each other
			  for (var j = i + 1; j < balls.length; j++) {
			  	balls[i].join(balls[j]);
			  	balls[i].react(balls[j]);
			  }

			  // Make the balls react to the countries
			  for (var k = 0; k < countries.length; k++) {
			  	balls[i].reactTwo(countries[k]);
			  }

			  // Update the balls
			  balls[i].iterate();

			  // If the ball isn't alive anymore remove it from the array
			  if (balls[i].isAlive == false)	{
					balls.splice(i, 1);
			  }
		}

		// Get the combined size of all balls
		size = 0;
		for (var i = 0; i < balls.length; i++) {
			size += balls[i].size;
		}

		// Set the zoom according to the comined size
		if (size <= 100)	{
			  screenPosition = 0;
		} else if (size > 100 && size <= 400)	{
			screenPosition = 1;
		} else if (size > 400 && size <= 1200)	{
			screenPosition = 2;
		} else if (size > 1200 && size <= 3200)	{
			screenPosition = 3;
		} else if (size > 3200)	{
			screenPosition = 4;
		}

		// If the screen position changed scroll
		if (screenPosition != screenPositionBuff && screenPosition <= 4) 	{
			offset = $('html, body').offset().top;
			$('html, body').animate({
				  scrollTop: 2000 * screenPosition
			}, 1000);
		}

		screenPositionBuff = screenPosition;

	// If the visualisation is not running yet
	} else if (go)	{
		text.content = "";

		var notYetReady = false;

		for (var i = 0; i < countries.length; i++) {
			  // Inititalizer Sequence
			  countries[i].buildUp();

			  if (countries[i].goodToGo == false)	{
				   notYetReady = true;
			  }
		}

		if (notYetReady == false)	{
			tick = true;
		}

		frameCount++;
	}

	// Update the zoom object
	zoom.iterate();
}