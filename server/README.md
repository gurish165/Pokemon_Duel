## Pushing to Heroku
Make sure the newest build is in the `server` folder:
```bash
$ cd pokemon_duel_app
$ npm run build 
$ cd ..
$ mv pokemon_duel_app/build server/
``` 
First, make sure you have committed all your changes on the main branch.

Navigate to the heroku-deployment branch and cd to the Java_Game folder
```bash
$ git checkout heroku-deployment
$ cd Java_Game/
```
Merge the changes from the main branch into the heroku-deployment branch:
```bash
$ git branch
heroku-deployment
$ git merge main
```

Commit the changes:
```bash
$ git add .
$ git commit -m "Update heroku-deployment branch with main branch changes"
```

Push the updated app to Heroku
```bash
$ git subtree push --prefix server heroku heroku-deployment
```
Open the game:
```bash
$ heroku open --app pokemon-duel-app
```