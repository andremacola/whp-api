import { whpClient, sendGetStatus, getFile } from './../helpers';

class whpSend {
	constructor(req, res) {
		this.req = req;
		this.res = res;
		this.client = whpClient();
	}

	bad(msg = 'Bad Request') {
		return this.res.status(400).send(msg);
	}

	checkNumber(n) {
		// const number = await this.client.checkNumberStatus(recipient);
		// return (number.status == 200) ? number.id._serialized : false;
		if (n.charAt(4) == 9 && n.slice(0, 2) == 55) {
			return n.slice(0, 4) + n.slice(5);
		}
		return n;
	}

	async text() {
		const { cmd, to, msg } = this.req.body;
		const number = this.checkNumber(to);
		console.log(number);
		if (cmd == 'chat' && number && msg) {
			const send = sendGetStatus(await this.client.sendText(number, msg));
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
		const number = this.checkNumber(to);
		console.log(number);
		if (cmd == 'link' && number && url) {
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
		const number = this.checkNumber(to);
		console.log(number);
		if (cmd == 'media' && number && url) {
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

export default whpSend;
