/*const fs = require("fs-extra");
/*const cps = require("./scores/9drooms.json");

const images = fs.readdirSync("./9d gaming");

let total = 0;

for (let i = 0; i < cps.length; i++){
    for (let j = 0; j < cps[i].rooms; j++){
        total++;

        let image = images[total-1];
        fs.renameSync(`./9d gaming/${image}`,`./9d/${cps[i].cp}/${j+1}/9dbcimage.png`);
    }
}


for (let i = 0; i < cps.length; i++){
    for (let j = 0; j < cps[i].rooms; j++){
        try {
            
            fs.mkdirSync(`./9d/${cps[i].cp}/${j+1}`);
        } catch (error) {
            
        }
    }
}

//const names = ["imageA.png","imageB.png","imageC.png","imageD.png"];

let total = 0;

const cps = fs.readdirSync("./9d");
cps.forEach((element, i) => {
    const rooms = fs.readdirSync(`./9d/${element}`);
    let cp = element;
    rooms.forEach((element, i) => {
        total++;
    });
});

console.log(total);*/

const overlayImages = require('./overlay.js');
overlayImages("./flags/trans.png","./blahaj.png","./output/out.png",0.8);
