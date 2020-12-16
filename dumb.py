import os

directory = r'C:\Users\kisersj\Desktop\Projects\CardGames\cards\multicolored\cards'
for filename in os.listdir(directory):
    fname = filename.split(".")[0]
    ext = "." + filename.split(".")[1]
    if fname.startswith("club"):
        suit = "C"
        value = fname[4:]
        if value in ["Ace", "Jack", "Queen", "King"]: value = value[0]
        fname2 = value + suit + ext
    if fname.startswith("diamond"): 
        suit = "D"
        value = fname[7:]
        if value in ["Ace", "Jack", "Queen", "King"]: value = value[0]
        fname2 = value + suit + ext
    if fname.startswith("heart"):
        suit = "H"
        value = fname[5:]
        if value in ["Ace", "Jack", "Queen", "King"]: value = value[0]
        fname2 = value + suit + ext
    if fname.startswith("spade"):
        suit = "S"
        value = fname[5:]
        if value in ["Ace", "Jack", "Queen", "King"]: value = value[0]
        fname2 = value + suit + ext
    os.rename(f'{directory}\{filename}', f'{directory}\{fname2}')