function FinishScreen({ points, maxPossiblePoint, highScore, dispatch }) {
  const percentage = (points / maxPossiblePoint) * 100;
  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> out of {maxPossiblePoint} (
        {Math.ceil(percentage)}%)
      </p>
      <p className="highscore">highScore : {highScore} points</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "reset" })}
      >
        Rest Quiz
      </button>
    </>
  );
}

export default FinishScreen;
