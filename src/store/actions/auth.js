import axios from 'axios'
import {AUTH_LOGOUT, AUTH_SUCCESS} from './actionTypes'

export  function auth(email, password, isLogin) {
  return async dispatch => {
    const authData = {
      email, password, returnSecureToken: true
    }

    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAZFWEfV-y6YeZKKmHRRNfnibUK7NeN4oM';

    if(isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAZFWEfV-y6YeZKKmHRRNfnibUK7NeN4oM';
    }
    const responce = await axios.post(url, authData)
    // console.log(responce)
    const data = responce.data

    const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000)

    localStorage.setItem('token', data.idToken)
    localStorage.setItem('userID', data.localId)
    localStorage.setItem('expirationDate', expirationDate)

    dispatch(authSuccess(data.idToken))
    dispatch(autoLogout(data.expiresIn))
  }
}

export function autoLogout(time) {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, time * 1000)
  }
}

export function logout() {

  localStorage.removeItem('token')
  localStorage.removeItem('userID')
  localStorage.removeItem('expirationDate')

  return {
    type: AUTH_LOGOUT
  }
}

export function authSuccess(token) {
  return {
    type: AUTH_SUCCESS,
    token
  }
}
