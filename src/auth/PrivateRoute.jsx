import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '.'

// Porps means components passed down to this private route component
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => isAuthenticated() ? (
        <Component {...props} />
    ) : (
            <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
        )} />
)

export default PrivateRoute
