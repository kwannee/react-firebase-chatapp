import {
    SET_USER,
    CLEAR_USER,
    SET_PHOTO_URL
} from '../actions/types'

const initialUserState ={
    currentUser : null,
    isLoading : true
}

export default function(state = initialUserState,action){
    switch(action.type){
        case SET_USER:
            return{
                ...state,
                currentUser:action.payload,
                isLoading : false
            }
        case CLEAR_USER:
            return{
                ...state,
                currentUser : null,
                isLoading : false
            }
        case SET_PHOTO_URL:
            //currentUser다 그대로 두고 포토URL만 앣ㄴ의 페이로드로 변경
            return{
                ...state,
                currentUser:{...state.currentUser, photoURL:action.payload},
                isLoading : false
            }
        default:
            return state;
    }
}