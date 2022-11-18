import { getVideoFile } from '../helpers/index.js';

getVideoFile('https://www.youtube.com/watch?v=Ijo1NPtwq3g').then((response) => {
	console.log(response.split(' ')[1].replace(':', ''));
}).catch((err) => {
	console.log(err);
});
