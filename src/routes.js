const express = require('express');
const router = express.Router();

// validateActiveToken
// verifyActiveSession

/* session status/info */
router.get(
	'/debug/',
	async (req, res) => {
		return res.json(req.app.locals.whp);
	},
);

// /* session status/info */
// routes.get(
// 	'/status/:token',
// 	validateActiveToken,
// 	verifyActiveSession,
// 	async (req, res) => {
// 		return res.json(await whp.client.getMe());
// 	},
// );

// /* session stop */
// routes.get(
// 	'/stop/:token',
// 	validateActiveToken,
// 	verifyActiveSession,
// 	async (req, res) => {
// 		sessionStop();
// 		return res.status(200).json({
// 			status: `Session Terminated!`,
// 		});
// 	},
// );

// /* session start */
// routes.get(
// 	'/start/:token',
// 	validateActiveToken,
// 	async (req, res) => {
// 		if (!whp.client && !whp.isStarting) {
// 			await startWHPServer();
// 			whp.isStarting = true;
// 		}
// 		const status = (whp.isStarting) ? 'Starting Session...' : 'Online';
// 		return res.status(200).json({
// 			status,
// 		});
// 	},
// );

// /* send messages */
// routes.post(
// 	'/send/:token/',
// 	validateActiveToken,
// 	verifyActiveSession,
// 	async (req, res) => {
// 		const { cmd, to, msg } = req.body;
// 		const send = await whp.client.sendText(to, msg);
// 		return res.status(200).json({
// 			send,
// 			cmd,
// 			// id,
// 			to,
// 			// msg,
// 		});
// 	},
// );

module.exports = router;
