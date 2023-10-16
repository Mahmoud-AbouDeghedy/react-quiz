function NextButton({ dispatch, answer, index, numQuestions }) {
	if (answer !== null && index < numQuestions - 1)
		return (
			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: "NEXT_QUESTION" })}
			>
				Next
			</button>
		);
	if (answer !== null && index === numQuestions - 1)
		return (
			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: "FINISH" })}
			>
				Finish
			</button>
		);
}

export default NextButton;
