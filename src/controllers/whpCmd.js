const axios = require('axios').default;
const { getFile } = require('./../helpers');

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
				this.taunts(client, number, body);
				break;
			default:
				break;
		}
	}

	static async taunts(client, number, body) {
		const taunt = body.replace('!!', '');
		const url = `${process.env.CDN_URL}/taunts/${taunt}.mp3`;
		const media = await getFile(url);
		return await client.sendFile(number, media.base64, media.name);
	}

	static brl(client, number, coin = 'USD') {
		axios
			.get(`https://economia.awesomeapi.com.br/${coin}`)
			.then((res) => {
				const { name, bid, ask, pctChange } = res.data[0];
				const icTitle = (pctChange[0] === '-') ? '📉' : '📈';
				const icVar = (pctChange[0] === '-') ? '🔻' : '🔼';
				const msg = `${icTitle} *${name}* ${icTitle}\n*Compra:* R$${bid}\n*Venda:* R$${ask}\n*Variação:* ${icVar} ${pctChange}%`;
				client.sendText(number, msg);
			});
	}

	static stock(client, number, stock) {
		const ac = stock.slice(4);
		axios
			.get(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes`,
				{
					params: {
						symbols: `${ac}.SA`,
						region: 'BR',
						lang: 'pt-BR',
					},
					headers: {
						'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
						'x-rapidapi-key': '3148a30e3cmshcc97bfcd0f10725p10df16jsn3cb9d1db3f7d',
					},
				},
			)
			.then((res) => {
				const { longName, symbol, regularMarketPrice, regularMarketChange } = res.data.quoteResponse.result[0];
				const icTitle = (regularMarketChange < 0) ? '📉' : '📈';
				const icVar = (regularMarketChange < 0) ? '🔻' : '🔼';
				const msg = `${icTitle} *${longName}* ${icTitle}\n*ID:* ${symbol}\n*Preço:* ${icVar} R$${regularMarketPrice}\n*Variação:* ${icVar} ${regularMarketChange}%`;
				client.sendText(number, msg);
			});
	}

	static outLine(client, number, body, replyMsg) {
		const sourceUrl = body.replace('@pay ', '');
		const outline = `https://outline.com/${sourceUrl}`;
		if (sourceUrl) {
			client.reply(number, outline, replyMsg, true);
		}
	}
}

module.exports = whpCmd;
