require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
    {
        name:"smots",
        description:"Get a smots episode of your choosing",
        options:[
            {
                name:"episode",
                description:"Which smots episode to view?",
                type:ApplicationCommandOptionType.Number,
                required:true

            }
        ],
        "integration_types":[0,1],
        "contexts":[0,1,2]
    },
    {
        name:"daily-smots",
        description:"Get the latest smots video",
        "integration_types":[0,1],
        "contexts":[0,1,2]

    },
    {
        name:"random-smots",
        description:"Get a random smots video",
        integration_types:[0,1],
        contexts:[0,1,2]
    },
    {
        name:"comment",
        description:"Get a comment from a specified user on a smots episode",
        options:[
            {
                name:"episode",
                description:"Which smots episode to look for comments on?",
                type:ApplicationCommandOptionType.Number,
                required:true

            },
            {
                name:"user",
                description:"Which user to get comments from? This is case-sensitive. (Type their username not display name)",
                type:ApplicationCommandOptionType.String,
                required:true
            }
        ],
        "integration_types":[0,1],
        "contexts":[0,1,2]
    },
    {
        name:"explain",
        description:"Get a community made explanation for a smots video",
        options:[
            {
                name:"episode",
                description:"Which smots episode to explain?",
                type:ApplicationCommandOptionType.Number,
                required:false

            },
        ],
        "integration_types":[0,1],
        "contexts":[0,1,2]
    },
    {
        name:"submit",
        description:"Submit a community made explanation for a smots video",
        options:[
            {
                name:"episode",
                description:"Which smots episode to explain?",
                type:ApplicationCommandOptionType.Number,
                required:true

            },
            {
                name:"content",
                description:"The body of your explanation",
                type:ApplicationCommandOptionType.String,
                required:true
            }
        ],
        "integration_types":[0,1],
        "contexts":[0,1,2]
    },
    {
        name:"lock",
        description:"Lock or unlock an explanation so it cant be changed (Mod only)",
        options:[
            {
                name:"episode",
                description:"Which smots episode to lock explanations for?",
                type:ApplicationCommandOptionType.Number,
                required:true

            },
            {
                name:"locked",
                description:"Lock or unlock this explanation? (True to lock, False to unlock)",
                type:ApplicationCommandOptionType.Boolean,
                required:true,
            }
        ],
        "integration_types":[0,1],
        "contexts":[0,1,2]
    },
    {
        name:"list",
        description:"DM's you the file that has all the definitions. WARNING the list is really big.",
        "integration_types":[0,1],
        "contexts":[0,1,2]
    },
    {
        name:"appoint",
        description:"Appoint a user to be a mod so they can lock and unlock explanations. (Mod only)",
        options:[
            {
                name:"user",
                description:"The user to give the role to",
                type:ApplicationCommandOptionType.User,
                required:true
            }
        ],
        "integration_types":[0,1],
        "contexts":[0,1,2]
    },
    {
        name:"progress",
        description:"Tells you the precentage of videos we've explained.",
        options:[
            {
                name:"the-silly",
                "description":"do the silly",
                type:ApplicationCommandOptionType.Boolean
            }
        ],
        integration_types:[0,1],
        contexts:[0,1,2]
    },
    {
        name:"remaining",
        description:"Tells you the how many videos are left to be explained.",
        options:[
            {
                name:"list",
                "description":"Will DM you a list of all the smots gaming episodes yet to be explained.",
                type:ApplicationCommandOptionType.Boolean
            }
        ],
        integration_types:[0,1],
        contexts:[0,1,2]
    },
    {
        name:"whatdoido",
        description:"Gets a random video with an empty explanation.",
        integration_types:[0,1],
        contexts:[0,1,2]
    },
    {
        name:"curate",
        description:"Gets a random video with an unlocked explanation.",
        integration_types:[0,1],
        contexts:[0,1,2]
    },
    {
        name:"smonsole",
        description:"A console for smots helper for secret commands",
        options:[
            {
                name:"command",
                description:"What to enter in the console.",
                required:true,
                type:ApplicationCommandOptionType.String
            },
            {
                name:"argument",
                description:"What argument to enter for the command.",
                type:ApplicationCommandOptionType.String
            }
        ],
        integration_types:[0,1],
        contexts:[0,1,2]
    },
];

const rest = new REST({ version:"10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Regestering slash commands...")
        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID,process.env.GUILD_ID
            ),
            { body:commands }
        );
        /*await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,process.env.GUILD_ID
            ),
            { body:commands }
        );*/
        
        console.log("✅ Slash commands were registered. ✅")
    } catch (error) {
        console.log(`❌ There was an error regestering commands. ❌ \n Error:${error}`)
    }
})();