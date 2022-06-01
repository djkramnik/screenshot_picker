const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

//assignment 1

function getDirectories(directory_path) {
    const directories = fs
        .readdirSync(path.resolve(directory_path), {
            withFileTypes: true,
        })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    return directories;
}

function getFiles(directory_path) {
    const files = fs
        .readdirSync(directory_path, {
            withFileTypes: true,
        })
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name);

    return files;
}

const rootDirectory = process.env.ROOT_DIR ?? process.cwd();

//criteria 1
router.get('/api/fs/directory', async (req, res) => {
    try {
        const files = await getDirectories(rootDirectory);
        return res.send({ directory: files });
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

//criteria 2
router.get('/api/fs/directory/:directoryId/files', async (req, res) => {
    try {
        const directories = getDirectories(rootDirectory);

        const directoryId = req.params.directoryId;

        if (directories.indexOf(directoryId) === -1) {
            return res.status(404).send({});
        }

        //get files of specified directory
        const files = getFiles(path.join(rootDirectory, directoryId));

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

module.exports = router;
