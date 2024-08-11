const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require('uuid');


const outputPath = path.join(__dirname, 'output');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFileName = `${jobId}.exe`;
    const outPath = path.join(outputPath, outputFileName);
    console.log(filePath);
    return new Promise((resolve, reject) => {
        exec(`g++ codes/${jobId}.cpp -o output/${outputFileName} && cd output && .\\${outputFileName}`, (error, stdout, stderror) => {
            if (error) {
                reject(error);
            }
            if (stderror) {
                reject(stderror);
            }
            resolve(stdout);
        });
    });
};
module.exports = {
    executeCpp,
};