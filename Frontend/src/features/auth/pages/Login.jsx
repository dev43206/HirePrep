import React,{useState} from 'react'
import "../auth.form.scss"
import { useNavigate ,Link} from 'react-router'
import { useAuth } from '../hooks/useAuth'



function Login() {

    const {loading,handleLogin} = useAuth()
    
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setErrorMessage("")
        const result = await handleLogin({email,password})
        if(result.success){
            navigate('/')
        } else {
            setErrorMessage(result.message)
        }
    }

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }


  return (

    
    <main>
        <div className="form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                {errorMessage && (
                    <div className="form-message form-message--error" role="alert">
                        {errorMessage}
                    </div>
                )}

                <div className={`input-group ${errorMessage ? 'input-group--error' : ''}`}>
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e) => {setEmail(e.target.value)}}
                    type="email" id='email' name='email' placeholder='Enter email address' />

                </div>
                <div className={`input-group ${errorMessage ? 'input-group--error' : ''}`}>
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e) => {setPassword(e.target.value)}}
                    type="password" id='password' name='password' placeholder='Enter password' />

                </div>

                <button className='button primary-button' disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

            </form>

            <p>Don't have an account?<Link to={"/register"}>Register</Link></p>
        </div>
    </main>
  )
}

export default Login