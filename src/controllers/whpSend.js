const { whpClient, sendGetStatus, getFile } = require('./../helpers');

class whpSend {
	constructor(req, res) {
		this.req = req;
		this.res = res;
		this.client = whpClient();
	}

	bad() {
		return this.res.status(400).send('Bad Request');
	}

	async text() {
		const { cmd, to, msg } = this.req.body;
		if (cmd == 'chat' && to && msg) {
			const send = sendGetStatus(await this.client.sendText(to, msg));
			return this.res.status(200).json({
				send,
				cmd,
				to,
			});
		}
		this.bad();
	}

	async link() {
		const { cmd, to, url, msg } = this.req.body;
		if (cmd == 'link' && to && url) {
			const caption = (msg) ? msg : '';

			let send = await this.client.sendLinkWithAutoPreview(to, url, caption);
			send = (typeof send == 'undefined') ? true : false;
			return this.res.status(200).json({
				send,
				cmd,
				to,
			});
		}
		this.bad();
	}

	async media() {
		const { cmd, to, url, msg } = this.req.body;
		if (cmd == 'media' && to && url) {
			const media = await getFile(url);
			const caption = (msg) ? msg : '';

			if (!media) {
				return this.bad();
			}

			const send = await this.client.sendFile(to, media.base64, media.name, caption);
			return this.res.status(200).json({
				send,
				cmd,
				to,
			});
		}
		this.bad();
	}
}

module.exports = whpSend;
