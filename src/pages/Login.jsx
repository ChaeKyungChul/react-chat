import React, { useState, useEffect } from 'react'
import { FaUserLarge } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [useremail, setUseremail] = useState(""); 
  const [userpass, setUserpass] = useState("");
  const nav = useNavigate();

  useEffect(()=>{
    if(auth.currentUser) {
        nav("/");  //로그인이 되어 있다면 바로 메인으로 넘김
    }
  }, [nav]);

  const handleLogin = async (e) => {
     e.preventDefault();
     if(!useremail){
        alert("이름을 입력하세요.");
        return;
     }else if(!userpass){
        alert("비밀번호를 입력하세요");
        return;
     }else{
        try{
           const res = await signInWithEmailAndPassword(auth, useremail, userpass);
           console.log(res); 
           const user = auth.currentUser;
           if(user.displayName){
                nav("/");
           }else{
               alert("회원가입이 완료되지 않았습니다. \n 회원가입을 완료해 주세요.");
               nav("/joinb");
           }
        }catch(err){
            alert("아이디, 또는 비밀번호가 틀렸습니다.");
            setUseremail("");
            setUserpass("");
            console.error("회원로그인 도중 에러발생", err);
            return;
        }   
     }
  }
  return (
    <div className="container">
       <div className="row justify-content-center my-5">
       </div>
       <div className="row justify-content-center mt-3">
           <div className="col-md-6 col-lg-5 ">
              <div className="shadow-lg p-3 mb-5 bg-white roundbox">
                 <div className="login-wrap icon">
                    <span><FaUserLarge /></span>
                    <h1>LOGIN</h1>
                 </div>
                 <form className="login-form" onSubmit={handleLogin}>
                    <input type="text" 
                           className="form-control" 
                           placeholder="userid" 
                           name="useremail"
                           value={useremail}
                           onChange={(e)=>setUseremail(e.target.value)}       
                    />
                    <input type="password" 
                           className="form-control" 
                           placeholder="userpass" 
                           name="userpass"
                           value={userpass}
                           onChange={(e)=>setUserpass(e.target.value)}       
                    />
                    <button 
                           type="submit" 
                           className="btn btn-primary rounded submit">
                              로그인
                     </button>
                    <Link to="/joina" className="btn btn-link link">회원가입</Link>
                 </form>
              </div> 
           </div>
       </div>
    </div>
  )
}

export default Login