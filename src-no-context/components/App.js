import { useEffect, useReducer } from "react";

import Header from "./Header";
import Loader from "./Loader";
import Main from "./Main";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const initialState = {
	questions: [],
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondsRemaining: null,
};

function reducer(state, action) {
	switch (action.type) {
		case "FETCHED_QUESTIONS":
			return { ...state, questions: action.payload, status: "ready" };
		case "Error fetching questions":
			return { ...state, status: "error" };
		case "START_QUIZ":
			return {
				...state,
				status: "active",
				secondsRemaining: 30 * state.questions.length,
			};
		case "SELECT_ANSWER":
			const question = state.questions[state.index];
			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};
		case "NEXT_QUESTION":
			return { ...state, index: state.index + 1, answer: null };
		case "FINISH":
			return {
				...state,
				status: "finished",
				highscore:
					state.points > state.highscore ? state.points : state.highscore,
			};
		case "Restart":
			return {
				...initialState,
				highscore: state.highscore,
				questions: state.questions,
				status: "ready",
			};
		case "Tick":
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? "finished" : state.status,
			};
		default:
			throw new Error(`Unrecognized action: ${action.type}`);
	}
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {
		questions,
		status,
		index,
		answer,
		points,
		highscore,
		secondsRemaining,
	} = state;
	const maxPoints = questions.reduce((acc, curr) => acc + curr.points, 0);

	useEffect(function () {
		fetch("http://localhost:5000/questions")
			.then((res) => res.json())
			.then((data) => dispatch({ type: "FETCHED_QUESTIONS", payload: data }))
			.catch((err) => dispatch({ type: "Error fetching questions" }));
	}, []);

	return (
		<div className="app">
			<Header />
			<Main>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen numQuestions={questions.length} dispatch={dispatch} />
				)}
				{status === "active" && (
					<>
						<Progress
							index={index}
							numQuestions={questions.length}
							points={points}
							maxPoints={maxPoints}
							answer={answer}
						/>
						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
							<NextButton
								dispatch={dispatch}
								answer={answer}
								index={index}
								numQuestions={questions.length}
							/>
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen
						points={points}
						maxPoints={maxPoints}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}

export default App;
