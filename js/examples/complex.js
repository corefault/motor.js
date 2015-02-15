var mo = new motor("motor", false, false);
// motor:creator
mo.creator.set("size", 2, 5);
mo.creator.set("color_r", 50);
mo.creator.set("color_g", 50);
mo.creator.set("color_b", 150);
mo.creator.set("color_alpha", 0.2, 0.7);
mo.creator.set("x", mo.width/2 - 10, mo.width/2 + 10);
mo.creator.set("y", mo.height/2 - 10, mo.height/2 +10);
mo.creator.set("vy", 0, -0.8);
mo.creator.set("vx", 0, 0.8);
mo.creator.set("life", 50,60);

// mo::forces
mo.force.set("life", -0.1);
mo.force.set("vy", function() {
   return Math.cos(20 * mo.creator.rnd(0,360));
});
mo.force.set("vx", function() {
   return Math.sin(20 * mo.creator.rnd(0,360));
});

mo.setBoundingBox(mo.width/2 - 100,mo.height/2-100,mo.width/2+100, mo.height/2+100, 0.4);

// initialize all
mo.initialize(10, 2);

function draw() {
  mo.update();
  requestAnimationFrame(draw);
}
draw();

