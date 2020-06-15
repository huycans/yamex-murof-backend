import React from "react";
import ReactLoading from "react-loading";

const LoadingIcon = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
		}}
	>
		<ReactLoading type="balls" color="var(--main-orange)" height={50} width={50} />
		<div style={{ fontWeight: "bold", fontSize: 24, color: "var(--main-orange)" }}>Please wait...</div>
	</div>
);
export default LoadingIcon;
