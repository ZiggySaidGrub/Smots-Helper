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

    if (interaction.commandName == "list"){ 
        interaction.user.send({files:["./src/scores/explanations.json"]});
        interaction.reply({content:"mrrrp :3", ephemeral:true});
    }
    
    
    
        
    
});

function whatdoido(interaction, idk){
    let message = "wow looks like this idiot doesn't know how to code";
    fs.readFile("./src/scores/explanations.json", function (err, data) {
        let explanations = JSON.parse(data);
        getVideoCount(CHANNEL_ID).then((count) => { 
            /*let randomvid = getRandomInt(1,count)
            if(idk){
                while(explanations[randomvid-1].content != ""){
                    randomvid = getRandomInt(1,count)
                }
            } else {
                while(explanations[randomvid-1].locked){
                    randomvid = getRandomInt(1,count)
                }
            }*/
            let list = [];
            for (let i = 0;i < explanations.length;i++){
                if(explanations[i].content = "" && idk) list = list.concat(i+1);
                if(explanations[i].content != "" && !explanations[i].locked && !idk) list = list.concat(i+1);
            }
            let randomvid = list[getRandomInt(0,list.length-1)];
            getNthVideo(CHANNEL_ID, randomvid).then((video) => {
                message = (`Episode:[ ${randomvid}](${video.url})`);
                
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
                for (let i = 0; i < count; i++) {
                    if (explanations[i].locked) locks++;
                }
                const hearts = [
                    ":pink_heart:", ":heart:", ":orange_heart:", ":yellow_heart:", 
                    ":green_heart:", ":light_blue_heart:", ":blue_heart:", 
                    ":purple_heart:", ":black_heart:", ":grey_heart:", 
                    ":white_heart:", ":brown_heart:"
                ];
                const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
                interaction.reply(`We have locked explanations for ${locks}/${count} or about ${Math.round((locks / count) * 100)}% of videos! ${randomHeart}`);
            });
        });
    } else {
        interaction.reply(silly[getRandomInt(0, silly.length - 1)]);
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
    if(interaction.context == 1 || interaction.context == 2) {interaction.reply({content:"ur not a mod buckarro :joy: 🦐",ephemeral:true}); return;}
    let urole = interaction.member.roles.cache.find(role => role.name === 'smots modding');
    if(urole === undefined) {interaction.reply({content:"ur not a mod buckarro :joy: 🦐",ephemeral:true}); return;}
    
    let user = interaction.options.get("user")
    assignRoleToUser(process.env.GUILD_ID,user.value,"1325282371838152795");
    assignRoleToUser(process.env.GUILD_ID,user.value,"1326332341894778890");
    console.log(user);
    interaction.reply(`Gave ${user.user.globalName} the smots modding role`);
    
}



async function assignRoleToUser(guildId, userId, roleId) {
    try {
        // Fetch the guild (server) by its ID
        const guild = await client.guilds.fetch(guildId);
        if (!guild) {
            throw new Error('Guild not found');
        }

        // Fetch the member (user) by their ID
        const member = await guild.members.fetch(userId);
        if (!member) {
            throw new Error('User not found in the guild');
        }

        // Assign the role to the user
        await member.roles.add(roleId);
        console.log(`Role ${roleId} assigned to user ${userId}`);
    } catch (error) {
        console.error(`Failed to assign role: ${error.message}`);
    }
}



function explain(interaction){
    let lineNumber = interaction.options.get("episode");
    fs.readFile("./src/scores/explanations.json", function(err, data){
        let explanations = JSON.parse(data);
        getVideoCount(CHANNEL_ID).then((count) => {
            if (!lineNumber) lineNumber = {value:count};
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
        });
        if(explanations[i].locked){interaction.reply(`The explanation for ${line.value} is locked and can't be changed.`); return;}
        
        let newUser = true;
        if (scoreboard.length > 0){
            for (let score = 0; score < scoreboard.length;score++) {
                if (scoreboard[score].id == interaction.user.id) { scoreboard[score].score++; newUser = false; break; }
            }
        }
        if (newUser){ scoreboard = scoreboard.concat({"id":interaction.user.id,"name":interaction.user.globalName,"score":1});}
        scoreboard.sort((a, b) => b.score - a.score);
        fs.writeFileSync("./src/scores/scoreboard.json",JSON.stringify(scoreboard, null, 2));
        
        explanations[i].content = content.value;
        explanations[i].user.id = interaction.user.id;
        explanations[i].user.name = interaction.user.globalName;

        console.log(explanations[i]); // write to file
        fs.writeFileSync("./src/scores/explanations.json",JSON.stringify(explanations, null, 2));
        interaction.reply(`Explanation submited for episode ${line.value}!`);
    });
}

function lock(interaction){
    if(interaction.context == 1 || interaction.context == 2) {interaction.reply({content:"ur not a mod buckarro :joy: 🦐",ephemeral:true}); return;}
    let urole = interaction.member.roles.cache.find(role => role.name === 'smots modding');
    let line = interaction.options.get("episode");
    let lockvalue = interaction.options.get("locked").value;
    fs.readFile("./src/scores/explanations.json", function(err, data){
        let explanations = JSON.parse(data);
        let i = line.value-1;
        
        let lockmsg = "";
        if(urole === undefined) {interaction.reply({content:"ur not a mod buckarro :joy: 🦐",ephemeral:true}); return;}
        getVideoCount(CHANNEL_ID).then((count) => { 
            if (line.value > count) { interaction.reply("That video doesn't exist!"); return;}
            /*rl.oneline('./explain.txt', line.value, function(err, res) {
                if (err) console.error(err)	//handling error

                if (lockvalue) {lockvalue = "l"; lockmsg = "locked";} 
                else {lockvalue = "u"; lockmsg = "unlocked";}

                (async () => {
                    await writeToLine("./explain.txt",line.value-1,lockvalue + res.slice(1));
                })();
                interaction.reply(`Explanation ${lockmsg} for episode ${line.value}!`);
                
            });*/
        });
        explanations[i].locked = lockvalue;

        if (lockvalue) {lockmsg = "locked";} 
        else {lockmsg = "unlocked";}

        console.log(explanations[i]); // write to file
        fs.writeFileSync("./src/scores/explanations.json",JSON.stringify(explanations, null, 2));
        interaction.reply(`Explanation ${lockmsg} for episode ${line.value}!`);
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
