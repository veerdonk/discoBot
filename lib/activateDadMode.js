module.exports = {
	name: 'dadMode',
	description: 'Switches dadMode on and off',
	execute(message, args) {
		dadMode = true;
		message.channel.send('dadMode!');
	},
};