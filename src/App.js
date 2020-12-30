import React,{useEffect} from 'react'
import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import ChatPage from './components/ChatPage/ChatPage'
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage'

import firebase from './firebase'

import {useDispatch,useSelector} from 'react-redux'
import{
  setUser
} from './redux/actions/user_action'
//라우팅
function App(props) {
  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading)
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user =>{
      //로그인이 된 상태
      if(user){
        //react-router-dom에서 제공하는 기능
        history.push("/")
        dispatch(setUser(user))
      }else{
        history.push("/login")
      }
    })
  }, [])

  if(isLoading){
    return (
      <div>
        로딩중...
      </div>
    )    
  }else{
    return (
      <Switch>
        <Route exact path="/"    component={ChatPage}/>
        <Route exact path="/login"    component={LoginPage}/>
        <Route exact path="/register"    component={RegisterPage}/>
      </Switch>  );
  }
}

export default App;
