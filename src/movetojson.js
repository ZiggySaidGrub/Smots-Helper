let explanations = [];
const fs = require("fs");
const rl = require('readline-specific');
rl.alllines('./explain.txt', function(err, res) {
    if (err) console.error(err)	//handling error
    //console.log(res)	//print content
    for(let i = 1;i < 1500;i++){
        let locked = false;
        let content = "";
        let name = "";
        let idxString = i.toString();
        
        if (res.row[idxString][0] == "l") locked = true;
        if (res.row[idxString].length > 2) {content = res.row[idxString].slice(1); name = "Legacy Submitter";}
        explanations = explanations.concat({"content":content,"locked":locked,"user":{"id":"N/A","name":name},"episode":i});
        console.log(i);
    }
    fs.writeFileSync("./src/scores/explanations.json",JSON.stringify(explanations, null, 2));
})
/*for (let i = 1;i < 1500;i++){
    rl.oneline("./explain.txt", i, function(err, res){
        if (err) console.error(err)	//handling error
        let locked = false;
        let content = "";
        let name = "";
        if (res[0] == "l") locked = true;
        if (res.length > 2) {content = res.slice(1); name = "Legacy Submitter";}
        explanations = explanations.concat({"content":content,"locked":locked,"user":{"id":"N/A","name":name},"episode":i});
        console.log(i);
        if(i == 1499){ fs.writeFileSync("./src/scores/explanations.json",JSON.stringify(explanations, null, 2)); console.log("writing!")}
    });
}
console.log(JSON.stringify(explanations, null, 2))*/

