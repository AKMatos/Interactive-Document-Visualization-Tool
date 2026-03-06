const fs = require('fs');

// This function gets all the file paths of files in a folder
function getAllFiles (dir, allFilesList = []){
    //Have files be the files in given folder
    const files = fs.readdirSync(dir);
    //Recursive function to push all files on to the allFilesList list
    files.map(file => {
        //Name of current file
        const name = dir + '/' + file;
        //If the there is a subdirectory, do recursive call
        if (fs.statSync(name).isDirectory()) {
            getAllFiles(name, allFilesList);
        } 
        //Else push file name onto array
        else {
            allFilesList.push(name);
        }
    })
    return allFilesList;
}

//Cut off the first n amount of char from a list of strings
//Used to cut of the file directory part of the file names
function fileNameTrim(trimLength, files) {
    for (let i = 0; i < files.length; i++) {
        files[i] = files[i].slice(trimLength)
    }

    return files
}


//Call 
const allFilesWithDirectory = getAllFiles('./dataset');
let allFilesName = fileNameTrim(10, allFilesWithDirectory)
console.log(allFilesName);

test = allFilesWithDirectory[0]