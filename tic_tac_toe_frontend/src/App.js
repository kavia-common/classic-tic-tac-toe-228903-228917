import React, { useMemo, useState } from 'react';
import './App.css';

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Determines whether the current board contains a winning line.
 * @param {(null|'X'|'O')[]} squares
 * @returns {{winner: (null|'X'|'O'), line: number[] | null}}
 */
function getWinnerInfo(squares) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

/**
 * @param {(null|'X'|'O')[]} squares
 * @returns {boolean}
 */
function isDraw(squares) {
  return squares.every(Boolean) && !getWinnerInfo(squares).winner;
}

// PUBLIC_INTERFACE
function App() {
  /** Game board state for the current round. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  /** Whose turn it is for the current round. */
  const [xIsNext, setXIsNext] = useState(true);
  /** Score that persists across rounds. */
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const winnerInfo = useMemo(() => getWinnerInfo(squares), [squares]);
  const winner = winnerInfo.winner;
  const winningLine = winnerInfo.line;

  const draw = useMemo(() => isDraw(squares), [squares]);

  const statusText = useMemo(() => {
    if (winner) return `Player ${winner} wins!`;
    if (draw) return 'It’s a draw!';
    return `Next: ${xIsNext ? PLAYER_X : PLAYER_O}`;
  }, [winner, draw, xIsNext]);

  /**
   * Handles a click on a specific board cell.
   * Prevents moves after round is finished or on occupied cells.
   * @param {number} index
   */
  const handleSquareClick = (index) => {
    if (winner || draw) return;
    if (squares[index]) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? PLAYER_X : PLAYER_O;

    // If this move completes the game, update score before committing state.
    const nextWinnerInfo = getWinnerInfo(nextSquares);
    const nextDraw = isDraw(nextSquares);

    setSquares(nextSquares);
    setXIsNext((prev) => !prev);

    if (nextWinnerInfo.winner) {
      const w = nextWinnerInfo.winner;
      setScore((prev) => ({ ...prev, [w]: prev[w] + 1 }));
    } else if (nextDraw) {
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  /** Starts a new round but keeps the score. */
  const newRound = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  /** Resets the entire match (board + score). */
  const resetScore = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setScore({ X: 0, O: 0, draws: 0 });
  };

  return (
    <div className="App">
      <main className="rt-page">
        <header className="rt-header" aria-label="Game header">
          <div className="rt-badge" aria-hidden="true">
            8-BIT
          </div>
          <div className="rt-headerText">
            <h1 className="rt-title">Retro Tic Tac Toe</h1>
            <p className="rt-subtitle">Local 2-player • First to 3 in a row</p>
          </div>
        </header>

        <section className="rt-card" aria-label="Scoreboard and status">
          <div className="rt-scoreboard" role="group" aria-label="Scoreboard">
            <div className="rt-scoreItem" aria-label="Player X score">
              <div className="rt-scoreLabel">PLAYER X</div>
              <div className="rt-scoreValue">{score.X}</div>
            </div>

            <div className="rt-scoreItem rt-scoreItem--draw" aria-label="Draws">
              <div className="rt-scoreLabel">DRAWS</div>
              <div className="rt-scoreValue">{score.draws}</div>
            </div>

            <div className="rt-scoreItem" aria-label="Player O score">
              <div className="rt-scoreLabel">PLAYER O</div>
              <div className="rt-scoreValue">{score.O}</div>
            </div>
          </div>

          <div
            className={`rt-status ${winner ? 'rt-status--win' : ''} ${
              draw ? 'rt-status--draw' : ''
            }`}
            aria-live="polite"
          >
            {statusText}
          </div>
        </section>

        <section className="rt-boardWrap" aria-label="Tic Tac Toe board">
          <div className="rt-board" role="grid" aria-label="3 by 3 Tic Tac Toe board">
            {squares.map((value, idx) => {
              const isWinningCell = Boolean(winningLine && winningLine.includes(idx));
              const disabled = Boolean(value || winner || draw);

              return (
                <button
                  key={idx}
                  type="button"
                  className={`rt-cell ${value ? 'rt-cell--filled' : ''} ${
                    isWinningCell ? 'rt-cell--win' : ''
                  } ${value === PLAYER_X ? 'rt-cell--x' : ''} ${
                    value === PLAYER_O ? 'rt-cell--o' : ''
                  }`}
                  onClick={() => handleSquareClick(idx)}
                  role="gridcell"
                  aria-label={`Cell ${idx + 1}${value ? `, ${value}` : ''}`}
                  disabled={disabled}
                >
                  <span className="rt-cellInner" aria-hidden="true">
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rt-controls" aria-label="Game controls">
          <button type="button" className="rt-btn rt-btn--primary" onClick={newRound}>
            New round
          </button>
          <button type="button" className="rt-btn" onClick={resetScore}>
            Reset score
          </button>
        </section>

        <footer className="rt-footer" aria-label="Footer">
          Tip: Winner line lights up. Use “New round” to keep the score going.
        </footer>
      </main>
    </div>
  );
}

export default App;
