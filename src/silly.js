require("dotenv").config();
const { Client, IntentsBitField, ActivityType, Partials } = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

let guild;

client.on("ready", async (c) => {
    console.log(`✅ ${c.user.tag} is now online. ✅`);
    client.user.setActivity({
        name:"smots gaming",
        type:ActivityType.Watching,
    });
    guild = client.guilds.cache.get("1235244922706329600");
    
    inputLoop();
    //client.channels.cache.get("1329551174487248918").send({content:"You guessed **SMOTS-8**\nThe room was **SMOTS-8**. You scored **5000** points!\nGame Over!\nYou scored 5000/5000.",files:[]});
    /*const guild = client.guilds.cache.get("1326330601908994112");
    const founduser = (await guild.members.fetch()).get("563749920683720709");
    founduser.send("smots gaming is coming for you");*/
    
});
client.on("messageCreate", (message) => {
    //console.log(message);
    if (message.author.id == founduser.id && message.guildId == null) console.log(message.cleanContent);
});


client.login(process.env.TOKEN);


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

let channel = "1326330603486056480";
let dmMode = false;
let founduser = {id:"826957144162172998"};
let replyMessage;
let replyMode = false

async function inputLoop() {
    readline.question('>>>', async (command) => {
        if (command === '$exit') {
            readline.close();
            return;
        }
        if (command.slice(0,3) == "$ch"){
            if (!client.channels.cache.get(command.slice(4))){
                console.log(`The channel ${command.slice(4)} doesn't exist!`)
                inputLoop();
                return;
            }
            dmMode = false;
            channel = command.slice(4);
            console.log(`Switching to channel #${client.channels.cache.get(channel).name} in ${client.channels.cache.get(channel).guild.name}`);
            inputLoop();
            return;
        }
        if (command.slice(0,3) == "$dm"){
            dmMode = true;
            try {
                founduser = await client.users.fetch(command.slice(4));
            } catch (error) {
                console.log(`The user ${command.slice(4)} doesn't exist!`);
                dmMode = false;
                inputLoop();
                return;
            }
            console.log(`Switching to ${founduser.globalName}'s dms`);
            inputLoop();
            return;
        }
        if (command.slice(0,3) == "$re"){
            replyMode = true;
            try {
                let ch = await client.channels.cache.get(channel)
                replyMessage = await ch.messages.fetch(command.slice(4))
            } catch (error) {
                console.log(`The message ${command.slice(4)} doesn't exist!`);
                replyMode = false;
                inputLoop();
                return;
            }
            console.log(`Replying to message ${replyMessage.id}`);
            inputLoop();
            return;
        }
        if (command.slice(0,4) == "$sre"){
            console.log("Stopping reply....")
            replyMode = false
        }
        
        if (command[0] != "$"){
            if (!dmMode){ 
                if (!replyMode) client.channels.cache.get(channel).send(command);
                else {
                    replyMessage.reply(command);
                    replyMode = false
                }
            }
            else founduser.send(command);
        }
        inputLoop();
        return;
    });
}
  

