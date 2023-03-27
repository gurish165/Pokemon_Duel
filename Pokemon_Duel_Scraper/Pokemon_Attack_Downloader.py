import os
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

def setupChromedriver():
    chrome_options = Options()
    chrome_options.add_argument("--headless") # Ensure GUI is off
    chrome_options.add_argument("--no-sandbox")

    # Set path to chromedriver as per your configuration
    homedir = os.path.expanduser("~")
    webdriver_service = Service(f"{homedir}/chromedriver/stable/chromedriver")

    # Choose Chrome Browser
    driver = webdriver.Chrome(service=webdriver_service, options=chrome_options)

    return driver

def getDfRowContents(df, row_idx):
    pokemon_name = ""
    attack_wheel_size = ""
    attack_name = ""
    attack_type = ""
    attack_value = ""
    attack_ability = ""

    return pokemon_name, attack_wheel_size, attack_name, attack_type, attack_value, attack_ability

def createWheelAndTable(wheel_type, attack_list):
    pass

def createJSON(wheel_type, attack_list):
    pass

def scrapeWheelsAndTables(pokemon_attacks_df, url):
    driver = setupChromedriver()
    driver.get(url)
    
    # Loop through DF and fill in content for the same Pokemon
    prev_pokemon_name = ""
    wheel_types = ['basic', 'poisoned', 'confused', 'paralyzed', 'asleep', 'frozen', 'burned']
    # Loop through DF and fill in content for the same Pokemon
    attack_list = []  # initialize an empty list to store attack information for each pokemon
    for index, row in pokemon_attacks_df.iterrows():
        pokemon_name = row['Name']
        attack_name = row['Attack']
        attack_type = row['Type']
        attack_value = row['Value']
        attack_ability = row['Ability']
        attack_wheel_size = row['Attack Wheel Size']
        
        # check if this is a new pokemon and update prev_pokemon_name
        if prev_pokemon_name != pokemon_name:
            prev_pokemon_name = pokemon_name
            # if this is not the first pokemon, create a wheel and table for the previous pokemon
            if attack_list:
                for wheel_type in wheel_types:
                    createWheelAndTable(wheel_type, attack_list)
                    createJSON(wheel_type, attack_list)

            # clear the attack_list and start a new one for the current pokemon
            attack_list = []

        # append this attack to the current pokemon's attack_list
        attack_list.append({
            'pokemon_name': pokemon_name,
            'attack_wheel_size': attack_wheel_size,
            'attack_name': attack_name,
            'attack_type': attack_type,
            'attack_value': attack_value,
            'attack_ability': attack_ability
        })

    # after the loop, create a wheel and table for the last pokemon
    if attack_list:
        for wheel_type in wheel_types:
            createWheelAndTable(wheel_type, attack_list)
            createJSON(wheel_type, attack_list)
    driver.quit()

def getPokemon(file_path):
    # Check if the file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} does not exist.")
    
    df = pd.read_csv(file_path)
    return df

def main():
    print("Beginning main...")
    # Get the Pokemon and attacks from csv
    file_path = "Pokemon_Duel_Characters/pokemon_duel_characters_v1_gen1.csv"
    pokemon_attacks_df = getPokemon(file_path)
    # Use df to scrape content from localhost
    url = "localhost:8080"
    scrapeWheelsAndTables(pokemon_attacks_df, url)


if __name__ == "__main__":
    main()