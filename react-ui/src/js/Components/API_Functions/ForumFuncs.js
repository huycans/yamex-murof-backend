import { URL, SERVER_API } from "../../Constants/API";
async function getForumList() {
	try {
		let link = URL + SERVER_API.getAllForum;
		let response = await fetch(link, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Access-Control-Allow-Origin": "*"
			}
		});
		let responseJSON = await response.json();
		return responseJSON;
	} catch (error) {
		throw error;
	}
}

async function createForum(name, coverUrl = "", bikeInfo = {}) {
	try {
		let link = URL + SERVER_API.forum;
		let response = await fetch(link, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify({
				bikeInfo: bikeInfo,
				coverUrl: coverUrl,
				name: name
			})
		});
		let responseJSON = await response.json();
		return responseJSON;
	} catch (error) {
		throw error;
	}
}

export { getForumList, createForum };
