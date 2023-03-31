import os
import pandas as pd
import copy
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from bs4 import BeautifulSoup
from PIL import Image
import time
import io

def handleSpecialPokemonNames(pokemon_name):
    # Special case for nidoran
    if pokemon_name == 'nidoran♂' or pokemon_name == 'Nidoran♂':
        pokemon_name = 'Nidoran-m'
    if pokemon_name == 'mr. mime' or pokemon_name == "Mr. Mime":
        pokemon_name = 'Mr-Mime'
    return pokemon_name

def setupChromedriver(download_dir = "/home/gurish/Downloads/Attack_Wheels"):
    chrome_options = Options()
    chrome_options.add_argument("--headless") # Ensure GUI is off
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_experimental_option('prefs', {'download.default_directory': download_dir})
    chrome_options.add_argument('--disable-dev-shm-usage')

    # Set path to chromedriver as per your configuration
    homedir = os.path.expanduser("~")
    webdriver_service = Service(f"{homedir}/chromedriver/stable/chromedriver")

    # Choose Chrome Browser
    driver = webdriver.Chrome(service=webdriver_service, options=chrome_options)

    return driver


def fillInAllAttacks(attack_list, driver):
    # print(f"Atack list: {attack_list}")
    for attack in attack_list:
        # Fill in elements
        wheel_size_field = driver.find_element(By.ID, "percentage-field")
        wheel_size_field.click()
        wheel_size_field.clear()
        wheel_size_field.send_keys(str(int(attack['attack_wheel_size'])))
        attack_name_field = driver.find_element(By.ID, "attack-name-field")
        attack_name_field.click()
        attack_name_field.send_keys(attack['attack_name'].capitalize())
        # Fill Attack Values
        attack_value_field = driver.find_element(By.ID, "attack-value-field")
        attack_value_field.click()
        attack_value_field.send_keys(str(attack['attack_value']).replace('☆','★'))
        attack_ability_field = driver.find_element(By.ID, "attack-ability-field")
        attack_ability_field.click()
        attack_ability_field.send_keys(attack['attack_ability'])
        # Select color
        select = Select(driver.find_element(By.ID, 'color-dropdown'))
        attack_type = str(attack['attack_type'].capitalize())
        select.select_by_visible_text(attack_type)
        # Add to table
        add_button = driver.find_element(By.ID, "add-field-button")
        add_button.click()
        driver.implicitly_wait(2)

def saveWheel(attack_list, folder_path, file_name):
    # set up the webdriver
    driver = setupChromedriver()
    driver.set_window_size(1920, 1080) # set the window size to the desired dimensions

    # navigate to the URL and wait for the page to load
    url = "http://127.0.0.1:8080" # replace with your URL
    driver.get(url)
    driver.implicitly_wait(2) # wait up to 10 seconds for page elements to load
    fillInAllAttacks(attack_list, driver)
    # find the download button and click it
    download_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Download Disk')]")
    download_button.click()

    # wait for the download to complete
    wait_time = 10 # set a maximum wait time for the download to complete (in seconds)
    start_time = time.time()
    while time.time() - start_time < wait_time:
        # check if the file has been downloaded
        downloads_path = os.path.join(os.path.expanduser("~"), "Downloads/Attack_Wheels")
        print(f"WTFFF: {downloads_path}")
        files = os.listdir(downloads_path)
        for file in files:
            if file.endswith(".png"):
                # move the file to the specified folder path
                os.replace(os.path.join(downloads_path, file), os.path.join(folder_path, file_name))
                print(f"Successfully downloaded and saved {os.path.join(folder_path, file_name)}")
                break
        else:
            # sleep for a short time and check again
            time.sleep(1)
    else:
        print(f"Failed to download {file_name} within {wait_time} seconds")
    driver.quit()
    

def saveTable(attack_list, folder_path, file_name):
    # set up the webdriver
    driver = setupChromedriver()
    driver.set_window_size(1920, 1080) # set the window size to the desired dimensions

    # navigate to the URL and wait for the page to load
    url = "http://127.0.0.1:8080" # replace with your URL
    driver.get(url)
    driver.implicitly_wait(2) # wait up to 10 seconds for page elements to load
    fillInAllAttacks(attack_list, driver)
    # find the table rectangle on the page
    table_element = driver.find_element(By.ID, "attack-table")

    # get the location and dimensions of the rectangle
    location = table_element.location
    size = table_element.size

    # take a screenshot of the entire page
    screenshot = driver.get_screenshot_as_png()
    screenshot = Image.open(io.BytesIO(screenshot))

    # crop the screenshot to the contents inside the rectangle
    left = location['x']
    top = location['y']
    right = location['x'] + size['width']
    bottom = location['y'] + size['height']
    screenshot = screenshot.crop((left, top, right, bottom))

    # resize the image with a width of 1000 pixels
    width, height = screenshot.size
    new_width = 1000
    new_height = int(height * (new_width / width))
    screenshot = screenshot.resize((new_width, new_height))

    # save the cropped screenshot to a file
    print(f"Saving {folder_path}/{file_name}...")
    screenshot.save(f"{folder_path}/{file_name}")



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
    # print(f"Before evolving: {attack_list[0]}")
    attack_list_copy = copy.deepcopy(attack_list)
    if evolution_num != 0:
        for attack in attack_list_copy:
            # Increase white price
            if(len(str(attack['attack_value'])) > 0):
                if(attack['attack_type'].lower() == 'white' or attack['attack_type'].lower() == 'gold'):
                    new_value = ""
                    if(str(attack['attack_value'])[-1] == 'x'):
                        base_value = int(attack['attack_value'][:-1])
                        new_value = base_value + 10*int(evolution_num)
                        new_value = str(new_value) + 'x' 
                    elif(str(attack['attack_value'])[-1] == '+'):
                        base_value = int(attack['attack_value'][:-1])
                        new_value = base_value + 10*int(evolution_num)
                        new_value = str(new_value) + '+' 
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
def createWheelsAndTable(attack_list, evolution_num, overwrite):
    # Setup file names and folders
    pokemon_name = attack_list[0]['pokemon_name'].capitalize()
    parent_folder_path = f"../Assets/Pokemon_Data/{pokemon_name}_{attack_list[0]['pokemon_rarity']}_{evolution_num}"
    parent_folders = os.path.dirname(parent_folder_path)
    if not os.path.exists(parent_folders):
        raise FileNotFoundError(f"{parent_folder_path} does not exist.")
    folder_path = f"{parent_folder_path}"
    table_file_name = f"{pokemon_name}_{attack_list[0]['pokemon_rarity']}_{evolution_num}_attack_table.png"
    table_full_path = f"{folder_path}/{table_file_name}"
    # Modify the attack list with evolution
    evolved_attack_list = modifyAttackswithEvolution(attack_list, evolution_num)

    # Create the table if we need to overwrite or the table hasnt been made
    if overwrite or not os.path.exists(table_full_path):
        # Last term indicates if we want to overwrite existing tables
        saveTable(evolved_attack_list, folder_path, table_file_name)

    # Create Wheel Folder
    attack_wheels_folder_path = os.path.join(parent_folder_path, "Attack_Wheels")
    if not os.path.exists(attack_wheels_folder_path):
        os.makedirs(attack_wheels_folder_path)

    # * Poison: Damage -20
    # * Confusion: The spun move changes in combat
    # ** Paralyze: Turns a random white attack into a miss
    # * Sleep: Can’t move or attack. Can wake up if a friendly Pokemon moves next to it or if an opponent attacks it.
    # ** Frozen: Same as Sleep with the additional effect of turning all of a Pokemon's Attacks into Miss.
    # ** Burned: Same as paralyzed with the additional effect of reducing the damage of a Pokemon's White and Gold Attacks by 10 in battles.
    wheel_types = ['basic', 'poisoned', 'confused', 'paralyzed', 'asleep', 'frozen', 'burned']
    for wheel_type in wheel_types:
        # Create wheel file name
        attack_wheel_file_name = f"{pokemon_name}_{attack_list[0]['pokemon_rarity']}_{evolution_num}_{wheel_type}_attack_wheel.png"
        print(f"Attempting to save: {attack_wheel_file_name}")

        if(wheel_type == "paralyzed" or wheel_type == "burned"):
            # Get index of all attacks that are white
            idxs_of_white_attacks = []
            for idx, attack in enumerate(evolved_attack_list):
                if attack['attack_type'].lower() == 'white':
                    idxs_of_white_attacks.append(idx)
            # Make an attack list for each white
            attack_version = 0
            for white_idx in idxs_of_white_attacks:
                evolved_copy = copy.deepcopy(evolved_attack_list)
                for idx, attack in enumerate(evolved_copy):
                    if(idx == white_idx):
                        # Set the attack to a miss
                        evolved_copy[white_idx]['attack_name'] = 'Miss'
                        evolved_copy[white_idx]['attack_type'] = 'Red'
                        evolved_copy[white_idx]['value'] = ''
                        evolved_copy[white_idx]['attack_ability'] = ''
                # Paralyzed and burned wheels need a special file name
                modified_file_name = f"{pokemon_name}_{attack_list[0]['pokemon_rarity']}_{evolution_num}_{wheel_type}_{attack_version}_attack_wheel.png"
                saveWheel(evolved_copy, attack_wheels_folder_path, modified_file_name)
                attack_version += 1
                
        elif(wheel_type == "frozen"):
            # Generate all miss
            evolved_copy = copy.deepcopy(evolved_attack_list)
            for idx, attack in enumerate(evolved_copy):
                # Set the all attacks to a miss
                evolved_copy[idx]['attack_name'] = 'Miss'
                evolved_copy[idx]['attack_type'] = 'Red'
                evolved_copy[idx]['value'] = ''
                evolved_copy[idx]['attack_ability'] = ''
            saveWheel(evolved_copy, attack_wheels_folder_path, attack_wheel_file_name)
        else:
            # No changes to the wheel, but include the effect in the name
            saveWheel(evolved_attack_list, attack_wheels_folder_path, attack_wheel_file_name)


def createJSON(attack_list, evolution_num):
    pass

def scrapeWheelsAndTables(pokemon_attacks_df):
    
    # Loop through DF and fill in content for the same Pokemon
    prev_pokemon_name = ""
    
    # Loop through DF and fill in content for the same Pokemon
    attack_list = []  # initialize an empty list to store attack information for each pokemon
    for index, row in pokemon_attacks_df.iterrows():
        pokemon_name = handleSpecialPokemonNames(row['Name'])
        pokemon_movement = row['Movement']
        pokemon_rarity = row['Rarity']
        pokemon_type = row['Type']
        attack_name = row['Attack Name']
        attack_type = row['Attack Type']
        attack_value = row['Attack Value']
        if(pd.isnull(attack_value)):
            attack_value = ""
        attack_value.replace('☆','★')
        attack_ability = row['Attack Ability']
        if(pd.isnull(attack_ability)):
            attack_ability = ""
        attack_wheel_size = row['Attack Wheel Size']
        evolution = row['Evolution']
        evolved_from = row['Evolved From']
        num_evolutions = row['Num Evolutions']
        
        # check if this is a new pokemon and update prev_pokemon_name
        if prev_pokemon_name != pokemon_name:
            prev_pokemon_name = pokemon_name
            # if this is not the first pokemon, create a wheel and table for the previous pokemon
            if attack_list:
                # !! Use for testing 
                # if prev_pokemon_name == 'Psyduck':
                curr_num_evolutions = int(attack_list[0]['num_evolutions'])
                for evolution_num in range(curr_num_evolutions + 1):
                    # print(f"Before createWheelsAndTable: {attack_list[0]}")
                    print(f"Creating Wheels and Table for: {attack_list[0]['pokemon_name']}")
                    # Last term indicates if we want to overwrite existing files
                    createWheelsAndTable(attack_list, evolution_num, False)
                    createJSON(attack_list, evolution_num)

            # clear the attack_list and start a new one for the current pokemon
            attack_list = []

        # append this attack to the current pokemon's attack_list
        attack_list.append({
            'pokemon_name': pokemon_name,
            'pokemon_movement': pokemon_movement,
            'pokemon_rarity' : pokemon_rarity,
            'pokemon_type' : pokemon_type,
            'attack_wheel_size': attack_wheel_size,
            'attack_name': attack_name,
            'attack_type': attack_type,
            'attack_value': attack_value,
            'attack_ability': attack_ability,
            'evolution': evolution,
            'evolved_from': evolved_from,
            'num_evolutions':num_evolutions
        })
        # print(f"Appended: {attack_list[-1]}")

    # after the loop, create a wheel and table for the last pokemon
    if attack_list:
        curr_num_evolutions = int(attack_list[0]['num_evolutions'])
        for evolution_num in range(curr_num_evolutions + 1):
            createWheelsAndTable(attack_list, evolution_num, False)
            createJSON(attack_list, evolution_num)

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
    scrapeWheelsAndTables(pokemon_attacks_df)


if __name__ == "__main__":
    main()