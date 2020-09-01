import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home.jsx';
import Signup from './user/Signup.jsx';
import Signin from './user/Signin.jsx';
import Menu from './core/Menu';
import Profile from './user/Profile.jsx';
import Users from './user/User.jsx';
import EditProfile from './user/EditProfile.jsx';

const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/user/edit/:userId" component={EditProfile} />
            <Route exact path="/user/:userId" component={Profile} />
        </Switch>
    </div>
)

export default MainRouter;
