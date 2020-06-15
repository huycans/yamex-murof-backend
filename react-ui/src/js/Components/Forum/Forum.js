import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Route, Switch } from "react-router-dom";
import Modal from "react-modal";

import { MiniThreadView } from './MiniThreadView';
import SubForum from "../SubForum";
import "./Forum.css";
import {
	getSubForumList,
	getNewestThreadList,
	createSubforum
} from "../API_Functions";
import { Thread } from "../Thread";


//full forum view
class Forum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subforumList: [],
			isModalOpen: false,
			newSubforumName: "",
			newSubforumDiscription: ""
		};
		this.createNewSubforum = this.createNewSubforum.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	async createNewSubforum() {
		try {
			const { forumData } = this.props;
			const { newSubforumName, newSubforumDiscription } = this.state;
			await createSubforum(
				forumData.id,
				newSubforumDiscription,
				newSubforumName
			);
			window.location.reload();
		} catch (error) {
			alert(error);
		} finally {
			this.closeModal();
		}
	}

	handleInputChange(event) {
		//this function runs when user input new subforum name and discription
		const name = event.target.name;
		const value = event.target.value;
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
			newSubforumName: "",
			newSubforumDiscription: ""
		});
	}
	componentDidMount() {
		const { forumData } = this.props;
		getSubForumList(forumData.id)
			.then(
				subforumList => {
					return subforumList;
				},
				error => alert(error)
			)
			.then(subforumList => {
				//create a copy of the subforumlist
				let subforumListCopy = subforumList.slice();
				//for each subforum, get its list of threads, use Promise.all to wait for
				//all Promises return by async functions inside the map function

				Promise.all(
					subforumListCopy.map(async subforum => {
						let threadList = await getNewestThreadList(subforum.id);
						//create a new object which includes the subforum data plus
						//threadList data for easy data display
						return Object.assign(
							{},
							{ ...subforum },
							{ threadList: threadList }
						);
					})
				).then(subforumListWithThreads => {
					this.setState({ subforumList: subforumListWithThreads });
				});
			});
	}
	render() {
		const { match, forumData, authData, userFromServer } = this.props;
		const { isModalOpen, newSubforumName, newSubforumDiscription } = this.state;

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
		const newThreadModal = (
			<Modal
				style={customStyles}
				isOpen={isModalOpen}
				contentLabel="newThreadModal"
			>
				<div>
					<h2>Enter information</h2>

					<input
						style={{ border: "1px black solid", color: "black" }}
						name="newSubforumName"
						type="text"
						placeholder="Subforum Name"
						value={newSubforumName}
						onChange={this.handleInputChange}
					/>
					<input
						style={{ border: "1px black solid", color: "black", margin: "1em" }}
						name="newSubforumDiscription"
						type="text"
						placeholder="Subforum Discription"
						value={newSubforumDiscription}
						onChange={this.handleInputChange}
					/>
					<button onClick={this.createNewSubforum}>Submit</button>
					<button onClick={this.closeModal}>Close</button>
				</div>
			</Modal>
		);

		const subforums = this.state.subforumList;
		// if (!subforums || !subforums.threadList) return null;
		//create a list of subforum in the forum, each subforum has a list of threads
		let SubforumList = subforums.map(subforum => {
			//if there is no threads, return nothing
			if (!subforum.threadList) return null;
			let MiniThreadViews = subforum.threadList.map(thread => (
				<MiniThreadView
					forumPath={forumData.path}
					subforumPath={subforum.path}
					key={thread.id}
					threadData={thread}
					subforum={subforum}
				/>
			));
			return (
				<div key={subforum.id}>
					<div className="minithread minithread-header">
						<div className="mini-date-and-tname">{subforum.name} </div>
						<div className="rep">REPLIES</div>
						<div className="views">VIEW</div>
					</div>
					{MiniThreadViews}
					<div className="more">
						<Link to={`/${forumData.path}/${subforum.path}`}>
							Go to {subforum.name} subforum
						</Link>
					</div>
					<hr />
				</div>
			);
		});

		let listOfSubForumRoutes = subforums.map(subforum => (
			<Route
				key={subforum.id}
				path={`${match.path}/${subforum.path}`}
				render={props => (
					<SubForum
						{...props}
						forumData={forumData}
						subforumData={subforum}
						authData={authData}
					/>
				)}
			/>
		));

		let ForumView = (
			<div>
				<div className="navigator">
					<Link to={"/"}>YAMEX</Link>
					-&gt;
					<Link to={`/${forumData.path}`}>{forumData.name}</Link>
				</div>

				{newThreadModal}
				<div className="forum_view">
					{userFromServer && userFromServer.role === "ADMIN" ? (
						<button onClick={this.openModal}>Create new subforum</button>
					) : null}
					<h1>{forumData.name}</h1>
					{SubforumList}{" "}
				</div>
			</div>
		);

		return (
			<div className="tab">
				<Route exact path={`${match.path}`} render={() => ForumView} />
				<Switch>
					<Route
						exact
						path={"/:forumName/:subforumName/thread/:threadId"}
						render={props => <Thread authData={authData} {...props} />}
					/>

					{listOfSubForumRoutes}
				</Switch>
			</div>
		);
	}
}
Forum.propTypes = {
	match: PropTypes.shape({
		url: PropTypes.string,
		path: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.object
	}),
	forumData: PropTypes.shape({
		bikeInfo: PropTypes.string,
		coverUrl: PropTypes.string,
		createdTime: PropTypes.string,
		description: PropTypes.string,
		id: PropTypes.string,
		lastModifiedTime: PropTypes.string,
		moderators: PropTypes.arrayOf(PropTypes.string),
		name: PropTypes.string,
		path: PropTypes.string
	}),
	authData: PropTypes.object,
	userFromServer: PropTypes.object
};
export default Forum;
