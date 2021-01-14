import React,{useState,useRef} from 'react'
import Form from 'react-bootstrap/Form'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import firebase from '../../../firebase'
//함수형이기 때문에 리덕스를 사용(useSelector)
import {useSelector} from 'react-redux'
import mime from 'mime-types'
function MessageForm() {
    const chatRoom = useSelector(state =>state.chatRoom.currentChatRoom)
    const user = useSelector(state =>state.user.currentUser)
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const [percentage, setPercentage] = useState(0)
    const messagesRef = firebase.database().ref("messages")
    const inputOpenImageRef = useRef();
    const storageRef = firebase.storage().ref();
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const handleChange = (event) => {
        setContent(event.target.value)
    }

    //파라미터 디폴트 지정하는 방법
    const createMessage =  (fileUrl = null) =>{
        const message = {
            timestamp : firebase.database.ServerValue.TIMESTAMP,
            user:{
                id:user.uid,
                name:user.displayName,
                image:user.photoURL
            }
        }
        if(fileUrl !== null){
            message["image"] = fileUrl;
        }else{
            message["content"] =content;
        }
        return message
    }
    const handleSubmit = async () =>{
        if (!content){
            setErrors(prev =>prev.concat("Type contents first"))
            return;
        }
        setLoading(true);
        
        //파이어베이스에 메시지 저장
        try{
            await messagesRef.child(chatRoom.id).push().set(createMessage())
            setLoading(false)
            setContent("")
            setErrors([])
        }catch(error){
            setErrors(pre => pre.concat(error.message))
            setLoading(false)
            setTimeout(() => {
                setErrors([])
            }, 5000);
        }
    }
    const handleOpenImageRef = () =>{
        inputOpenImageRef.current.click()
    }
    const getPath = () =>{
        return isPrivateChatRoom ? `/message/private/${chatRoom.id}` : '/message/public'
    }
    const handleUploadImage = (event) =>{
        const file = event.target.files[0]
        if(!file) return
        const filePath = `${getPath()}/${file.name}`
        //mime으로 파일의 메타데이터를 다룬다.
        const metadata = {constentType:mime.lookup(file.name)}
        setLoading(true)
        try{
            //원래 await storageRef였다. 근데 프로그레스바를 하려면 업로드 되는 와중에 실시간으로 반응해야 하는데 그렇게 안되니까 뺐다.
            let uploadTask = storageRef.child(filePath).put(file,metadata)
            uploadTask.on("state_changed",
            UploadTaskSnapshot=>{
                const percentage = Math.round((UploadTaskSnapshot.bytesTransferred/UploadTaskSnapshot.totalBytes)*100)
            setPercentage(percentage)   
            },
            err=>{
                console.error(err);
                setLoading(false)
            },
            () =>{
                //저장이 다 된 후 파일 메세지 전송
                //저장된 파일을 다운할 수 있응 url 가져오기
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL =>{
                        messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL))
                        setLoading(false)
                    })
            }
            )
        }catch(error){
            alert(error)
        }
    }
    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                    value = {content}
                    onChange = {handleChange}
                    as="textarea" rows={3} />
                </Form.Group>
            </Form>
            {
                !(percentage === 0 || percentage === 100) &&
                <ProgressBar variant="warning" label={`${percentage}%`} now={percentage} />
            }
            <div>
                {errors.map(errorMsg => <p style={{color:'red'}} key={errorMsg}></p>)}
            </div>

            <Row>
                <Col>
                    <button
                    onClick={handleSubmit}
                    className="message-form-button"
                     style ={{width:'100%'}}
                     >
                         SEND
                     </button>
                </Col>
                <Col>
                    <button
                    onClick={handleOpenImageRef}
                    className="message-form-button"
                     style ={{width:'100%'}}
                     disabled={loading}
                     >
                         UPLOAD
                     </button>
                </Col>
            </Row>
            {/**useRef를 이용하여 upload 돔을 선택해야함. */}
            {/**onChange가 있어야 업로드한 파일을 db에 업로드할 수 있음 */}
            <input
                accept="image/jpeg,image/png"
                style={{display:'none'}}
                type="file"
                ref={inputOpenImageRef}
                onChange={handleUploadImage}
            />
        </div>
    )
}

export default MessageForm
