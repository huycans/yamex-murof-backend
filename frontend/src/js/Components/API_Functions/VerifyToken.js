import { URL, SERVER_API } from "../../Constants/API";

//verify clientIdToken, FCMkey with server then return server response
async function verifyToken(clientIdToken, FCMkey = null) {
	try {
		let link = URL + SERVER_API.auth;
		let response = await fetch(link, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				clientIdToken: clientIdToken,
				fcmKey: FCMkey
			})
		});
		let responseJSON = await response.json();

		if (responseJSON.status.httpStatus === 200) {
			//make sure there is content inside the response before return it to signin function
			return responseJSON;
		} else {
			throw "Verification process unsuccessful: " + responseJSON.message;
		}
	} catch (error) {
		throw error;
	}
}
export { verifyToken };
