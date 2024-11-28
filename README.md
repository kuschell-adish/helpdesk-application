# Helpdesk Application System

An application that aims to file and update tickets in regards to common problems encountered in the company, such as logging in time for work, requested documents, and hardware troubleshooting. 

## Getting Started

### Dependencies

* To run the application locally, the device must have installed Node.js for running React frameworks and PHP for running the back-end functions. 

### Executing program

* Initialize Git into your source code editor like Visual Studio Code. 
```
git init
```
* Add the remote repository URL
```
git remote add origin https://github.com/kuschell-adish/helpdesk-application
```

### Front-End

* To see the frontend syntaxes, switch to a different branch. 
```
checkout feature/creating_initial_pages
```
* Run npm install to install the node dependencies.
```
npm install
```
* Save this source code locally to your device and have it named (ex. helpdesk-frontend).

* Run the front-end of application. 
```
npm run start
```

### Back-End

* To see the backend functions, switch to a different branch. 
```
checkout feature/creating_initial_functions
```
* Run composer install to install the dependencies. 
```
composer install
```
* Save this source code locally to your device and have it named (ex. helpdesk-backend).

* Run the back-end of application. 
```
php artisan serve
```

## Help

* If you have encountered **error in running** `npm run start`, node dependencies must be installed first. 
```
npm install
```
* If you have encountered **error in running** `php artisan serve`, composer must be installed first. 
```
composer install
```
* If you have encountered **500 server error**, .env file must be created, a .env example has been provided in this source code. 
