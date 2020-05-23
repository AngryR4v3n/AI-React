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
    }
  }

  
  identifySpecials = (paramArr) => {
    let entrance = this.state.text[this.state.text.length - 2]
    let exit = this.state.text[this.state.text.length - 1]
    //we need to split..
    entrance = entrance.split(',')
    exit = exit.split(',')
    entrance = utils.transformLocations(entrance)
    exit = utils.transformLocations(exit)
    //change values of real matrix
    paramArr[utils.indexTrans(entrance[0], entrance[1], this.state.cols)].setValue(2)
    paramArr[utils.indexTrans(exit[0], exit[1], this.state.cols)].setValue(9)

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

  addFile = (e) => {
    e.preventDefault()
    let tmpArr = []
    
    for (let i = 0; i < this.state.text.length; i++) {
      if (isNaN(parseInt(this.state.text[i].charAt(0)))) {
        tmpArr.push(this.linetoArr(this.state.text[i]))
      } 
    }

    //hasta aqui tenemos ya el 2d arr en tmpArr...
    this.setState({
      text: tmpArr
    })

    var tmpMap = []
    //carguemos el mapa
    for (let i = 0; i < this.state.rows; i++) {
      for (let j = 0; j < this.state.cols; j++) {
        tmpMap.push(new Cell(j, i, [false, false, false, false],0))
      }
    }

    //agregemos paredes externas
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

    //agregemos paredes internas
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
              <Maze mazeGrid={this.state.actualMaze} codedMaze={this.state.grid} dim={this.state.sizeCell} />
            </div>
          </div>
        </div>

      </div>
    );
  }

}

