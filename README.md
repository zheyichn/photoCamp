# Photo&amp;Video-sharing Social Network APP -  HW5

# Deployment
The app is deployed to `https://photocamp.herokuapp.com/`

# Instructions for running it locally

  Root folder
  1. Add configurations to .env - details can be obtained from group members separately. It would contain five vairables AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, dbName, password, and NODE_ENV.

  For Front-end
  1. cd into the `./new_view` folder 
  2. run `npm install`
  3. run `npm run build`
  
  For Back-end
  1. cd into the `./server` folder 
  2. run `npm install`
  
  Start the app
  1. In the `./server` folder, run `npm start`
  2. Make sure the run the app at local host 8080, NOT 3000!
  
## How to run back-end test files:
  1. make sure you are under the `./server` folder or any subfolder within it
  2. run `npm test`

## How to run eslint check:
  - run `npm run lint` in folder `./new_view` (front-end) and folder `./server` (back-end)

## How to run cypress testing:
 - start the server using `npm start` in folder `./server`
 - in folder `new_view`, run `npx cypress open`, follow the UI and click `allTests.cy.js` to run all the e2e tests.



