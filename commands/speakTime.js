module.exports = {
	name: 'whos_chatty',
	description: 'Show how much everyone has been speaking',
	execute(client, message, args, speakTime) {
        let msg = "";

        for(let member of speakTime.keys()){
            let seconds = speakTime.get(member)/1000;

            msg += `${member.displayName} has spoken for a total of ${Math.round(seconds/60)} minutes and ${Math.round(seconds%60)} seconds\n`
        }

		message.channel.send(msg);
	},
};
