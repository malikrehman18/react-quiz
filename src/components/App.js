import { useReducer } from "react";
import { useEffect } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

// ======================================== Initial States
const initalState = {
  questions: [],
  // loading, ready,error,active,finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
};
// ======================================= Reducer Function
function reducer(state, action) {
  switch (action.type) {
    case "dataFetch":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const currQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currQuestion.correctOption
            ? state.points + currQuestion.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finish",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "reset":
      return {
        ...state,
        status: "ready",
        points: 0,
        index: 0,
        answer: null,
        highScore: 0,
      };
    default:
      throw new Error("Action unknow");
  }
}
// ======================================== App Component
export default function App() {
  const [state, dispatch] = useReducer(reducer, initalState);
  const { questions, status, index, answer, points, highScore } = state;
  const numQuestions = questions.length;
  const maxPossiblePoint = questions.reduce(
    (acc, curr) => acc + curr.points,
    0
  );
  useEffect(function () {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataFetch", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    fetchData();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoint={maxPossiblePoint}
              answer={answer}
            />
            <Question
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              index={index}
            />
          </>
        )}

        {status === "finish" && (
          <>
            <FinishScreen
              points={points}
              maxPossiblePoint={maxPossiblePoint}
              highScore={highScore}
              dispatch={dispatch}
            />
          </>
        )}
      </Main>
    </div>
  );
}
