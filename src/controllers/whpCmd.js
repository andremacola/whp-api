const axios = require('axios').default;

class whpCmd {
	bad() {
		return false;
	}

	static handler(client, data) {
		const body = data.body;
		const number = data.from;
		const msgId = data.id;
		switch (true) {
			case (body.startsWith('@pay ')):
				this.outLine(client, number, body, msgId);
				break;
			default:
				break;
		}
	}

	static outLine(client, number, body, replyMsg) {
		const sourceUrl = body.replace('@pay ', '');
		const outline = `https://outline.com/${sourceUrl}`;
		// const outline = `https://api.outline.com/v3/parse_article?source_url=${sourceUrl}`;
		client.reply(number, outline, replyMsg, true);
	}
}

module.exports = whpCmd;
