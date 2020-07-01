# Yo-yo!
It's the sequel to Yo! It's Yo-yo!

An app for posting anonymous and temporary "Yo!" pins on a Leaflet map. Made using Handlebars and an Express server backed by a MySQL database with a Sequelize ORM and deployed on Heroku: [url-goes-here](#)

The app uses the Geolocation API to locate a user. When the location has been found a user will see any "Yo!" pins submitted by other users within the previous 15 minutes inside the bounds of their map view. The user will also have the ability to submit their own "Yo!" pin, and their pin will be available to other users for 15 minutes.
