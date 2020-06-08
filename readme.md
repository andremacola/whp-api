**THIS IS A WORKING PROJECT.**

Whatsapp REST API for [wa-automate-nodejs](https://github.com/open-wa/wa-automate-nodejs) and inspired by [whats2api](https://github.com/joaomirandasa/whats2api)

**This is a basic example how to create a REST API for Whatsapp. Not for production use (yet).**

### HOW TO USE ###

1. Set ambient variables inside .env file (see .env.example for more information). *MYGROUP* and *MYNUMBER* is only for development purpose.
2. `yarn install` or `npm install`
3. `yarn start-server`

### ENDPOINTS ###

|Command|Endpoint|
|---|---|
|Send **(POST):** | http://localhost:3000/SESSION_TOKEN/send|
|Info **(GET):** | http://localhost:3000/SESSION_TOKEN/status|
|Stop **(GET):** | http://localhost:3000/SESSION_TOKEN/stop|
|Start **(GET):** | http://localhost:3000/SESSION_TOKEN/start|


### SEND EXAMPLES ###
```json
// Text message (for groups use @g.us)

{
  "cmd": "chat",
  "to": "number@c.us",
  "msg": "some message"
}

// Link or Youtube videos

{
  "cmd": "link",
  "to": "number@c.us",
  "url": "https://github.com",
  "msg": "some message (optional)"
}
```

### WEBHOOKS ###

No info yet
