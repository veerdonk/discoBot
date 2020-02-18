module.exports = {
	name: 'whos_chatty',
	description: 'Show how much everyone has been speaking',
	execute(client, message, args, speakTime) {
        let msg = "";

        for(let member in speakTime){
            let timestr = "";
            let minutes = Math.round((speakTime[member]/1000)/60);
            let seconds = Math.round((speakTime[member]/1000)%60);

            //Format the message correctly
            if(minutes > 0){
                timestr += `${minutes} minute`;
                if(minutes > 1){
                    timestr += "s";
                }
                timestr += " and "
            }

            if(seconds > 0){
                timestr += `${seconds} second`;
                if(seconds > 1){
                    timestr += "s";
                }
            }
            msg += `${member} has spoken for a total of ${timestr}\n`
        }

		message.channel.send(msg);
	},
};
