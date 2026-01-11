import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from 'react-router-dom'

import './styles/global.css'
import SkillConnect from './pages/SkillConnect/SkillConnect'
import Login from './pages/Login/Login'
import SignIn from './pages/SignIn/SignIn'
import UserProfile from './pages/UserProfile/UserProfile'
import UserFeedbacks from './pages/UserFeedbacks/UserFeedbacks'
import SwapRequestForm from './pages/SwapRequestForm/SwapRequestForm'
import Dashboard from './pages/Dashboard/Dashboard'
import SwapRequests from './pages/SwapRequests/SwapRequests'
import Messages from './pages/Messages/Messages'
import Chats from './pages/Chats/Chats'
import SearchBar from './components/SearchBar/SearchBar'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import ForgetPassword from './pages/ForgetPassword/ForgetPassword'
import NotFound from './pages/NotFound/NotFound'
import Header from './components/Header/Header'

const App = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route component={SkillConnect} exact path="/explore" />
                <Route component={Login} exact path="/login" />
                <Route component={SignIn} exact path="/signin" />
                <Route component={UserProfile} exact path="/profile" />
                <Route component={UserFeedbacks} exact path="/feedbacks/:userId" />
                <Route component={SwapRequestForm} exact path="/swap-request-form" />
                <Route component={Dashboard} exact path="/dashboard" />
                <Route component={SwapRequests} exact path="/swap-requests" />
                <Route component={Messages} exact path="/messages" />
                <Route component={Chats} exact path="/chats" />
                <Route component={SearchBar} exact path="/search" />
                <Route component={ResetPassword} exact path="/reset-password/:token" />
                <Route component={VerifyEmail} exact path="/verify-email" />
                <Route component={ForgetPassword} exact path="/forgot-password" />
                <Route component={NotFound} path="**" />
                <Redirect to="**" />
            </Switch>
        </Router>
    )
}

export default App
