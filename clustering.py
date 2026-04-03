import nltk
import pandas as pd
from nltk.tree import *
import numpy

# RUN THIS THE FIRST TIME YOU RUN THIS CODE (PRESS DOWNLOAD IN THE BOTTTOM LEFT)
#nltk.download()

df = pd.read_csv('datasetAsCSV.csv')

# df2 = pd.read_csv('countries.csv')
# print(df2)

#Tokenize all the data
tokensList = []
tokensCount = []
tokensSource = []

for index, row in df.iterrows():
    tokens = nltk.word_tokenize(row['FileContents'])
    for token in tokens:
        try:
            index = tokensList.index(token)
            tokensCount[index] += 1
            if (row['FileNames'] not in tokensSource[index]):
                tokensSource[index].append(row['FileNames'])
        except:
            tokensList.append(token)
            tokensCount.append(1)
            tokensSource.append([row['FileNames']])

df2 = pd.DataFrame(
    {'tokens': tokensList,
     'count': tokensCount,
     'source': tokensSource,
    })

df2 = df2.sort_values(by=["count"], ascending=False)
df2 = df2.reset_index(drop=True)

df2.to_csv("tokens.csv", sep=',', index=False)

#Tag all the tokens by part of speach

partOfSpeach = []
posCount = []
posTokens = []

for index, row in df.iterrows():
    tokens = nltk.word_tokenize(row['FileContents'])
    tagged = nltk.pos_tag(tokens, tagset='universal')
    for tuple in tagged:
        try:
            index = partOfSpeach.index(tuple[1])
            posCount[index] += 1
            if (tuple[0] not in posTokens[index]):
                posTokens[index].append(tuple[0])
        except:
            partOfSpeach.append(tuple[1])
            posCount.append(1)
            posTokens.append([tuple[0]])

df3 = pd.DataFrame(
    {'POS': partOfSpeach,
     'POSCount': posCount,
     'POSTokens': posTokens,
    })

df3 = df3.sort_values(by=["POSCount"], ascending=False)
df3 = df3.reset_index(drop=True)

df3.to_csv("posTags.csv", sep=',', index=False)

clusterYear = set()

for index, row in df.iterrows():
    tokens = nltk.word_tokenize(row['FileContents'])
    for token in tokens:
        try:
            tokenAsInt = int(token)
            if (2100 > tokenAsInt > 1900):
                clusterYear.add(row['FileNames'])
        except:
            pass

print(df['FileNames'])
print(len(clusterYear))
