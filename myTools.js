#! /usr/bin/env node
const { Console } = require("console");
const yargs = require("yargs");
const fs = require('fs');

// console.log("all", yargs.argv)

function showHelp() {   
    console.log("\nUsage: mytools <location file> -t <type output file> - o <location output file>");  
    console.log('\nOptions:\r')  
    console.log(`-t \t: type output file, options: json or text\n\t default:text\n`)  
    console.log(`-o \t: file name and location\n\t ex: /User/johnmayer/Desktop/nginxlog.txt`)  
}
const validateJSON = (data) => {
    try {
      return JSON.parse(data);
    } catch(e) {
      return null;
    }
  }
const readFile = async filePath => {
    try {
        const data = await fs.readFileSync(filePath, 'utf-8')
        return data
    }
    catch(err) {
        console.log(err)
    }
}


try {
    let typeOutput = yargs.argv.t || 'text'
    let dirOutput = yargs.argv.o
    let dirFile = yargs.argv._[0]

    if (yargs.argv.h) {
        return showHelp();
    }

    if (dirFile) {
        const dataFile = fs.readFileSync(dirFile, 'utf-8')
        const dataJson = validateJSON(dataFile);
        let content
        if (!dataJson) {
            if (typeOutput==='json') {
                const allLines = dataFile.split(/\r?\n/)
                content = allLines
            }else{
                content = dataFile
            }
        }else{
            if (typeOutput==='text') {
                content = dataFile
            } else {
                content = dataJson
            }
        }
        console.log(content)
        if(dirOutput){
            if (typeOutput==='json' || dirOutput.slice(-5) === '.json') {
                content = JSON.stringify(content)
            }
            fs.writeFileSync(dirOutput, content);
        }
    }
} catch (error) {
    console.error(error)
}
