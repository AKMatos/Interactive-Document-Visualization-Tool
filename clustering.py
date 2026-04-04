import nltk
import pandas as pd
from nltk.tree import *

# RUN THIS THE FIRST TIME YOU RUN THIS CODE (PRESS DOWNLOAD IN THE BOTTTOM LEFT)
#nltk.download()

# Read the dataset from project 1
df = pd.read_csv('datasetAsCSV.csv')

# Read the dataset of country names
df4 = pd.read_csv('countries.csv')
countryList = df4['countries'].to_list()

# Create a new column of cluster (which will contain a list of clusters a file is a part of)
df["clusters"] = ""

# Tokenize every file's contents and search through the tokens for country names. If a name is found at it to the dataframe under the cluster columns
for index, row in df.iterrows():
    # Tokenizer
    tokens = nltk.word_tokenize(row['FileContents'])
    # File cluster column with default cluster
    df.loc[index, "clusters"] = ["No Country"]
    # Iterate through the tokens
    for token in tokens:
        # If the token is a country
        if token in countryList:
            # If first country to be added, replace default cluster
            if "No Country" in df['clusters'][index]:
                df.loc[index, "clusters"] = [token]
            # Else append to list of clusters
            else:
                if token not in df['clusters'][index]:
                    df.loc[index, "clusters"].append(token)

# Create a new dataframe that seperates the cluster lists into new rows
# Sim to filesToCsv.py
fileNames = []
fileContents = []
cluster = []

for index, row in df.iterrows():
    for clusterName in row['clusters']:
        fileNames.append(row['FileNames'])
        fileContents.append(row['FileContents'].replace('\n', '\t').replace('\r', ''))
        cluster.append(clusterName)

df_new= pd.DataFrame({
        "FileNames": fileNames,
        "FileContents": fileContents,
        "Cluster": cluster,
    }
)

df_new = df_new.sort_values(by=["Cluster", "FileNames"])
df_new = df_new.reset_index()
    
#Export the modified csv
df_new.to_csv("datasetAsCSVwithClusters.csv", sep=',', index=False)

# #----------------------------------------------This was a ton of data exploration----------------------------------------------
# # I create a df of the token, a df of tokens tagged by POS, and clustered by year
# #Tokenize all the data
# tokensList = []
# tokensCount = []
# tokensSource = []

# for index, row in df.iterrows():
#     tokens = nltk.word_tokenize(row['FileContents'])
#     for token in tokens:
#         try:
#             index = tokensList.index(token)
#             tokensCount[index] += 1
#             if (row['FileNames'] not in tokensSource[index]):
#                 tokensSource[index].append(row['FileNames'])
#         except:
#             tokensList.append(token)
#             tokensCount.append(1)
#             tokensSource.append([row['FileNames']])

# df2 = pd.DataFrame(
#     {'tokens': tokensList,
#      'count': tokensCount,
#      'source': tokensSource,
#     })

# df2 = df2.sort_values(by=["count"], ascending=False)
# df2 = df2.reset_index(drop=True)

# df2.to_csv("tokens.csv", sep=',', index=False)

# #Tag all the tokens by part of speach

# partOfSpeach = []
# posCount = []
# posTokens = []

# for index, row in df.iterrows():
#     tokens = nltk.word_tokenize(row['FileContents'])
#     tagged = nltk.pos_tag(tokens, tagset='universal')
#     for tuple in tagged:
#         try:
#             index = partOfSpeach.index(tuple[1])
#             posCount[index] += 1
#             if (tuple[0] not in posTokens[index]):
#                 posTokens[index].append(tuple[0])
#         except:
#             partOfSpeach.append(tuple[1])
#             posCount.append(1)
#             posTokens.append([tuple[0]])

# df3 = pd.DataFrame(
#     {'POS': partOfSpeach,
#      'POSCount': posCount,
#      'POSTokens': posTokens,
#     })

# df3 = df3.sort_values(by=["POSCount"], ascending=False)
# df3 = df3.reset_index(drop=True)

# df3.to_csv("posTags.csv", sep=',', index=False)

# clusterYear = set()
# tokenSet = set()

# for index, row in df.iterrows():
#     tokens = nltk.word_tokenize(row['FileContents'])
#     for token in tokens:
#         try:
#             tokenAsInt = int(token)
#             # Manual check through numbers in the POS df shows that all dates are between these values
#             if (2100 > tokenAsInt > 1900):
#                 clusterYear.add(row['FileNames'])
#                 tokenSet.add(tokenAsInt)
#         except:
#             pass