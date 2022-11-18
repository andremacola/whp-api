import { getVideoFile } from '../helpers/index.js';

getVideoFile('https://www.youtube.com/watch?v=Ijo1NPtwq3g').then((response) => {
	console.log(JSON.stringify(response.display_id));
}).catch((err) => {
	console.log(err);
});
