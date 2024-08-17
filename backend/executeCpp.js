const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require('uuid');


const outputPath = path.join(__dirname, 'output');
const codeDirectory = path.join(__dirname, 'codes');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFileName = `${jobId}.exe`;
    const outPath = path.join(outputPath, outputFileName);
    const cppCodeDirectory = path.join(codeDirectory, 'cpp');
    console.log(filePath);
    return new Promise((resolve, reject) => {
        exec(`cd ${cppCodeDirectory} && g++ ${jobId}.cpp -o ../output/cpp/${outputFileName} && cd ${outputPath} && ./${jobId}.exe`, (error, stdout, stderror) => {
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

const executeJava = (filePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFileName = `${jobId}.class`;
    const outPath = path.join(outputPath, outputFileName);
    const javaCodeDirectory = path.join(codeDirectory, 'java');
    const javaOutputDirectory = path.join(codeDirectory, 'output')
    return new Promise((resolve, reject) => {
        console.log(filePath);
        exec(`cd ${javaCodeDirectory} &&  javac -d ../output/java ${jobId}.java && cd ${javaOutputDirectory} && cd java && java Main`, (error, stdout, stderror) => {
            if (error) {
                reject(error);
            }
            if (stderror) {
                reject(stderror);
            }
            resolve(stdout);
        });
    });
}
module.exports = {
    executeCpp,
    executeJava
};