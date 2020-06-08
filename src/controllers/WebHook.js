const axios = require('axios').default;
const { default: PQueue } = require('p-queue');
const queue = new PQueue({ concurrency: 5 });

class webHook {
	static async post(data) {
		return await axios.post(process.env.WEBHOOK, data);
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
}

module.exports = webHook;
