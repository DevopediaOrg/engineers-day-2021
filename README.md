# Overview

This project implements an event page that includes a registration form. This project is based on Firebase backend and vanilla JavaScript frontend. This codebase can be a useful starting point for beginners who wish to get started with Firebase.

This repo has two branches:
* **master**: server-side rendering with Firebase Cloud Functions
* **dynamic-client**: client-side rendering

For an high-level introduction to Firebase, visit [Devopedia's Firebase article](https://devopedia.org/firebase).


# Firebase Project Creation

A project can be created via command line or via the web interface. We first show the steps for latter:
* Login to your Google account (Gmail login)
* Visit [Firebase console page](https://console.firebase.google.com/)
* Add project
* Register a new web app for this project

On your computer, execute the following from a node.js terminal (requires node.js and npm):
* `npm install -g firebase-tools`
* `firebase login` : use your Gmail login
* `firebase init` : select the already created project or create a new one
* `firebase deploy` : deploys your app to URL _{app-name}.web.app_


# Emulators

It's a good idea to test your app locally before deploying to Firebase. Firebase provides emulators for this purpose. Emulators can be started with the command `firebase emulators:start`. Access the local app on the port used by the emulator. Firebase dashboard can also be accessed via the web browser, although on a different port.


# Config Files

Two files are essential:
* `firebase.json` : specify port numbers and public folder for hosting
* `database.rules.json` : rules to access the database


# Cloud Functions

To serve dynamic content, we'll make use of Firebase Cloud Functions. This can be initialized in the existing project via the command `firebase init functions`. We'll use JavaScript as the language. Cloud Functions are accessed on a different port. Note that use of Cloud Functions is not possible under the free tier. However, you can still develop and test your app on local emulator.

Via rewrite rules in `firebase.json`, we can redirect specific URL request to specific functions. Changes to rewrite rules require restart of emulators.

All scheduled talks are now listed in `talks.json`. Import this into the database. Note that this import has to be done every time emulators are restarted.
