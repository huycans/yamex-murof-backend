import { URL, SERVER_API } from "../../Constants/API";
async function getSubForumList(fid) {
	try {
		let link = URL + SERVER_API.subforum + "?fid=" + fid;
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

async function createSubforum(forumId, description, name) {
	try {
		let link = URL + SERVER_API.subforum;
		let response = await fetch(link, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*"
			},
			body: JSON.stringify({
				description: description,
				forumId: forumId,
				name: name
			})
		});
		let responseJSON = await response.json();
		return responseJSON;
	} catch (error) {
		throw error;
	}
}
export { getSubForumList, createSubforum };
