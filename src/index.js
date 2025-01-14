require("dotenv").config();
const rl = require('readline-specific');
let scoreboard = require('./scores/scoreboard.json');
//let explanations = require("./scores/explanations");
const fs = require("fs");
const { Client, IntentsBitField, ActivityType } = require("discord.js");
const { getLatestVideo, getNthVideo, getVideoCount, getCommentsByUser } = require('../youtubeApi');

const nReadlines = require('n-readlines');

const silly = ["mrrrp :3", "meow :3", ":3", ":3 :3", "psspspsppsps :3", ":cat:"]

const CHANNEL_ID = "UCp7ZXAVupbsyh4V5_XXCubg";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.on("ready", (c) => {
    console.log(`✅ ${c.user.tag} is now online. ✅`);
    client.user.setActivity({
        name:"smots gaming",
        type:ActivityType.Watching,
    });
});


client.on("interactionCreate",(interaction) => {
    //if (interaction.context == 1) {interaction.reply("smots gaming"); return;}
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == "smots"){ smots(interaction); return; }
    if (interaction.commandName == "daily-smots"){ dailysmots(interaction); return; }
    if (interaction.commandName == "random-smots"){ randomsmots(interaction); return; }
    if (interaction.commandName == "comment"){ comment(interaction); return; }



    // EPIC: The musical, the Explanation Saga. Releases January 32nd
    if (interaction.commandName == "explain"){ explain(interaction); return; }
    if (interaction.commandName == "submit"){ submit(interaction); return; }

    if (interaction.commandName == "progress"){ progress(interaction); return; }
    if (interaction.commandName == "remaining"){ remaining(interaction); return; }
    
    
    
    if (interaction.commandName == "lock"){ lock(interaction); return; }
    if (interaction.commandName == "appoint"){ appoint(interaction); return; }

    if (interaction.commandName == "whatdoido"){ whatdoido(interaction, true); return; }
    if (interaction.commandName == "curate"){ whatdoido(interaction, false); return; }

    if (interaction.commandName == "smonsole"){ smonsole(interaction); return; }

    if (interaction.commandName == "list"){ 
        interaction.user.send({files:["./src/scores/explanations.json"]});
        interaction.reply({content:"mrrrp :3", ephemeral:true});
    }
    
    
    
        
    
});


function smonsole(interaction){
    let name = interaction.options.get("command").value;
    let arg = interaction.options.get("argument")?.value;
    fs.readFile("./src/scores/smonsole.json", function (err, data) {
        let commands = JSON.parse(data);

        if (!(name in commands)){interaction.reply(`The command\n\`$${name}\`\ndoesn't exist.`); return;}

        let f = new Function(commands[name].arguments, commands[name].body);
        f(interaction,arg);

    });
}



function whatdoido(interaction, idk){
    let message = "wow looks like this idiot doesn't know how to code";
    fs.readFile("./src/scores/explanations.json", function (err, data) {
        let explanations = JSON.parse(data);
        getVideoCount(CHANNEL_ID).then((count) => { 
            let list = [];
            for (let i = 0;i < count;i++){
                if(explanations[i].content == "" && idk) list = list.concat(i+1);
                if(explanations[i].content != "" && !explanations[i].locked && !idk) list = list.concat(i+1);
                //list = list.concat(i+1);
            }
            if (list.length < 1) {interaction.reply("No videos found"); return;}
            let randomvid = list[Math.floor(Math.random() * list.length)];
            console.log(randomvid);
            getNthVideo(CHANNEL_ID, randomvid).then((video) => {
                if (idk) message = `Not sure what to do? How about you help by explaining this video! \nUse /submit [[${randomvid}](${video.url})] and write an explanation for the video.`;
                if (!idk) message = `Wanna help out a little more in depth? How about you help make this explanation better! Use /explain [[${randomvid}](${video.url})] and /submit [[${randomvid}](<${video.url}>)]\nThe current explanation is:\n${explanations[randomvid-1].content}`;
                
                interaction.reply(message);
            }); 
        });
    });
}

function progress(interaction) {
    let thesilly = interaction.options.get("the-silly");
    if (thesilly === null) thesilly = false;
    if (thesilly.value != true) {
        fs.readFile("./src/scores/explanations.json", function (err, data) {
            let explanations = JSON.parse(data);
            getVideoCount(CHANNEL_ID).then((count) => {
                let locks = 0;
                let filled = 0;
                for (let i = 0; i < count; i++) {
                    if (explanations[i].locked) locks++;
                    if (explanations[i].content != "") filled++;
                }
                const hearts = [
                    ":pink_heart:", ":heart:", ":orange_heart:", ":yellow_heart:", 
                    ":green_heart:", ":light_blue_heart:", ":blue_heart:", 
                    ":purple_heart:", ":black_heart:", ":grey_heart:", 
                    ":white_heart:", ":brown_heart:", ":3", "<:smotsheart:1327432522518237254>"
                ];
                const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
                interaction.reply(`We have locked explanations for ${locks}/${count} or about ${Math.round((locks / count) * 100)}% and filled out explanations for ${filled}/${count} or about ${Math.round((filled / count) * 100)}% of videos! ${randomHeart}`);
            });
        });
    } else {
        interaction.reply(silly[Math.floor(Math.random() * silly.length)]);
    }
}
function remaining(interaction){
    let list = interaction.options.get("list");
    if (list === null) list = false;
    fs.readFile("./src/scores/explanations.json", function(err, data){
        let explanations = JSON.parse(data);
        getVideoCount(CHANNEL_ID).then((count) => {
            let locks = 0;
            let episodes = [];
            for (let i = 0;i < count;i++){
                if (!explanations[i].locked) {locks++; episodes = episodes.concat(i+1);}
            }
            interaction.reply(`We have ${locks} remaining videos to explain!`);
            if(list) interaction.user.send(episodes.toString());
        });
    });
}

function appoint(interaction){
    fs.readFile("./src/scores/mods.json", function(err, data){
        let mods = JSON.parse(data);
        let mod = mods.includes(interaction.user.id);

        
        if(!mod) {interaction.reply({content:"ur not a mod buckarro :joy: 🦐",ephemeral:true}); return;}
        
        let user = interaction.options.get("user");
        let username = user.user.globalName;
        if (username == null) username = user.user.username;
        if (mods.includes(user.value)) {interaction.reply(`${username} already is a mod.`); return;}
        mods = mods.concat(user.value);
        fs.writeFileSync("./src/scores/mods.json",JSON.stringify(mods, null, 2));

        interaction.reply(`Added ${username} to the list of mods.`);
    });
}






function explain(interaction){
    let lineNumber = interaction.options.get("episode");
    fs.readFile("./src/scores/explanations.json", function(err, data){
        let explanations = JSON.parse(data);
        getVideoCount(CHANNEL_ID).then((count) => {
            if (!lineNumber) lineNumber = {value:count};
            if (lineNumber > count) {interaction.reply("That video doesn't exist!");return;}
            let data = explanations[lineNumber.value-1];
            if (data.content == "") { 
                if (lineNumber.value > count){ interaction.reply("That video doesn't exist!"); return; }
                getNthVideo(CHANNEL_ID, lineNumber.value).then((video) => {
                    getCommentsByUser(video.videoId,"@MatttNguyen2").then((comment) => {
                        if (comment.length == 0) { interaction.reply(`No explanation for episode ${lineNumber.value}`); return;}
                        
                        message = comment[0].comment;
                        message = message.replaceAll("<br>","\n");
                        message = message.replaceAll("&quot;","\"");
                        message = message.replaceAll("&#39;","\'");
                        interaction.reply(`No community made explanation for episode ${lineNumber.value} instead trying to pull from @MatttNguyen2:\n${message}`)
                        console.log(comment);
                    });
                }); 
                return;
            }
            let text = data.content.replaceAll("<br>","\n");
            interaction.reply("Episode "+lineNumber.value+":\n"+text);
        });
    });
}


function submit(interaction){
    let line = interaction.options.get("episode");
    let content = interaction.options.get("content");
    fs.readFile("./src/scores/explanations.json", function(err, data){
        let explanations = JSON.parse(data);
        let i = line.value-1;
        getVideoCount(CHANNEL_ID).then((count) => { 
            if (line.value > count) { interaction.reply("That video doesn't exist!"); return;}
            if(explanations[i].locked){interaction.reply(`🔒 The explanation for ${line.value} is locked and can't be changed. 🔒`); return;}
            
            let username = interaction.user.globalName;
            if (username == null) username = interaction.user.username;
            
            let newUser = true;
            if (scoreboard.length > 0){
                for (let score = 0; score < scoreboard.length;score++) {
                    if (scoreboard[score].id == interaction.user.id) { scoreboard[score].score++; newUser = false; break; }
                }
            }
            if (newUser){ scoreboard = scoreboard.concat({"id":interaction.user.id,"name":username,"score":1});}
            scoreboard.sort((a, b) => b.score - a.score);
            fs.writeFileSync("./src/scores/scoreboard.json",JSON.stringify(scoreboard, null, 2));
            
            explanations[i].content = content.value;
            explanations[i].user.id = interaction.user.id;
            explanations[i].user.name = username;
            
            console.log(explanations[i]); // write to file
            fs.writeFileSync("./src/scores/explanations.json",JSON.stringify(explanations, null, 2));
            interaction.reply(`Explanation submited for episode ${line.value}!`);
        });
    });
}

function lock(interaction){
    let urole = interaction.member.roles.cache.find(role => role.name === 'smots modding');
    let line = interaction.options.get("episode");
    let lockvalue = interaction.options.get("locked").value;
    fs.readFile("./src/scores/explanations.json", function(err, data){
        fs.readFile("./src/scores/mods.json", function(err, data2){
            let mods = JSON.parse(data2);
            let mod = mods.includes(interaction.user.id);
            let explanations = JSON.parse(data);
            let i = line.value-1;
            
            let lockmsg = "";
            if(!mod) {interaction.reply({content:"ur not a mod buckarro :joy: 🦐",ephemeral:true}); return;}
            getVideoCount(CHANNEL_ID).then((count) => { 
                if (line.value > count) { interaction.reply("That video doesn't exist!"); return;}
                explanations[i].locked = lockvalue;
                
                if (lockvalue) {lockmsg = "locked";} 
                else {lockmsg = "unlocked";}
                
                console.log(explanations[i]); // write to file
                fs.writeFileSync("./src/scores/explanations.json",JSON.stringify(explanations, null, 2));
                interaction.reply(`Explanation ${lockmsg} for episode ${line.value}!`);
            });
        });
    });
}




async function writeToLine(filePath,lineNumber,newContent){
    try {
        // Read the file content
        const data = await fs.promises.readFile(filePath, 'utf8');
    
        // Split the content into an array of lines
        const lines = data.split('\n');
    
        // Ensure the lineNumber is within bounds
        if (lineNumber < 0 || lineNumber >= lines.length) {
          throw new Error('Line number out of range');
        }
    
        // Replace the specific line
        lines[lineNumber] = newContent;
    
        // Join the lines back into a single string
        const updatedContent = lines.join('\n');
    
        // Write the updated content back to the file
        await fs.promises.writeFile(filePath, updatedContent, 'utf8');
      } catch (error) {
        console.error(`Error replacing line in file: ${error.message}`);
      }
}





function smots(interaction){
    let episode = interaction.options.get("episode");
    getVideoCount(CHANNEL_ID).then((count) => { 
        if (episode.value > count) {interaction.reply("That video doesn't exist!"); return;}
        getNthVideo(CHANNEL_ID, episode.value).then((video) => {
            interaction.reply(`Episode:[ ${episode.value}](${video.url})`);
        });
    });
}
function dailysmots(interaction){
    getVideoCount(CHANNEL_ID).then((count) => { 
        getLatestVideo(CHANNEL_ID).then((video) => {
            interaction.reply(`Episode:[ ${count}](${video.url})`);
        })
    });
}
function randomsmots(interaction){
    let message = "wow looks like this idiot doesn't know how to code";
    getVideoCount(CHANNEL_ID).then((count) => { 
        let randomvid = getRandomInt(1,count)
        getNthVideo(CHANNEL_ID, randomvid).then((video) => {
            message = (`Episode:[ ${randomvid}](${video.url})`);
            
            interaction.reply(message);
        }); 
    });
    
}

function comment(interaction){
    let user = interaction.options.get("user").value;
    let episode = interaction.options.get("episode").value;
    if(user[0] != "@"){user = "@"+user;}
    getNthVideo(CHANNEL_ID, episode).then((video) => {
        getCommentsByUser(video.videoId, user).then((comments) => {
            let message = `Comments by user ${user} on episode ${episode}:`;
            if (comments.length > 0) {
                for (let i = comments.length-1;i>=0;i--){
                    message = message + `\n\nComment ${-i+comments.length}:\n` + comments[i].comment;
                }
                message = message.replaceAll("<br>","\n");
                message = message.replaceAll("&quot;","\"");
                message = message.replaceAll("&#39;","\'");
                interaction.reply(message);
            } else {
                interaction.reply({content:"No such comments",ephemeral:true});
            }
        });
    });
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}





client.login(process.env.TOKEN);
