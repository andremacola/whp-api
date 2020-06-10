const express = require('express');
const { whpClient, sessionStop, getWhp, setWhp } = require('./helpers');
const whpServerStart = require('./controllers/whpServerStart');
const router = express.Router();

const validateActiveToken = require('./middlewares/validateActiveToken');
const verifyActiveSession = require('./middlewares/verifyActiveSession');
const sendHandler = require('./middlewares/sendHandler');
const statusHandler = require('./middlewares/statusHandler');

/* session debug */
router.get(
	'/debug/',
	async (req, res) => {
		return res.json(await whpClient().getMe());
	},
);

/* session status/info */
router.get(
	'/:token/status',
	validateActiveToken,
	verifyActiveSession,
	statusHandler,
);

/* session stop */
router.get(
	'/:token/stop',
	validateActiveToken,
	verifyActiveSession,
	async (req, res) => {
		sessionStop();
		return res.status(200).json({
			status: `Session Terminated!`,
		});
	},
);

/* session start */
router.get(
	'/:token/start',
	validateActiveToken,
	async (req, res) => {
		let { isStarting, client } = getWhp();
		if (!client && !isStarting) {
			await whpServerStart();
			isStarting = setWhp('isStarting', true);
		}
		const status = (isStarting) ? 'Starting Session...' : 'Online';
		return res.status(200).json({
			status,
		});
	},
);

/* send messages */
router.post(
	'/:token/send/',
	validateActiveToken,
	verifyActiveSession,
	sendHandler,
);

module.exports = router;
