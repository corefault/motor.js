var mo = new motor("motor", false, true);
// motor:creator
mo.creator.set("size", 1,2);
mo.creator.set("color_alpha", 0.2, 0.8);
mo.creator.set("x", 0, mo.width);
mo.creator.set("y", 1, 1);
mo.creator.set("vy", 2, 500);

// mo::forces
mo.force.set("vy", 9.81);

// initialize all
mo.initialize(1000);

function draw() {
  mo.update();
  requestAnimationFrame(draw);
}
draw();

