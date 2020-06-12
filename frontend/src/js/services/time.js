const formatTime = time => {
	return `${time.getDate()}/${time.getMonth() +
		1}/${time.getFullYear()} at ${time.getHours()}:${time.getMinutes()}`;
};

export { formatTime };