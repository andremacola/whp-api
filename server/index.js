require('dotenv').config();

const express = require('express');
const wa = require('@open-wa/wa-automate');

const axios = require('axios').default;

const { default: PQueue } = require('p-queue');
const queue = new PQueue({ concurrency: 5 });

const ON_DEATH = require('death');

const server = express();

ON_DEATH(async () => {
	console.log(`\n• Killing session!`);
	await sessionStop();
	process.exit(0);
});

// ############
// INSTANCES
// ############

const whp = {
	port: process.env.PORT,
	sessionId: process.env.SESSION_TOKEN,
	client: false,
	webhook: process.env.WEBHOOK,
	isStarting: false,
};

// ##############
// MIDDLEWARES
// ##############

/* use json on express */
server.use(express.json());

/* validate session token */
function validateActiveToken(req, res, next) {
	const { token } = req.params;
	if (token != process.env.SESSION_TOKEN) {
		return res.status(200).json({
			status: `Invalid session token`,
		});
	}
	return next();
}

/* verify active instance session */
function verifyActiveSession(req, res, next) {
	if (!whp.client) {
		return res.status(200).json({
			status: `WHP Client offline`,
		});
	}
	return next();
}

// ##############
// ROUTES
// ##############

/* session status/info */
server.get(
	'/status/:token',
	validateActiveToken,
	verifyActiveSession,
	async (req, res) => {
		return res.json(await whp.client.getMe());
	},
);

/* session stop */
server.get(
	'/stop/:token',
	validateActiveToken,
	verifyActiveSession,
	async (req, res) => {
		sessionStop();
		return res.status(200).json({
			status: `Session Terminated!`,
		});
	},
);

/* session start */
server.get(
	'/start/:token',
	validateActiveToken,
	async (req, res) => {
		if (!whp.client && !whp.isStarting) {
			await startWHPServer();
			whp.isStarting = true;
		}
		const status = (whp.isStarting) ? 'Starting Session...' : 'Online';
		return res.status(200).json({
			status,
		});
	},
);

/* send messages */
server.post(
	'/send/:token/',
	validateActiveToken,
	verifyActiveSession,
	async (req, res) => {
		const { cmd, to, msg } = req.body;
		const send = await whp.client.sendText(to, msg);
		return res.status(200).json({
			send,
			cmd,
			// id,
			to,
			// msg,
		});
	},
);

// ##############
// FUNCTIONS
// ##############

async function startWHPServer() {
	whp.isStarting = true;
	wa.create({
		sessionId: whp.sessionId,
	})
		.then(async (client) => await startWA(client))
		.catch((error) => {
			console.log('Error', error.message);
		});
}

async function fireWebhook(data) {
	return await axios.post(whp.webhook, data);
}

const webHook = (event) => async (data) => {
	const ts = Date.now();
	return await queue.add(() => fireWebhook({
		ts,
		event,
		data,
	}));
};

async function sessionStop() {
	if (whp.client) {
		await whp.client.kill();
		whp.client = false;
	}
}

// ##############
// START CLIENT
// ##############

async function startWA(client) {
	server.use(client.middleware);

	whp.client = client;
	whp.isStarting = false;

	client.onPlugged(fireWebhook(await client.getMe()));
	client.onAck(webHook('ack'));
	client.onMessage(webHook('message'));

	// client.onAnyMessage(webHook('any_message'));
	// client.onAddedToGroup(webHook('added_to_group'));
	// client.onBattery(webHook('battery'));
	// client.onContactAdded(webHook('contact_added'));
	// client.onIncomingCall(webHook('incoming_call'));
	// client.onPlugged(webHook('plugged'));
	// client.onStateChanged(webHook('state'));
}

// ##############
// INIT INSTANCE
// ##############

server.listen(whp.port, function() {
	startWHPServer();
	console.log(`\n• Listening on port 3000!`);
});
