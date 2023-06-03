module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                console.log(`${interaction.user.tag} in ${interaction.guild} triggered ${interaction.commandName}.`);
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            };
        };

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'feedbackmodal') {
                const subject = interaction.fields.getTextInputValue('subject');
                const feedbacktext = interaction.fields.getTextInputValue('feedbacktext');
                leep = await interaction.client.users.fetch("297140281931988995");
                leep.send(`**User:** ${interaction.user.tag} **Subject:** ${subject} **Feedback:** ${feedbacktext}`);
                await interaction.reply({ content: 'Your feedback was received successfully!' });
            }
        };
    },
};