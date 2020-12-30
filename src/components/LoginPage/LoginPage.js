import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import firebase from '../../firebase'

function LoginPage() {

    const {register,errors,handleSubmit} =useForm();
    const [errorFromSubmit, seterrorFromSubmit] = useState("")
    //로딩 중 클릭 방지
    const [loading, setloading] = useState(false)
    const onSubmit = async (data) =>{

        try{
            setloading(true)
            await firebase.auth().signInWithEmailAndPassword(data.email,data.password)
            setloading(false)
        }catch(error){
            seterrorFromSubmit(error.message)
            setTimeout(()=>{
                seterrorFromSubmit("")
            },2000)
        }
        
    }
    return (
        <div className="auth-wrapper">
            <div style={{textAlign:'center'}}>
                <h3>Login</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true})}
                />
                {errors.email && errors.email.type==="required" && <p>This field is required</p>}
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type==="required" && <p>This field is required</p>}
                {errors.password && errors.password.type==="minLength" && <p>비밀번호 6자 이상</p>}
                <input type="submit" disabled={loading}/>
                <Link style={{color:'gray',textDecoration:'none'}} to="register">아직 아이디가 없다면...</Link>
            </form>
        </div>
    )
}

export default LoginPage
