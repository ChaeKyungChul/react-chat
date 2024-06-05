import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, storage } from '../config/firebase'
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { FaUserLarge } from "react-icons/fa6";
import { v4 } from 'uuid';

const JoinB = () => {
  const [nick, setNick] = useState('');
  const [userIcon, setUserIcon] = useState('');
  const [userImg, setUserImg] = useState('');
  const [fileName, setFileName] = useState('');
  const nav = useNavigate();
  const user = auth.currentUser;

  //encode Base64 
  const encodeFileToBase64 = (fileB) => {
     const reader = new FileReader();
     reader.readAsDataURL(fileB);
     return new Promise((res)=>{
        reader.onload = () => {
           setUserIcon(reader.result);
           res();
        }
     })
  }

  //확장자 추출
  const extExt = (fileName) => {
     //마지막 점의 위치를 찾음
     const lastDot = fileName.lastIndexOf(".");
     //subString으로 마지막만 추출하고 소문자로 변환
     return fileName.substring(lastDot, fileName.length).toLowerCase();
  }

  const imgChange = (e) => {
     const newIcon = e.target.files[0];
     encodeFileToBase64(newIcon);
     setUserIcon(newIcon);
     setFileName(newIcon.name);
     setUserImg(e.target.files[0]);
     console.log(extExt(fileName));
  }

  const handleSubmit = async (e) =>{
     e.preventDefault();
     let photoURL = "";
     if(fileName !== null){
       try{
          //확장자 추출
          const fileExt = extExt(fileName);
          //이미지 전송
          const imgRef = ref(storage, `userdata/${v4()}${fileExt}`);
          await uploadBytes(imgRef, userImg);
          photoURL = await getDownloadURL(imgRef);
       }catch(err){
          console.error('이미지 업로드 실패', err)
       }
     }
     //이미지 업로드 끝나면 프로필 업데이트, where user로 내용수정
     try{
        await updateProfile(
           user, {
              displayName: nick,
              photoURL
           }
        )
     }catch(err){
        console.error("회원정보 업데이트 실패", err);
     }
     nav('/');
  }

  return (
    <div className="container">
   <div className="row justify-content-center my-5">
   </div>

   <div className="row justify-content-center mt-3">
       <div className="col-md-6 col-lg-5 ">
          <div className="shadow-lg p-3 mb-5 bg-white roundbox">
             <div className="login-wrap icon">
                <span>
                  {
                    fileName ? 
                      <img src={userIcon} alt={fileName} className="userIcon" /> 
                      :
                      <FaUserLarge />
                  }  
                               
                </span>
                <h1>회원가입 2단계</h1>
                <p>닉네임(필수), 프로필사진(선택) 등록</p>
             </div>
             <form className="login-form" method="post">
                <input type="text" 
                       className="form-control" 
                       placeholder="닉네임" 
                       name="nick"
                       value={nick} 
                       onChange={(e)=>setNick(e.target.value)}
                />
                <div className="filebox">
                  <input type="file" 
                         hidden 
                         id="myfile" 
                         onInput={imgChange} />
                  <label htmlFor="myfile"
                      style={{
                        color:'#333',
                        padding:'0.1rem 0.5rem',
                        borderRadius: '0.3rem',
                        cursor:'pointer',
                        marginTop:'2rem',
                        marginRight:'0.5rem',
                        backgroundColor:'#ddd'
                      }}       
                   >이미지선택</label>   
                </div>
           
                <button type="submit" 
                        className="btn btn-primary rounded submit"
                        onClick={handleSubmit}>회원가입완료</button>
                <Link to="/" className="btn btn-link link">회원로그인</Link>
             </form>
          </div> 
       </div>
   </div>
</div>
  )
}

export default JoinB