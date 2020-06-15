import { URL } from "../../Constants/API";
import sha512 from "crypto-js/sha512";

async function sendDataWithAuth(method, api, authData, body) {
	try {
		let link = `${URL}${api}`;
		let serverResponse = await fetch(link, {
			method: method,
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
				// sessionToken: authData.sessionToken,
				// enc: hashDigest,
				"Authorization": "Bearer " + authData.sessionToken
			},
			body: JSON.stringify(body)
		});
		//make sure there is content inside the response before return it
		if (serverResponse.status === 200) {
			let responseJSON = await serverResponse.json();
			return responseJSON;
		} else {
			throw serverResponse;
		}

	} catch (error) {
		throw error;
	}
}

async function sendFormWithAuth(method, api, authData, body) {
	try {
		let link = `${URL}${api}`;
		let serverResponse = await fetch(link, {
			method: method,
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				// "Content-Type": "multipart/form-data",//setting this prevent the FormData object from being read by multer at backend
				"Authorization": "Bearer " + authData.sessionToken
			},
			body: body
		});
		//make sure there is content inside the response before return it
		if (serverResponse.status === 200) {
			let responseJSON = await serverResponse.json();
			return responseJSON;
		} else {
			throw serverResponse;
		}

	} catch (error) {
		throw error;
	}
}

async function sendThankWithAuth(method, api, authData, rid) {
	try {
		let link = `${URL}${api}/${rid}`;
		let serverResponse = await fetch(link, {
			method: method,
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
				"Authorization": "Bearer " + authData.sessionToken
			}
		});
		if (serverResponse.status === 200) {
			let responseJSON = await serverResponse.json();
			return responseJSON;
		} else {
			throw serverResponse;
		}
	} catch (error) {
		throw error;
	}
}
export { sendDataWithAuth, sendThankWithAuth, sendFormWithAuth };
