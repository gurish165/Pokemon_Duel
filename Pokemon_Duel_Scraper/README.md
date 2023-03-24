# Pokemon Duel Scraper

This folder is to generate Pokemone names, attacks, and sprites.

## Install Python
Install a recent version of Python.
### macOS
```bash
$ brew install python3
```
### WSL or Linux
```bash
$ sudo apt-get update
$ sudo apt-get install python3 python3-pip python3-venv python3-wheel python3-setuptools
```
## Create a Python virtual environment
This section will help you install the Python tools and packages locally, which won’t affect Python tools and packages installed elsewhere on your computer.

After finishing this section, you’ll have a folder called `env/` that contains all the Python packages you need for this project.

**Pitfall:** Do not use the version of Python provided by Anaconda. 

Create a virtual environment in your project’s root directory. 
```bash
$ pwd
/mnt/c/Users/gurish/OneDrive/Documents/UofM_Clubs/MECC/NoahsArc
$ python3 -m venv env
```
Activate virtual environment. You’ll need to do this **every time** you start a new shell.
```bash
$ source env/bin/activate
```

## Installing Chrome
https://www.gregbrisebois.com/posts/chromedriver-in-wsl2/

Dependencies
```bash
$ sudo apt-get install -y curl unzip xvfb libxi6 libgconf-2-4
```

Chrome Itself
```bash
$ wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
$ sudo apt install ./google-chrome-stable_current_amd64.deb
```

Ensure it worked:
```bash
$ google-chrome --version
```

## Installing ChromeDriver
Download, unzip, and put it in your bin directory:
```bash
$ wget https://chromedriver.storage.googleapis.com/86.0.4240.22/chromedriver_linux64.zip
$ unzip chromedriver_linux64.zip
$ sudo mv chromedriver /usr/bin/chromedriver
$ sudo chown root:root /usr/bin/chromedriver
$ sudo chmod +x /usr/bin/chromedriver
```