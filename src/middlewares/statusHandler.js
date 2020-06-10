const { whpClient } = require('../helpers');

async function statusHandler(req, res) {
	const client = await whpClient().getMe();
	const status = {
		instance: process.env.SESSION_TOKEN,
		status: 'CONNECTED',
		phone: client.me.user,
		picture: client.profilePicThumb.eurl,
		battery: client.battery,
		platform: client.platform,
		webhook: process.env.WEBHOOK,
		qrCode: null,
	};

	return res.json(status);
}

module.exports = statusHandler;
