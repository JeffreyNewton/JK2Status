const Gamedig = require("Gamedig");

module.exports = {

	name: "status",
	description: "Status report on the provided server.",

	execute(client, message, args) {

		// No arguments were provided
		if(!args.length) {
			return message.channel.send("You didn't provide any arguments!");
		}

		// Arguments matched a server
		else if(args[0] === "chicago") {
			Gamedig.query({
				type: "swjk2",
				host: client.config.IP,
				port: client.config.port,
			}).then((state) => {
				const statusArray = [];
				for(let i = 0; i < state.players.length; i++) {
					statusArray[i] = i + " " + state.players[i].name;
				}
				if(statusArray.length > 0) message.channel.send(statusArray);
				else message.channel.send("0");
			}).catch((error) => {
				console.log("Server is offline - " + error);
			});
		}
		else {
			return message.channel.send("Not a valid server. Use the command !help for more information.");
		}
	},
};