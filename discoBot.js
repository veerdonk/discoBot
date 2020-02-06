const auth = require('./auth.json');
const fs = require('fs');
const Discord = require('discord.js');
const log = require('winston');
const wit = require('./lib/voiceControl');

//voice
const datapath = 'voiceData';
const rate = 48000;
const frame_size = 1920;
const channels = 2;

//client initialization
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const prefix = '!';
let dadMode = false;
let listening = true;

//Maps to hold voice recording stuff
let voiceConnections = new Map();
let voiceReceivers = new Map();
let writeStreams = new Map();
let speakTime = new Map();
let timestart = new Date().getTime();

for (const file of commandFiles) {
	const commandName = require(`./commands/${file}`);
    client.commands.set(commandName.name, commandName);
    log.info("command added: " + commandName.name);
}

//Logging stuff
log.remove(log.transports.Console);
log.add(new log.transports.Console, {
    colorize: true
});
log.level = 'info';

//Silence stuff for voiceConnection
const { Readable } = require('stream');
const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
class Silence extends Readable {
  _read() {
    this.push(SILENCE_FRAME);
    this.destroy();
  }
}

//When client is ready log this
client.on('ready', function(evt){
    log.info(`Logged in as ${client.user.tag}!`);
})

client.on('guildMemberSpeaking', (member, speaking) => {
    
    
    if(!speakTime.get(member)){
        speakTime.set(member, 0);
    }
    if(speaking){
        console.log(`user: ${member.displayName} is currently speaking`);
        timestart = new Date().getTime();
    }
    if(!speaking){
        let timestop = new Date().getTime();
        speakTime.set(member, speakTime.get(member) + (timestop - timestart));
    }

});


client.on('message', message => {
    if(message.content.startsWith(prefix)){

        const args = message.content.slice(prefix.length).split(/ +/);
	    const commandName = args.shift().toLowerCase();

        log.info(commandName);

        //commandName not implemented
        if (!client.commands.has(commandName)) return;
        
        let command = client.commands.get(commandName);
        
        try {
            if(commandName == "whos_chatty"){
                command.execute(client, message, args, speakTime);
            }else{
                command.execute(client, message, args)
            }
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that commandName!');
        }

    }
    else if(dadMode === true){
        //check for dadjoke
    }

    else if(listening === true){
        
        const voiceChannel = message.member.voiceChannel;//client.channels.get("644587330673311788");
        log.info('listening = true');
    
        voiceChannel.join()
        .then(connection => {
            console.log("connection aquired");
            
            voiceConnections.set()
    
    
            connection.on('speaking', (user, speaking) => {
                log.info(`user: ${user} is currently speaking`)
            });
        })
        .catch(err => {
            log.error(err);
        });

    }

});





client.login(auth.token);