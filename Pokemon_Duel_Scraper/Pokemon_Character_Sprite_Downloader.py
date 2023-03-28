import os
import pandas as pd
from PIL import Image
import requests

def getPokemon(file_path):
    # Check if the file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} does not exist.")
    
    df = pd.read_csv(file_path)
    return df

def createSpriteFolders(pokemon_attacks_df, filepath):
    # Check if the filepath exists
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"The specified filepath '{filepath}' does not exist.")

    # Get the list of unique names from the 'Name' column
    for _, row in pokemon_attacks_df.iterrows():
        pokemon_name = row['Name']
        rarity = row['Rarity']
        num_evolutions = int(row['Num Evolutions'])
        base_folder_name = pokemon_name + "_" + rarity + "_"
        # Create a folder for each unique name
        for num in range(num_evolutions + 1):
            folder_name = base_folder_name + str(num)
            folder_path = os.path.join(filepath, folder_name)
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
                print(f"Folder '{folder_name}' created successfully.")
            else:
                print(f"Folder '{folder_name}' already exists, skipping.")


def downloadImages(pokemon_attacks_df, file_path):
    # Check if the specified file_path exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The specified filepath '{file_path}' does not exist.")

    # Iterate over the rows in the dataframe
    for _, row in pokemon_attacks_df.iterrows():
        
        name = row['Name']
        # Special case for nidoran
        if name == 'nidoran♂' or name == 'Nidoran♂':
            name = 'Nidoran-m'
        if name == 'mr. mime' or name == "Mr. Mime":
            name = 'Mr-Mime'
        image_url = f"https://img.pokemondb.net/sprites/x-y/normal/{name.lower()}.png"

        pokemon_name = row['Name']
        rarity = row['Rarity']
        num_evolutions = int(row['Num Evolutions'])
        base_folder_name = pokemon_name + "_" + rarity + "_"
        # Create a folder for each unique name
        for num in range(num_evolutions + 1):
            folder_name = base_folder_name + str(num)
            folder_path = os.path.join(file_path, folder_name)

            # Check if the folder exists, and create it if it doesn't
            folder_path = os.path.join(file_path, folder_name)
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
                print(f"Folder '{folder_name}' created successfully.")

            # Download the image and save it to the folder
            image_path = os.path.join(folder_path, f"{name.lower()}_sprite.png")
            if not os.path.exists(image_path):
                response = requests.get(image_url)
                try:
                    response.raise_for_status()
                except requests.exceptions.HTTPError as e:
                    print(f"Error downloading image '{name.lower()}_sprite.png': {e}")
                    continue
                else:
                    with open(image_path, "wb") as f:
                        f.write(response.content)
                        print(f"Image '{name.lower()}_sprite.png' downloaded successfully.")
            # Resize the image proportional bly to a width of 500 pixels
            image = Image.open(image_path)
            width, height = image.size
            if(width != 500):
                new_width = 500
                new_height = int(height * new_width / width)
                image = image.resize((new_width, new_height))
                # Save the resized image to the same file
                image.save(image_path)
                print(f"Image '{name.lower()}_sprite.png' resized and saved successfully.")

def main():
    print("Beginning main...")
    # Get the Pokemon and attacks from csv
    csv_file_path = "Pokemon_Duel_Characters/pokemon_duel_characters_v1_gen1.csv"
    pokemon_attacks_df = getPokemon(csv_file_path)
    # Check the creation of pokemon folders
    sprite_folder_filepath = "../Pokemon_Data"
    createSpriteFolders(pokemon_attacks_df, sprite_folder_filepath)
    downloadImages(pokemon_attacks_df, sprite_folder_filepath)

if __name__ == "__main__":
    main()