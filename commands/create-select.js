const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createselect")
    .setDescription(
      "Create select menu with different choices, do not insert the same id"
    )
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("message content")
        .setRequired(true)
    )
    //#region Option 1
    .addStringOption((option) =>
      option.setName("option1").setDescription("option 1").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("option1key")
        .setDescription("option 1 category ID")
        .setRequired(true)
    )
    //#endregion
    //#region Option 2
    .addStringOption((option) =>
      option.setName("option2").setDescription("option 2").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("option2key")
        .setDescription("option 2 category ID")
        .setRequired(true)
    )
    //#endregion
    //#region Option 3
    .addStringOption((option) =>
      option.setName("option3").setDescription("option 3")
    )
    .addStringOption((option) =>
      option.setName("option3key").setDescription("option 3 category ID")
    )
    .addStringOption((option) =>
      option.setName("option4").setDescription("option 4")
    )
    .addStringOption((option) =>
      option.setName("option4key").setDescription("option 4 category ID")
    )
    .addStringOption((option) =>
      option.setName("option5").setDescription("option 5")
    )
    .addStringOption((option) =>
      option.setName("option5key").setDescription("option 5 category ID")
    ),
  //#endregion
  async execute(interaction) {
    // val can't be the same, DiscordAPI will return error if is the same.
    const contents = [
      {
        label: "Pre-Corso Java",
        val: "0",
      },
      {
        label: "Pre-Corso Web",
        val: "1",
      },
      {
        label: interaction.options.getString("option1"),
        val: interaction.options.getString("option1key"),
      },
      {
        label: interaction.options.getString("option2"),
        val: interaction.options.getString("option2key"),
      },
      {
        label: interaction.options.getString("option3"),
        val: interaction.options.getString("option3key"),
      },
      {
        label: interaction.options.getString("option4"),
        val: interaction.options.getString("option4key"),
      },
      {
        label: interaction.options.getString("option5"),
        val: interaction.options.getString("option5key"),
      },
      interaction.options.getString("content"),
    ];

    // get message content
    const msgCont = (cont) => {
      let str = "";
      cont.forEach((element) => {
        if (typeof element == "string") {
          str = element;
        }
      });
      return str;
    };

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Select your class!")
        .addOptions(ArrayToObject(contents))
    );

    await interaction.reply({
      content: `${msgCont(contents)}`,
      components: [row],
    });
  },
};

function ArrayToObject(options) {
  var obj = [];
  for (let i = 0; i < options.length; i++) {
    // prevent null/undefinied objects
    if (options[i].label == null) {
      continue;
    }

    obj.push({
      label: options[i].label,
      // description: `Description ${i + 1}`,
      value: options[i].val,
    });
  }
  return Object.assign(obj);
}
