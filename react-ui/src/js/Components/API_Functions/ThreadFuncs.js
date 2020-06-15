import { URL, SERVER_API } from "../../Constants/API";
import { sendReply } from "./ReplyFuncs";
import { sendDataWithAuth } from "./SecureConnect";

async function getThreadList(sfid, currentPage) {
	try {
		let link = URL + SERVER_API.thread + "?sfid=" + sfid + "&page=" + currentPage;
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

async function getThreadData(threadId) {
	try {
		let link = URL + SERVER_API.thread + "/" + threadId;
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

async function createThread(name, subForumId, content, authData) {
	try {
		const body = {
			author: {
				id: authData.userId
			},
			name: name,
			threadContent: content,
			subForumId: subForumId
		};

		let response = await sendDataWithAuth(
			"PUT",
			SERVER_API.thread,
			authData,
			body
		);
		// let threadId = response.id ;
		//a new thread has the thread's content as the first reply, therefore a new thread is created
		// await sendReply(authData, content, threadId);
		return response;
	} catch (error) {
		throw error;
	}
}

async function getNewestThreadList(sfid) {
	try {
		let link = URL + SERVER_API.threadNewest + "?sfid=" + sfid;
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
export { getThreadList, createThread, getThreadData, getNewestThreadList };
