from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from PIL import Image
import io
import os

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

def takeScreenshot():

    # set up the webdriver
    driver = setupChromedriver()
    driver.set_window_size(1280, 1024) # set the window size to the desired dimensions

    # navigate to the URL and wait for the page to load
    url = "http://127.0.0.1:8080" # replace with your URL
    driver.get(url)
    driver.implicitly_wait(10) # wait up to 10 seconds for page elements to load

    # Fill in elements
    wheel_size_field = driver.find_element(By.ID, "percentage-field")
    wheel_size_field.click()
    wheel_size_field.clear()
    wheel_size_field.send_keys("20")
    attack_name_field = driver.find_element(By.ID, "attack-name-field")
    attack_name_field.click()
    attack_name_field.send_keys("Kick")
    attack_value_field = driver.find_element(By.ID, "attack-value-field")
    attack_value_field.click()
    attack_value_field.send_keys("50")
    attack_ability_field = driver.find_element(By.ID, "attack-ability-field")
    attack_ability_field.click()
    attack_ability_field.send_keys("Kicks the opponent aksjdklljas lkdjlkasjd lkajsldkj qk;whdkjlqh njwkdhioaqw ndmxankx;ihqwo;ik ndj,xm ajo9qwj dn,hqowpi;d ;kqwodh ")
    add_button = driver.find_element(By.ID, "add-field-button")
    add_button.click()
    driver.implicitly_wait(2)
    # find the green rectangle on the page
    green_elem = driver.find_element(By.ID, "attack-table")

    # get the location and dimensions of the rectangle
    location = green_elem.location
    size = green_elem.size

    # take a screenshot of the entire page
    screenshot = driver.get_screenshot_as_png()
    screenshot = Image.open(io.BytesIO(screenshot))

    # crop the screenshot to the contents inside the rectangle
    left = location['x']
    top = location['y']
    right = location['x'] + size['width']
    bottom = location['y'] + size['height']
    screenshot = screenshot.crop((left, top, right, bottom))

    # save the cropped screenshot to a file
    screenshot.save("screenshot.png")

    # close the webdriver
    driver.quit()

def main():
    list = ['a','b','c','d']
    for index, item in enumerate(list):
        print(f"{index} : {item}")

if __name__ == "__main__":
    main()