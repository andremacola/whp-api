import fs from 'fs';
// import { getFile } from '../helpers';
import * as dotenv from 'dotenv';
import * as urll from 'url';

dotenv.config();
const __dirname = urll.fileURLToPath(new URL('.', import.meta.url));

async function taunts(body = '!!random') {
	const folder = __dirname + '../../cdn/taunts/';
	const files = fs.readdirSync(folder);
	const tauntRef = body.replace('!!', '');

	let tauntFileName;
	if (tauntRef === 'random') {
		tauntFileName = files[Math.floor(Math.random() * files.length)];
	} else {
		tauntFileName = files.find((file) => file.split(' ')[0] === tauntRef);
		if (!tauntFileName) {
			tauntFileName = files.filter((file) => file.toLocaleLowerCase().includes(tauntRef));
			tauntFileName = tauntFileName[Math.floor(Math.random() * tauntFileName.length)];
		}
	}

	const tauntFilePath = folder + '/' + tauntFileName;
	const tauntExist = fs.existsSync(tauntFilePath);

	if (tauntExist) {
		console.log(tauntFileName, ' taunt existe');
		// const url = `${process.env.CDN_URL}/taunts/${tauntFileName}.mp3`;
		// const media = await getFile(url);
		// console.log('media', media);
	} else {
		console.log(tauntFileName, ' taunt não existe');
	}
}

taunts();

