import { useContext ,useEffect} from "react";
import { AuthContext } from "../auth.context";
import {login,register,logout,getMe} from "../services/auth.api"


export const useAuth = ()=>{

    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context

    const handleLogin = async ({email,password}) =>{
        setLoading(true)
        try {
            const data = await login({email,password})
            if (data?.user) {
                setUser(data.user)
                return { success: true, message: data?.message || "Login successful" }
            }
            return { success: false, message: data?.message || "Login failed" }
        } catch (err) {
            const message = err?.response?.data?.message || "Invalid email or password"
            console.error(err)
            return { success: false, message }
        } finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({username,email,password}) =>{
        setLoading(true)
        try {
            const data = await register({username,email,password})
            if (data?.user) {
                setUser(data.user)
                return { success: true, message: data?.message || "Registration successful" }
            }
            return { success: false, message: data?.message || "Registration failed" }
        } catch (err) {
            const message = err?.response?.data?.message || "Registration failed"
            console.error(err)
            return { success: false, message }
        } finally{
            setLoading(false)
        }
    }

    const handleLogout = async () =>{
        setLoading(true)
        try {
            await logout()
            setUser(null)
            return true
        } catch (err) {
            console.error(err)
            return false
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        let isMounted = true;

        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                if (isMounted && data?.user) {
                    setUser(data.user);
                }
            } catch (err) {
                if (isMounted) {
                    setUser(null);
                }
                console.error(err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        getAndSetUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return {user,loading,handleLogin,handleLogout,handleRegister}

}