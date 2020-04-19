import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends PureComponent {
  constructor() {
    super();
    this.user1 = [];
    this.user2 = [];
    this.ref = [];
    this.n = 0;
    this.state = {
      user: 1,
      gameOver: '',
      n: 0,
    }
  }

  componentWillUnmount() {
    this.user1 = null;
    this.user2 = null;
    this.ref = null;
    this.n = null;
  }

  checkRow = (i, arr) => {
    //keep i constant and navigate throw j
    for (let k = 0; k < this.n; k++) {
      if(!arr[i][k]) {
        return false;
      }
    }
    return true;
  }

  checkColumn = (j, arr) => {
    //keep j constant and navigate throw i
    for (let k = 0; k < this.n; k++) {
      if(!arr[k][j]) {
        return false;
      }
    }
    return true;
  }

  checkLeftDiagnol = (i, j, arr) => {
    for (let k = 0; k < this.n; k++) {
      if(!arr[k][k]) {
        return false;
      }
    }
    return true;
  }

  checkRightDiagnol = (i, j, arr) => {
    const len = this.n - 1;
    for (let m = len; m >= 0; m--) {
      const n = len - m;
      if(!arr[m][n]) {
        return false;
      }
    }
    return true;
  }

  isGameOver = (i, j, arr) => {
    return this.checkColumn(j, arr) || this.checkRow(i, arr) || this.checkLeftDiagnol(i, j, arr) || this.checkRightDiagnol(i, j, arr);
  }

  posibilitiesLeft = () => {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n ; j++) {
        if (this.ref[i][j]['innerText'] == '') {
          return true;
        }
      }
    }
  }

  changePlayer = () => {
    this.setState((state) => {
      if (state.user === 1) {
        return {
          user: 2
        }
      } else {
        return {
          user: 1
        }
      }
    });
  }

  setDrawStatus = () => {
    this.setState({gameOver: 'draw'});
  }

  handleClick = (i, j) => {
    let gameOver = false;
    if (this.state.user == 1) {
      this.user1[i][j] = true;
      gameOver = this.isGameOver(i, j, this.user1);
    } else if (this.state.user == 2) {
      this.user2[i][j] = true;
      gameOver = this.isGameOver(i, j, this.user2);
    }
    if (!gameOver) {
      if (this.posibilitiesLeft()) {
        this.changePlayer();
      } else {
        this.setDrawStatus();
      }
    } else {
      this.setState({gameOver: 'won'});
    }
  }

  getStyle = () => {
    if (this.state.user == 1)
      return {
        color: 'red',
        icon: 'X',
      };
    else if (this.state.user == 2)
      return {
        color: 'blue',
        icon: 'O',
      };
    else
      return '';
  }

  setIcon = (i, j) => {
    const ele = this.ref[i][j];
    const style = this.getStyle();
    ele.style.backgroundColor = style.color;
    ele.innerText = style.icon;
  }

  handleChange = (val) => {
    if (val == '') {
      this.setState({n: 0});
    } else {
      this.n = Number(val) || 0;
    }
  }

  reinitialise = () => {
    this.user1 = [];
    this.user2 = [];
    this.ref = [];
    for (let i = 0; i < this.n; i++) {
      this.user1[i] = new Array(this.n);
      this.user2[i] = new Array(this.n);
      this.ref[i] = new Array(this.n);
      for (let j = 0; j < this.n; j++) {
        this.user1[i][j] = false;
        this.user2[i][j] = false;
      }
    }
  }

  render() {
    const board = [];

    const boxStyle = 500/this.n - 10;

    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const key = `${i}-${j}`;
        const ele = (
          <div key={key} className="app__div__divInner"
            style={{width: boxStyle, height: boxStyle}}
            ref={(ref) => {
              this.ref[i][j] = {};
              this.ref[i][j] = ref;
            }}
            onClick={() => {
              this.setIcon(i, j);
              this.handleClick(i, j);
            }}
          >
          </div> );
        board.push(ele);
      }
    }

    return (
      <div className='app'>
        <h3 className='app__h3'> Tic Tac Toe Game </h3>
        <p> Welcome to Tic Tac Toe Game. This game is played between two players using N * N board. <br/>
          The game will be won if a player manages to get his pawns in horizontal, vertical or diagnol row
        </p>
        <label htmlFor='numberInput'> Enter value of N : </label>
        <input name='numberInput' type='text'
          className='app__input'
          onChange={(evt) => {
            this.handleChange(evt.target.value);
          }}
        />
        <button
          className="app__input app__button"
          onClick={() => {
            this.setState({n: this.n, user: 1, gameOver: ''});
            this.reinitialise();
          }}
        >
          Start Game
        </button>
        {this.state.n > 0 &&
          <div>
            <div className='app__span'>
            <span> Game :
              {this.state.user == 1 ? <span className='app__span__player1'> Player1 </span> : <span className='app__span__player2'> Player2 </span>}
            </span>
            <br/>
            {this.state.gameOver === 'won' && <span> Game Over :  Player{this.state.user} Won </span>}
            {this.state.gameOver === 'draw' && <span> Game Over :  Draw </span>}
          </div>
          <div className='app__div'>
            <div className='app__div__div'>
              {board}
            </div>
          </div>
        </div>
      }
      </div>
    );
  }
}
