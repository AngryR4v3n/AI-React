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
      text: "",
      special: []
    }
  }
  getMaze = () => {
    let arr = new Array(this.state.rows);
    //init
    for (let i = 0; i < this.state.text.length; i++) {
      arr[i] = new Array(this.state.cols)
    }

    for (let j = 1; j < this.state.text[0].length; j++) {
      for (let i = 1; i < this.state.text.length; i++) {

        if (this.state.text[i][j] === '|') {
          arr[i][j] = 1
        }
        else if (i + 1 >= this.state.text.length) {
          break
        }
        else if (this.state.text[i - 1][j] === '|' && this.state.text[i + 1][j] === '|' && this.state.text[i][j] === ' '){
          arr[i][j] = 1
        } else{
          arr[i][j] = 0
        }
      }
    }

    for(let i = 1; i<this.state.text.length; i++){
      for(let j = 1; j<this.state.text[0].length; j++){
        if(this.state.text[i][j] === '-'){
          arr[i][j] = 1
        }
        else if(this.state.text[i][j - 1] === '-' && this.state.text[i][j + 1] === '-' && this.state.text[i][j] === ' '){
          arr[i][j] = 1
        }
      }
    }

    //ok lets set outer walls and stuff:
    for (let i = 0; i < this.state.rows; i++) {
      arr[0][i] = 1
      arr[i][0] = 1
      arr[this.state.rows][i] = 1
      arr[i][this.state.cols] = 1
    }



    this.setState({
      actualMaze: arr
    })
  }

  handleFile = (file) => {
    var fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onloadend = (e) => {
      var content = e.target.result

      this.setState({
        text: content.split("\n"),
        rows: content.match(new RegExp("\n", "g") || []).length - 1,
        cols: content.split('\n').length - 2 //count from 0.
      })
    }



  }

  addFile = (e) => {
    e.preventDefault()
    let tmpArr = []
    let specialArr = []
    for (let i = 0; i < this.state.text.length; i++) {
      if (isNaN(parseInt(this.state.text[i].charAt(0)))) {
        tmpArr.push(this.linetoArr(this.state.text[i]))
      } else {
        specialArr.push(this.state.text[i])
      }
    }

    //hasta aqui tenemos ya el 2d arr en tmpArr...
    this.setState({
      text: tmpArr,
      special: specialArr
    })
    var leftWalls, downWalls, topWalls, rightWalls;
    var tmpMap = []
    //agregemos paredes externas

    for (let i = 0; i < this.state.rows; i++) {
      topWalls = new Cell(i, 0, [true, false, false, false])
      leftWalls = new Cell(0, i, [false, false, false, true])
      downWalls = new Cell(i, this.state.cols, [true, false, false, false])
      rightWalls = new Cell(this.state.rows, i, [false, false, false, true])
      tmpMap.push(topWalls, leftWalls, downWalls, rightWalls)
    }

    //agregamos paredes internas
    for (let i = 1; i < this.state.rows - 1; i++) {
      for (let j = 1; j < this.state.cols - 1; j++) {
        if (this.state.text[i][j] === '|') {
          //maze[i][j] = '#';

          if (j === this.state.cols - 1) {
            continue
          } else {
            tmpMap.push(new Cell(j, i, [false, false, false, true]))
          }

        }
        else if (i + 1 >= this.state.rows - 1) {
          break;
        }
        else if (this.state.text[i - 1][j] === '|' && this.state.text[i + 1][j] === '|' && this.state.text[i][j] === ' ') {

          if (j === this.state.cols - 1) {
            continue
          } else {
            tmpMap.push(new Cell(j, i, [false, false, false, true]))
          }
        }
        else
          tmpMap.push(new Cell(j, i, [false, false, false, false]))
      }
    }
    for (let i = 1; i < this.state.rows - 1; i++) {
      for (let j = 1; j < this.state.cols - 1; j++) {
        if (this.state.text[i][j] === '-') {
          tmpMap.push(new Cell(j, i, [false, false, true, false]))
        }

        if (this.state.text[i][j - 1] === '-' && this.state.text[i][j + 1] === '-' && this.state.text[i][j] === ' ') {

          tmpMap.push(new Cell(j, i, [false, false, true, false]))
        }
        else
          tmpMap.push(new Cell(j, i, [false, false, false, false]))
      }
    }

    this.setState({
      grid: tmpMap
    })

    this.calculateDims()
    this.getMaze()
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

