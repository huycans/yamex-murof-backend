import React, { Component } from "react";
import PropTypes from "prop-types";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class EditorConvertToHTML extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty()
		};
		this.onEditorStateChange = this.onEditorStateChange.bind(this);
	}

	onEditorStateChange(editorState) {
		this.setState({
			editorState: editorState
		});
	}

	render() {
		const { editorState } = this.state;
		return (
			<div>
				<Editor
					editorState={editorState}
					wrapperClassName="demo-wrapper"
					editorClassName="demo-editor"
					onEditorStateChange={this.onEditorStateChange}
				/>

				<button
					disabled={this.props.disabled}
					onClick={() =>
						this.props.submit(
							draftToHtml(convertToRaw(editorState.getCurrentContent()))
						)
					}
				>
					Submit
				</button>
			</div>
		);
	}
}
EditorConvertToHTML.propTypes = {
	submit: PropTypes.func.isRequired
};
export default EditorConvertToHTML;
