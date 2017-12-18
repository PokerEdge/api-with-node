# api-with-node
Node API interacting with Twitter using Express and Pug

# Configuring The Application
#### Create a file called config.js within the root directory of the project file. The file should contain keys and secrets to your Twitter App, which can be found and generated at https://apps.twitter.com/, as well as your Twitter *screen name* as below showcased

###### config.js
```javascript
module.exports = {
  consumer_key: '...',
  consumer_secret: '...',
  access_token: '...',
  access_token_secret: '...',
  screen_name: '...'
}
```

#Starting The Application
#### Start the application by using 'npm start' or by using 'nodemon' if you have the package installed as a dev dependency. 'npm start' executes 'node index.js', the app's entry point.
###### terminal
```javascript
npm start
```
