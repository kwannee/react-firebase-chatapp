import React,{useRef} from 'react'
import {IoIosChatboxes} from 'react-icons/io'
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image'
import {useDispatch,useSelector} from 'react-redux'
import firebase from '../../../firebase'
import mime from 'mime-types'
import {setPhotoURL} from '../../../redux/actions/user_action'

function UserPanel() {
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch();
    const inputOpenImageRef = useRef()
    const handleOpenImageRef = () =>{
        inputOpenImageRef.current.click()
    }
    
    const handleLogout = () =>{
        firebase.auth().signOut()
    }
    const handleUploadImage = async (event) => {
         const file = event.target.files[0]
         const metadata = {contentType:mime.lookup(file.name)}
            //파일 이름 바꾸는 법/// 근데 생각해보니 이럴필요 없고 그냥 강의 방식대로 하는데 ${user.uid} 이 부분을 이름으로 바꾸면 됨
        //  let blob = file.slice(0,file.size,'image/png')
        //  let newFile = new File([blob], 'new.png',{type:'image/png'})
         //스토리지에 파일 저장
         try{
            let uploadTaskSnapshot = await firebase.storage().ref()
                .child(`user_image/${user.uid}`)
                .put(file,metadata)
                
            let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL()
            console.log(downloadURL)
            await firebase.auth().currentUser.updateProfile({
                photoURL:downloadURL
            })
            dispatch(setPhotoURL(downloadURL))

            //DB에 유저 이미지 수정
            await firebase.database().ref('users')
                .child(user.uid)
                .update({image:downloadURL})
         }catch(error){
            alert(error)
         }
    }
    return (
        <div>
            {/**Logo */}
            <h3 style={{color:'white'}}>
                <IoIosChatboxes/>
            </h3>
            <div style={{display:'flex',marginBottom:'1rem'}}>
                <Image src={user && user.photoURL}
                    style={{width:'30px',height:'30px',marginTop:'3px'}}
                    roundedCircle />
                <input
                    type="file"
                    accept="image/jpeg,image/png"
                    ref={inputOpenImageRef}
                    style={{display:'none'}}
                    onChange={handleUploadImage}/>
                <Dropdown>
                    <Dropdown.Toggle 
                        style={{background:'transparent',border:'0px'}}
                        id="dropdown-basic">
                        {user && user.displayName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleOpenImageRef}>
                            프로필 사진 변경
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                             로그아웃
                        </Dropdown.Item>                    
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserPanel
