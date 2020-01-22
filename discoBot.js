const auth = require('./auth.json');
const fs = require('fs');
const Discord = require('discord.js');
const log = require('winston');
const wit = require('./lib/voiceControl');

// wit.execute("doe de lokroep");

//client initialization
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const prefix = '!';
let dadMode = false;
let listening = true;

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

//When client is ready log this
client.on('ready', function(evt){
    log.info(`Logged in as ${client.user.tag}!`);
})

client.on('message', message => {
    if(message.content.startsWith(prefix)){

        const args = message.content.slice(prefix.length).split(/ +/);
	    const commandName = args.shift().toLowerCase();

        log.info(commandName);

        //commandName not implemented
        if (!client.commands.has(commandName)) return;
        
        let command = client.commands.get(commandName);
        
        try {
            command.execute(client, message, args)
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that commandName!');
        }

    }
    else if(dadMode === true){
        //check for dadjoke
    }

    else if(listening === true){
        const voiceChannel = client.channels.get("644587330673311788");
        log.info('listening = true');
        voiceChannel.join()
        .then(conn => {
            log.info('ready!');
            // create our voice receiver
            const receiver = conn.createReceiver();

            conn.on('speaking', (user, speaking) => {
                log.info("speaking conn up...");
                    if (speaking) {
                        log.info(`I'm listening to ${user}`);
                        //This is where the audiostream will be created/written to file

                        // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
                        const audioStream = receiver.createPCMStream(user);
                        // create an output stream so we can dump our data in a file
                        const outputStream = generateOutputFile(voiceChannel, user);
                        // pipe our audio data into the file stream
                        audioStream.pipe(outputStream);
                        outputStream.on("data", console.log);
                        // when the stream ends (the user stopped talking) tell the user
                        audioStream.on('end', () => {
                        log.info(`I'm no longer listening to ${user}`);
                        });
                        
                    }
                });
            })
        .catch(console.log);
    }

})





client.login(auth.token);