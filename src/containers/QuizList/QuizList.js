import React, {Component} from 'react'
import classes from './QuizList.module.css'
import { NavLink } from 'react-router-dom'
import Loader from '../../components/UI/Loader/Loader'
import axios from '../../axios/axios-quiz'


class QuizList extends Component {

  state = {
    quizes: [],
    loading: true
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
      const responce = await axios.get('quizes.json')

      const quizes = []

      Object.keys(responce.data).forEach( (key, index) => {
        quizes.push({
          id: key,
          name: `Тест №${index + 1}`
        })
      })

      this.setState({
        quizes,
        loading: false
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
          {
            this.state.loading
              ? <Loader/>
              : <ul>
                  {this.renderQuizes()}
                </ul>
          }
        </div>
      </div>
    )
  }
}

export default QuizList