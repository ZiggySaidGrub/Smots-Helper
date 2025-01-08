let explanations = require("./scores/explanations.json");
const fs = require("fs");
const rl = require('readline-specific');

for (let i = 1;i < 1500;i++){
    rl.oneline("./explain.txt", i, function(err, res){
        if (err) console.error(err)	//handling error
        let locked = false;
        let content = "";
        let name = "";
        if (res[0] == "l") locked = true;
        if (res.length > 2) {content = res.slice(1); name = "Legacy Submitter";}
        explanations = explanations.concat({"content":content,"locked":locked,"user":{"id":"N/A","name":name},"episode":i});
        //console.log(explanations);
        if(i == 1499){ fs.writeFileSync("./src/scores/explanations.json",JSON.stringify(explanations, null, 2));}
    });
}
console.log(JSON.stringify(explanations, null, 2))