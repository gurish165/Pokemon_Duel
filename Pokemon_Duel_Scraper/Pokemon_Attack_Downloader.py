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

#               Attack Format           #
# attack_list.append({
#             'pokemon_name': pokemon_name,
#             'attack_wheel_size': attack_wheel_size,
#             'attack_name': attack_name,
#             'attack_type': attack_type,
#             'attack_value': attack_value,
#             'attack_ability': attack_ability,
#             'evolution': evolution,
#             'evolved_from': evolved_from,
#             'num_evolutions':num_evolutions
#         })
def modifyAttackswithEvolution(attack_list, evolution_num):
    attack_list_copy = attack_list
    for attack in attack_list_copy:
        # Increase white price
        if(attack['attack_type'].lower() == 'white' or attack['attack_type'].lower() == 'gold'):
            new_value = ""
            if(attack['attack_value'][-1] == 'x'):
                base_value = int(attack['attack_value'][:-1])
                new_value = base_value + 10*int(evolution_num)
                new_value = str(new_value) + 'x' 
            else:
                base_value = int(attack['attack_value'])
                new_value = base_value + 10*int(evolution_num)
            attack['attack_value'] = new_value
        # Add stars to pruple attack
        elif(attack['attack_type'].lower() == 'purple'):
            new_value = attack['attack_value'].replace('☆','★')
            for _ in range(evolution_num):
                new_value += '★'
                attack['attack_value'] = new_value
    return attack_list_copy

# This function handles creating the wheel and creates all evolution levels
def createWheelAndTable(attack_list, evolution_num):
    driver = setupChromedriver()
    driver.get("http://127.0.0.1:8080")
    # Modify the attack list with evolution
    evolved_attack_list = modifyAttackswithEvolution(attack_list, evolution_num)
    # TODO: Modify the attack_list using wheel_type. Most effects will modify the attack value in battle
    # * Poison: Damage -20
    # * Confusion: The spun move changes in combat
    # * Paralyze: Turns a random white attack into a miss
    # * Sleep: Can’t move or attack. Can wake up if a friendly Pokemon moves next to it or if an opponent attacks it.
    # * Frozen: Same as Sleep with the additional effect of turning all of a Pokemon's Attacks into Miss.
    # * Burned: Same as paralyzed with the additional effect of reducing the damage of a Pokemon's White and Gold Attacks by 10 in battles.
    wheel_types = ['basic', 'poisoned', 'confused', 'paralyzed', 'asleep', 'frozen', 'burned']
    for wheel_type in wheel_types:
        if(wheel_type == "paralyzed"):
            # TODO: Generate all combinations of misses
            pass
        elif(wheel_type == "frozen"):
            pass
        elif(wheel_type == "burned"):
            # TODO: Generate all combinations of misses
            pass
        else:
            # No changes to the wheel, but include the effect in the name
            pass
        # TODO: Use selenium to fill in the attacks
        # TODO: Save wheel and table to the correct file path
        # TODO: resize the wheel


def createJSON(wheel_type, attack_list, evolution_num):
    pass

def scrapeWheelsAndTables(pokemon_attacks_df, url):
    
    # Loop through DF and fill in content for the same Pokemon
    prev_pokemon_name = ""
    
    # Loop through DF and fill in content for the same Pokemon
    attack_list = []  # initialize an empty list to store attack information for each pokemon
    for index, row in pokemon_attacks_df.iterrows():
        pokemon_name = row['Name']
        attack_name = row['Attack']
        attack_type = row['Type']
        attack_value = row['Value']
        attack_ability = row['Ability']
        attack_wheel_size = row['Attack Wheel Size']
        evolution = row['Evolution']
        evolved_from = row['Evolved From']
        num_evolutions = row['Num Evolutions']
        
        # check if this is a new pokemon and update prev_pokemon_name
        if prev_pokemon_name != pokemon_name:
            prev_pokemon_name = pokemon_name
            # if this is not the first pokemon, create a wheel and table for the previous pokemon
            if attack_list:
                curr_num_evolutions = int(attack_list[0][num_evolutions])
                for evolution_num in range(curr_num_evolutions + 1):
                    createWheelAndTable(wheel_type, attack_list, evolution_num)
                    createJSON(wheel_type, attack_list, evolution_num)

            # clear the attack_list and start a new one for the current pokemon
            attack_list = []

        # append this attack to the current pokemon's attack_list
        attack_list.append({
            'pokemon_name': pokemon_name,
            'attack_wheel_size': attack_wheel_size,
            'attack_name': attack_name,
            'attack_type': attack_type,
            'attack_value': attack_value,
            'attack_ability': attack_ability,
            'evolution': evolution,
            'evolved_from': evolved_from,
            'num_evolutions':num_evolutions
        })

    # after the loop, create a wheel and table for the last pokemon
    if attack_list:
        for wheel_type in wheel_types:
            createWheelsAndTables(wheel_type, attack_list)
            createJSONs(wheel_type, attack_list)

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