const fs = require("fs");

let jsonout = []

for (let i = 0; i < 26; i++){
    jsonout = jsonout.concat({
        "cp":"",
        "rooms":0
    });
}

fs.writeFileSync("./src/scores/9drooms.json",JSON.stringify(jsonout, null, 2));