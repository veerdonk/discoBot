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
let speakTime = require('./data/voiceData/chatty.json');
let timestart = new Date().getTime();

//More voice stuff
let dispatcher;
let receiver;
let connection;

//Get all commands
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

// make a new stream for each time someone starts to talk
function generateOutputFile(channel, member) {
    const fileName = `./data/recordings/${channel.name}-${member.displayName}-${Date.now()}.pcm`;
    console.log(fileName);
    return fs.createWriteStream(fileName);
}

// Works (kinda)
client.on('guildMemberSpeaking', (member, speaking) => {
    
    if(!voiceConnections.get(member)){
        voiceConnections.set(member, member.voiceChannel.connection);
    }
    if(!voiceReceivers.get(member)){
        voiceReceivers.set(member,  voiceConnections.get(member).createReceiver());
    }

    if(!speakTime[member.displayName]){
        speakTime[member.displayName] = 0;
    }
    if(speaking){
        console.log(`user: ${member.displayName} is currently speaking`);
        timestart = new Date().getTime();

        const audioStream = voiceReceivers.get(member).createPCMStream(member.user);
        const outputStream = generateOutputFile(member.voiceChannel, member);
        audioStream.on('data', (chunk) => {
            console.log(`Received ${chunk.length} bytes of data.`);
        });
        audioStream.pipe(outputStream);

        outputStream.on("data", console.log)

        audioStream.on('end', () => {
            console.log("audioStream ended");
        })
        //TODO create voice clips
        // Write to file or maybe use stream
        // feed file/stream to Wit
        //Use Wit to determine command.
    }
    if(!speaking){
        let timestop = new Date().getTime();
        speakTime[member.displayName] = speakTime[member.displayName] + (timestop - timestart);

        //A bit inefficient to write each time someone stops speaking
        fs.writeFileSync('./data/voiceData/chatty.json', JSON.stringify(speakTime), 'utf-8');
    }

});

// client.on('presenceUpdate', async (oldPresence, newPresence) =>{

    

// })

function handleVoiceConnection(conn){
    console.log(`Start listening to: ${conn}!`);

    console.log(`Playing a sound in ${conn.channel.name}`);
    dispatcher = conn.playFile('./data/sounds/join.mp3', { passes: 5 });
    dispatcher.on('start', () => {
        console.log('Playing join.mp3')
    })
    dispatcher.on('finish', () => {
        console.log('Finished playing sound')
    })
    dispatcher.on('end', () => {
        console.log('dispatcher ended')
    })
    conn.on('error', (error) => {
        console.log("conn Error!", error);
    });
    conn.on('failed', (error) => {
        console.log("conn Fail!", error);
    });

    //speaking
    conn.on('speaking', (user, speaking) => {
        console.log('user: ', user.displayName);
        console.log('Scribe: speaking: ', speaking);
    })

}

//If user sends a message do something
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
    else if(message.content == 'listen'){
        
    }
});


client.login(auth.token);

//When client is ready log this
client.on('ready', () =>{
    
    log.info(`Logged in as ${client.user.tag}!`);

    // const member = newPresence.member
    
    const voiceID = '644587330673311788';
    const memberVoiceChannel = client.channels.get(voiceID);
    console.log("joining..")
    memberVoiceChannel.join()

    // memberVoiceChannel.join()
    // connection = client.voiceConnections;
    // receiver = connection.createReceiver();

    console.log('joined')
    // .then(conn => {
    //     console.log(conn);
    //     connection = conn;
    // });
    // console.log(connection)
    // handleVoiceConnection(client.voiceConnections.get('644587330673311784'));

})