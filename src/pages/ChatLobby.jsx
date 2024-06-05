import React, {useState, useEffect} from 'react'
import { useNavigate, Link} from 'react-router-dom'
import { useAuthValue } from '../context/AuthProvider'
import { db, auth } from '../config/firebase'
import { addDoc, 
         collection, 
         query, 
         orderBy, 
         onSnapshot, 
         serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth'

const ChatLobby = () => {
  const [roomname, setRoomname] = useState("");
  const [roomList, setRoomList] = useState([]);
  const { nick, userIcon, email } = useAuthValue();
  const nav = useNavigate();

  const logout = () => {
     signOut(auth)
       .then(()=>{
          nav("/login");
       })
       .catch((err) => console.error('로그아웃하다가 삑사리', err));
  }

  //db의 chatroom에서 읽기
  const getRoom = () => {
     const sql = query(collection(db, 'chatroom'), orderBy("timestamp", "desc"));
     onSnapshot(sql, (res) => {
        const rooms =res.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setRoomList(rooms);
     });
  }
  useEffect(()=>{
     getRoom();
  }, []);

  //db의 chatroom이라는 테이블에 쓰기
  const handleMakeRoom = async (e) => {
     e.preventDefault();
     const dbref = collection(db, 'chatroom');
        await addDoc(dbref, {
           timestamp: serverTimestamp(),
           title: roomname,
           master: nick,
           email
        });
        setRoomname("");
  }

  return (
    <div className="container">
       <div className="header text-center">
           <img src={userIcon} alt={nick} className="usericon"/>
           <h2 className="text-center">{nick}님 환영합니다.</h2>
           <button type="button" onClick={logout} className="btn btn-warning">로그아웃</button>
       </div>
       <form className="makechat my-4" method="post" onSubmit={handleMakeRoom}>
           <h2 className="text-center">채팅방개설</h2>
           <input 
               type="text"
               placeholder="채팅룸이름을 쓰세요"
               name="roomname"
               value={roomname}
               onChange={(e)=>setRoomname(e.target.value)}
           />
           <button type="submit"
                   className="btn btn-primary"
            >채팅방만들기</button>           
       </form>
       <div className="row">
           {
              (roomList) && 
                 roomList.map((rs, index)=>(
                    <div className="col-3" key={index}>
                       <Link to={`/chat/${rs.id}`}>{rs.title}</Link>
                       <p>(방장 : {rs.master}님)</p>
                    </div>  
                 ))
           }
       </div>
    </div>
  )
}

export default ChatLobby