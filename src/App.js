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
      sizeCell: 10,
      text: ""
    }
  }
  handleFile = (file) => {
    var fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onloadend = (e) => {
      var content = e.target.result
      console.log(content)
      this.setState({
        text: content,
        rows: content.match(new RegExp("\n", "g") || []).length,
        cols: content.split('\n').length - 1 //count from 0.
      })
    }
  }

  addFile = (e) => {
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
      if (this.state.text.charAt(counter) === "-") {
        cell = new Cell(x, y, [true, false, true, false])
      } else if (this.state.text.charAt(counter) === "|") {
        cell = new Cell(x, y, [true, false, false, true])
      } else {
        cell = new Cell(x, y, [false, false, false, false])
      }
      
      x++

      tmpArr.push(cell)
    }
    this.setState({
      grid: tmpArr
    })

    console.log(tmpArr)

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
              <Maze codedMaze={this.state.grid} />
            </div>
          </div>
        </div>

      </div>
    );
  }

}

