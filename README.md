# helpar

helpar

## Installation

### Initialize a template project

We recommend to install this template by using the viewar-cli:<br>

- Install viewar-cli: <br>`npm install -g viewar-cli`.<br><br>
- Initialize a project: <br>`viewar-cli init`<br><br>
- _Select the user account for this app:_ navigate to your account.<br><br>
- _Select a project type:_ Choose the _Sample Project_ to access the Template List.<br><br>
- _Choose a sample project:_ <br>`Helpar Object Tracking`<br><br>
- _Enter the app ID:_ Define the _Bundle ID_ you will be using to access your application through the SDK App. We suggest using a syntax of _company.project_.<br><br>
- _Enter the app version:_ Unless you have a really good reason, stick to 1.0 as default.<br><br>
- _Choose trackers_: In order to use the <b>helpar</b> template you need to activate 2 tracking systems: <b>Placenote</b> and <b>Remote</b>.

### Run application in the browser

You have 2 modes to choose from:<br>

- <b>mock mode</b> (no 3D content, mock buttons for AR tracking simulation): <br>`npm run start:mock` <br><br>
- <b>full browser mode</b> (download 3D content, no mock buttons for AR tracking simulation): <br>`npm run start`

### UI Configuration flags

```js
{
  serverUrl: '', // Server url to connect to.
  demo: false    // Enable demo login.
}
```

## Support

Documentation: https://viewar.gitbooks.io/sdk-documentation/content/
<br>Tutorials: https://developer.viewar.com/site/tutorials
<br>Features Overview: https://www.youtube.com/watch?v=0j-v-j9xEUQ
