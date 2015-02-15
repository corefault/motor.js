/**
 * motor.js
 * 
 * simple and easy particle engine
 * use at your own risk
 * 
 * @author Daniel Kagemann (@corefault)
 * https://github.com/corefault/motor.js
 * 
 * if this seems useful for you please credit the author
 * donations welcome (daniel@corefault.de)
 * 
 * changelog
 *
 * v0.3
 *   display number of particles as text
 *   added bounding box
 * 
 * v0.2
 *   min/max values fix for invalid order
 *   force can use a value or a function returning a value (can be used for complex calculations)
 *   added timespan pulse feature for motor.initialize
 *   
 * v0.1
 *   initial version
 */

/* ===================================================================================================================
 * motor
 ===================================================================================================================*/
function motor (id, isTrailing, spawnAfterDeath) {
   this.particles = [];
   var canvas = document.getElementById(id);
   this.ctx = canvas.getContext('2d');
   this.useTrail = isTrailing==null ? false : isTrailing;
   this.useReSpawn = spawnAfterDeath==null ? true : spawnAfterDeath;
   this.pulse = {cur:0, limit: 0};
   
   // make fullscreen
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   
   this.width = canvas.width;
   this.height = canvas.height;
   this.lastupdate = Date.now();
   this.boundingBox = false;
   
   this.force = {
      data: {},
      set: function (key, val) {
         this.data[key] = val;
      },
      apply: function(particle, dt) {
         for (var k in this.data) {
            // check for function
            var val = this.data[k];
            if (typeof val === "function") {
               val = val.call(particle);
            }
            particle.props[k] += val;
         }
         
         // check for death of particle
         if (particle.props.color_alpha < 0 || particle.props.color_alpha > 1) {
            particle.props.dead = true;
         }
         if (particle.props.life <= 0) {
            particle.props.dead = true;
         }
      } 
   };
   
   this.creator = {
      data: {},
      rnd: function(min,max) {
         return (Math.random()*(max-min))+min;
      },
      make: function (min,max) {
         
         if (min > max) {
            var tmp = min;
            min = max;
            max = tmp;
         }
         return {min: min, max:max}; 
      },
      set: function (key, min, max) {
        max = max || min;     // fallback to same vaue as min
        this.data[key] = this.make(min,max);
      },
      get: function(key) {
         if (this.data[key]) {
            return this.rnd(this.data[key].min, this.data[key].max);
         }
         return false;
      }
   };
}
motor.prototype.setBoundingBox = function(left,top,right,bottom,bounce) {
   this.boundingBox = {l: left, t: top, r: right, b: bottom, f: bounce};
};
motor.prototype.spawn = function() {
   var p = new particle();
   for(var key in p.props) {
        var val = this.creator.get(key);
        if (val !== false) {
           p.props[key] = val;
        }
   }
   return p;
};
motor.prototype.initialize = function(num, timespan) {
   timespan = timespan || 0;
   
   // if timespan is used it should be in seconds
   if (timespan == 0) {
      for (var i = 0; i < num; i++) {
         this.particles.push(this.spawn()); 
      } 
   } else {
      this.pulse = {cur: 0, limit: (timespan*60) / num};
      // just spawn a single particle
      this.particles.push(this.spawn());
   }
};
motor.prototype.checkBounds = function(particle) {
   if (this.boundingBox !== false) {
      // right
      if (particle.props.vx > 0 && (particle.props.x + particle.props.size >= this.boundingBox.r)) {
          particle.props.vx = -particle.props.vx * this.boundingBox.f;
          particle.props.x += 2*(this.boundingBox.r - (particle.props.x + particle.props.size));
      }
      // left
		else if ( particle.props.vx < 0 &&  (particle.props.x - particle.props.size  <= this.boundingBox.l)) {
		   particle.props.vx = -particle.props.vx * this.boundingBox.f;
		   particle.props.x += 2 * ( this.boundingBox.l - (particle.props.x - particle.props.size) );
		}
      // bottom
      if ( particle.props.vy > 0 && (particle.props.y + particle.props.size >= this.boundingBox.b)) {
         particle.props.vy = -particle.props.vy * this.boundingBox.f;
         particle.props.y += 2 * ( this.boundingBox.b - (particle.props.y + particle.props.size) );
      }
      // top
      else if ( particle.props.vy < 0 && (particle.props.y - particle.props.size <= this.boundingBox.t)) {
		   particle.props.vy = -particle.props.vy * this.boundingBox.f;
		   particle.props.y += 2 * ( this.boundingBox.t - (particle.props.y - particle.props.size) );
		}
   }
   
   if (particle.props.x < 0 || particle.props.x > this.width || 
       particle.props.y < 0 || particle.props.y > this.height) {
          particle.props.dead = true;
   }
};
motor.prototype.update = function() {
   
   if (this.useTrail) {
      this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
      this.ctx.fillRect(0,0,this.width,this.height);
   } else {
      this.ctx.clearRect(0,0, this.width, this.height);
   }
   
   // draw number of particles
   var label = "Particles: " + this.particles.length;
   this.ctx.font = "10px Tahoma";
   this.ctx.fillStyle = "#000000";
   this.ctx.fillText(label, 20, this.height - 40);
   
   // check for pulse feature
   if (this.pulse.limit != 0) {
      this.pulse.cur++;
      if (this.pulse.cur >= this.pulse.limit) {
         this.particles.push(this.spawn());
         this.pulse.cur = 0;
      }
   }
   
   var dt = Date.now() - this.lastupdate;
   this.lastupdate = Date.now();
   
   dt /= 1000; // calc in ms
   
   var i = this.particles.length;
   while (i--) {
      if (!this.particles[i].props.dead) {
         this.particles[i].render(this.ctx);
         this.particles[i].move(dt);
      
         this.force.apply(this.particles[i] , dt);
         this.checkBounds(this.particles[i]);
      } else {
         if (this.useReSpawn) {
            this.particles[i] = this.spawn();
         }
      }
   }
};

/* ===================================================================================================================
 * particle
 ===================================================================================================================*/
function particle () {
   this.props = {
     size: 1,
     life: 1,
     x: 0,
     y: 0,
     vx: 0,
     vy: 0,
     color_r: 0,
     color_g: 0,
     color_b: 0,
     color_alpha: 1,
     dead: false
   };
}
particle.prototype.move = function(dt) {
   this.props.x += this.props.vx * dt;
   this.props.y += this.props.vy * dt;
};
particle.prototype.render = function(ctx) {
   ctx.beginPath();
   ctx.arc(this.props.x, this.props.y, this.props.size, 0, Math.PI*2, true);
   ctx.closePath();
   ctx.fillStyle = "rgba("+this.props.color_r+","+this.props.color_g+","+this.props.color_b+","+this.props.color_alpha+")";
   ctx.fill(); 
};

