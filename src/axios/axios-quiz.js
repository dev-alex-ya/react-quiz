import axios from 'axios'

export default axios.create({
  baseURL: 'https://react-quiz-40821.firebaseio.com'
})