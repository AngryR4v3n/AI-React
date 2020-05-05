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
    }
  }
  handleFile = (file) => {
    var fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onloadend = (e) => {
      var content = e.target.result

      this.setState({
        text: content,
        rows: content.match(new RegExp("\n", "g") || []).length,
        cols: content.split('\n').length - 1 //count from 0.
      })
    }

  }

  addFile = async(e) => {
    e.preventDefault()
    let tmpArr = []
    var cell
    var x = 0, y = 0
    for (var counter = 0; counter < this.state.text.length; counter++) {
      if (x > this.state.cols) {
        x = 0
        y++
      }
      if (y > this.state.rows) {
        break
      }
      if (this.state.text.charAt(counter) === '-') {
        cell = new Cell(x, y, [true, false, false, false])
      } else if (this.state.text.charAt(counter) === '|') {
        cell = new Cell(x, y, [false, false, false, true])
      } else {
        cell = new Cell(x, y, [false, false, false, false])
      }

      x++

      tmpArr.push(cell)
    }
    await this.setState({
      grid: tmpArr
    })
    await this.calculateDims()
    await this.checkNeighbor(this.state.grid)
  }

  calculateDims = (width = 600) => {
    this.setState({
      sizeCell: Math.floor(width / this.state.cols)
    })
  }

  checkNeighbor = (arr) => {
    //solo necesitamos renderizar paredes. Si hay columna una posicion en Y arriba y el espacio es vacio, renderizar
    //      return x + y * this.state.cols  
    var firstComparison, emptyComparison, neighbor = 0
    console.log(arr)
    for (var i = 0; i < arr.length; i++) {
      neighbor = i + 1
      
      if (neighbor >= arr) {
        break
      }
      firstComparison = this.arraysEqual(this.state.grid[i].getWalls(), [true, false, false, false])
      emptyComparison = this.arraysEqual(this.state.grid[neighbor + 1].getWalls(), [false, false, false, false])
      console.log(firstComparison)
      
      // wall and next is empty
      if (firstComparison & emptyComparison){
        //we should check that its not the last in row
        if(this.state.grid[i].getX()===16){
          continue
        } else{
          //here we draw the wall
          this.state.grid[i].setX(i+1)
        }
      }
    }
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
                  <label className="custom-file-label" htmlfor="customFile">Choose file</label>
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

