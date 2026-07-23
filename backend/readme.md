now a sum up of how we setup this project 


1 - we define the folder structure 
    - controller
    - db
    - middlewares
    - modles
    - routes
    - utils


2 - installing development dependencies as dev dependencies

3 - setting up prettierrc
{
    "singleQuote": false,
    "bracketSpacing": true,
    "tabWidth": 2,
    "semi": true,
    "trailingComma": "es5"
}  , some prettier setup code things

  4 - setting up the db using mongodb

  5 - we have to setup dotenv but we have module import so we havbe to do steps
  dotenv.config({
    path: "./env"
})



6 - an experimental feature in package.json
"scripts": {
    "dev": "nodemon -r dotnev /config --experimental-json-modules src/index.js"
  },
