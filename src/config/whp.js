const Whp = {
	port: process.env.PORT,
	sessionId: process.env.SESSION_TOKEN,
	client: null,
	webhook: process.env.WEBHOOK,
	isStarting: false,
};

module.exports = Whp;
