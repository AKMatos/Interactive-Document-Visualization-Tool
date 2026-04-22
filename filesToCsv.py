#Imports for file/folder access and pandas
from pathlib import Path
from os import walk
import pandas as pd

#Set source as dataset folder
sourceDir = Path('dataset/')

#For us, this makes a list called fileNames with the names of the files
f = []
for (dirpPath, dirNames, fileNames) in walk(sourceDir):
    f.extend(fileNames)
    break

#List for file contents
fileContents = []

#Fill above list with contents using file names to access the files
for i in range(len(fileNames)):
    file = open("dataset/" + fileNames[i], "r")
    fileContents.append(file.read().replace('\n', '\t').replace('\r', ''))
    file.close()

#Create a dataframe with these 2 lists
df = pd.DataFrame({
        "FileNames": fileNames,
        "FileContents": fileContents,
    }
)

#Export that dataframe as a csv
df.to_csv("datasetAsCSV.csv", sep=',', index=False)