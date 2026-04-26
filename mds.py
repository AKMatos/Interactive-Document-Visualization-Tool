import pandas as pd
import numpy
import nltk
from nltk.tree import *

# RUN THIS THE FIRST TIME YOU RUN THIS CODE (PRESS DOWNLOAD IN THE BOTTTOM LEFT)
#nltk.download()

# Read the dataset from project 1
df = pd.read_csv('datasetAsCSV.csv')

amountOfRows = len(df.index)

# Tags in tagset universal
# VERB - verbs (all tenses and modes)
# NOUN - nouns (common and proper)
# PRON - pronouns 
# ADJ - adjectives
# ADV - adverbs
# ADP - adpositions (prepositions and postpositions)
# CONJ - conjunctions
# DET - determiners
# NUM - cardinal numbers
# PRT - particles or other function words
# X - other: foreign words, typos, abbreviations
# . - punctuation

tagVERB = [0] * amountOfRows
tagNOUN = [0] * amountOfRows
tagPRON = [0] * amountOfRows
tagADJ = [0] * amountOfRows
tagADV = [0] * amountOfRows
tagADP = [0] * amountOfRows
tagCONJ = [0] * amountOfRows
tagDET = [0] * amountOfRows
tagNUM = [0] * amountOfRows
tagPRT = [0] * amountOfRows
tagX = [0] * amountOfRows
tagPUNC = [0] * amountOfRows

for index, row in df.iterrows():
    tokens = nltk.word_tokenize(row['FileContents'])
    tagged = nltk.pos_tag(tokens, tagset='universal')
    for tuple in tagged:
        match tuple[1]:
            case ("VERB"):
                tagVERB[index] += 1
            case ("NOUN"):
                tagNOUN[index] += 1
            case ("PRON"):
                tagPRON[index] += 1
            case ("ADJ"):
                tagADJ[index] += 1
            case ("ADV"):
                tagADV[index] += 1
            case ("ADP"):
                tagADP[index] += 1
            case ("CONJ"):
                tagCONJ[index] += 1
            case ("DET"):
                tagDET[index] += 1
            case ("NUM"):
                tagNUM[index] += 1
            case ("PRT"):
                tagPRT[index] += 1
            case ("."):
                tagPUNC[index] += 1
            case ("X"):
                tagX[index] += 1
            case _:
                raise TypeError("Only tagged allowed")

df2 = pd.DataFrame(
    {'VERB': tagVERB,
     'NOUN': tagNOUN,
     'PRON': tagPRON,
     'ADJ': tagADJ,
     'ADV': tagADV,
     'ADP': tagADP,
     'CONJ': tagCONJ,
     'DET': tagDET,
     'NUM': tagNUM,
     'PRT': tagPRT,
     '.': tagPUNC,
     'X': tagX,
    })

df2.to_csv("posMatrix.csv", sep=',', index=False)

import matplotlib.pyplot as plt
from sklearn.manifold import MDS

# Create an MDS object with
# 2 dimensions and random start
mds = MDS(n_components=2, random_state=0)

# Fit the data to the MDS
# object and transform the data
df_transformed = mds.fit_transform(df2.values)

print('Dimension of X after MDS : ', df_transformed.shape)

# Plot the results
plt.scatter(df_transformed[:, 0], df_transformed[:, 1])
plt.title("MDS Visualization")
plt.xlabel("Weighted Amount of Unique Words")
plt.ylabel("Weighted Size of File")
# plt.show()

plt.savefig('plot.png')

df_cleaned = pd.DataFrame(df_transformed, columns=["x", "y"])
    
df3 = pd.DataFrame(df_cleaned)

df3['FileNames'] = df['FileNames'].tolist()

df3 = df3.loc[:, ['FileNames', 'x', 'y']] 

df3.to_csv("MDS.csv", sep=',', index=False)