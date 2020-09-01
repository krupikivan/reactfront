import React, { Component } from 'react'
import { isAuthenticated } from '../auth'
import { read, update } from './apiUser'
import { Redirect } from 'react-router-dom'
import DefaultProfile from '../images/loading.jpg'
import Loading from './Loading'

class EditProfile extends Component {

    constructor() {
        super()
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false
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
        this.userData = new FormData()
        const userId = this.props.match.params.userId
        this.init(userId)
    }

    isValid = () => {
        const { name, email, password, fileSize } = this.state
        if (fileSize > 100000) {
            this.setState({ error: "File size should be less than 100 kb" })
            return false
        }
        if (name.length === 0) {
            this.setState({ error: "Name is required" })
            return false
        }
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
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
        const value = name === "photo" ? event.target.files[0] : event.target.value
        const fileSize = name === "photo" ? event.target.files[0].fileSize : 0
        this.userData.set(name, value)
        this.setState({ [name]: value, fileSize })
    }

    clickUpdate = event => {
        event.preventDefault()
        this.setState({ loading: true })
        if (this.isValid()) {
            const { userData } = this;
            const userId = this.props.match.params.userId
            const token = isAuthenticated().token
            update(userId, token, userData)
                .then(data => {
                    console.log(data);
                    if (data.error) this.setState({ error: data.error })
                    else this.setState({
                        redirectToProfile: true
                    })
                })
        }
    }

    updateForm = (name, email, password, photoUrl) => {
        return <form>
            <div>
                {photoUrl === "" ? (
                    <Loading />
                ) : (
                        <img className="card-img-top" src={photoUrl} alt={name} style={{ width: '100%', height: '15vw', objectFit: 'cover' }} />
                    )}
            </div>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control" />
            </div>
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
            <button onClick={this.clickUpdate} className="btn btn-raised btn-primary">UPDATE</button>
        </form>
    }

    render() {
        const { id, name, email, password, redirectToProfile, error, loading } = this.state
        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }

        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}` : ''

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>{error}</div>
                {loading ? <div className="jumbotron text-center">Loading...</div> : this.updateForm(name, email, password, photoUrl)}

            </div>
        )
    }
}

export default EditProfile;
