const Gamedig = require("Gamedig");

module.exports = (client) => {

	console.log(`JK2Status started! Serving ${client.users.size} users in ${client.channels.size} channels of ${client.guilds.size} servers.`);
	client.user.setActivity("!status for updates!", { type: "LISTENING" });

	// Attempt to query the server every 15 seconds
	setInterval (function() {
		Gamedig.query({
			type: "swjk2",
			host: client.config.IP,
			port: client.config.port,
		}).then((state) => {
			client.user.setActivity(state.players.length + " players from spec!", { type: "WATCHING" });
		}).catch((error) => {
			console.log(error);
		});
	}, 15000);
};