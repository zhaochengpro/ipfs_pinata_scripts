const fs = require("fs")
const path = require("path")
const pinataSDK = require('@pinata/sdk');
const { API_Key, API_Secret } = require("./keys.json");
const pinata = pinataSDK(API_Key, API_Secret);

function getAllFiles(dirPath, originalPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []
    originalPath = originalPath || path.resolve(dirPath, "..")

    folder = path.relative(originalPath, path.join(dirPath, "/"))

    files.forEach(function (fileName) {
        if (fs.statSync(dirPath + "/" + fileName).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + fileName, originalPath, arrayOfFiles)
        } else {
            file = path.join(dirPath, "/", fileName)
            arrayOfFiles.push({
                path: process.argv[4] == "dir" ? path.relative(originalPath, file).replace(/\\/g, "/") : null,
                content: fs.createReadStream(file),
                name: fileName.split(".png")[0]
            })
        }
    })

    return arrayOfFiles
}

function writeMetadata(name, url, path) {
    let metadata = {
        name: name,
        image: url
    }

    var writeStream = fs.createWriteStream(path);
    writeStream.write(JSON.stringify(metadata));
    writeStream.end();

}

function uploadFileToIPFS(files, base) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file.name != ".DS_Store") {
            pinata.pinFileToIPFS(file.content, null).then(result => {
                rootItem = ipfsPrefix + "/ipfs/" + result.IpfsHash
                writeMetadata(file.name, rootItem, process.argv[4] + "/" + (base + i));
                console.info((base + i) + " Generate metadata " + rootItem + " to /metadata")
            }).catch(error => console.error(error))
        }

    }
}

function uploadDirToIPFS(dirPath) {
    let sourcePath = path.resolve(__dirname, dirPath);
    pinata.pinFileToIPFS(sourcePath, null).then((result) => {
        rootItem = ipfsPrefix + "/ipfs/" + result.IpfsHash
        console.info("Upload metadata dir  to /metadata, hash : " + result.IpfsHash);
    }).catch(error => console.error(error))
}

function runFile() {
    files = getAllFiles(process.argv[2])
    ipfsPrefix = "https://ipfs.io"

    uploadFileToIPFS(files, Number(process.argv[3]));

}

function runDir() {
    ipfsPrefix = "https://ipfs.io"

    uploadDirToIPFS(process.argv[2]);
}

if (process.argv[5] == "file") {
    // upload image to ipfs and create some files
    // example npm run ipfs ./images_07 120 ./metadata file
    runFile()
} else if (process.argv[3] == "dir") {
    // upload metadata dir to ipfs
    runDir()
}