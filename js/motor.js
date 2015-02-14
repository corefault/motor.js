/* ===================================================================================================================
 * motor
 ===================================================================================================================*/
function motor (id, isTrailing, spawnAfterDeath) {
   this.particles = [];
   var canvas = document.getElementById(id);
   this.ctx = canvas.getContext('2d');
   this.useTrail = isTrailing || false;
   this.useReSpawn = spawnAfterDeath || true;
   
   // make fullscreen
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   
   this.width = canvas.width;
   this.height = canvas.height;
   
   this.lastupdate = Date.now();
   
   this.force = {
      data: {},
      set: function (key, val) {
        this.data[key] = val;
      },
      apply: function(particle) {
         for (var k in this.data) {
            particle.props[k] += this.data[k];
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
motor.prototype.initialize = function(num) {
  for (var i = 0; i < num; i++) {
     this.particles.push(this.spawn()); 
  } 
};
motor.prototype.outOfBounds = function(particle) {
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
   
   var dt = Date.now() - this.lastupdate;
   this.lastupdate = Date.now();
   
   dt /= 1000; // calc in ms
   
   var i = this.particles.length;
   while (i--) {
      if (!this.particles[i].props.dead) {
         this.particles[i].render(this.ctx);
         this.particles[i].move(dt);
      
         this.force.apply(this.particles[i]);
         
         this.outOfBounds(this.particles[i]);
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

