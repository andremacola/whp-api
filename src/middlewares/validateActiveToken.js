/* validate session token */
function validateActiveToken(req, res, next) {
	const { token } = req.params;
	if (token != process.env.SESSION_TOKEN) {
		return res.status(200).json({
			status: `Invalid session token`,
		});
	}
	return next();
}

module.exports = validateActiveToken;
