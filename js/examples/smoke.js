var mo = new motor("motor", {fullscreen:true});
// motor:creator
mo.creator.set("size", 1,2);
mo.creator.set("color_r", 50);
mo.creator.set("color_g", 50);
mo.creator.set("color_b", 50);
mo.creator.set("color_alpha", 0.5, 0.7);
mo.creator.set("x", mo.width/2);
mo.creator.set("y", mo.height/2);
mo.creator.set("vy", 0, -0.8);
mo.creator.set("life", 30,40);

// mo::forces
mo.force.set("life", -0.2);
mo.force.set("size", 0.2);
mo.force.set("color_alpha", -0.01);
mo.force.set("vy", -4, -8);
mo.force.set("vx", function() {
   return mo.creator.rnd(-4, 4);
});

// initialize all
mo.initialize(40, 1);

function draw() {
  mo.update();
  requestAnimationFrame(draw);
}
draw();

