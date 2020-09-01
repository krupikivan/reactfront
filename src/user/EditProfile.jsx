import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import { read, update } from './apiUser'
import { Redirect } from 'react-router-dom'

class EditProfile extends Component {

    constructor() {
        super()
        this.state = {
            error: "",
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false
        }
    }

    init = userId => {
        const token = isAuthenticated().token
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToSignin: true })
                }
                else {
                    this.setState({ id: data._id, name: data.name, email: data.email })
                }
            })
    }

    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId)
    }

    isValid = () => {
        const { name, email, password } = this.state
        if (name.length == 0) {
            this.setState({ error: "Name is required" })
            return false
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({ error: "Email is not valid" })
            return false
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({ error: "Password must be at least 6 characters" })
            return false
        }
        return true
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    }

    clickSubmit = event => {
        event.preventDefault()
        if (this.isValid()) {
            const { name, email, password } = this.state;
            const user = {
                name,
                email,
                password: password || undefined
            };
            const userId = this.props.match.params.userId
            const token = isAuthenticated().token
            update(userId, token, user)
                .then(data => {
                    console.log(data);
                    if (data.error) this.setState({ error: data.error })
                    else this.setState({
                        redirectToProfile: true
                    })
                })
        }
    }

    updateForm = (name, email, password) => {
        return <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={this.handleChange("name")} type="text" className="form-control" value={name} />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={this.handleChange("email")} type="email" className="form-control" value={email} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={this.handleChange("password")} type="password" className="form-control" value={password} />
            </div>
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">UPDATE</button>
        </form>
    }

    render() {
        const { id, name, email, password, redirectToProfile, error } = this.state
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>{error}</div>
                {this.updateForm(name, email, password)}
            </div>
        )
    }
}

export default EditProfile;
