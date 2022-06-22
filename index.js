const { Client, Intents, Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");

require("dotenv/config"); // get .env items

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

//#region initialize commands

const commands = [];

client.commands = new Collection();
const cmdFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of cmdFiles) {
  const command = require("./commands/" + file);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

//#endregion

client.once("ready", () => {
  console.log("Bot online!");

  //#region Initialize command handler

  const CLIENT_ID = client.user.id;

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
      body: commands,
    })
    .then(() => {
      console.log("Successfully registered application commands.");
    })
    .catch(console.error);

  //#endregion
});

// bot action when interact
client.on("interactionCreate", async (interaction) => {
  // command handler
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      // const isAdmin = interaction.member._roles.find(
      //   (i) => i == "935129849742372914"
      // );
      // if (isAdmin)
      await command.execute(interaction);
    } catch (error) {
      console.error(new Error(error));

      await interaction.reply({
        content: "An error occurred while executing that command.",
        ephemeral: true,
      });
    }
  }

  // select menu handler
  if (interaction.isSelectMenu()) {
    try {
      if (interaction.customId === "select") {
        const guilds = interaction.member.displayName;
        const userId = interaction.user.id;
        const roleId = interaction.guild.roles.cache.get(interaction.values[0]);
        const usersCache = [];

        // user request spam
        if (usersCache.includes(userId)) {
          client.users.cache
            .get(interaction.user.id)
            .send(
              "We have already received your request, please wait for it to be accepted"
            );
          return;
        }

        await interaction.update({}); // Just await for something to not get error

        if (roleId > "1") {
          const embed = new MessageEmbed()
            .setColor("#00ff00")
            .setTitle("Role Request")
            .setAuthor({
              name: guilds,
              iconURL: interaction.user.avatarURL(),
            })
            .setDescription(
              `User: **${guilds}** Required role: **${roleId.name}**\n
                            Use reaction:\n\n ✅ to approve\n\n ❌ to decline`
            )
            .setTimestamp();

          // send message just in that channel
          // TODO: find a way to get this code directly on form creation
          console.log(interaction.cache);
          client.channels.cache
            .get("966629222720344064")
            .send({ embeds: [embed] })
            .then((msg) => {
              const filter = (reaction, user) => {
                // add userId to userCache
                usersCache.push(userId);

                // User feedback to button triggered
                client.users.cache
                  .get(interaction.user.id)
                  .send(
                    "We have already received your request, please wait for it to be accepted"
                  );
                return (
                  reaction.emoji.name === "✅" && user.id === msg.author.id
                );
              };

              msg.react("✅").then(() =>
                msg.react("❌").then(() => {
                  // required timeout because sometimes collector starts before ❌ reaction
                  setTimeout(() => {
                    const collector = msg.createReactionCollector(filter);

                    // let role = msg.guild.roles.cache.get(
                    //   `${interaction.values[0]}`
                    // );

                    collector.on("collect", (messageReaction, user) => {
                      // remove userId from userCache
                      usersCache = [
                        ...usersCache,
                        usersCache.filter((id) => id != userId),
                      ];

                      if (messageReaction.emoji.name == "✅") {
                        interaction.member.roles.add(role);
                      } else {
                        client.users.cache.get(interaction.user.id).send(
                          `It was not possible to set you the role selected 
                            [${roleId.name}], please select new role again`
                        );
                      }
                    });
                  }, 2000);
                })
              );
            });
        } else {
          interaction.member.roles.add("946412996681424947");
        }
      }
    } catch (ex) {
      console.log(new Error(ex));
    }
  }
});

client.login(process.env.TOKEN);
