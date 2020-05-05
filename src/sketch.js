export default function sketch(p) {
  let grid = null
  let size
  p.setup = () => {
    var myCanvas = p.createCanvas(600, 600);
    myCanvas.parent("canvas");
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.codedMaze) {
      grid = props.codedMaze
      size = props.size
    }
  };

  p.draw = () => {

    p.background(51);
    p.stroke(255,0,0)
    if (grid != null & size != null) {
      for (var i = 0; i < grid.length; i++) {
        
        show(grid[i].getX(), grid[i].getY(), grid[i].getWalls(),size)
      }
    }
    
  };


  function show(x, y, walls = [true, true, true, true], size) {
    const w = size
    var coord_x = Math.floor(x * w + 20);
    var coord_y = Math.floor(y * w + 20);
    

    if (walls[0]) {
      //top
      p.line(coord_x, coord_y, coord_x + w, coord_y)
    }

    if (walls[1]) {
      //right
      p.line(coord_x + w, coord_y, coord_x + w, coord_y)
    }

    if (walls[2]) {
      //bottom
      p.line(coord_x + w, coord_y + w, coord_x, coord_y + w)
    }

    if (walls[3]) {
      //left
      p.line(coord_x, coord_y + w, coord_x, coord_y)
    }
    //noFill();
    //rect(x,coord_y,w,w)
  }

};