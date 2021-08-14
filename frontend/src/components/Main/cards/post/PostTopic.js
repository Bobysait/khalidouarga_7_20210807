import React, { useState } from 'react';

const PostTopic = (props) => {
	const {refresh, database} = props;
	const currentUser = database.User.current();

	const [comAttachment, setComAttachment] = useState(null);
	const [textEditorTitle, setTextEditorTitle] = useState("");
	const [textEditorValue, setTextEditorValue] = useState("");

	const validateNewTopic = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		await database.User.request.post(
											currentUser.id,
											textEditorTitle,
											textEditorValue,
											comAttachment,
											refresh
										);
	}

	const setAnswerText = (e, pValue) => {
		e.preventDefault();
		e.stopPropagation();
		setTextEditorValue(pValue);
		document.getElementById("textEditorError").innerHTML = "";
	}
	const updateTitle = (e, pTitle) => {
		e.preventDefault();
		e.stopPropagation();
		setTextEditorTitle(pTitle);
	}

	return (
		<div className="cat-body topic-create">

			<div className="form-group">
				<label htmlFor="id-title">Titre</label>
				<input type="text" id="id-title"
						required onChange={(e) => updateTitle(e, e.target.value)}
				></input>
			</div>

			<textarea type="text"
					id="topic-create"
					className="topic-new-message text"
					defaultValue=""
					placeholder="tapez votre message"
					onChange={(e) => {
										setAnswerText(e, e.target.value)
									}}
					onClick={(e) => {e.stopPropagation();}}
			></textarea>

			<div className="flex-post">
				<div className="import-file">
					<input
						className="input-file"
						type="file"
						id="file"
						name="Changer d'Avatar"
						accept=".jpg, .jpeg, .png"
						onChange = {(e) => setComAttachment(e.target.files[0])}
					/>
				</div>
				<div id="textEditorError" className="error"></div>

				<input className="btn" type="submit" value="Poster" onClick={(e) => {validateNewTopic(e)}}/>
			</div>
		</div>
	);
};

export default PostTopic;