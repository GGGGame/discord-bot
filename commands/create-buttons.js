const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('createbutton')
    .setDescription('create new button/s')
    .addStringOption(option => 
        option.setName('type')
        .setDescription('select button type')
        .setRequired(true)
        .addChoice('Primary (Blue button)', 'PRIMARY')
        .addChoice('Secondary (Gray button)', 'SECONDARY')
        .addChoice('Success (Green button)', 'SUCCESS')
        .addChoice('Danger (Red Button)', 'DANGER')
        .addChoice('Link (external link)', 'LINK'))
    .addStringOption(option => 
        option.setName('label')
        .setDescription('button text')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('content')
        .setDescription('Things the bot will write')
        .setRequired(true)),
        
    async execute(interaction) {
        // get button type
        const contents = [interaction.options.getString('type'),
        interaction.options.getString('label'),
        interaction.options.getString('content')]
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(contents[0].toLowerCase())
                    .setLabel(contents[1])
                    .setStyle(contents[2])
            )
        await interaction.reply({ content: `${contents[2]}`, components: [row] });
    }

};