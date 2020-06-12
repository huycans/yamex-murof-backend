import React, { Component } from 'react';
import { Link } from "react-router-dom";

import "./TopAuthcomp.css";
export const TopAuthComp = ({ userId, userFromServer, logout,
	handleInputEmail, handleInputPassword, login, signup, email, password }) => {
	//if state.user exist display the logout button and link to user info page, if not display the login buttons
	const authSection = userId ? (
		<div className="login">
			<div className="login-section">
				<Link to={`/user/${userId}`}>{userFromServer.username}</Link>
				<button className="button-signout" onClick={() => logout()}>
					Signout
					</button>
			</div>
		</div>
	) : (
			<div className="login">
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={email}
					onChange={handleInputEmail}
				/>

				<input
					type="password"
					name="pwd"
					placeholder="Password"
					value={password}
					onChange={handleInputPassword}
				/>
				<div className="login-section">
					<button className="button-login" onClick={() => login("email")}>
						Login
					</button>

					<button className="button-signup" onClick={signup}>
						Signup
					</button>
					{
						// 	<input
						// 	className="login-button"
						// 	type="image"
						// 	src={require("../../../img/facebook.png")}
						// 	alt="fb logo"
						// 	onClick={() => login("facebook")}
						// 	onKeyPress={() => login("facebook")}
						// />
						// <input
						// 	className="login-button"
						// 	type="image"
						// 	src={require("../../../img/google-plus.png")}
						// 	alt="google logo"
						// 	onClick={() => login("google")}
						// 	onKeyPress={() => login("google")}
						// />
					}
				</div>
			</div>
		);
	return (
		<div className="wrap">
			<Link to="/">
				<img className="logo" src={require("../../../img/logo.png")} alt="Logo" />
			</Link>

			<div className="search-input">
				<input type="text" name="search" placeholder="Search.." />
			</div>
			{authSection}
		</div>
	);
};


