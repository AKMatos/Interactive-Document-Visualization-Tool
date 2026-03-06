from pathlib import Path
import sys

source_dir = Path('dataset/')

files = source_dir.iterdir()

def process_files(files):
    for file in files:
        with file.open('r') as file_handle :
            for line in file_handle:
                print(line)
                yield line

process_files(files)