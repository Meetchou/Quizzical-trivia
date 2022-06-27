import React from "react"
// import {nanoid} from 'nanoid'

export default function Question (props) {
	console.log(props.isFinish)
	const SelectedStyle  = {
		backgroundColor : "#D6DBF5"
	}

	const correctStyle = {
		backgroundColor : "#94D7A2"
	}

	const incorrectStyle = {
		backgroundColor : "#F8BCBC"
	}

	const answersElements = props.question.answers.map( (elem) =>
		props.isFinish ?
		<div className="answers-button" style={elem.isCorrect ? correctStyle : 
			elem.isSelected ? incorrectStyle : {}} key={elem.id}>{elem.answer}</div> :
		<div style={elem.isSelected ? 
			SelectedStyle : {}} 
		onClick={() => props.handleClick(elem.id)} 
		className="answers-button" key={elem.id}>
			{elem.answer}
		</div>
	)
	return (
		<div className="question-container">
			<h2 className="question-title" >{props.question.question}</h2>
			<div className="answers-container">{answersElements}</div>
		</div>
		

	)
}