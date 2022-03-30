const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const createPilots = async (number = 10) => {
    const resp = await fetch(`https://randomuser.me/api?inc=name,email,picture&nat=us,dk,fr,gb&noinfo&results=${number}`);
    const data = await resp.json();

    return data.results.map((o, idx) => ({
        id: idx + 1,
        name: o.name.first + ' ' + o.name.last,
        email: o.email,
        comment: '',
        picture: o.picture.large
    }))
}
const writeJsonDataToFile = (data, filename) => {
    fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
}

(async () => {
    const pilots = await createPilots(20);
    const data = { pilots }

    writeJsonDataToFile(data, "data.json");
})()