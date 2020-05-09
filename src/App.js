import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Maze from './Maze.js'
import Cell from './Cell.js'
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: [],
      cols: 0,
      rows: 0,
      sizeCell: 0,
      text: ""
    }
  }
  handleFile = (file) => {
    var fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onloadend = (e) => {
      var content = e.target.result

      this.setState({
        text: content.split("\n"),
        rows: content.match(new RegExp("\n", "g") || []).length,
        cols: content.split('\n').length - 1 //count from 0.
      })
    }



  }

  addFile = (e) => {
    e.preventDefault()
    let tmpArr = []

    for (let i = 0; i < this.state.text.length; i++) {
      tmpArr.push(this.linetoArr(this.state.text[i]))
    }

    //hasta aqui tenemos ya el 2d arr en tmpArr...
    this.setState({
      text: tmpArr
    })
    var leftWalls, downWalls, topWalls, rightWalls;
    var tmpMap = []
    //agregemos paredes y eso 

    for (let i = 0; i < 17; i++) {
      topWalls = new Cell(i, 0, [true, false, true, false])
      leftWalls = new Cell(0, i, [false, false, false, true])
      downWalls = new Cell(i, this.state.rows, [false, true, false, false])
      rightWalls = new Cell(16,i,[false, true, false, false])
      //maze[0][i] = '#';
      //maze[16][i] = '#';
      tmpMap.push(leftWalls, downWalls, topWalls, rightWalls)
    }


    this.setState({
      grid: tmpMap
    })

    this.calculateDims()

  }

  calculateDims = (width = 600) => {
    this.setState({
      sizeCell: width / this.state.cols
    })
  }

  linetoArr = (str) => {
    let i = 0
    let char_arr = []
    while (str.charAt(i) !== "") {
      i++
      char_arr.push(str.charAt(i))
    }
    return char_arr
  }


  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
      return false;
    for (var i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i])
        return false;
    }

    return true;
  }

  render() {
    return (
      <div className="App">
        <div className="container h-100">
          <div className="row mt-4 justify-content-center align-items-center">
            <div className=".col-xl-1">
              <h2 className="title">Maze Solver!</h2>
              <form id="form">
                <div className="custom-file">
                  <input type="file" accept='.txt' className="custom-file-input" id="customFile"
                    onChange={e => this.handleFile(e.target.files[0])} />
                  <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                </div>
                <button type="submit" id="submit" className="btn btn-primary" onClick={this.addFile}>Submit</button>
              </form>
              <Maze codedMaze={this.state.grid} dim={this.state.sizeCell} />
            </div>
          </div>
        </div>

      </div>
    );
  }

}

