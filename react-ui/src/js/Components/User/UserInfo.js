import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';

import { getUserInfo } from "../API_Functions";
import { updateUserInfo } from "../API_Functions";
import { formatTime } from '../../services/time';
import cloudinaryConfig from '../../Constants/Cloudinary';
import "./user.css";

class UserInfoComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userInfo: null,
			avatarUrl: "",
			avatarUpload: null,
			favoriteBike: "",
			username: "",
			errorMessage: "",
			isUpdateSuccess: false,
			isUpdating: false
		};
		this.handleChangeValue = this.handleChangeValue.bind(this);
		this.updateUser = this.updateUser.bind(this);
		// this.fileInput = React.createRef();
	}

	handleChangeValue(event) {
		let targetName = event.target.name;
		if (targetName == "avatarUpload") {
			this.setState({ [targetName]: event.target.files[0] });
		}
		else this.setState({ [targetName]: event.target.value });
	}

	async updateUser(event) {
		event.preventDefault();
		let { authData } = this.props;
		let { avatarUrl, favoriteBike, username, avatarUpload } = this.state;

		let data = new FormData();
		data.append("avatarFile", avatarUpload);
		data.append("avatarUrl", avatarUrl);
		data.append("favoriteBike", favoriteBike);

		try {
			this.setState({ isUpdating: true });
			let response = await updateUserInfo(authData, data);
			this.setState({
				isUpdateSuccess: true
			});

			this.setState({
				avatarUrl: response.avatarUrl,
				favoriteBike: response.favoriteBike
			});

			let okay = alert("Update successful");
			window.location.reload();

		} catch (error) {
			this.setState({ errorMessage: error.message });
		} finally {
			this.setState({ isUpdating: false });
		}
	}

	componentDidMount() {
		const { match, sessionToken } = this.props;
		getUserInfo(match.params.userId, sessionToken).then(
			user => {
				this.setState({
					userInfo: user,
					avatarUrl: user.avatarUrl,
					favoriteBike: user.favoriteBike,
					username: user.username
				});
			},
			error => {
				console.log(error);
			}
		);
	}

	render() {
		const {
			userInfo,
			avatarUrl,
			favoriteBike,
			username,
			errorMessage,
			isUpdateSuccess,
			isUpdating
		} = this.state;
		const { authData, match } = this.props;

		if (!userInfo) return null;
		else if (errorMessage) return (
			<div style={{ backgroundColor: "red", fontSize: 20, textAlign: "center" }}>
				{errorMessage}
			</div>
		);
		else {
			return (
				<div className="container">
					<div className="user">
						<CloudinaryContext cloudName={cloudinaryConfig.cloud_name}>
							<Image publicId={userInfo.avatarUrl} className="userinfo-avatar" />
						</CloudinaryContext>
						<div className="user_info">
							<div className="user_name">{userInfo.username}</div>
							<div className="user_title">Role: {userInfo.role}</div>
							<div className="status">Last online: {formatTime(new Date(userInfo.lastLogin))}</div>
						</div>
					</div>
					<div className="user_about">
						<div className="fav_bike">
							<b>Favorite bike: </b>
							{userInfo.favoriteBike}
						</div>
						<div className="statistic">
							<div className="no_post">
								<b>No posts:</b> {userInfo.numberOfPost}
							</div>
							<div className="no_tks">
								<b>No thanks:</b> {userInfo.numberOfThank}
							</div>
						</div>
						<div className="contact">
							<div className="email">
								<b>Email:</b> {userInfo.email}
							</div>
						</div>
					</div>
					{authData.userId === match.params.userId ? (
						<div className="change_info">
							<form>

								<h4>Change your personal infomation</h4>
								<label htmlFor="username">Username: </label>
								<input
									id="username"
									value={username}
									name="username"
									disabled
								/>
								<br />
								{
									// <label htmlFor="avatarUrl">Avatar url: </label>
									// <input
									// 	id="avatarUrl"
									// 	value={avatarUrl}
									// 	name="avatarUrl"
									// 	onChange={this.handleChangeValue}
									// />
								}
								<label htmlFor="avatarUpload">Upload Avatar: </label>
								<input type="file" accept="image/png, image/jpeg, image/jpg" name="avatarUpload" onChange={this.handleChangeValue} />
								<br />
								<label htmlFor="favoriteBike">Favorite Bike: </label>
								<input
									id="favoriteBike"
									value={favoriteBike}
									name="favoriteBike"
									onChange={this.handleChangeValue}
								/>
								<br />

								<button className="change_info_button" disabled={isUpdating} onClick={this.updateUser}>
									Submit
						</button>
							</form>
						</div>
					) : null}
				</div>
			);
		}

	}
}
UserInfoComponent.propTypes = {
	match: PropTypes.object,
	authData: PropTypes.object,
	sessionToken: PropTypes.string
};

// const UserInfo = React.forwardRef((props, ref) => (
// 	<ContextConsumer>
// 		{value => <UserInfoComponent {...props} {...value} ref={ref} />}
// 	</ContextConsumer>
// ));

// const UserInfo =
// 	<ContextConsumer>
// 		{value => <UserInfoComponent {...value} />}
// 	</ContextConsumer>;
export { UserInfoComponent as UserInfo };
