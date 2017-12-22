# api-with-node
Node API interacting with Twitter using Express and Pug

# Configuring The Application
#### Create a file called config.js within the root directory of the project file. The file should contain keys and secrets to your Twitter App, which can be found and generated at https://apps.twitter.com/, as well as your Twitter *screen name* as below showcased. IMPORTANT: Your Twitter Application created to generate the below data requires an access token with RWD (read, write & direct message) permissions that you modify inside of the "Access Level" area of your Twitter Application.

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

# Starting the Application
#### Start the application by using 'npm start' or by using 'nodemon' if you have the package installed as a dev dependency. 'npm start' executes the script to run 'node index.js', which accesses the application's entry point.
###### terminal
```javascript
npm start
```
