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
    //agregemos paredes externas

    for (let i = 0; i < 17; i++) {
      topWalls = new Cell(i, 0, [true, false, false, false])
      leftWalls = new Cell(0, i, [false, false, false, true])
      downWalls = new Cell(i, 17, [true, false, false, false])
      rightWalls = new Cell(17, i, [false, false, false, true])
      tmpMap.push(topWalls, leftWalls, downWalls, rightWalls)
    }

    //agregamos paredes internas
    for (let i = 1; i < 17; i++) {
      for (let j = 1; j < 17; j++) {
        if (this.state.text[i][j] === '|') {
          //maze[i][j] = '#';
          console.log("COLUMN - (row: ", i, "column: ", j, ")")
          if (j === 16) {
            continue
          } else {
            tmpMap.push(new Cell(j, i, [false, false, false, true]))
          }

        }
        else if (i + 1 >= 17) {
          break;
        }
        else if (this.state.text[i - 1][j] === '|' && this.state.text[i + 1][j] === '|' && this.state.text[i][j] === ' ') {
          console.log("NEIGHBOR - (row: ", i, "column: ", j, ")")
          if (j === 16) {
            continue
          } else {
            tmpMap.push(new Cell(j, i, [false, false, false, true]))
          }
        }
        else
          tmpMap.push(new Cell(j, i, [false, true, false, false]))
      }
    }
    for (let i = 1; i < 17; i++) {
      for (let j = 1; j < 17; j++) {
        if (this.state.text[i][j] === '-') {
          //maze[i][j] = '#';
          console.log("ROW - (row: ", i, "column: ", j, ")")
          tmpMap.push(new Cell(j, i, [false, false, true, false]))
        }
        else if (j + 1 >= 17) {
          break;
        }
        else if (this.state.text[i][j - i] === '-' && this.state.text[i][j + 1] === '-' && this.state.text[i][j] === ' ') {
          console.log("NEIGHBOR - (row: ", i, "column: ", j, ")")
          tmpMap.push(new Cell(j, i, [false, false, true, false]))
        }
      }
    }
    console.log(this.state.text[16][13])
    this.setState({
      grid: tmpMap
    })

    this.calculateDims()

  }

  calculateDims = (width = 600) => {
    this.setState({
      sizeCell: Math.floor(width / this.state.cols) - 3
    })
  }

  linetoArr = (str) => {
    let i = 0
    let char_arr = []
    while (str.charAt(i) !== "") {
      char_arr.push(str.charAt(i))
      i++

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

