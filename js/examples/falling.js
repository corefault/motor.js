var mo = new motor("motor", {fullscreen:true});
// motor:creator
mo.creator.set("size", 2, 5);
mo.creator.set("color_r", 0);
mo.creator.set("color_g", 0);
mo.creator.set("color_b", 250);
mo.creator.set("color_alpha", 0.2, 0.7);
mo.creator.set("x", 10, mo.width - 10);
mo.creator.set("y", 0,100);
mo.creator.set("vy", 10, 14);

// mo::forces
mo.force.set("vy", 9.81);
mo.force.set("color_alpha", 0.001);
mo.force.set("vx", function() {
   return mo.creator.rnd(-5,5); 
});
mo.setBoundingBox(0, -1,mo.width, mo.height-10, 0.8);

// initialize all
mo.initialize(100);

function draw() {
  mo.update();
  requestAnimationFrame(draw);
}
draw();

