const whpSend = require('../controllers/whpSend');

function sendHandler(req, res) {
	const { cmd } = req.body;
	const whp = new whpSend(req, res);

	switch (cmd) {
		case 'chat':
			return whp.text();
		case 'link':
			return whp.link();
		case 'media':
			return whp.media();
		default:
			return whp.bad();
	}
}

module.exports = sendHandler;
