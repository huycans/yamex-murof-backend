import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import DOMPurify from 'dompurify';
import { Image, CloudinaryContext } from 'cloudinary-react';

import { getReplyList, getThreadData, sendReply, sendThank } from "../API_Functions";
import EditorConvertToHTML from "../Editor";
import Pagination from '../Pagination';
import { formatTime } from '../../services/time';
import cloudinaryConfig from '../../Constants/Cloudinary';
import "./thread.css";

class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      thread: null,
      replies: [],
      errorMessage: "",
      isModalOpen: false,
      current: null,
      pages: null
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleType = this.handleType.bind(this);
    this.thank = this.thank.bind(this);
    this.reply = this.reply.bind(this);
    this.loadRepliesFromPageNum = this.loadRepliesFromPageNum.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(htmlString) {
    if (htmlString == "<p></p>\n") {
      alert("Reply cannot be empty");
      return;
    }
    this.reply(DOMPurify.sanitize(htmlString));
  }

  handleType(event) {
    this.setState({ newReplyContent: event.target.value });
  }

  openModal() {
    const { authData } = this.props;
    if (!authData.sessionToken) {
      alert("You're not logging in");
      return;
    }
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
      newReplyContent: ""
    });
  }

  async reply(newReplyContent) {
    try {
      const { authData } = this.props;
      const { thread } = this.state;
      await sendReply(authData, newReplyContent, thread.id);
      this.setState({ isModalOpen: false });
      window.location.reload();
    } catch (error) {
      this.setState({ errorMessage: error });
    }
  }

  async thank(rid) {
    try {
      const { authData } = this.props;
      const { replies } = this.state;
      if (!authData.sessionToken) {
        alert("You're not logging in");
        return;
      }
      await sendThank(authData, rid);

      let repliesCopy = replies.map((reply, index) => {
        if (reply.id == rid) {
          reply.numberOfThank = reply.numberOfThank + 1;
        }
        return reply;
      });
      this.setState({ repliesCopy });

    } catch (error) {
      this.setState({ errorMessage: error });
    }
  }

  async loadRepliesFromPageNum(pageNum) {
    try {
      //loading thread is just loading replies in that thread
      this.setState({ isLoading: true });
      const { match } = this.props;
      getReplyList(match.params.threadId, pageNum).then(({ replies, current, pages }) => {
        this.setState({ replies, current, pages });
      });
    } catch (error) {
      this.setState({ errorMessage: error });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    const { match } = this.props;
    getThreadData(match.params.threadId).then(thread => {
      this.setState({ thread: thread });
    });
    this.loadRepliesFromPageNum(1);
  }

  render() {
    const { match, authData } = this.props;
    const { replies, errorMessage, isLoading, thread, isModalOpen, current, pages } = this.state;

    if (!replies || !thread) return null;

    //tool bar to thank and reply to posts
    const RepToolBar = props => {
      if (props.reply)
        return (
          <div className="rep_quickrep_tool">
            <div className="no_thank">{props.reply.numberOfThank || "0"} people thank this</div>
            <button onClick={this.openModal}>Reply</button>
            <button onClick={() => this.thank(props.reply.id)}>Thanks</button>
          </div>
        );
      else return;
    };

    //navbar that display the path to the thread
    const NavBar = (
      <div className="navigator">
        <Link to={"/"}>YAMEX</Link>
        -&gt;
        <Link to={`/${match.params.forumName}`}>{match.params.forumName}</Link>
        -&gt;
        <Link to={`/${match.params.forumName}/${match.params.subforumName}`}>
          {match.params.subforumName}
        </Link>
        -&gt;
        <Link
          to={`/${match.params.forumName}/${match.params.subforumName}/${match.params.threadId}`}
        >
          {thread.name}
        </Link>
      </div>
    );

    const ThreadHeader = (
      <div className="thread_header">
        <div className="user_avatar">
          <CloudinaryContext cloudName={cloudinaryConfig.cloud_name}>
            <Image publicId={thread.author.avatarUrl} />
          </CloudinaryContext>
        </div>
        <div className="thread_header_info">
          <div className="thread_name">{thread.name}</div>
          <div className="thread_creator">
            By <Link to={`/user/${thread.author.id}`}>{thread.author.username}</Link>, Member on{" "}
            {formatTime(new Date(thread.author.createdTime))}
          </div>
        </div>
      </div>
    );

    const repliesListView = replies.sort((reply1, reply2) => {
      const d1 = new Date(reply1.createdTime);
      const d2 = new Date(reply2.createdTime);
      return d1.getTime() - d2.getTime();
    }).map((reply, index) => {
      function createMarkup() {
        return { __html: DOMPurify.sanitize(reply.content) };
      }
      return (
        <div key={reply.id}>
          <div className="post_reply">
            <div className="user_post_rep">
              <div className="post_user">
                <Link to={`/user/${reply.author.id}`}>{reply.author.username}</Link>
              </div>
              <div className="post_info">{formatTime(new Date(reply.createdTime))}</div>
            </div>
            <div className="post_content">
              <div className="post_user_content">
                <CloudinaryContext cloudName={cloudinaryConfig.cloud_name}>
                  <Image publicId={reply.author.avatarUrl} alt="user-avatar" />
                </CloudinaryContext>

                <div className="user_title">Role: {reply.author.role}</div>
              </div>
              <div className="post_rep_content">
                <div dangerouslySetInnerHTML={createMarkup()} />
              </div>
            </div>
          </div>
          <RepToolBar reply={reply} />
        </div>
      );
      // }
    });

    let errorDisplay = (
      <div style={{ backgroundColor: "red", fontSize: 20, textAlign: "center" }}>
        {errorMessage}
      </div>
    );

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

    let newReplyModal = (
      <Modal style={customStyles} isOpen={isModalOpen} contentLabel="newThreadModal">
        <div style={{ flex: 1, flexDirection: "column" }}>
          <h2>Enter information</h2>
          <EditorConvertToHTML submit={this.submit} />

          <button onClick={this.closeModal}>Close</button>
        </div>
      </Modal>
    );

    if (isLoading) return <div />;
    else
      return (
        <div>
          {newReplyModal}
          {NavBar}
          {ThreadHeader}
          {errorDisplay}
          <div className="paginate_bar">
            {authData.sessionToken ? (
              <button className="postnew" onClick={this.openModal}>
                Post Reply
              </button>
            ) : null}
            {pages
              ? <div>
                <Pagination current={current} loadOnClick={this.loadRepliesFromPageNum} pages={pages} />
              </div> : null
            }

          </div>

          {repliesListView}
        </div>
      );
  }
}
Thread.propTypes = {
  match: PropTypes.object,
  authData: PropTypes.object
};
export default Thread;
