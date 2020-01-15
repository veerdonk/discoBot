const tools = require('../lib/tools.js');
const log = require('winston');
let lokAmount = 6;

module.exports = {
	name: 'lokroep',
	description: 'Performs a so called lokroep',
    execute(client, message, args) {
        
        let reqAmount = parseInt(args[0])
        if((typeof reqAmount) === "number" && !isNaN(reqAmount)){
            if(reqAmount < 30){ 
                lokAmount = args[0];
            }else{
                return message.channel.send(`${reqAmount} is not allowed, choose a value below 30.`)
            }
        }


        const oldChannel = message.member.voiceChannel;
        let newChannel;

        const generalChannel = client.channels.find(val => val.name === "General");
        const dieAndereChannel = client.channels.find(val => val.name === "Die andere");

        //die andere
        if(oldChannel === generalChannel){
            //set new channel to General
            newChannel = dieAndereChannel;
        }else if(oldChannel === dieAndereChannel){
            //set new channel to 'Die andere'
            newChannel = generalChannel;
        }

        //tools.moveMembers(client, oldChannel, newChannel);
        //oldChannel.setVoiceChannel(newChannel.id).catch(console.error);
        let channels = [newChannel, oldChannel];
        lok(channels, message, lokAmount);
        
        message.channel.send(`${message.member.displayName} called out ${lokAmount} times!`);
	},
};

async function lok(channels, message, times){
    
    for(let i = 0; i < times; i++){
        log.info(channels[i%2].id);
        message.member.setVoiceChannel(channels[i%2]);
        await tools.sleep(200);
    }
}