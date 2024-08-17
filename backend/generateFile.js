const fs = require("fs");
const path = require("path");
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive : true});
}

const generateFile = (language, code) => {
    const jobId = uuid();
    const langDir = path.join(dirCodes, language);
    if(!fs.existsSync(langDir)){
        fs.mkdirSync(langDir, {recursive : true});
    }
    const filename = `${jobId}.${language}`;
    const filePath = path.join(langDir, filename);
    fs.writeFileSync(filePath, code);
    return filePath;
};
module.exports = {
generateFile,
};