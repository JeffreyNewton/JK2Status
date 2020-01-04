const columnify = require("columnify");
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
		else if(client.servers.has(args[0]) && args.length == 1) {
			Gamedig.query({
				type: "swjk2",
				host: client.servers.get(args[0]).IP,
				port: client.servers.get(args[0]).port,
			}).then((state) => {

				const statusArray = [];
				for(let i = 0; i < state.players.length; i++) {
					const player = { "client" : i,
							   		 "name"   : state.players[i].name,
							   		 "score"  : state.players[i].frags,
					  		   		 "ping"   : state.players[i].ping,
					};
					statusArray[i] = player;
				}

				// Format our statusArray for display using columnify
				if(statusArray.length > 0) {
					const arrayFormat = columnify(statusArray, { truncate: true, config: {
						client:	{ align: "right" },
						score:  { align: "right" },
						ping:   { align: "right" },
						name:	{ minWidth: "25", maxWidth: "25" },
					} });
					message.channel.send(client.servers.get(args[0]).IP + ":" + client.servers.get(args[0]).port + " - " + statusArray.length + " player(s)!" + "\n```" +
					arrayFormat + "```");
				}
				else { message.channel.send("No players currently."); }
			}).catch((error) => {
				console.log("Server is offline - " + error);
			});
		}

		// Multiple arguments (options)
		else if(client.servers.has(args[0]) && args.length >= 2) {

			// Options
			switch(args[1]) {

				// Mobile display (needs updating)
				case "-m":
					Gamedig.query({
						type: "swjk2",
						host: client.servers.get(args[0]).IP,
						port: client.servers.get(args[0]).port,
					}).then((state) => {
						const mobileMessage = client.servers.get(args[0]).IP + ":" + client.servers.get(args[0]).port + " - " + state.players.length + " player(s)!";
						message.channel.send(mobileMessage);
					}).catch((error) => {
						console.log("Server is offline - " + error);
					});
					break;

				default:
					message.channel.send("Option not recognized.");
			}
		}
		else { return message.channel.send("Not a valid server. Use the command `!status help` for more information."); }
	},
};