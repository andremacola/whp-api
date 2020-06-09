const { whpClient, sendGetStatus, getFile } = require('./../helpers');
const axios = require('axios').default;

class whpCmd {
	constructor() {
		this.client = whpClient();
	}

	bad() {
		return false;
	}

	async outLine(sourceUrl) {
		const url = `https://api.outline.com/v3/parse_article?source_url=${sourceUrl}`;
		return axios.get(url, {
			responseType: 'arraybuffer',
		});
	}
}

module.exports = whpCmd;
