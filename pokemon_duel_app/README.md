## Pushing to Heroku
Make sure the newest build is in the `server` folder:
```bash
$ cd pokemon_duel_app
$ npm run build     
$ cd ..
$ mv pokemon_duel_app/build server/
``` 
First, make sure you have committed all your changes on the main branch.

Navigate to the `heroku-deployment` branch and cd to the `Java_Game` folder
```bash
$ git checkout heroku-deployment
$ cd Java_Game/
```
Merge the changes from the `main` branch into the `heroku-deployment` branch:
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

Push the updated app to Heroku from the the `heroku-deployment` branch
```bash
$ git push heroku heroku-deployment:main --force
```
Open the game at https://pokemon-duel-app.herokuapp.com/

Check Heroku status
```bash
heroku logs --tail -a pokemon-duel-app
```

## Debugging

If you get the following:
```bash
remote: -----> Building on the Heroku-22 stack
remote: -----> Using buildpacks:
remote:        1. https://github.com/timanovsky/subdir-heroku-buildpack
remote:        2. heroku/nodejs
remote: -----> Subdir buildpack app detected
remote: PROJECT_PATH is undefined
remote:  !     Push rejected, failed to compile Subdir buildpack app.
```

Do the following:
```bash
$ pwd
*/Java_Game
$ git branch
* heroku-deployment
  main
$ heroku config:set PROJECT_PATH=server -a pokemon-duel-app
```

## Copying Over Assets
From the `Java_Game` directory run the following:
```bash
cp -rf Assets pokemon_duel_app/Assets
```
