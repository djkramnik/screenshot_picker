const {
    S3Client,
    CreateBucketCommand,
    PutObjectCommand,
} = require('@aws-sdk/client-s3');

const fs = require('fs');
const path = require('path');

require('dotenv').config();

const REGION = process.env.aws_region;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const s3Client = new S3Client({ region: REGION });
const filePath = path.join(process.env.SCREENSHOT_ROOT, 'update.json');

async function createBucket() {
    try {
        const command = new CreateBucketCommand({ Bucket: BUCKET_NAME });

        const data = await s3Client.send(command);
        return data;
    } catch (err) {
        console.log('err', err);
    }
}

async function uploadFile(uploadParams) {
    try {
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log('Upload data', data);
        return data;
    } catch (err) {
        console.log('Error', err);
    }
}

async function main() {
    await createBucket();

    //get filepaths
    if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        const json = JSON.parse(buffer);

        const filepaths = json.filepaths;

        filepaths.forEach((filepath) => {
            const fileStream = fs.createReadStream(filepath);
            const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: path.basename(filepath),
                Body: fileStream,
            };
            uploadFile(uploadParams);
        });
    } else {
        console.log(`Folder not found: ${filePath}`);
    }
}

main();
