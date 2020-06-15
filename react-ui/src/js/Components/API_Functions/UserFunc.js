import { URL, SERVER_API } from "../../Constants/API";
import { sendFormWithAuth } from "./SecureConnect";
async function getUserInfo(userId, token) {
	try {
		let link = URL + SERVER_API.user + "/" + userId;
		let bearer = "Bearer " + token;
		let response = await fetch(link, {
			method: "GET",
			withCredentials: true,
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				"Authorization": bearer
			}
		});
		let responseJSON = await response.json();
		return responseJSON;
	} catch (error) {
		throw error;
	}
}

async function updateUserInfo(authData, body) {
	try {

		let response = await sendFormWithAuth(
			"PUT",
			SERVER_API.user + "/" + authData.userId,
			authData,
			body
		);
		//response is already json
		return response;
	} catch (error) {
		throw error;
	}
}

async function loginWithEmail(username, password) {
	try {
		let response = await fetch(URL + SERVER_API.userlogin, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});
		let responseJSON = await response.json();
		if (response.status != 200 && response.ok == false) {
			throw new Error(responseJSON.err.message);
		} else {
			return responseJSON;
		}
	} catch (error) {
		throw error;
	}
}

async function signupWithEmail(username, password) {
	try {
		let response = await fetch(URL + SERVER_API.usersignup, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});
		let responseJSON = await response.json();
		if (response.status != 200 && response.ok == false) {
			throw new Error(responseJSON.err.message);
		} else {
			return responseJSON;
		}
	} catch (error) {
		throw error;
	}
}

async function checkSession(sessionToken) {
	try {
		let response = await fetch(URL + SERVER_API.userTokenCheck, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				Authorization: "Bearer " + sessionToken
			}
		});
		let responseJSON = await response.json();
		if (responseJSON.success == false && responseJSON.status == "JWT invalid") {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		throw error;
	}
}

async function logout() {
	try {
		let response = await fetch(URL + SERVER_API.logout, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*"
			}
		});
		let responseJSON = await response.json();
	} catch (error) {
		throw error;
	}
}
export { getUserInfo, updateUserInfo, loginWithEmail, signupWithEmail, checkSession, logout };
