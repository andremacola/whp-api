const whpSend = require('../controllers/whpSend');
// const whpClient = require('../helpers');

// async function checkNumber(number) {
// 	const client = whpClient(); console.log(client);
// 	// const verify = await client.checkNumberStatus(number);
// 	// console.log('verificando numero...');
// 	// console.log(verify);
// }

function sendHandler(req, res) {
	const { cmd } = req.body;
	// checkNumber(req.body.to);
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
