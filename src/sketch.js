export default function sketch(p) {
  p.setup = () => {
    var myCanvas = p.createCanvas(600, 600, p.WEBGL);
    myCanvas.parent("canvas");


  };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.codedMaze) {
      for (var i = 0; i < props.codedMaze.length; i++) {
        console.log(props.codedMaze[i])
        //show(props.codedMaze[i])
        
      }

    }
  };

  p.draw = () => {
    p.background(51);

  
  };


  function show(x, y, walls = [true, true, true, true]) {
    var w = 35.294117647
    var coord_x = x * w;
    var coord_y = y * w;
    p.stroke(255);
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