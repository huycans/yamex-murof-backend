import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import DOMPurify from 'dompurify';

import { getThreadList } from "../API_Functions/index";
import Pagination from "../Pagination";
import { createThread } from "../API_Functions";
import EditorConvertToHTML from "../Editor";
import { formatTime } from '../../services/time';
import "./subforum.css";

class SubForum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			threadList: [],
			newThreadName: "",
			current: null,
			pages: null
		};
		this.createNewThread = this.createNewThread.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.loadThreadsFromPageNum = this.loadThreadsFromPageNum.bind(this);
		this.submit = this.submit.bind(this);
	}

	submit(htmlString) {
		if (htmlString == "<p></p>\n" || this.newThreadName == "") {
			alert("Thread name or thread content cannot be empty");
			return;
		}
		this.createNewThread(DOMPurify.sanitize(htmlString));
	}

	async createNewThread(threadContent) {
		try {
			const { newThreadName } = this.state;
			const { subforumData, authData } = this.props;
			let response = await createThread(
				newThreadName,
				subforumData.id,
				threadContent,
				authData
			);
			if (response == null) throw Error("Error while creating thread");

			//refresh the page to display the new thread
			window.location.reload();
		} catch (error) {
			console.log("Error while creating thread: ", error);
		} finally {
			this.closeModal();
		}
	}

	handleInputChange(event) {
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
			newThreadName: "",
			newThreadContent: ""
		});
	}

	async loadThreadsFromPageNum(pageNum) {
		//pageNum is a number used to load threadList from server
		//thread data are not passed to subforum, must be downloaded again
		const { subforumData } = this.props;
		const self = this;

		getThreadList(subforumData.id, pageNum).then(
			result => {
				//if there is no threads, return nothing
				if (!result) return;
				self.setState({ threadList: result.threads, current: result.current, pages: result.pages });
			},
			error => console.log(error)
		);
	}

	componentWillMount() {
		//load the first page
		this.loadThreadsFromPageNum(1);
	}

	render() {
		const { match, forumData, authData, subforumData } = this.props;
		//the maximum page number of a subforum
		const maxPageNumber = subforumData.pageNumber;
		const { threadList, newThreadName, isModalOpen, current, pages } = this.state;
		if (!threadList) return <p>Loading</p>;
		const customStyles = {
			content: {
				top: "50%",
				left: "50%",
				right: "auto",
				bottom: "auto",
				marginRight: "-50%",
				transform: "translate(-50%, -50%)",
				overflow: "scroll",
				height: "500px"
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
						name="newThreadName"
						type="text"
						placeholder="Thread Name"
						value={newThreadName}
						onChange={this.handleInputChange}
					/>
					<EditorConvertToHTML submit={this.submit} />
					<button onClick={this.closeModal} style={{ marginTop: "1em" }}>Close</button>
				</div>
			</Modal>
		);
		const threads = threadList.map(thread => {
			const lastModifiedTime = new Date(thread.lastModifiedTime);
			const formattedTime = formatTime(lastModifiedTime);
			return (
				<div className="thread_container" key={thread.id}>
					<div className="thread_info">
						<div className="thread_name">
							<Link to={`${match.path}/thread/${thread.id}`}>
								{thread.name}
							</Link>
						</div>
						<div className="thread_creator">
							Thread by :{" "}
							<Link to={`/user/${thread.author.id}`}>
								{thread.author.username}
							</Link>
						</div>
					</div>
					<div className="latest_post">
						<div className="lasted_post_time">
							<span>{formattedTime}</span>
						</div>
						<div className="lasted_post_owner">
							<span>by </span>
							<Link to={`/user/${thread.latestReply.author.id}`}>
								{thread.latestReply.author.username}{" "}
							</Link>
						</div>
					</div>
					<div className="no_rep_view">
						<span>Replies: N/A{thread.replyNumber}</span>
						<span>Views: N/A{thread.viewNumber}</span>
					</div>
				</div>
			);
		});

		return (
			<div>
				{newThreadModal}
				<div className="navigator">
					<Link to={"/"}>YAMEX</Link>
					<span>-&gt;</span>
					<Link to={`/${forumData.path}`}>{forumData.name}</Link>
					<span>-&gt;</span>
					<Link to={`/${forumData.path}/${subforumData.path}`}>
						{subforumData.name}
					</Link>
				</div>

				<div className="intro">
					<h1>{subforumData.description}</h1>
				</div>

				<div className="paginate_bar" style={{ marginLeft: "50px" }}>
					{authData.sessionToken ? (
						<div className="postnew">
							<button onClick={this.openModal}>New Thread</button>
						</div>
					) : null}

					{pages
						? <div>
							<Pagination current={current} loadOnClick={this.loadThreadsFromPageNum} pages={pages} />
						</div>
						: null
					}

				</div>

				<div className="subforum_bar">
					<div className="subforum_name">{subforumData.name}</div>
				</div>
				{threads}
			</div>
		);
	}
}

SubForum.propTypes = {
	match: PropTypes.shape({
		url: PropTypes.string,
		path: PropTypes.string,
		isExact: PropTypes.bool,
		params: PropTypes.object
	}),
	history: PropTypes.object,
	subforumData: PropTypes.shape({
		id: PropTypes.string,
		createdTime: PropTypes.string,
		lastModifiedTime: PropTypes.string,
		name: PropTypes.string,
		description: PropTypes.string,
		forumId: PropTypes.string,
		latestThread: PropTypes.object,
		threadNumber: PropTypes.number,
		replyNumber: PropTypes.number
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
	authData: PropTypes.object
};
export default SubForum;
