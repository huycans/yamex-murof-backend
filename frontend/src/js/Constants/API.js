//constants for api access
// const PROTOCOL = "https://";
// const SERVER_IP = "35.196.89.114:5003";
//const SERVER_IP = "10.80.250.235:5003";

// local link
const PROTOCOL = "http://";
const SERVER_IP = "localhost:4000";
const LOCAL_URL = (PROTOCOL + SERVER_IP);
//deployed link
// const PROTOCOL = "https://";
// const SERVER_IP = "yamex.herokuapp.com";
const SERVER_API = {
	auth: "/auth",
	forum: "/forum",
	getAllForum: "/forum/all",
	subforum: "/subforum",
	thread: "/thread",
	threadNewest: "/thread/latest",
	reply: "/reply",
	user: "/user",
	userlogin: "/user/login",
	usersignup: "/user/signup",
	userTokenCheck: "/user/checkJWTToken",
	logout: "/user/logout"
};
console.log("BASE_URL", process.env.REACT_APP_BASE_URL);
let URL = process.env.REACT_APP_BASE_URL || LOCAL_URL;

export { URL, SERVER_API };
