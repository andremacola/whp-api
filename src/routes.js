import express from 'express';
import { whpClient, sessionStop, getWhp, setWhp } from './helpers';
import whpServerStart from './controllers/whpServerStart';
import validateActiveToken from './middlewares/validateActiveToken';
import verifyActiveSession from './middlewares/verifyActiveSession';
import sendHandler from './middlewares/sendHandler';
import statusHandler from './middlewares/statusHandler';
import nodemon from 'nodemon';

const router = express.Router();

/* session debug */
router.get(
	'/debug/',
	async (req, res) => {
		nodemon.emit('restart');
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

export default router;
