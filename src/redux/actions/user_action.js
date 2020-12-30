import {
    SET_USER,
    CLEAR_USER,
    SET_PHOTO_URL
} from './types'
export function setUser(user){
    return{
        type:SET_USER,
        payload:user
    }
}
export function clearUser(){
    return{
        type:CLEAR_USER
    }
}

export function setPhotoURL(photoURL){
    //payload는 parameter를 넣는데 뭘 바꾸는지 알려주는거인듯?
    return{
        type:SET_PHOTO_URL,
        payload:photoURL
    }
}