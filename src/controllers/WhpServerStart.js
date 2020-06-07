const wa = require('@open-wa/wa-automate');
const helpers = require('./../helpers');
const WebHook = require('./WebHook');

const { setWhp } = helpers;

const WhpServerStart = async function() {
	setWhp('isStarting', true);
	wa.create({
		sessionId: process.env.SESSION_TOKEN,
	})
		.then(async (client) => await WhpConfigureClient(client))
		.catch((error) => {
			console.log('Error', error.message);
		});
};

const WhpConfigureClient = async function(client) {
	setWhp('client', client);

	client.onPlugged(WebHook.post(await client.getMe()));
	client.onAck(WebHook.event('ack'));
	client.onMessage(WebHook.event('message'));

	// client.onAnyMessage(webHook('any_message'));
	// client.onAddedToGroup(webHook('added_to_group'));
	// client.onBattery(webHook('battery'));
	// client.onContactAdded(webHook('contact_added'));
	// client.onIncomingCall(webHook('incoming_call'));
	// client.onPlugged(webHook('plugged'));
	// client.onStateChanged(webHook('state'));

	setWhp('isStarting', false);
	console.log(`\n⚡ Listening on http://localhost:${process.env.PORT}!`);
};

module.exports = WhpServerStart;
