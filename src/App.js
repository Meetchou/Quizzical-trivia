import './App.css';
import React from "react"
import Question from './components/Question';
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() 
{
	const [questionsTab, setQuestionsTab] = React.useState([])
	const [questionsElements, setQuestionsElements] = React.useState([])
	const [endGame, setEndGame] = React.useState({
		isWon : false,
		isFinish: false,
		score : 0
	})
	
	async function generateQuestions()
	{
		const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
		const data = await res.json()
		console.log(data.results)
		setQuestionsTab(data.results.map((question) => (
			{
				question : question.question,
				answers : createAnswers(question),
				correct_answer : question.correct_answer,
				isCorrect : false
			}
		)

		))
	}

	function createAnswers(question)
	{
		const answersTab = question.incorrect_answers
		answersTab.push(question.correct_answer)
		const shuffledAnswers = answersTab.sort((a, b) => 0.5 - Math.random())
		return shuffledAnswers.map((elem) => ({
			id : nanoid(),
			answer : elem,
			isSelected : false,
			isCorrect : false
		}))
	}

	function selectAnswer(id)
	{
		setQuestionsTab((prevQuestionTab) => (prevQuestionTab.map((question) => {
		return {...question, answers : question.answers.map((answer) => {
				if (answer.id === id)
					return { ...answer, isSelected : true,
						isCorrect : answer.answer === question.correct_answer ? true : false}
				else if (question.answers.some((elem) => elem.id === id))
					return { ...answer, isSelected : false, isCorrect : false}
				return answer
		})}}
		)))
	}

	function checkAnswers()
	{
		const rightAnswersTab = []
		questionsTab.forEach((question) => question.answers.forEach( answer => {
			if (answer.isSelected && answer.isCorrect)
				rightAnswersTab.push(answer)
		}))
		console.log(rightAnswersTab)
		if (rightAnswersTab.length === 5)
			setEndGame({
				isWon : true,
				isFinish : true,
				score : 5
			})
		else 
			setEndGame({
				isWon : false,
				isFinish : true,
				score : rightAnswersTab.length
			})
	}

	function restartGame ()
	{
		generateQuestions()
		setEndGame({
			isWon : false,
			isFinish: false,
			score : 0
		})
	}

	React.useEffect(() => {
		setQuestionsElements(questionsTab.map(question => 
			<Question key={nanoid()} isFinish={endGame.isFinish} handleClick={selectAnswer} question={question}></Question>
			))
	}, [questionsTab, endGame])

	return (
		<div className="App">
		{
			endGame.isWon && <Confetti/>}
			{
			questionsTab.length === 0 ?
				<div className='home-page'>
					<h1 className='home-title'>Quizzical</h1>
					<p className='home-descrption'>Some description if needed</p>
					<button onClick={generateQuestions} className='button-start'>Start quiz</button>
				</div> :
				<div className='quizz-page'>
					{questionsElements}
					{ endGame.isFinish ?
					<div className='end-button'>
						<h5>You scored {endGame.score}/5 correct answers</h5>
						<button onClick={restartGame} className='button-check'>Play again</button>
					</div> :
					<button onClick={checkAnswers} className='button-check'>Check answers</button>
					}
				</div>
		}
			<div>	
			</div>
		</div>
	);
}

export default App;
