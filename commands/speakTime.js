module.exports = {
	name: 'whos_chatty',
	description: 'Show how much everyone has been speaking',
	execute(client, message, args, speakTime) {
        let msg = "";

        for(let member of speakTime.keys()){
            msg += `${member.displayName} has spoken for a total of ${speakTime.get(member)/1000} seconds\n`
        }

		message.channel.send(msg);
	},
};