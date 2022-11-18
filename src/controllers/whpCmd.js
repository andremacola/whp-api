import fs from 'fs';
import * as urll from 'url';
import axios from 'axios';
import { getShortLink, getVideoFile } from './../helpers';

const __dirname = urll.fileURLToPath(new URL('.', import.meta.url));

class whpCmd {
	bad() {
		return false;
	}

	static handler(client, data) {
		const body = data.body;
		const number = data.from;
		const msgId = data.id;
		switch (true) {
			case (body == '@help'):
				this.help(client, number);
				break;
			case (body.startsWith('@vid ')):
				this.video(client, number, body, msgId);
				break;
			case (body.startsWith('@pay ')):
				this.outLine(client, number, body, msgId);
				break;
			case (body == '@pay'):
				const wall = data.quotedMsgObj.canonicalUrl;
				if (wall) {
					client.reply(number, `https://outline.com/${wall}`, msgId, true);
				} else {
					client.reply(number, 'Link inválido', msgId, true);
				}
				break;
			case (body == '@ping'):
				client.sendText(number, '@pong');
				break;
			case (body == '@ei' || body.startsWith('@ei ')):
				this.frases(client, number, msgId);
				break;
			case (body.startsWith('@ac ')):
				this.stock(client, number, body);
				break;
			case (body == '@usd'):
				this.brl(client, number, 'USD');
				break;
			case (body == '@eur'):
				this.brl(client, number, 'EUR');
				break;
			case (body.startsWith('!!')):
				this.taunts(client, number, body, msgId);
				break;
			default:
				break;
		}
	}

	static async help(client, number) {
		const msg = `ℹ *Comandos Disponíveis* ℹ
*@ping*: _@pong_
*@ei*: _uma frase aleatória_
*@pay endereço-da-noticia*: _Burlar paywall_
*@usd*: _Cotação atual do Dólar_
*@eur*: _Cotação atual do Euro_
*@ac sigla-do-ativo*: _Cotação do ativo na bolsa_
*@_vid_ endereço-do-video*: Baixar vídeo do Youtube/Twitter/Vimeo (em dev)
*!!1-126*: _Retorna um taunt (ex: !!11)_`;
		return await client.sendText(number, msg);
	}

	static async frases(client, number, replyMsg) {
		const prons = [ 'Ei', 'Hnn', 'Rapá', 'Fala', 'Veish' ];
		const frases = [ 'Már cumpôca eu vou aí', 'Tu tá parecendo um menino do buchão', 'É só tu arrudiar bem por alí', 'Essa piquena é pai D\'Égua', 'Esse bicho é todo desassuntado', 'Eu vou aí na boquinha da noite', 'Tu é todo migueloso', 'Cadê essa ôta?', 'Te dou-lhe um bogue', 'Te dou-lhe um murro', 'Te dou-lhe um cascudo', 'Paruano eu vou pro meu interior', 'Eu tô é tu', 'Esse bicho é todo galudo', 'Te sai de boca!', 'Ele é iscritinho o pai', 'Éguas vai cair um toró! São Pedro tá inspirado!', 'Lá vai ela com a calça no rendengue', 'Eu tô só a coíra', 'Merman, larga de ser esparrosa', 'Eu não sou teus pareceiros', 'Eu vou me banhar rapidão', 'Aquela piquena é amostrada', 'Alí só tem maroca', 'Merman, eu fiquei arriliada', 'Eu cheguei lá na caruda', 'Tu só quer ser', 'Bora binhalí merendar', 'Larga de ser canhenga', 'Daqui pra rua grande é uma pernada', 'Aquilo ali é qualira', 'Piqueno eu vou te dále', 'Éguas té doido', 'Bota o teu', 'Não te faz de doida que o pau de acha', 'Heinhein' ];

		const pron = prons[Math.floor(Math.random() * prons.length)];
		const frase = frases[Math.floor(Math.random() * frases.length)];
		const msg = `${pron}, ${frase}`;

		return await client.reply(number, msg, replyMsg, true);
	}

	static async video(client, number, body, replyMsg) {
		const url = body.replace('@vid ', '');
		await getVideoFile(url)
			.then((res) => {
				const file = res.split(' ')[1].replace(':', '');
				const videoUrl = `${process.env.CDN_URL}/videos/${file}.mp4`;
				return client.reply(number, '😁 Yess! *Baixe o vídeo em:* ' + videoUrl, replyMsg, true);
			})
			.catch((err) => {
				console.log(err);
				return client.reply(number, '😕 Haaaa! Não consegui baixar o vídeo. O Endereço está correto?', replyMsg, true);
			});
	}

	static async taunts(client, number, body, replyMsg) {
		const folder = __dirname + '../../cdn/taunts/';
		const files = fs.readdirSync(folder);
		const tauntRef = body.replaceAll('!!', '').replace('title', '').trim();

		let tauntFileName;
		if (tauntRef === 'random') {
			tauntFileName = files[Math.floor(Math.random() * files.length)];
		} else {
			tauntFileName = files.find((file) => file.split(' ')[0] === tauntRef);
			if (!tauntFileName && !parseInt(tauntRef)) {
				tauntFileName = files.filter((file) => file.toLocaleLowerCase().includes(tauntRef));
				tauntFileName = tauntFileName[Math.floor(Math.random() * tauntFileName.length)];
			}
		}

		const tauntFilePath = folder + '/' + tauntFileName;
		const tauntExist = fs.existsSync(tauntFilePath);

		if (tauntExist) {
			await client.sendFile(number, tauntFilePath, tauntFileName);
			if (body.includes('title')) {
				await client.sendText(number, tauntFileName.replace('.mp3', ''));
			}
		} else {
			await client.reply(number, '😕 Haaaa! Não consegui achar esse taunt. Tenta outro número!', replyMsg, true);
		}
	}

	static brl(client, number, coin = 'USD') {
		axios
			.get(`https://economia.awesomeapi.com.br/${coin}`)
			.then((res) => {
				const { name, bid, ask, pctChange } = res.data[0];
				const icTitle = (pctChange[0] === '-') ? '📉' : '📈';
				const icVar = (pctChange[0] === '-') ? '🔻' : '🔼';
				const msg = `${icTitle} *${name}* ${icTitle}\n*Compra:* R$${bid}\n*Venda:* R$${ask}\n*Variação:* ${icVar} ${pctChange}%`;
				return client.sendText(number, msg);
			});
	}

	static stock(client, number, stock) {
		const ac = stock.slice(4);
		axios
			.get(`https://yh-finance.p.rapidapi.com/market/v2/get-quotes`,
				{
					params: {
						symbols: `${ac}.SA`,
						region: 'BR',
					},
					headers: {
						'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
						'x-rapidapi-key': process.env.RAPIDAPI_KEY,
					},
				},
			)
			.then((res) => {
				const { longName, symbol, regularMarketPrice, regularMarketChange } = res.data.quoteResponse.result[0];
				const icTitle = (regularMarketChange < 0) ? '📉' : '📈';
				const icVar = (regularMarketChange < 0) ? '🔻' : '🔼';
				const msg = `${icTitle} *${longName}* ${icTitle}\n*ID:* ${symbol}\n*Preço:* ${icVar} R$${regularMarketPrice}\n*Variação:* ${icVar} ${regularMarketChange}%`;
				return client.sendText(number, msg);
			});
	}

	static async outLine(client, number, body, replyMsg) {
		const sourceUrl = body.replace('@pay ', '');

		const link = await getShortLink(`https://12ft.io/proxy?q=${sourceUrl}`);
		if (link) {
			return client.reply(number, `🗞️ *Leia*: ${link}`, replyMsg, true);
		}
	}
}

export default whpCmd;
