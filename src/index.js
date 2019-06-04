import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
      );
  }


  
class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

   

    render(){
        const rows = [];
        for (var i = 0; i < 3; i++) {
            const children = [];
            for (var x = 0; x < 3; x++){
               children.push(this.renderSquare((x*3)+i))
            } rows.push( <div className="board-row">{children}</div>);
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

function intoRowCol(i) {
    if (i === 0) {
        return "(1, 1)";
    } else if (i === 1) {
        return "(1, 2)";
    } else if (i === 2){
        return "(1, 3)";
    } else if (i === 3){
        return "(2, 1)";
    } else if (i === 4){
        return "(2, 2)";
    } else if (i === 5){
        return "(2, 3)";
    } else if (i === 6){
        return "(3, 1)";
    } else if (i === 7){
        return "(3, 2)";
    } else if (i === 8){
        return "(3, 3)";
    };
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            isToggleOn: true,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X': 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }



    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });

    }

    toggleClick() {
        this.setState(function(prevState) {
            return {isToggleOn: !prevState.isToggleOn};
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

    
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + " " + intoRowCol(step.location) :
                'Go to game start';
            
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                    {step === current ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });

        let status;
        if(winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        } 

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.toggleClick()}>{this.state.isToggleOn ? 'Desc' : 'Asc'} </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [3, 5, 8],
        [0, 4, 8],
        [2, 4, 6]];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // const line = lines[i];
        // const a = line[0];
        // const b = line[1];
        // const c = line[2];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

