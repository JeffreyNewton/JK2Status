const discord = require("discord.js");
const client = new discord.Client();

// Initialize the server configurations
const Enmap = require("enmap");
client.servers = new Enmap({ name: "servers" });
client.players = new Enmap({ name: "players" });
client.skins = new Enmap({ name: "skins" });

client.commands = new discord.Collection();
client.config = require("./config.json");

const fs = require("fs");
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events/").filter(file => file.endsWith(".js"));

// Command Handler
for(const file of commandFiles) {
	const commandName = file.substring(0, file.length - 3);
	const command = require(`./commands/${file}`);
	client.commands.set(commandName, command);
}

// Event Handler
for(const file of eventFiles) {
	const eventName = file.substring(0, file.length - 3);
	const event = require(`./events/${file}`);
	client.on(eventName, event.bind(null, client));
	delete require.cache[require.resolve(`./events/${file}`)];
}

/* We only need to populate the databases once
const csvparse = require("csv-parse");

// Server parser
const parseServers = csvparse({ delimiter: "," }, function(err, data) {
	data.forEach(function(line) {
		const alias = { "alias" : line[0].trim(),
					  	"IP"    : line[1].trim(),
					  	"port"  : line[2].trim(),
		};
		client.servers.set(alias.alias, { IP: alias.IP, port: alias.port });
	});
});
fs.createReadStream("./assets/servers.csv").pipe(parseServers);

// User parser
const parseUsers = csvparse({ delimiter: "," }, function(err, data) {
	data.forEach(function(line) {
		const users = { "ID"	: line[0].trim(),
			"name" 			: line[1].trim(),
			"role"			: line[2].trim(),
			"saberColor"	: line[3].trim(),
			"skin"			: line[4].trim(),
		};
		client.players.set(users.ID, { name: users.name, role: users.role, saberColor: users.saberColor, skin: users.skin });
	});
});
fs.createReadStream("./assets/players.csv").pipe(parseUsers);

// Skin parser
const parseSkins = csvparse({ delimiter: "," }, function(err, data) {
	data.forEach(function(line) {
		const skins = { "name"	: line[0].trim(),
			"URL"	: line[1].trim(),
		};
		client.skins.set(skins.name, { URL: skins.URL });
	});
});
fs.createReadStream("./assets/skins.csv").pipe(parseSkins);
*/

client.login(client.config.token);