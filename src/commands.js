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
                type:ApplicationCommandOptionType.Integer,
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
                type:ApplicationCommandOptionType.Integer,
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
                type:ApplicationCommandOptionType.Integer,
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
                type:ApplicationCommandOptionType.Integer,
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
                type:ApplicationCommandOptionType.Integer,
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
    {
        name:"9dg-new-game",
        description:"Start a new game of 9d Guessr",
        integration_types:[0,1],
        contexts:[0,1,2],
        options:[
            {
                name:"rounds",
                description:"How many rounds?",
                type:ApplicationCommandOptionType.Integer,
                required:true,
                choices:[
                    {
                        name:"5",
                        value:5
                    },
                    {
                        name:"10",
                        value:10
                    },
                    {
                        name:"15",
                        value:15
                    },
                    {
                        name:"20",
                        value:20
                    },
                    {
                        name:"30",
                        value:30
                    },
                    {
                        name:"50",
                        value:50
                    },
                    {
                        name:"75",
                        value:75
                    },
                    {
                        name:"100",
                        value:100
                    },
                    {
                        name:"150",
                        value:150
                    },
                    {
                        name:"200",
                        value:200
                    },
                    {
                        name:"250",
                        value:250
                    },
                    {
                        name:"300",
                        value:300
                    },
                    {
                        name:"322",
                        value:322
                    }
                ]
            },
            {
                name:"multiplayer",
                description:"Is it a multiplayer game or not?",
                type:ApplicationCommandOptionType.Boolean,
                required:true
            },
            {
                name:"platinum",
                description:"Do you want your game to be platinum mode? (If you guess a room wrong, the game ends)",
                type:ApplicationCommandOptionType.Boolean
            },
            {
                name:"time",
                description:"How long do you want to see the image? (In milliseconds, leave blank for infinite)",
                type:ApplicationCommandOptionType.Integer
            },
            {
                name:"code",
                description:">:3",
                type:ApplicationCommandOptionType.String
            }
        ]
    },
    {
        name:"9dg-guess",
        description:"Guess what room it is!",
        integration_types:[0,1],
        contexts:[0,1,2],
        options:[
            {
                name:"checkpoint",
                description:"Which checkpoint is the picture?",
                type:ApplicationCommandOptionType.String,
                required:true,
                choices:[
                    {
                        name:"ST",
                        value:"ST"
                    },
                    {
                        name:"PS",
                        value:"PS"
                    },
                    {
                        name:"GOF",
                        value:"GOF"
                    },
                    {
                        name:"CU",
                        value:"CU"
                    },
                    {
                        name:"DE",
                        value:"DE"
                    },
                    {
                        name:"ME",
                        value:"ME"
                    },
                    {
                        name:"CR",
                        value:"CR"
                    },
                    {
                        name:"EX",
                        value:"EX"
                    },
                    {
                        name:"DEP",
                        value:"DEP"
                    },
                    {
                        name:"TR",
                        value:"TR"
                    },
                    {
                        name:"SE",
                        value:"SE"
                    },
                    {
                        name:"REV",
                        value:"REV"
                    },
                    {
                        name:"BK",
                        value:"BK"
                    },
                    {
                        name:"SMOTS",
                        value:"SMOTS"
                    },
                    {
                        name:"SR",
                        value:"SR"
                    },
                    {
                        name:"GOTM",
                        value:"GOTM"
                    },
                    {
                        name:"HB",
                        value:"HB"
                    },
                    {
                        name:"RZ",
                        value:"RZ"
                    },
                    {
                        name:"PAR-PL",
                        value:"PAR-PL"
                    },
                    {
                        name:"TL",
                        value:"TL"
                    },
                    {
                        name:"REU",
                        value:"REU"
                    },
                    {
                        name:"PONR",
                        value:"PONR"
                    },
                    {
                        name:"MAC",
                        value:"MAC"
                    },
                    {
                        name:"BO",
                        value:"BO"
                    },
                    {
                        name:"FG",
                        value:"FG"
                    }
                ]
            },
            {
                name:"room",
                description:"Which room number is the picture?",
                type:ApplicationCommandOptionType.Integer,
                required:true
            }
        ]
    },
    {
        name:"9dg-end-game",
        description:"Ends your current game of 9d Guessr.",
        integration_types:[0,1],
        contexts:[0,1,2]
    },
    {
        name:"9dg-join",
        description:"Joins a multiplayer game of 9d Guessr. ONLY WORKS IF YOU ARE IN THE SMOTS GAMING SERVER",
        integration_types:[0,1],
        contexts:[0,1,2],
        options:[
            {
                name:"code",
                description:"The code of the game to join. (Example: ABCDE)",
                type:ApplicationCommandOptionType.String,
                required:true
            }
        ]
    },
    {
        name:"9dg-start",
        description:"Starts your multiplayer game of 9d Guessr. Only works if you are the host",
        integration_types:[0,1],
        contexts:[0,1,2],
    },
    {
        name:"smearch",
        description:"Gets smots videos based off a keyword",
        integration_types:[0,1],
        contexts:[0,1,2],
        options:[
            {
                name:"keyword",
                description:"What to seacrch for",
                type:ApplicationCommandOptionType.String,
                required:true
            }
        ]
    },
    {
        name:"9dg-globalscore",
        description:"View the total score of all 9dg games combined!",
        integration_types:[0,1],
        contexts:[0,1,2]
    },
    {
        name:"9dg-leaderboard",
        description:"View the leaderboard of 9dg games for each length!",
        integration_types:[0,1],
        contexts:[0,1,2],
        options:[
            {
                name:"rounds",
                description:"Which length of game to view the leaderboard for?",
                type:ApplicationCommandOptionType.Integer,
                choices:[
                    {
                        name:"5",
                        value:5
                    },
                    {
                        name:"10",
                        value:10
                    },
                    {
                        name:"15",
                        value:15
                    },
                    {
                        name:"20",
                        value:20
                    },
                    {
                        name:"30",
                        value:30
                    },
                    {
                        name:"50",
                        value:50
                    },
                    {
                        name:"75",
                        value:75
                    },
                    {
                        name:"100",
                        value:100
                    },
                    {
                        name:"150",
                        value:150
                    },
                    {
                        name:"200",
                        value:200
                    },
                    {
                        name:"250",
                        value:250
                    },
                    {
                        name:"300",
                        value:300
                    },
                    {
                        name:"322",
                        value:322
                    }
                ],
                required:true

            }
        ]

    },
    {
        name:"9dg-hof",
        description:"A hall of fame for anyone who guess 322 room in a row correctly.",
        integration_types:[0,1],
        contexts:[0,1,2],
    },
    {
        name:"gay",
        description:"adds a pride flag to an image",
        integration_types:[0,1],
        contexts:[0,1,2],
        options:[
            {
                name:"image",
                description:"The image to edit",
                required:true,
                type:ApplicationCommandOptionType.Attachment
            },
            {
                name:"flag",
                description:"What flag to use",
                required:true,
                type:ApplicationCommandOptionType.Integer,
                choices:[
                    {
                        name:"Rainbow",
                        value:0
                    },
                    {
                        name:"Progress",
                        value:1
                    },
                    {
                        name:"MLM",
                        value:2
                    },
                    {
                        name:"Lesbian",
                        value:3
                    },
                    {
                        name:"Bi",
                        value:4
                    },
                    {
                        name:"Pan",
                        value:5
                    },
                    {
                        name:"Omni",
                        value:6
                    },
                    {
                        name:"Asexual",
                        value:7
                    },
                    {
                        name:"Aromantic",
                        value:8
                    },
                    {
                        name:"Aroace",
                        value:9
                    },
                    {
                        name:"Demisexual",
                        value:10
                    },
                    {
                        name:"Demiromantic",
                        value:11
                    },
                    {
                        name:"Trans",
                        value:12
                    },
                    {
                        name:"Non-Binary",
                        value:13
                    },
                    {
                        name:"Meow",
                        value:14
                    },
                    {
                        name:"smots",
                        value:15
                    }
                ]
            },
            {
                name:"custom-flag",
                description:"Upload your own custom flag.",
                type:ApplicationCommandOptionType.Attachment
            },
            {
                name:"dm",
                description:"Send it dm's or not?",
                type:ApplicationCommandOptionType.Boolean
            },
            {
                name:"opacity",
                description:"How opaque do you want it? (0 is invisible, 1 is not see thorugh)",
                type:ApplicationCommandOptionType.Number
            }
        ]
    }
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