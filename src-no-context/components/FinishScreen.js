function FinishScreen({ points, maxPoints, highscore, dispatch }) {
	const percentage = (points / maxPoints) * 100;

	let emoji;
	if (percentage === 100) emoji = "🥳";
	else if (percentage >= 80) emoji = "😀";
	else if (percentage >= 60) emoji = "😐";
	else if (percentage >= 40) emoji = "😕";
	else if (percentage >= 20) emoji = "😟";

	return (
		<>
			<p className="result">
				<span>{emoji}</span>
				You scored <strong>{points}</strong> out of {maxPoints} (
				{Math.ceil((points / maxPoints) * 100)} %)
			</p>
			<p className="highscore">(Highscore: {highscore} points)</p>
			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: "Restart" })}
			>
				Restart Quiz
			</button>
		</>
	);
}

export default FinishScreen;
