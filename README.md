# motor.js
simple and easy particle engine for javascript using canvas.
inspired by my old C++ project [corengine](https://github.com/corefault/corengine)

## particle attributes

a particle has the following attributes which can be used in creators and forces for manipulation
* size (the radius default 1)
* life (lifetime default 1)
* x (horizontal position default 0)
* y (vertical position default 0)
* vx (velocity for x direction default 0)
* vy (velocity for y direction default 0)
* color_r (red value default 0)
* color_g (green value default 0)
* color_b (blue value default 0)
* color_alpha (red value default 1)
* dead (indicates a dead particle default false)


## how to use

include motor.js in your html

    <script src="js/motor.js" type="text/javascript"></script>
    
add a canvas element in your html

    <canvas id="motor"></canvas>
    
write a configuration script and include in your html

    // create the engine using the id "motor"
    // second parameter is for trailing effect
    // third parameter is for respawn on particle death
    var mo = new motor("motor", false, true);
    
    // now add creator settings. alle settings use the direct 
    // particle attributes with min and max
    // if max is not specified the min is used.
    mo.creator.set("size", 1, 2);
    mo.creator.set("color_alpha", 0.2, 0.8);
    mo.creator.set("x", 0, mo.width);
    mo.creator.set("y", 1, 1);
    mo.creator.set("vy", 2, 500);

    // next thing to do is setup some forces.
    // again the direct use of particle attributes are used
    mo.force.set("vy", 9.81);

    // if all is configured just initialize with 
    // the amount of particles
    mo.initialize(1000);

    // this routine uses the smooth animation feature 
    // for drawing so just use like this
    function draw() {
    mo.update();
    requestAnimationFrame(draw);
    }
    draw();