const log = require('winston');

module.exports = {
	name: 'enable_voice',
	description: 'Enable listening',
	execute(client, message, args) {
		const voiceChannel = client.channels.get("644587330673311788");
        
        voiceChannel.join()
        .then(conn => {
            message.reply('ready!');
            
            // create our voice receiver
            const receiver = conn.createReceiver();

            conn.on('speaking', (user, speaking) => {
                log.info("speaking conn up...");
                    if (speaking) {
                        log.info('voice detected...');
                        message.channel.sendMessage(`I'm listening to ${user}`);
                        // this creates a 16-bit signed PCM, stereo 48KHz PCM stream.
                        const audioStream = receiver.createPCMStream(user);
                        // create an output stream so we can dump our data in a file
                        const outputStream = generateOutputFile(voiceChannel, user);
                        // pipe our audio data into the file stream
                        audioStream.pipe(outputStream);
                        outputStream.on("data", console.log);
                        // when the stream ends (the user stopped talking) tell the user
                        audioStream.on('end', () => {
                        message.channel.sendMessage(`I'm no longer listening to ${user}`);
                        });
                    }
                });
            })
        .catch(console.log);
	},
};

