const discord = require("discord.js");
const client = new discord.Client();

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

client.login(client.config.token);