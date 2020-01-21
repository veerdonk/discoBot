const {Wit} = require('node-wit');
const auth = require('../auth.json');
const log = require('winston');

//Wit client initialization
const witClient = new Wit({
    accessToken: auth.wit_server_token,
    logger: log
})

module.exports = {
    name: "wit",
    description: "Handles voice commands",
    execute(message){
        processWitMessage(message);
    }

}

function processWitMessage(message){
    witClient.message(message, {}).then((data) => {
        log.info("Got Wit response: " + JSON.stringify(data));
    }).catch(console.error);
}

