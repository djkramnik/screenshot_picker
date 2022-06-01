//delete all files contained in the string array found in delete.json in the $SCREENSHOT_ROOT folder

//permanently deletes files

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const filePath = path.join(process.env.SCREENSHOT_ROOT, 'delete.json');

try {
    if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        const json = JSON.parse(buffer);

        const filepaths = json.filepaths;

        filepaths.forEach((filepath) => {
            fs.rmSync(filepath);
        });
    } else {
        console.log(`Folder not found: ${filePath}`);
    }
} catch (err) {
    console.log(`Error: ${err}`);
}
