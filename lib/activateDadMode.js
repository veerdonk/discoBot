module.exports = {
	name: 'dadMode',
	description: 'Switches dadMode on and off',
	execute(message, args) {
		message.channel.send('dadMode!');
	},
};