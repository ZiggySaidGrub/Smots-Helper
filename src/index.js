require("dotenv").config();
const rl = require('readline-specific');
const fs = require("fs");
const { Client, IntentsBitField, ActivityType } = require("discord.js");
const { getLatestVideo, getNthVideo, getVideoCount, getCommentsByUser } = require('../youtubeApi');

const nReadlines = require('n-readlines');
const explanations = new nReadlines('./explain.txt');

const CHANNEL_ID = "UCp7ZXAVupbsyh4V5_XXCubg";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        //IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        //IntentsBitField.Flags.MessageContent
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
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName == "smots"){ smots(interaction); return; }
    if (interaction.commandName == "daily-smots"){ dailysmots(interaction); return; }
    if (interaction.commandName == "random-smots"){ randomsmots(interaction); return; }
    if (interaction.commandName == "comment"){ comment(interaction); return; }



    // the explanation saga
    if (interaction.commandName == "explain"){ explain(interaction); return; }
    if (interaction.commandName == "submit"){ submit(interaction); return; }
    
    
    
    if (interaction.commandName == "lock"){ lock(interaction); return; }
    if (interaction.commandName == "appoint"){ appoint(interaction); return; }

    if (interaction.commandName == "list"){ 
        /*fs.readFile('./explain.txt', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
          
            interaction.user.send("```"+data+"```");
        });*/
        interaction.user.send({files:["./explain.txt"]})
    }
    
    
    
        
    
});

function appoint(interaction){
    let urole = interaction.member.roles.cache.find(role => role.name === 'smots modding');
    if(urole === undefined) {interaction.reply("ur not a mod buckarro :joy: 🦐"); return;}
    
    let user = interaction.options.get("user")
    assignRoleToUser(process.env.GUILD_ID,user.value,"1325282371838152795");
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
    //for (let i = 1;i<=lineNumber;i++) line = explanations.next;
    //text = explanations.toString("ascii");
    //console.log(text);
    //if (text == "") { interaction.reply(`No explination for episode ${lineNumber}`); return;}

    rl.oneline('./explain.txt', lineNumber.value, function(err, res) {
        if (err) console.error(err)	//handling error
        if (res == "" || res == "u" || res == "l") { 
            getNthVideo(CHANNEL_ID, lineNumber.value).then((video) => {
                getCommentsByUser(video.videoId,"@MatttNguyen2").then((comment) => {
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
        let text = res.slice(1);
        text = text.replaceAll("<br>","\n");
        
        interaction.reply("Episode "+lineNumber.value+":\n"+text);
    });

}


function submit(interaction){
    let line = interaction.options.get("episode");
    let content = interaction.options.get("content");
    getVideoCount(CHANNEL_ID).then((count) => { 
        if (line.value > count) { interaction.reply("That video doesn't exist!"); return;}
        rl.oneline('./explain.txt', line.value, function(err, res) {
            if (err) console.error(err)	//handling error
            if(res[0] == "l"){interaction.reply("This explanation is locked and can't be changed."); return;}
            (async () => {
                await writeToLine("./explain.txt",line.value-1,"u" + content.value);
            })();
            interaction.reply(`Explanation submited for episode ${line.value}!`);
            
        });
    });
    

}

function lock(interaction){
    let urole = interaction.member.roles.cache.find(role => role.name === 'smots modding');
    let line = interaction.options.get("episode");
    let lockvalue = interaction.options.get("locked").value;
    
    let lockmsg = "";
    if(urole === undefined) {interaction.reply("ur not a mod buckarro :joy: 🦐"); return;}
    getVideoCount(CHANNEL_ID).then((count) => { 
        if (line.value > count) { interaction.reply("That video doesn't exist!"); return;}
        rl.oneline('./explain.txt', line.value, function(err, res) {
            if (err) console.error(err)	//handling error

            if (lockvalue) {lockvalue = "l"; lockmsg = "locked";} 
            else {lockvalue = "u"; lockmsg = "unlocked";}

            (async () => {
                await writeToLine("./explain.txt",line.value-1,lockvalue + res.slice(1));
            })();
            interaction.reply(`Explanation ${lockmsg} for episode ${line.value}!`);
            
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