import React,{useRef,useState} from 'react'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import firebase from '../../firebase'
import md5 from 'md5'

function RegisterPage() {

    const {register,watch,errors,handleSubmit} =useForm();
    const [errorFromSubmit, seterrorFromSubmit] = useState("")
    //로딩 중 클릭 방지
    const [loading, setloading] = useState(false)
    const password =useRef()
    password.current = watch("password")

    const onSubmit = async (data) =>{

        try{
            setloading(true)
            let createdUser = await firebase
            .auth()
            .createUserWithEmailAndPassword(data.email,data.password)
            setloading(false)

            await createdUser.user.updateProfile({
                displayName:data.name,
                photoURL: `http:gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            })
            //파베 db에 저장하기
            await firebase.database().ref("users").child(createdUser.user.uid).set({
                name:createdUser.user.displayName,
                image:createdUser.user.photoURL
            })
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
                <h3>Register</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true})}
                />
                {errors.email && errors.email.type==="required" && <p>This field is required</p>}
                <label>Name</label>
                <input
                    name="name"
                    ref={register({ required: true, maxLength: 10 })}
                />
                {errors.name && errors.name.type==="required" && <p>This field is required</p>}
                {errors.name && errors.name.type==="maxLength" && <p>10자 미만</p>}
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type==="required" && <p>This field is required</p>}
                {errors.password && errors.password.type==="minLength" && <p>비밀번호 6자 이상</p>}
                <label>Password Confirm</label>
                <input
                    name="password_confirm"
                    type="password"
                    ref={register({ required: true, validate:(value)=>value === password.current })}
                />
                {errors.password_confirm && errors.password_confirm.type==="required" && <p>This field is required</p>}
                {errors.password_confirm && errors.password_confirm.type==="validate" && <p>비밀번호가 다름</p>}
                    {errorFromSubmit &&
                    <p>{errorFromSubmit}</p>}
                
                <input type="submit" disabled={loading}/>
                <Link style={{color:'gray',textDecoration:'none'}} to="login">이미 아이디가 있다면...</Link>
            </form>
        </div>
    )
}

export default RegisterPage
