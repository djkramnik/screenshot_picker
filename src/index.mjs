import express from 'express';
import { readdir } from 'fs/promises';
import path from 'path';

import 'dotenv/config';

let app = express();
const PORT = 3000;

app.use(express.json());

async function getDirectories(directory_path) {
    const directories = (
        await readdir(path.resolve(directory_path), {
            withFileTypes: true,
        })
    )
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    return directories;
}

async function getFiles(directory_path) {
    const files = (
        await readdir(path.resolve(directory_path), {
            withFileTypes: true,
        })
    )
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name);

    return files;
}

const rootDirectory = process.env.ROOT_DIR ?? process.cwd();

app.get('/', (_, res) => {
    res.send(['/api/fs/directory', '/api/fs/directory/:directoryId/files']);
});

//criteria 1
app.get('/api/fs/directory', async (req, res) => {
    try {
        const files = await getDirectories(rootDirectory);
        return res.send({ directory: files });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

//criteria 2
app.get('/api/fs/directory/:directoryId/files', async (req, res) => {
    try {
        const directories = await getDirectories(rootDirectory);

        const directoryId = req.params.directoryId;

        if (directories.indexOf(directoryId) === -1) {
            return res.status(404).send({});
        }

        //get files of specified directory
        const files = await getFiles(path.join(rootDirectory, directoryId));

        const ext = req.query.ext;

        if (!ext) {
            return res.send({ files: [...files] }); //no extension; no filter needed
        }
        const filteredFiles = files.filter(
            (file) => path.extname(file) === `.${ext}`
        );

        return res.send({ files: [...filteredFiles] });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

app.listen(PORT, () => {
    console.log(`Server started. Listening on port ${PORT}`);
});
