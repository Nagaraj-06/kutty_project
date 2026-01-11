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
import ExploreMessages from './pages/ExploreMessages/ExploreMessages'
import UserChat from './pages/UserChat/UserChat'
import SearchBar from './components/SearchBar/SearchBar'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import NotFound from './pages/NotFound/NotFound'

const App = () => {
    return (
        <Router>
            <Switch>
                <Route component={SkillConnect} exact path="/" />
                <Route component={Login} exact path="/login" />
                <Route component={SignIn} exact path="/signin" />
                <Route component={UserProfile} exact path="/profile" />
                <Route component={UserFeedbacks} exact path="/feedbacks" />
                <Route component={SwapRequestForm} exact path="/swap-request-form" />
                <Route component={Dashboard} exact path="/dashboard" />
                <Route component={SwapRequests} exact path="/swap-requests" />
                <Route component={ExploreMessages} exact path="/explore" />
                <Route component={UserChat} exact path="/chat" />
                <Route component={SearchBar} exact path="/search" />
                <Route component={ResetPassword} exact path="/reset-password/:token" />
                <Route component={VerifyEmail} exact path="/verify-email" />
                <Route component={NotFound} path="**" />
                <Redirect to="**" />
            </Switch>
        </Router>
    )
}

export default App
