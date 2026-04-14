import {useContext}from 'react'
import AuthContext from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import Loader from './Loader';

function RequireAuth({children}) {
    const {authStatus} = useContext(AuthContext);

    const location = useLocation();

    if(authStatus === 'unknown'){
        return <Loader/>
    }

    if(authStatus === 'guest'){
        return <Navigate to="/login" replace state={{from: location}}/>
    }
    
    //replace: replaces current entry in the browser alsmot like a redirect lool for ggod UX
    //children prop: whatever is wrapped inside RequireAuth
    return children
}

export default RequireAuth