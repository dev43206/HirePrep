import React,{useState} from 'react'
import { useNavigate ,Link} from 'react-router'
import { useAuth } from '../hooks/useAuth'


function Register() {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const {loading,handleRegister} = useAuth()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setErrorMessage("")
        const result = await handleRegister({username,email,password})
        if(result.success){
            navigate("/")
        } else {
            setErrorMessage(result.message)
        }
    }
    if(loading){
        return (<main><h1>Loading.....</h1></main>)
    }

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                {errorMessage && (
                    <div className="form-message form-message--error" role="alert">
                        {errorMessage}
                    </div>
                )}

                <div className={`input-group ${errorMessage ? 'input-group--error' : ''}`}>
                    <label htmlFor="username">Username</label>
                    <input 
                    onChange={(e) => {setUsername(e.target.value)}}
                    type="text" id='username' name='username' placeholder='Enter Username' />

                </div>

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
                    {loading ? 'Creating account...' : 'Register'}
                </button>

            </form>

            <p>Already have an account? <Link to={"/login"}>Login</Link></p>
        </div>
    </main>
  )
}

export default Register