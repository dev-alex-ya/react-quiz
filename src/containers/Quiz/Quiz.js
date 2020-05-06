import React, {Component} from 'react'
import classes from './Quiz.module.css'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'

class Quiz extends Component {
  state = {
    isFinished: true,
    activeQuestion: 0,
    answerState: null, // {[id]: 'success', 'error'}
    quiz: [
      {
        question: 'Какого цвета небо?',
        rightAnswerId: 2,
        answers: [
          {text: 'Черный', id: 1},
          {text: 'Синий', id: 2},
          {text: 'Красный', id: 3},
          {text: 'Зеленый', id: 4}
        ]
      },
      {
        question: 'В каком году основан Санкт-Петербург?',
        rightAnswerId: 3,
        answers: [
          {text: '1700', id: 1},
          {text: '1702', id: 2},
          {text: '1703', id: 3},
          {text: '1800', id: 4}
        ]
      }
    ]
  }

  

  onAnswerClickHandler = (answerId) => {
    if (this.state.answerState) {
      // Т.к. заранее неизвестно какой id будет получен в ответе,
      // то вытаскиваем ключ-id из объекта answerState
      const key = Object.keys(this.state.answerState)[0]
      // И если этот ответ оказался правильным,
      // то сразу выходим из хендлера
      if(this.state.answerState[key] === 'success')
        return
    }

    const question = this.state.quiz[this.state.activeQuestion]

    if(question.rightAnswerId === answerId) {

      this.setState({
        answerState: {[answerId]: 'success'}
      })

      const timeout = window.setTimeout(() => {
        
        if (this.isQuizFinished()) {
          this.setState({
            isFinished: true
          })
        } else {
          this.setState({
            activeQuestion: this.state.activeQuestion + 1,
            answerState: null
          })    
        }
        
        window.clearTimeout(timeout)
      }, 1000)

      console.log("Правильный ответ") 
    } else {
      this.setState({
        answerState: {[answerId]: 'error'}
      })
      console.log("Не правильный ответ")
    }
  }

  //если закончились вопросы
   isQuizFinished(){
    return this.state.activeQuestion + 1 === this.state.quiz.length
  }

  render() {
    return (
      <div className={classes.Quiz}>
        <div className={classes.QuizWrapper}>
          <h1>Ответьте на все вопросы</h1>
          {
            this.state.isFinished
            ? <FinishedQuiz />
            : <ActiveQuiz
                question={this.state.quiz[this.state.activeQuestion].question}
                answers={this.state.quiz[this.state.activeQuestion].answers}
                onAnswerClick={this.onAnswerClickHandler}
                quizLength={this.state.quiz.length}
                answerNumber={this.state.activeQuestion + 1}
                state={this.state.answerState}
              />
          }
          

        </div>
      </div>
    )
  }
}

export default Quiz