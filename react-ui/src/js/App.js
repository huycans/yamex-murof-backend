import React, { Component } from "react";
import MainContent from "./Components/MainContent";
import { Route, Link, Switch } from "react-router-dom";
import Modal from "react-modal";

// import firebase from "./Components/Firebase/Firebase.js";
import {
	verifyToken,
	getUserInfo,
	loginWithEmail,
	signupWithEmail,
	checkSession
} from "./Components/API_Functions";
import LoadingIcon from "./Components/LoadingIcon";
import UserInfo from "./Components/User";
import { ContextProvider } from "./context";
import { logout } from "./Components/API_Functions/UserFunc";
import { Footer } from "./Components/Footer/footer";
import { TopAuthComp } from './Components/TopAuthComp/TopAuthComp';

import "../css/App.css";
import 'bootstrap/dist/css/bootstrap.css';

const blankAppState = {
	isLoading: true,
	email: "huy3@user.com",
	password: "password",
	errorMessage: "",
	//user from firebase
	user: null,
	userFromServer: null,
	sessionToken: "",
	userId: ""
};
Modal.setAppElement("body");
class App extends Component {
	constructor(props) {
		super(props);
		this.state = blankAppState;
		this.handleInputEmail = this.handleInputEmail.bind(this);
		this.handleInputPassword = this.handleInputPassword.bind(this);
		this.signup = this.signup.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		// this.loginMethod = this.loginMethod.bind(this);
	}
	handleInputEmail(event) {
		this.setState({ email: event.target.value });
	}

	handleInputPassword(event) {
		this.setState({ password: event.target.value });
	}

	//function that will perform login function from various method and return user object
	// async loginMethod(method) {
	// 	let provider = null;
	// 	let result = null;
	// 	let user = null;
	// 	let { email, password } = this.state;
	// 	try {
	// 		switch (method) {
	// 			case "facebook": //if user log in using facebook
	// 				console.log("Logging in with facebook");
	// 				provider = new firebase.auth.FacebookAuthProvider();
	// 				await firebase.auth().signInWithRedirect(provider);
	// 				result = await firebase.auth().getRedirectResult();
	// 				// The signed-in user info.
	// 				user = result.user;
	// 				console.log("logged in");
	// 				console.log(user);
	// 				// clientIdToken = await user.getIdToken(true);
	// 				// console.log("clientIdToken", clientIdToken);
	// 				// return clientIdToken;
	// 				return user;
	// 			//break;

	// 			case "google": //if user log in using google
	// 				console.log("Logging in with google");
	// 				provider = new firebase.auth.GoogleAuthProvider();
	// 				await firebase.auth().signInWithRedirect(provider);
	// 				firebase.auth().languageCode = "en";
	// 				result = await firebase.auth().getRedirectResult();

	// 				// The signed-in user info.
	// 				user = result.user;
	// 				console.log("logged in");
	// 				// clientIdToken = await user.getIdToken();
	// 				return user;
	// 			//break;

	// 			case "email": //if user log in using email/password
	// 				if (email === "" || password === "") return;
	// 				console.log("Logging in with email");
	// 				await firebase.auth().signInWithEmailAndPassword(email, password);
	// 				await firebase.auth().onAuthStateChanged(function (userObj) {
	// 					if (userObj) {
	// 						//User is signed in
	// 						user = userObj;
	// 					} else {
	// 						console.log("No user is logged in");
	// 					}
	// 				});
	// 				if (user !== null) {
	// 					return user;
	// 				}

	// 				break;
	// 			default:
	// 				console.log("Not recognize login method");
	// 				break;
	// 		}
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }

	async login() {
		this.setState({ isLoading: true, errorMessage: "" });
		try {
			let userObj = await loginWithEmail(this.state.email, this.state.password);
			this.setState({
				userFromServer: userObj.user,
				user: userObj.user,
				sessionToken: userObj.token,
				userId: userObj.user.id
			}, () => localStorage.setItem("yamexState", JSON.stringify(this.state)));
		} catch (error) {
			this.setState({ errorMessage: error.message });
		} finally {
			this.setState({ isLoading: false });
		}
	}

	async signup() {
		const { email, password } = this.state;
		this.setState({ isLoading: true, errorMessage: "" });
		try {
			let userObj = await signupWithEmail(email, password);
			this.setState({
				userFromServer: userObj.user,
				user: userObj.user,
				sessionToken: userObj.token,
				userId: userObj.user.id
			}, () => localStorage.setItem("yamexState", JSON.stringify(this.state)));

		} catch (error) {
			this.setState({ errorMessage: error.message });
		} finally {
			this.setState({ isLoading: false });
		}

		this.setState({ isLoading: false });
	}
	logout() {
		try {
			this.setState({ isLoading: true, errorMessage: "" });

			//remove local state storage
			localStorage.setItem("yamexState", null);
			//call server logout function
			logout();
			console.log("Sign-out successful.");
			this.setState({ ...this.state, blankAppState }, () => {
				window.location.reload();
			});
		} catch (error) {
			console.log("Error while logout: ", error);
			this.setState({
				errorMessage: error.message
			});
		} finally {
			this.setState({
				isLoading: false
			});
		}
	}
	async componentDidMount() {

		this.setState({ isLoading: true });
		console.log("Checking if user is signed in or not");
		//look through local state
		let localState = JSON.parse(localStorage.getItem("yamexState"));
		if (localState == null) {
			// no local state is found, user not signed in
			console.log("No user is logged in");
			this.setState({ isLoading: false });

		}
		else {
			// there are local state
			if (localState.sessionToken) {
				let isSessionValid = await checkSession(localState.sessionToken);
				if (isSessionValid == false) {
					console.log("No user is logged in");
					this.setState({ isLoading: false });

				}
				else {
					// session is still valid
					// let newState = Object.assign.localState, {isLoading: false} }
					this.setState(Object.assign({}, localState, { isLoading: false }));
				}
			}
		}
	}

	render() {
		let {
			email,
			password,
			errorMessage,
			isLoading,
			sessionToken,
			userId,
			userFromServer
		} = this.state;
		//display a error message
		let errorDisplay = (
			<div style={{ backgroundColor: "red", fontSize: 20, textAlign: "center" }}>
				{errorMessage}
			</div>
		);

		//display a modal in the foreground while user is login, signup or logout
		let LoadingModal = (
			<Modal isOpen={isLoading} contentLabel="LoadingModal">
				<div>
					Logging in...
					<LoadingIcon />
				</div>
			</Modal>
		);

		return (
			<ContextProvider value={this.state}>
				<div id="mainApp">
					{LoadingModal}

					<TopAuthComp userId={userId} userFromServer={userFromServer} logout={this.logout}
						handleInputEmail={this.handleInputEmail} handleInputPassword={this.handleInputPassword}
						login={this.login} signup={this.signup}
						email={email} password={password} />

					{errorDisplay}

					<Route
						path="/"
						render={props => (
							<MainContent
								{...props}
								userFromServer={userFromServer}
								authData={{ sessionToken: sessionToken, userId: userId }}
							/>
						)}
					/>
					<Route
						path={"/user/:userId"}
						render={props => (
							<UserInfo authData={{ sessionToken: sessionToken, userId: userId }} {...props} />
						)}
					/>

					<Footer />

				</div>
			</ContextProvider>


		);
	}
}
export default App;
