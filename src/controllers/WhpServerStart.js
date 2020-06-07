const wa = require('@open-wa/wa-automate');
const WebHook = require('./WebHook');

const WhpServerStart = async function(app) {
	app.locals.whp.isStarting = true;
	wa.create({
		sessionId: process.env.SESSION_TOKEN,
	})
		.then(async (client) => await WhpConfigureClient(app, client))
		.catch((error) => {
			console.log('Error', error.message);
		});

	console.log(`\n⚡ Listening on http://localhost:${app.locals.whp.port}!`);
};

const WhpConfigureClient = async function(app, client) {
	app.use(client.middleware);

	app.locals.whp.client = client;
	app.locals.whp.isStarting = false;
	console.log(client);

	// client.onPlugged(WebHook.post(await client.getMe()));
	// client.onAck(WebHook.event('ack'));
	// client.onMessage(WebHook.event('message'));

	// client.onAnyMessage(webHook('any_message'));
	// client.onAddedToGroup(webHook('added_to_group'));
	// client.onBattery(webHook('battery'));
	// client.onContactAdded(webHook('contact_added'));
	// client.onIncomingCall(webHook('incoming_call'));
	// client.onPlugged(webHook('plugged'));
	// client.onStateChanged(webHook('state'));
};

module.exports = WhpServerStart;
