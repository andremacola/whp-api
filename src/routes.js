const express = require('express');
const { whpClient, sessionStop, getWhp, setWhp } = require('./helpers');
const WhpServerStart = require('./controllers/WhpServerStart');
const router = express.Router();

const validateActiveToken = require('./middlewares/validateActiveToken');
const verifyActiveSession = require('./middlewares/verifyActiveSession');

/* session status/info */
router.get(
	'/debug/',
	async (req, res) => {
		return res.json(await whpClient().getMe());
	},
);

// /* session status/info */
router.get(
	'/status/:token',
	validateActiveToken,
	verifyActiveSession,
	async (req, res) => {
		return res.json(await whpClient().getMe());
	},
);

// /* session stop */
router.get(
	'/stop/:token',
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
	'/start/:token',
	validateActiveToken,
	async (req, res) => {
		let { isStarting, client } = getWhp();
		if (!client && !isStarting) {
			await WhpServerStart();
			isStarting = setWhp('isStarting', true);
		}
		const status = (isStarting) ? 'Starting Session...' : 'Online';
		return res.status(200).json({
			status,
		});
	},
);

// /* send messages */
router.post(
	'/send/:token/',
	validateActiveToken,
	verifyActiveSession,
	async (req, res) => {
		const { cmd, to, msg } = req.body;
		const client = whpClient();
		const send = await client.sendText(to, msg);
		return res.status(200).json({
			send,
			cmd,
			// id,
			to,
			// msg,
		});
	},
);

module.exports = router;
