import * as dotenv from 'dotenv';
import * as urll from 'url';
import whp from '../config/whp';
import axios from 'axios';
import youtubedl from 'youtube-dl-exec';

const __dirname = urll.fileURLToPath(new URL('.', import.meta.url));
dotenv.config();

export const setWhp = function(option, value) {
	if (!option) {
		return false;
	}
	return whp[option] = (value) ? value : false;
};

export const getWhp = function(option) {
	return (option) ? whp[option] : whp;
};

export const whpClient = function() {
	return getWhp('client');
};

export const sessionStop = async function() {
	const client = await whpClient();
	console.log('sessionStop', 'init');
	if (client) {
		console.log('sessionStop', 'kill');
		await client.kill();
		setWhp('client', null);
	}
};

export const sendGetStatus = function(send) {
	return send = (!send) ? false : true;
};

export const getFileName = function(url) {
	return url.substring(url.lastIndexOf('/') + 1);
};

export const getFile = async function(url) {
	return axios
		.get(url, {
			responseType: 'arraybuffer',
		})
		.then((r) => {
			if (process.env.ALLOW_TYPES.split(',').includes(r.headers['content-type'])) {
				return {
					type: r.headers['content-type'],
					base64: 'data:' + r.headers['content-type'] + ';base64,' + Buffer.from(r.data, 'binary').toString('base64'),
					name: getFileName(url),
				};
			}
			return false;
		});
};

export const getMsgServer = function(isGroupMsg) {
	return (isGroupMsg) ? '@g.us' : '@c.us';
};

export const getMsgServerFromNumber = function(number) {
	return number.slice(-4);
};

export const getMessageID = function(id) {
	// return id = id.split('us_')[1].split('_')[0];
	return id.slice(id.indexOf('us_') + 3).split('_')[0];
};

export const formatPhoneNumber = function(number) {
	return number.slice(0, -5);
};

export const getShortLink = async function(url) {
	return axios
		.post('https://api-ssl.bitly.com/v4/shorten',
			{
				group_guid: process.env.BITLY_GUID,
				domain: 'bit.ly',
				long_url: url,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					Authorization: `Bearer ${process.env.BITLY_TOKEN}`,
				},
			})
		.then((r) => (r.data.link) ? r.data.link : false)
		.catch((err) => console.log(err));
};

export async function getVideoFile(url, quality = '(mp4)[height<480]') {
	return new Promise((res, rej) => {
		youtubedl(url, {
			format: quality,
			output: `${__dirname}../../cdn/videos/%(id)s.%(ext)s`,
			// dumpSingleJson: true,
			noCheckCertificates: true,
			noWarnings: true,
			addHeader: [
				'referer:youtube.com',
				'user-agent:googlebot',
			],
		})
			.then((output) => res(output))
			.catch((err) => rej(err));
	});
}

// export default {
// 	setWhp,
// 	getWhp,
// 	whpClient,
// 	sessionStop,
// 	sendGetStatus,
// 	getFileName,
// 	getFile,
// 	getMsgServer,
// 	getMessageID,
// 	getMsgServerFromNumber,
// 	formatPhoneNumber,
// 	getShortLink,
// 	getVideoInfo,
// 	getVideoFile,
// };

