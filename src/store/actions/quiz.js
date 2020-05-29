import axios from "../../axios/axios-quiz";
import {
  FETCH_QUIZES_START,
  FETCH_QUIZES_SUCCESS,
  FETCH_QUIZES_ERROR,
  FETCH_QUIZE_SUCCESS,
  QUIZ_SET_STATE,
  FINISH_QUIZ,
  QUIZ_NEXT_QUESTION,
  QUIZ_RETRY
} from './actionTypes'

export function fetchQuizes() {
  return async dispatch => {
    dispatch(fetchQuizesStart())

    try {
      const responce = await axios.get('quizes.json')

      const quizes = []

      Object.keys(responce.data).forEach( (key, index) => {
        quizes.push({
          id: key,
          name: `Тест №${index + 1}`
        })
      })

      dispatch(fetchQuizesSuccess(quizes))
    } catch (error) {
      dispatch(fetchQuizesError(error))
    }
  }
}

export function fetchQuizById(quizId) {
  // описываем логику загрузки теста по id
  return async dispatch => {
    dispatch(fetchQuizesStart())

    try {
      const response = await axios.get(`/quizes/${quizId}.json`)
      const quiz = response.data
      
      dispatch(fetchQuizeSuccess(quiz))
    } catch (e) {
      console.log(e);
      dispatch(fetchQuizesError(e))
    }
  }
}

export function fetchQuizeSuccess(quiz) {
  return {
    type: FETCH_QUIZE_SUCCESS,
    quiz
  }
}

export function fetchQuizesStart() {
  return {
    type: FETCH_QUIZES_START
  }
}

export function fetchQuizesSuccess(quizes) {
  return {
    type: FETCH_QUIZES_SUCCESS,
    quizes: quizes
  }
}

export function fetchQuizesError(e) {
  return {
    type: FETCH_QUIZES_ERROR,
    error: e
  }
}

export function quizSetState(answerState, results) {
  return {
    type: QUIZ_SET_STATE,
    answerState, results
  }
}

export function finishQuiz() {
  return {
    type: FINISH_QUIZ
  }
}

export function quizNextQuestion(number) {
  return {
    type: QUIZ_NEXT_QUESTION,
    number
  }
}

export function retryQuiz() {
  return {
    type: QUIZ_RETRY
  }
}

export function quizAnswerClick(answerId) {
  // возвращаем диспатч тк в методу будут ассинхронные операции
  // redux-thunk может вторым параметром получать функцию getState
  return (dispatch, getState) => {
    const state = getState().quiz;

    if (state.answerState) {
      const key = Object.keys(state.answerState)[0]
      if(state.answerState[key] === 'success'){
        return
      }
        
    }

    const question = state.quiz[state.activeQuestion]
    const results = state.results

    if(question.rightAnswerId === answerId) {
      if(!results[question.id]) {
        results[question.id] = 'success'
      }

      dispatch(quizSetState({[answerId]: 'success'}, results))

      const timeout = window.setTimeout(() => {
        if (isQuizFinished(state)) {
          // завершает тест
          dispatch(finishQuiz())
        } else {
          // переключает вопрос
          dispatch(quizNextQuestion(state.activeQuestion + 1))
        }
        
        window.clearTimeout(timeout)
      }, 1000)
    } else {
      results[question.id] = 'error'
      dispatch(quizSetState({[answerId]: 'error'}, results))
    }
  }
}

//если закончились вопросы
function isQuizFinished(state) {
  return state.activeQuestion + 1 === state.quiz.length
}