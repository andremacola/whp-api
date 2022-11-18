import wa from '@open-wa/wa-automate';
import ON_DEATH from 'death';
import { setWhp } from '../helpers';
import whpHook from './whpHook';
import whpCmd from './whpCmd';

const whpServerStart = async function() {
	setWhp('isStarting', true);
	wa.create({
		headless: true,
		sessionId: process.env.SESSION_TOKEN,
	})
		.then(async (client) => await whpConfigureClient(client))
		.catch((error) => {
			console.log('Error', error.message);
		});
};

const whpConfigureClient = async function(client) {
	setWhp('client', client);

	client.onAck((data) => whpHook.send('ack', data));
	client.onAnyMessage((data) => whpHook.send('message', data));
	client.onMessage((data) => whpCmd.handler(client, data));

	// console.log(await client.getMessageById('false_559881199008-1591773499@g.us_3EB0E29D045D458FCC1E_559881199008@c.us'));

	// client.onPlugged(whpHook.post(await client.getMe()));
	// client.onMessage((data) => whpHook.send('message', data));
	// client.onAnyMessage(webHook('any_message'));
	// client.onAddedToGroup(webHook('added_to_group'));
	// client.onBattery(webHook('battery'));
	// client.onContactAdded(webHook('contact_added'));
	// client.onIncomingCall(webHook('incoming_call'));
	// client.onPlugged(webHook('plugged'));
	// client.onStateChanged(webHook('state'));

	setWhp('isStarting', false);
	console.log(`\n⚡ Listening on http://localhost:${process.env.PORT}!`);

	ON_DEATH(async function(signal, err) {
		console.log(`\n❌ Killing session!`, signal, err);
		await client.kill();
		process.exit(0);
	});
};

export default whpServerStart;
