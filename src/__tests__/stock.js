import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

axios
	.get(`https://yh-finance.p.rapidapi.com/market/v2/get-quotes`,
		{
			params: {
				symbols: `PETR4.SA`,
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

		console.log(msg);
	});
