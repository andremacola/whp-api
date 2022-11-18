import { whpClient } from '../helpers';

/* verify active instance session */
async function verifyActiveSession(req, res, next) {
	const client = await whpClient();

	if (!client) {
		return res.status(200).json({
			status: `Client offline`,
		});
	}

	return next();
}

export default verifyActiveSession;
