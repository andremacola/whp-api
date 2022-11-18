import axios from 'axios';
import queue from 'p-queue';
import { getMsgServer, getMessageID, getMsgServerFromNumber, formatPhoneNumber } from '../helpers';

class whpHook {
	static async post(data) {
		try {
			await axios.post(process.env.WEBHOOK, data);
		} catch (e) {
			console.log('Error posting a hook');
		}
	}

	static async send(event, data) {
		try {
			await this.post(this.dataHandler(event, data));
		} catch (e) {
			console.log('Error sending a hook');
		}
	}

	static event(event) {
		return async function(data) {
			const ts = Date.now();
			return await queue.add(() => this.post({
				ts,
				event,
				data,
			}));
		}.bind(this);
	}

	static dataHandler(event, data) {
		let hook;

		if (data.type == 'sticker') {
			return false;
		}

		switch (event) {
			case 'message':
				hook = {
					event,
					type: data.type,
					token: process.env.SESSION_TOKEN,
					user: formatPhoneNumber(data.to),
					contact: {
						number: formatPhoneNumber(data.to),
						name: data.sender.name,
						server: getMsgServer(data.isGroupMsg),
					},
					chat: {
						dtm: data.timestamp,
						id: data.id,
						mid: getMessageID(data.id),
						dir: (data.fromMe) ? 'o' : 'i',
						type: data.type,
						body: data.body,
					},
					ack: data.ack,
				};
				if (data.isGroupMsg) {
					hook.contact.groupName = data.chat.contact.name;
					hook.contact.groupNumber = data.chat.contact.id;
				}
				break;
			case 'ack':
				hook = {
					event,
					dir: (data.id.fromMe) ? 'o' : 'i',
					from: formatPhoneNumber(data.from),
					to: formatPhoneNumber(data.to),
					server: getMsgServerFromNumber(data.from),
					muid: false,
					id: data.id.id,
					ack: data.ack,
				};
				if (data.author) {
					hook.from = formatPhoneNumber(data.author);
					hook.group = data.from;
				}
				break;
			default:
				break;
		}

		return hook;
	}
}

export default whpHook;
