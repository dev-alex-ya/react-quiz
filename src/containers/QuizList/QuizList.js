import React, {Component} from 'react'
import classes from './QuizList.module.css'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

class QuizList extends Component {

  state = {
    quizes: []
  }

  renderQuizes(){
    console.log('this.state.quizes: ', this.state.quizes);
    
    return this.state.quizes.map((quiz) => {
      return (
        <li key={quiz.id}>
          <NavLink to={'/quiz/' + quiz.id}>
            Test {quiz.name}
          </NavLink>
        </li>
      )
    })
  }

  async componentDidMount () {
    try {
      const responce = await axios.get('https://react-quiz-40821.firebaseio.com/quizes.json')

      const quizes = []

      Object.keys(responce.data).forEach( (key, index) => {
        quizes.push({
          id: key,
          name: `Тест №${index + 1}`
        })
      })

      this.setState({
        quizes
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div className={classes.QuizList}>
        <div>
          <h1>Список тестов</h1>
          <ul>
            {this.renderQuizes()}
          </ul>
        </div>
      </div>
    )
  }
}

export default QuizList