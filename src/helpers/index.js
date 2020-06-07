const whp = require('../config/whp');

const setWhp = function(option, value) {
	if (!option) {
		return false;
	}
	return whp[option] = (value) ? value : false;
};

const getWhp = function(option) {
	return (option) ? whp[option] : whp;
};

const whpClient = function() {
	return getWhp('client');
};

const sessionStop = async function() {
	const client = await whpClient();
	console.log('sessionStop', 'init');
	if (client) {
		console.log('sessionStop', 'kill');
		await client.kill();
		setWhp('client', null);
	}
};

module.exports = {
	setWhp,
	getWhp,
	whpClient,
	sessionStop,
};

