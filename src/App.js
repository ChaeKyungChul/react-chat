import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AuthProvider } from './context/AuthProvider'
import Login from './pages/Login'
import ChatLobby from './pages/ChatLobby'
import ChatRoom from './pages/ChatRoom'
import JoinA from './pages/JoinA'
import JoinB from './pages/JoinB'

const App = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [userIcon, setUserIcon] = useState("");

  const waitForAuthChange = () => {
     return new Promise(resolve => {  //promise 의 결과값을 일부러 만듬
        const unsub = onAuthStateChanged(auth, (user)=>{
           if(user){
              setIsLogged(true);
              setEmail(user.email);
              setNick(user.displayName);
              setUserIcon(user.photoURL);
              resolve(); //사용자 인증 성공이면 Promise에 값을 담고 해결
           }
        });
        return ()=>unsub(); //컴포넌트가 언마운트 될때 구독을 해제
     });
  }

  //인증상태 해결
  const handleAuthChange = async() => {
     try{
        await waitForAuthChange();
        console.log("사용자 인증이 되어 있음묘");
     }catch(error){
        console.error("오류가 발생했씀묘", error);
     }
  }

  useEffect(()=>{
    handleAuthChange();
  },[]);

  return (
    <Router>
      <AuthProvider value={{email, nick, userIcon}}>
          <Routes>
            {
              isLogged ? (
                <Route exact path="/" element={<ChatLobby />}/>
              ) : (
                <Route exact path="/" element={<Login />}/>
              )
            }
            <Route path="/chat/:id" element={<ChatRoom />} />
            <Route exact path="login" element={<Login />}/>
            <Route path="joina" element={<JoinA />} />
            <Route path="joinb" element={<JoinB />} />
          </Routes> 
       </AuthProvider>
    </Router>  
  )
}

export default App