const Discord = require('discord.io');
const log = require('winston');
const auth = require('./auth.json');


//Logging stuff
log.remove(log.transports.Console);
log.add(new log.transports.Console, {
    colorize: true
});
log.level = 'info';

//Bot initialization
const bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

//When bot is ready log this
bot.on('ready', function(evt){
    var offTopic = bot.channels.get("664085438562304002");
    console.log(offTopic);
    log.info('Connected');
    log.info('Logged in as: ');
    log.info(bot.username + ' - (' + bot.id + ')');
})

const ikBenRe = /ik ben (.*)/;


bot.on('message', function(user, userID, channelID, message, evt){
    console.log(message);
    if(message.startsWith('!')){
        let command = message.substring(1);
        log.info('command triggered ' + command);
        switch (command) {
            case 'lokroep':
                console.log(message.member);
                const andereChannel = message.member.channels.find("name", "Die andere");
                user.setVoiceChannel(andereChannel)
                .then(() => console.log(`Moved ${member.displayName}`))
                .catch(console.error);
                break;
            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'Command not recognized'
                })
                break;
        } 
    }else{

        let results = ikBenRe.exec(message);
    
        if(results){
            if(results[1] != 'DadBot!'){
                let name = results[1];
                let msg = 'Hallo ' + results[1] + ', ik ben DiscoBot!';
                bot.sendMessage({
                    to: channelID,
                    message: msg
                });
            }
        }
    }
});

