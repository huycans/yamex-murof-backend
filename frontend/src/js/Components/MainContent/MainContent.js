import React, { Component } from "react";
import PropTypes from "prop-types";
import Collapsible from "react-collapsible";
import { Link, Route, Switch } from "react-router-dom";
import Forum from "../Forum";
import LoadingIcon from "../LoadingIcon";
import { getSubForumList, getForumList, createForum } from "../API_Functions";
import Modal from "react-modal";
import { formatTime } from "../../services/time";
// subforumData
// "id": "5a2405a1799a83547a3cb970",
// "createdTime": "2017-12-03T14:09:37.308Z",
// "lastModifiedTime": "2017-12-03T14:09:37.308Z",
// "name": "FAQ",
// "description": "Question",
// "forumId": "5a1ecb2b799a833ca2c7657a",
// "latestThread": null,
// "threadNumber": 0,
// "replyNumber": 0
const MiniSubForumView = props => {
	let { subforumData, forumPath } = props;
	return (
		<div className="subforum">
			<div className="subforum_info">
				<Link to={`${forumPath}/${subforumData.path}`}>
					{subforumData.name}
				</Link>
				<p>{subforumData.description}</p>
			</div>
			<div className="no_thread_post">
				<span>Threads: NaN</span> {subforumData.threadNumber}
				<br />
				<span>Posts: NaN</span> {subforumData.replyNumber}
			</div>
			{subforumData.latestThread === null ? (
				<div className="first_unread_post">
					{"null"}
					<br />
					by <div>{"null"}</div>
					<br />
					{"null"}
				</div>
			) : (
					<div className="first_unread_post">
						Latest thread:  <Link to={`${forumPath}/${subforumData.path}/thread/${subforumData.latestThread.id}`}>
							{subforumData.latestThread.name}
						</Link>
						<br />
						on {formatTime(new Date(subforumData.latestThread.createdTime))}
					</div>
				)}
		</div>
	);
};

MiniSubForumView.propTypes = {
	subforumData: PropTypes.object,
	match: PropTypes.object,
	forumPath: PropTypes.string
};

class MiniForumView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subforumList: []
		};
	}
	componentDidMount() {
		let { forum } = this.props;
		getSubForumList(forum.id).then(
			subforumList => {
				this.setState({ subforumList: subforumList });
			},
			error => console.log(error)
		);
	}
	render() {
		let { forum, match } = this.props;
		let { subforumList } = this.state;
		//create a list of mini (small) subforums of each forum
		let MiniSubForumViewList = subforumList.map(subforum => (
			<MiniSubForumView
				forumPath={forum.path}
				subforumData={subforum}
				{...this.props}
				key={subforum.id}
			/>
		));

		return (
			<Collapsible
				trigger={
					<div className="trigger" id="forum1-trigger">
						<Link to={`${match.url}${forum.path}`}>{forum.name}</Link>
					</div>
				}
				open
				key={forum.id}
			>
				<div id="wrapper" className="open">
					<div className="forum-content" id="forum1-content">
						{MiniSubForumViewList}
					</div>
				</div>
			</Collapsible>
		);
	}
}

MiniForumView.propTypes = {
	forum: PropTypes.object,
	match: PropTypes.object
};

//MainContent will display the list of all forums on the site with their subforums
class MainContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isError: null,
			forumList: [],
			isLoading: true,
			isModalOpen: false,
			newForumName: "",
			coverUrl: "",
			//bike info
			brand: "",
			description: "",
			name: "",
			power: 0,
			stillProducing: true
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.createNewForum = this.createNewForum.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	async createNewForum() {
		try {
			const {
				brand,
				description,
				name,
				newForumName,
				power,
				stillProducing,
				coverUrl
			} = this.state;

			const bikeInfo = {
				brand: brand,
				description: description,
				name: name,
				power: power,
				stillProducing: stillProducing
			};

			await createForum(newForumName, coverUrl, bikeInfo);
			window.location.reload();
		} catch (error) {
			this.setState({ isError: true });
			console.log(error);
		} finally {
			this.setState({ isModalOpen: false });
		}
	}

	handleInputChange(event) {
		//this function runs when user type in input box
		const name = event.target.name;
		let value = event.target.value;
		if (name === "stillProducing") value = value === "true" ? true : false;

		this.setState({
			[name]: value
		});
	}

	openModal() {
		this.setState({ isModalOpen: true });
	}

	closeModal() {
		this.setState({
			isModalOpen: false,
			newForumName: "",
			newForumdescription: ""
		});
	}

	componentDidMount() {
		getForumList().then(
			forumList => {
				this.setState({ isLoading: false, forumList: forumList });
			},
			error => {
				this.setState({ isLoading: false, isError: true });
				console.log("Error while getting forum list: ", error);
			}
		);
	}
	render() {
		const {
			forumList,
			isError,
			isLoading,
			coverUrl,
			isModalOpen,
			brand,
			description,
			name,
			newForumName,
			power,
			stillProducing
		} = this.state;
		const { match, userFromServer } = this.props;

		//if the component is loading display LoadingIcon component
		if (isLoading)
			return (
				<div>
					<LoadingIcon />
				</div>
			);
		//if there is an error display this error message
		if (isError) {
			return (
				<div>
					<div>There has been an error, please refresh the page</div>
				</div>
			);
		}
		const customStyles = {
			content: {
				top: "50%",
				left: "50%",
				right: "auto",
				bottom: "auto",
				marginRight: "-50%",
				transform: "translate(-50%, -50%)"
			}
		};
		const newForumModal = (
			<Modal
				style={customStyles}
				isOpen={isModalOpen}
				contentLabel="newThreadModal"
			>
				<div>
					<h2>Enter information</h2>
					<br />
					<label>
						Forum Name
						<input
							style={{
								marginLeft: "5em",
								border: "1px black solid",
								color: "black"
							}}
							name="newForumName"
							type="text"
							placeholder="Forum Name"
							value={newForumName}
							onChange={this.handleInputChange}
						/>
					</label>
					<br />
					<label>
						URL for cover picture
						<input
							style={{ border: "1px black solid", color: "black", marginLeft: "1em" }}
							name="coverUrl"
							type="text"
							placeholder="URL for cover picture"
							value={coverUrl}
							onChange={this.handleInputChange}
						/>
					</label>
					<br />
					<h3>Enter bike info</h3>
					<br />
					<label>
						Bike brand
						<input
							style={{ border: "1px black solid", color: "black", marginLeft: "6em" }}
							name="brand"
							type="text"
							placeholder="Brand"
							value={brand}
							onChange={this.handleInputChange}
						/>
					</label>
					<br />
					<label>
						Bike name
						<input
							style={{ border: "1px black solid", color: "black", marginLeft: "6em" }}
							name="name"
							type="text"
							placeholder="Name"
							value={name}
							onChange={this.handleInputChange}
						/>
					</label>
					<br />
					<label>
						Bike description
						<input
							style={{ border: "1px black solid", color: "black", marginLeft: "3em" }}
							name="description"
							type="text"
							placeholder="description"
							value={description}
							onChange={this.handleInputChange}
						/>
					</label>
					<br />
					<label>
						Bike power
						<input
							style={{ border: "1px black solid", color: "black", marginLeft: "6em" }}
							name="power"
							type="number"
							placeholder="Power"
							value={power}
							onChange={this.handleInputChange}
						/>
					</label>
					<br />
					<h4>Is this bike still in production?</h4>
					<input
						name="stillProducing"
						type="radio"
						value={true}
						onChange={this.handleInputChange}
						checked={stillProducing == true}
						style={{ margin: "0.5em" }}
					/>
					Yes
					<br />
					<input
						name="stillProducing"
						type="radio"
						value={false}
						onChange={this.handleInputChange}
						checked={stillProducing == false}
						style={{ margin: "0.5em" }}
					/>
					No
					<br />
					<button onClick={this.createNewForum}>Submit</button>
					<button onClick={this.closeModal}>Close</button>
				</div>
			</Modal>
		);
		let listOfForum = null;
		let listOfForumRoute = null;
		//create a list of mini (small) peak of the forums in the site
		listOfForum = forumList.map(forum => (
			<MiniForumView forum={forum} match={match} key={forum.id} />
		));
		//create a list of routes to go to each forum
		listOfForumRoute = forumList.map(forum => (
			<Route
				path={`${match.path}${forum.path}`}
				key={forum.id}
				render={props => (
					<Forum
						{...props}
						userFromServer={userFromServer}
						forumData={forum}
						authData={this.props.authData}
					/>
				)}
			/>
		));

		return (
			<div>
				{newForumModal}
				{userFromServer && userFromServer.role === "ADMIN" ? (
					<button onClick={this.openModal} style={{ width: "80%", margin: "1em" }}>Create new Forum</button>
				) : null}
				<Switch>
					<Route exact path="/" render={() => listOfForum} />
					{listOfForumRoute}
				</Switch>
			</div>
		);
	}
}

MainContent.propTypes = {
	match: PropTypes.shape({
		url: PropTypes.string,
		path: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.object
	}),
	forumList: PropTypes.array,
	listOfForumRoute: PropTypes.array,
	authData: PropTypes.object,
	userFromServer: PropTypes.object
};

// bikeInfo: null
// coverUrl: null
// createdTime: "2017-11-30T02:32:20.192Z"
// description: null
// id: "5a1f6db45a111d1a78bbc2aa"
// lastModifiedTime: "2017-11-30T02:32:20.192Z"
// moderators: null
// name: "Honda Future"
// path: "honda-future"
export default MainContent;
