### To Do list

## Connections:
[x] - connection between nodeJS server and mongoDB
[x] - connection between nodeJS server and esp8266
[ ] - connection between nodeJS server and phone Application(client-side)

## Server:
[x] - Read the correct value from the client-side on localhost
[x] - change requested status in DB
[ ] - Read the correct value from the esp8266 device
[ ] - Write the correct value to the esp8266 device
[ ] - Deploy the nodeJS application to Heroku
[ ] - Figure out how to safely host the service in the internet (needed in order to connect the server with nodeJS and the phone application)

## ESP8266:
[x] - Change the state of the LED on button input
[x] - Change the state of the LED on Serial input
[x] - Chenge the state of the LED on HTTP request
[x] - Connect the device to the WiFi
[x] - Connect the device to the Server

## PHONE APPLICATION:
[ ] - Prepare the functions correlating to: turnOn, turnOff, and getState
[ ] - Create GUI
[ ] - Figure out how to securly connect from the phone application to the server (is a VPN an option?)

# Notes:
https://blog.hubspot.com/website/best-free-ssl-certificate-sources
- Domain Validated Certificates? -> DV Certificates
does heroku provide this in their service?
"Heroku SSL is a free feature that allows for the managing of SSL/TLS encryption for custom domains and relies on the Server Name Indication (SNI). 
Please note that Heroku SSL is currently available under Heroku paid plans only."