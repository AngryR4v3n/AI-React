import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch.js'
import './Maze.css'
 const Maze = (props) => {
    return (
        <div className="row justify-content-center align-items-center">
            <div className=".col-xl-1" id="canvas">
                <P5Wrapper codedMaze={props.codedMaze} sketch={sketch} />
            </div>
        </div>
    )
}

export default Maze