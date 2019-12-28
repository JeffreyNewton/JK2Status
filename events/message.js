module.exports = (client, message) => {

	// Ignore messages sent by bot users
	if(message.author.bot) return;

	// Ignore messages where the first "!" character is not at index 0
	if(message.content.indexOf(client.config.prefix) !== 0) return;

	// Gather our commandName and arguments
	const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	// Valid command
	if(!command) return;

	// Attempt to execute the command
	try {
		command.execute(client, message, args);
	}
	catch (error) {
		console.error(error);
		message.reply("Something went wrong when trying to execute that command!");
	}
};