import {
    SET_USER,
   
} from './constants'
const initialState = {
    user: {},
    getUserLoading: true,
}
export const setUser = (state = initialState, action) =>{
        switch(action.type){
        case SET_USER:
            return {
                ...state,
                user:action.payload,
                getUserLoading:false
            }
        default: 
            return state;
    }
}