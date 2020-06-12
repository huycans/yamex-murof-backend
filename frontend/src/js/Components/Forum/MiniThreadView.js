import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Route, Switch } from "react-router-dom";

export const MiniThreadView = props => {
  let { forumPath, subforumPath, threadData, subforum } = props;
  let date = new Date(threadData.lastModifiedTime);
  return (
    <div className="minithread">
      <div className="mini-date-and-tname">
        <div className="mini-date">{`${date.getDate()}/${date.getMonth()}`}</div>
        <div className="mini-tname">
          <Link to={`/${forumPath}/${subforumPath}/thread/${threadData.id}`}>
            {threadData.name}
          </Link>
        </div>
      </div>

      <div className="rep">N/A{threadData.replyNumber}</div>
      <div className="views">N/A</div>
    </div>
  );
};
//   <div className="MiniThreadView">
//   <div className="Date">{`${date.getDate()}/${date.getMonth()}`}</div>
//   <div className="MiniThreadView_name">
//     <Link to={`/${forumPath}/${subforumPath}/thread/${threadData.id}`}>
//       {threadData.name}
//     </Link>
//   </div>
//   <div className="MiniThreadView_rep">10{threadData.replyNumber}</div>
//   <div className="MiniThreadView_view">10</div>
// </div>
MiniThreadView.propTypes = {
  forumPath: PropTypes.string,
  subforumPath: PropTypes.string,
  threadData: PropTypes.object
};