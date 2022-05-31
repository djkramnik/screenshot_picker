const express = require('express');
const fs = require('fs');
const path = require('path');
const fsRoutes = require('./routes/fs');
const deleteRoutes = require('./routes/delete');

require('dotenv').config();

let app = express();
const PORT = 3000;

app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `${process.env.FRONTEND_URL}`);
    next();
});

app.get('/api', (_, res) => {
    res.send([
        '/api/fs/directory',
        '/api/fs/directory/:directoryId/files',
        '/api/deleteFiles',
        '/api/deleteFiles/:filepath',
    ]);
});

app.use(fsRoutes);
app.use(deleteRoutes);

app.get('/api/updateFiles', (req, res) => {
    try {
        const filePath = path.join(process.env.SCREENSHOT_ROOT, 'update.json');

        console.log(filePath);

        if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            const json = JSON.parse(buffer);

            return res.send(json);
        } else {
            return res.status(500).send('file does not exist');
        }
    } catch (err) {
        res.status(500).send();
    }
});

app.post('/api/updateFiles/:filepath', (req, res) => {
    try {
        const filePath = path.join(process.env.SCREENSHOT_ROOT, 'update.json');

        //for handling file paths in URL, must encode/decode
        const buff = Buffer.from(req.params.filepath, 'base64');

        const decodedFilePath = buff.toString('utf-8');

        //if file exists, get its data
        if (fs.existsSync(filePath)) {
            //get contents of existing file
            const buffer = fs.readFileSync(filePath);
            const json = JSON.parse(buffer);
            const arrFilePaths = json.filepaths;

            //routerend new file path to existing array
            arrFilePaths.push(decodedFilePath);
            const data = JSON.stringify({ filepaths: arrFilePaths });
            try {
                fs.writeFileSync(filePath, data, 'utf-8');
                return res.send(`Data successfully saved: ${data}`);
            } catch (err) {
                console.log(err);
                res.status(500).send('Data could not be saved');
            }
        }

        //file does not exist
        const data = JSON.stringify({ filepaths: [decodedFilePath] });
        try {
            fs.writeFileSync(filePath, data, 'utf-8');
            return res.send(`Data successfully saved: ${data}`);
        } catch (err) {
            console.log(err);
            res.status(500).send('Data could not be saved');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

app.delete('/api/updateFiles/:filepath', (req, res) => {
    try {
        const filePath = path.join(process.env.SCREENSHOT_ROOT, 'update.json');

        //for handling file paths in URL, must encode/decode
        const buff = Buffer.from(req.params.filepath, 'base64');

        const decodedFilePath = buff.toString('utf-8');

        //file doesn't exist
        if (!fs.existsSync(filePath)) {
            return res.status(500).send('File does not exist');
        }

        //if file exists, get its data
        if (fs.existsSync(filePath)) {
            //get contents of existing file
            const buffer = fs.readFileSync(filePath);
            const json = JSON.parse(buffer);
            const arrFilePaths = json.filepaths;

            //remove specified file path from array
            const filtered = arrFilePaths.filter(
                (name) => name !== decodedFilePath
            );

            //file path not found
            if (!arrFilePaths.find((name) => name === decodedFilePath)) {
                return res
                    .status(500)
                    .send(`Could not find file path: ${decodedFilePath}`);
            }

            //write data to file
            const data = JSON.stringify({ filepaths: filtered });
            try {
                fs.writeFileSync(filePath, data, 'utf-8');
                return res.send(`Data successfully removed: ${data}`);
            } catch (err) {
                console.log(err);
                res.status(500).send('Data could not be removed');
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

app.listen(PORT, () => {
    console.log(`Server started. Listening on port ${PORT}`);
});
