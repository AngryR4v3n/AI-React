import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/App.css';
import Maze from './Maze.js'
import Cell from '../Utils & Objects/Cell.js'
import * as utils from '../Utils & Objects/functions.js'
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: [],
      cols: 0,
      rows: 0,
      sizeCell: 0,
      text: "",
      special: [],
      algorithm: null
    }
  }

  /**
   * Method used to find the exit and entrance, it looks in the param the last 2 lines,
   * splits them to get the values of coordinates, and transforms such coordinates into our local coordinate system
   */
  identifySpecials = (paramArr) => {
    let entrance = this.state.text[this.state.text.length - 2]
    let exit = this.state.text[this.state.text.length - 1]
    //we need to split..
    entrance = entrance.split(',')
    exit = exit.split(',')
    entrance = utils.transformLocations(entrance)
    exit = utils.transformLocations(exit)
    //change values of real matrix
    paramArr[utils.indexTrans(entrance[0], entrance[1], this.state.cols)].setValue(3)
    paramArr[utils.indexTrans(exit[1], exit[0], this.state.cols)].setValue(9)
    this.setState({
      special: entrance
    })

  }

  handleFile = (file) => {
    var fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onloadend = (e) => {
      var content = e.target.result
      this.setState({
        text: content.split("\n"),
        // eslint-disable-next-line
        rows: content.match(new RegExp("\n", "g") || []).length - 1,
        cols: content.split('\n').length - 2 //count from 0.
      })
    }

  }
  i
  /**
   * Method called onSubmit. This will set all the variables needed to render the map.
   */
  addFile = (e) => {
    e.preventDefault()
    let tmpArr = []

    for (let i = 0; i < this.state.text.length; i++) {
      if (isNaN(parseInt(this.state.text[i].charAt(0)))) {
        tmpArr.push(this.linetoArr(this.state.text[i]))
      }
    }

    //we have the 2d arr of chars.
    this.setState({
      text: tmpArr
    })

    var tmpMap = []
    //load the map of cell objects
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.cols; j++) {
        tmpMap.push(new Cell(j, i, [false, false, false, false], 0))
      }
    }

    //external walls
    for (let i = 0; i < this.state.rows; i++) {

      //top border
      tmpMap[utils.indexTrans(i, 0, this.state.cols)].setWalls([true, false, false, false])
      tmpMap[utils.indexTrans(i, 0, this.state.cols)].setValue(1)
      //left border
      tmpMap[utils.indexTrans(0, i, this.state.cols)].setWalls([false, false, false, true])
      tmpMap[utils.indexTrans(0, i, this.state.cols)].setValue(1)
      //down
      tmpMap[utils.indexTrans(i, this.state.cols - 1, this.state.cols)].setWalls([false, false, true, false])
      tmpMap[utils.indexTrans(i, this.state.cols - 1, this.state.cols)].setValue(1)
      // right border
      tmpMap[utils.indexTrans(this.state.rows - 1, i, this.state.cols)].setWalls([false, true, false, false])
      tmpMap[utils.indexTrans(this.state.rows - 1, i, this.state.cols)].setValue(1)


    }

    //Lets set internal walls
    for (let i = 1; i < this.state.rows; i++) {
      for (let j = 1; j < this.state.cols; j++) {
        if (this.state.text[i][j] === '|') {
          if (j === this.state.cols - 1) {
            continue
          } else {
            tmpMap[utils.indexTrans(j, i, this.state.cols)].setWalls([false, false, false, true])
            tmpMap[utils.indexTrans(j, i, this.state.cols)].setValue(1)
          }
        }
        else if (i + 1 > this.state.rows) {
          break;
        }
        else if (this.state.text[i - 1][j] === '|' & this.state.text[i + 1][j] === '|' & this.state.text[i][j] === ' ') {
          //we dont want to alter the borders
          if (j === this.state.cols - 1) {
            continue
          } else {
            tmpMap[utils.indexTrans(j, i, this.state.cols)].setWalls([false, false, false, true])
            tmpMap[utils.indexTrans(j, i, this.state.cols)].setValue(1)
          }
        }

      }
    }
    //decide whether we need column or wall
    for (let i = 1; i < this.state.rows; i++) {
      for (let j = 1; j < this.state.cols; j++) {
        if (this.state.text[i][j] === '-') {
          tmpMap[utils.indexTrans(j, i, this.state.cols)].setWalls([false, false, true, false])
          tmpMap[utils.indexTrans(j, i, this.state.cols)].setValue(1)
        }
        if (this.state.text[i][j - 1] === '-' && this.state.text[i][j + 1] === '-' && this.state.text[i][j] === ' ') {
          tmpMap[utils.indexTrans(j, i, this.state.cols)].setWalls([false, false, true, false])
          tmpMap[utils.indexTrans(j, i, this.state.cols)].setValue(1)
        }
      }
    }
    this.identifySpecials(tmpMap)
    this.setState({
      grid: tmpMap
    })

    this.calculateDims()

    alert("When the path is shown, please reload the site to solve the maze again.")
    this.setState = {
      grid: [],
      cols: 0,
      rows: 0,
      sizeCell: 0,
      text: "",
      special: [],
      algorithm: null
    }
  }
  /**
   * calculates size of cell depending on the width and height of the map.
   */
  calculateDims = (width = 600) => {
    this.setState({
      sizeCell: Math.floor(width / this.state.cols) - 3
    })
  }
  /**
   * Receives a string and iterates through it, and returns array of chars.
   */
  linetoArr = (str) => {
    let i = 0
    let char_arr = []
    while (str.charAt(i) !== "") {
      char_arr.push(str.charAt(i))
      i++

    }
    return char_arr
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
                <h5 className="sub">Select the algorithm to solve the maze</h5>
                <label className="radio-inline">
                  <input onChange={e => this.setState({ algorithm: e.target.value })} type="radio" name="survey" id="Radios1" value={1} />
                    BFS
                </label>
                <label className="radio-inline">
                  <input onChange={e => this.setState({ algorithm: e.target.value })} type="radio" name="survey" id="Radios2" value={2} />
                      DFS
                </label>
                <br></br>
                {this.state.algorithm === null | this.state.rows === 0 ?
                  <button type="submit" id="submit" className="btn btn-primary" disabled onClick={this.addFile}>Submit</button> :
                  <button type="submit" id="submit" className="btn btn-primary" onClick={this.addFile}>Submit</button>}
              </form>
              <Maze mazeGrid={this.state.actualMaze} codedMaze={this.state.grid} dim={this.state.sizeCell} cols={this.state.cols} mazeStart={this.state.special} alg={this.state.algorithm} />
            </div>
          </div>
        </div>

      </div>
    );
  }

}

