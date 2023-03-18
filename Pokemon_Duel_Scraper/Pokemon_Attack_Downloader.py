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

def addAttackContent():
    pass

def scrapeWheelsAndTables(pokemon_attacks_df, url):
    driver = setupChromedriver()
    driver.get(url)
    
    # Loop through DF and fill in content for the same Pokemon
    # If the Pokemon name changes, refresh the page
    prev_pokemon_name = ""
    for row_idx in pokemon_attacks_df:
        pokemon_name, attack_wheel_size, attack_name, attack_type, attack_value, attack_ability = getDfRowContents(pokemon_attacks_df, row_idx)
        if(pokemon_name != prev_pokemon_name):
            # refresh page and set Pokemon Name
            pass
        # TODO: Create wheels for pokemon that have effect (burned, frozen, etc)
        pass

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