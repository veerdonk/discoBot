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
    log.info('Connected');
    log.info('Logged in as: ');
    log.info(bot.username + ' - (' + bot.id + ')');
})

const ikBenRe = /ik ben (.*)/;

bot.on('message', function(user, userID, channelID, message, evt){

    
    let results = ikBenRe.exec(message);
    
    if(results){
        if(results[1] != 'DadBot!'){
            let name = results[1];
            let msg = 'Hallo ' + results[1] + ', ik ben DadBot!';
            bot.sendMessage({
                to: channelID,
                message: msg
            });
        }
    }
});