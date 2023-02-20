import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

def get_hrefs_from_table(url):
    # Set up the web driver
    driver = webdriver.Chrome()  # Change this to the path of your Chrome driver if needed
    driver.get(url)

    # Find the table with class="dextable"
    table = driver.find_element_by_class_name('dextable')

    # Find all the <tr>s inside the table
    rows = table.find_elements_by_tag_name('tr')

    hrefs = []
    for row in rows:
        # Find the <td> with class="fooinfo"
        td = row.find_element_by_class_name('fooinfo')
        # Find the href inside the <a> tag inside the <td>
        href = td.find_element_by_tag_name('a').get_attribute('href')
        hrefs.append(href)

    return hrefs

def extract_pokemon_name(driver):
    # Find the fooleft class
    fooleft = driver.find_element_by_class_name('fooleft')

    # Find the Name <b> tag
    name_tag = fooleft.find_element_by_tag_name('b')

    # Extract the Name text and remove the ID-# prefix
    name = name_tag.text.split(' - ')[-1]

    return name


def extract_header_info(driver):
  html = driver.page_source

  # Parse the HTML using Beautiful Soup
  soup = BeautifulSoup(html, 'html.parser')
  
  # Extract the relevant information from the HTML
  info = {}
  for tag in soup.find_all('b'):
      if tag.text == 'Movement':
          info['Movement'] = tag.next_sibling.strip()[2:]
      elif tag.text == 'Rarity':
          info['Rarity'] = tag.next_sibling.strip()[2:]
      elif tag.text == 'Type':
          info['Type'] = tag.next_sibling.strip()[2:]
      elif tag.text == 'Special Ability':
          info['Special Ability'] = tag.next_sibling.strip()[2:]
  
  return info['Movement'], info['Rarity'], info['Type'], info['Special Ability']


def extract_attack_info(driver):
  # Wait for the table to load
    table = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'dextable')))
    
    # Extract the relevant information from the HTML
    info_list = []
    for tr in table.find_all('tr')[1:]:
        info = {}
        tds = tr.find_all('td')
        info['Wheel Size'] = tds[0].get_text().strip()
        info['Name'] = tds[1].get_text().strip()
        info['Attack Type'] = tds[2].get_text().strip()
        info['Additional Notes'] = tds[3].get_text().strip()
        info['Damage'] = tds[4].get_text().strip()
        if info['Attack Type'] != "White Z-Move" or info['Move Type'] != "Purple Z-Move":
            info_list.append(info)

    # Return the list of dictionaries
    return info_list


def process_pokemon_urls(url_list):
    # Set up the pandas DataFrame with the specified columns
    columns = ['Name', 'Movement', 'Rarity', 'Type', 'Special Ability', 'Attack Wheel Size', 'Attack Name', 'Attack Type', 'Attack Value', 'Attack Ability']
    result_df = pd.DataFrame(columns=columns)

    # Set up the web driver
    driver = webdriver.Chrome()  # Change this to the path of your Chrome driver if needed

    for href in url_list:
        # Open the webpage
        driver.get(href)

        # Extract the desired information from the webpage and add it to the pandas DataFrame
        name = extract_pokemon_name(driver)
        movement, rarity, type, special_ability = extract_header_info(driver)
        attack_info_list = extract_attack_info(driver) # attack_info_list is a list of dictionaries
        # append rows to result_df
        for attack in attack_info_list:
          attack_wheel_size = attack['Wheel Size']
          attack_name = attack['Name']
          attack_move_type = attack['Attack Type']
          attack_add_notes = ['Additional Notes']
          attack_damage = ['Damage']
          row = [name, movement, type, special_ability, attack_wheel_size, attack_name, attack_move_type, attack_add_notes, attack_damage]
          result_df.loc[len(result_df)] = row

    # Clean up
    driver.quit()

    return result_df


def main():
  # Get all links to every Pokemon
  pokemon_duel_listing_url = "https://www.serebii.net/duel/figures.shtml"
  href_list = get_hrefs_from_table(pokemon_duel_listing_url)
  process_pokemon_urls(href_list)
  

if __name__ == "__main__":
  main()
