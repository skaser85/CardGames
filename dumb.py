import os

directory = r'C:\Users\kisersj\Desktop\Projects\CardGames\cards\regular\cards'
for filename in os.listdir(directory):
    fname = filename.split(".")[0]
    ext = "." + filename.split(".")[1]
    if len(fname) == 2:
        fname2 = fname[1] + fname[0] + ext
    else:
        fname2 = fname[1:] + fname[0] + ext
    os.rename(f'{directory}\{filename}', f'{directory}\{fname2}')