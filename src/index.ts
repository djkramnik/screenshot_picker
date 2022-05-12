import express from 'express';
import { readdir } from 'fs/promises'
import path from 'path';
import helmet from 'helmet';
import { cwd } from 'process';
import { extname, join } from 'upath'

import 'dotenv/config'


let app = express();
const PORT = 3000;

app.use(helmet())
app.use(express.json())


async function getDirectories(directory_path: string) {
    const directories = (await readdir(path.resolve(directory_path), {
        withFileTypes: true
    }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    return directories;
}

async function getFiles(directory_path: string) {
    const files = (await readdir(path.resolve(directory_path), {
        withFileTypes: true
    }))
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);

    return files;
}

function getDirectoryPath(path: string) {
    return process.env.ROOT_DIR === path ? process.env.ROOT_DIR : cwd();
}

//change to correct base directory
const rootDirectory = '/c/User/david/workspace///';

app.get('/', (_, res) => {
    res.send({
        1: '/api/fs/directory',
        2: '/api/fs/directory/:directoryId/files'
    })
})

//criteria 1
app.get('/api/fs/directory', async (req, res) => {
    //todo: make cross platform;

    try {

        const directory_path = getDirectoryPath(rootDirectory);

        const files = await getDirectories(directory_path);
        return res.send({ "directory": files })

    } catch (err) {
        console.log(err)
    }
})

//criteria 2
app.get('/api/fs/directory/:directoryId/files', async (req, res) => {
    //todo: cross platform

    let directory_path = getDirectoryPath(rootDirectory);

    const directories = await getDirectories(directory_path);

    const directoryId = req.params.directoryId;

    if (directories.indexOf(directoryId) === -1) {
        return res.status(404).send({
        })
    }

    //get files of specified directory
    const files = await getFiles(join(directory_path, directoryId))

    const ext = req.query.ext as string;

    if (!ext) {
        return res.send({ "files": [...files] }) //no extension; no filter needed
    }

    try {
        const filteredFiles = files.filter(file => extname(file) === `.${ext}`)

        return res.send({ "files": [...filteredFiles] })
    } catch (err) {
        console.log(err)
    }

})

app.listen(PORT, () => {
    console.log(`Server started. Listening on port ${PORT}`)
})
