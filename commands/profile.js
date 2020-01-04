const discord = require("discord.js");

module.exports = {

	name: "profile",
	description: "Status report on the provided player.",

	execute(client, message, args) {

		const authorID = message.author.id;

		// Use your own server IDs
		const roles = {
			CAPPER: client.emojis.get("660920877378043905"), RET: client.emojis.get("660920909003227187"),
			BC: client.emojis.get("660920928905068561"), SUPPORT: client.emojis.get("660920945086824459"),
		};

		const saberColor = {
			BLUE: "🔵", GREEN: "🟢", ORANGE: "🟠",
			PURPLE: "🟣", RED: "🔴", YELLOW: "🟡",
		};

		// No arguments were provided and the profile exists
		if(args.length === 0) {

			if(client.players.has(authorID)) {
				message.channel.send(createEmbed(authorID));
			}

			// No profile exists
			else { message.channel.send("You don't currently have a profile. Use the command `!profile create` to create a new profile!"); }
		}

		else if(args.length === 1 && args[0] !== "create" && args[0] !== "update") {

			// !profile User (and User exists)
			if(client.players.findKey(user => user.name === args[0])) {

				const playerID = client.players.findKey(user => user.name === args[0]);
				const player = client.players.get(playerID);

				// Fetch User and create their embed
				client.fetchUser(playerID, true).then((user) => {
					const exampleEmbed = new discord.RichEmbed()
						.setAuthor(player.name)
						.setColor(player.saberColor)
						.setTitle("Winrate: " + "100.0" + "%")
						.setThumbnail(user.displayAvatarURL)
						.setImage(player.skin)
						.setFooter("Last updated: ")

						// Find a way to make the name field the same color as the value field
						.addField(`${roles.CAPPER}` 	+ "` : t1`", `${roles.RET}` 	+ "` : t1`", true)
						.addField(`${roles.BC}` 		+ "` : t1`", `${roles.SUPPORT}` 	+ "` : t1`", true);
					message.channel.send(exampleEmbed);
				}).catch((error) => {
					console.log(error);
				});
			}

			// Could not find a profile for the provided user
			else { message.channel.send(" No profile for the player `" + args[0] + "` exists."); }
		}

		// Create
		else if(args.length === 1 && args[0] === "create") {

			// !profile create (and author does not currently have a profile)
			if(!client.players.has(authorID)) {
				client.players.set(authorID, { "name": message.author.username, "role": "ret", "saberColor": "BLUE", "skin": "https://i.imgur.com/WUDbbtk.jpg" });
				message.channel.send("Successfully created your profile! Use the command `!profile update` to update your profile!");
			}

			// User already has a profile
			else { message.channel.send("You already have a profile! View it by typing `!profile`"); }
		}

		// Update (without any arguments)
		else if(args.length === 1 && args[0] === "update") {

			// !profile update (and author does not currently have a profile)
			message.channel.send("Use the following commands to update your profile!\n" +
			"```!profile update role\n!profile update saberColor\n!profile update skin```");
		}

		else if(args.length === 2) {

			if(client.players.has(authorID)) {
				// Must refactor
				switch(args[0]) {
					case "update":
						switch(args[1]) {
							case "role": {
								message.channel.send("Choose your preferred role!").then(msg => {
									msg.react(roles.CAPPER)
										.then(() => msg.react(roles.RET))
										.then(() => msg.react(roles.BC))
										.then(() => msg.react(roles.SUPPORT))
										.catch(() => console.error("Error reacting!"));

									const filter = (reaction, user) =>
										((reaction.emoji.name === roles.CAPPER.name || roles.RET.name || roles.BC.name || roles.SUPPORT.name) && user.id === authorID);
									msg.awaitReactions(filter, { max: 1, time: 20000 })
										.then(collected => {
											switch(collected.first().emoji.name) {

												case roles.CAPPER.name: {
													client.players.set(authorID, "capper", "role");
													message.channel.send("You are now classified as a capper.");
													msg.delete(500);
													break;
												}
												case roles.RET.name: {
													client.players.set(authorID, "ret", "role");
													message.channel.send("You are now classified as a returner.");
													msg.delete(500);
													break;
												}
												case roles.BC.name: {
													client.players.set(authorID, "bc", "role");
													message.channel.send("You are now classified as a BC.");
													msg.delete(500);
													break;
												}
												case roles.SUPPORT.name: {
													client.players.set(authorID, "support", "role");
													message.channel.send("You are now classified as a support.");
													msg.delete(500);
													break;
												}
												default:
											}
										}).catch(() => {
											message.reply("No reaction was selected after 20 seconds.");
											msg.delete();
										});
								});
								break;
							}
							case "color":
								message.channel.send("Choose your preferred saber color!").then(msg => {
									msg.react(saberColor.BLUE)
										.then(() => msg.react(saberColor.GREEN))
										.then(() => msg.react(saberColor.ORANGE))
										.then(() => msg.react(saberColor.PURPLE))
										.then(() => msg.react(saberColor.RED))
										.then(() => msg.react(saberColor.YELLOW))
										.catch(() => console.error("Error reacting!"));

									const filter = (reaction, user) =>
										((reaction.emoji === saberColor.BLUE || saberColor.GREEN || saberColor.ORANGE || saberColor.PURPLE ||
											saberColor.RED || saberColor.YELLOW), user.id === authorID);

									msg.awaitReactions(filter, { max: 1, time: 20000 })
										.then(collected => {
											switch(collected.first().emoji.name) {

												case saberColor.BLUE: {
													client.players.set(authorID, "BLUE", "saberColor");
													message.channel.send("You are now wielding a blue saber.");
													msg.delete(500);
													break;
												}
												case saberColor.GREEN: {
													client.players.set(authorID, "GREEN", "saberColor");
													message.channel.send("You are now wielding a green saber.");
													msg.delete(500);
													break;
												}
												case saberColor.ORANGE: {
													client.players.set(authorID, "ORANGE", "saberColor");
													message.channel.send("You are now wielding an orange saber.");
													msg.delete(500);
													break;
												}
												case saberColor.PURPLE: {
													client.players.set(authorID, "PURPLE", "saberColor");
													message.channel.send("You are now wielding a purple saber.");
													msg.delete(500);
													break;
												}
												case saberColor.RED: {
													client.players.set(authorID, "RED", "saberColor");
													message.channel.send("You are now wielding a red saber.");
													msg.delete(500);
													break;
												}
												case saberColor.YELLOW: {
													client.players.set(authorID, "GOLD", "saberColor");
													message.channel.send("You are now wielding a yellow saber.");
													msg.delete(500);
													break;
												}
												default:
											}
										}).catch(() => {
											message.reply("No reaction was selected after 20 seconds.");
											msg.delete();
										});
								});
								break;
							case "skin":
								message.channel.send("You didn't select a skin! Use the command `!profile help` for more information.");
								break;
							default:
								message.channel.send("Not a recognized option.");
						}
						break;
					default:
				}
			}
			else { message.channel.send("You don't currently have a profile. Use the command `!profile create` to create a new profile!"); }
		}

		else if(args.length === 3) {

			if(client.players.has(authorID)) {

				if(args[0] === "update" && args[1] === "skin") {

					const skinChoice = args[2];
					if(client.skins.has(skinChoice)) {
						const skinURL = client.skins.get(skinChoice).URL;
						client.players.set(authorID, skinURL, "skin");
						message.channel.send("Skin updated!")
							.then((confirmMsg => {
								confirmMsg.delete(15000);
							}))
							.catch(console.error);
					}
					else {
						message.channel.send("Skin doesn't exist!")
							.then((confirmMsg => {
								confirmMsg.delete(15000);
							}))
							.catch(console.error);
					}
				}
				else { message.channel.send("Unknown command. Use `!profile help` for more information."); }
			}
			else { message.channel.send("You don't currently have a profile. Use the command `!profile create` to create a new profile!"); }
		}

		// More than 3 arguments is an invalid command
		else if(args.length > 3) { message.channel.send("Unknown command. Use the command `!profile help` for more information."); }

		else { message.channel.send("Unknown command. Use the command `!profile help` for more information."); }

		// Create an embed for the provided playerID
		function createEmbed(playerID) {

			const player = client.players.get(playerID);

			const exampleEmbed = new discord.RichEmbed()
				.setAuthor(player.name)
				.setColor(player.saberColor)
				.setTitle("Winrate: " + "100.0" + "%")
				.setThumbnail(message.author.displayAvatarURL)
				.setImage(player.skin)
				.setFooter("Last updated: ")

				// Find a way to make the name field the same color as the value field
				.addField(`${roles.CAPPER}` 	+ "` : t1`", `${roles.RET}` 	+ "` : t1`", true)
				.addField(`${roles.BC}` 		+ "` : t1`", `${roles.SUPPORT}` 	+ "` : t1`", true);

			return exampleEmbed;
		}
	},
};