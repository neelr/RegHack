# RegHack (outdated creating new one...)
A registration web app for hackathons or other events

## What is it?

This is a registration node app that uses mongodb as a database for storing and presenting people. There is a mass email mechanism (through a POST request or soon to come /email) which can include a qr code to check in and out people. This alo has a form to store and keep people. 

## Soon to come

- /statistics GUI stats page
- /email GUI email page
- / a root page

# Documentation
### POST requests

#### /addperson

This is to add a person, and it accepts a json like
```json
{
  "name":"John Doe",
  "age":42,
  "email":"crackerjack@yopmail.com",
  "key":"your chosen API key"
 }
 ```
 #### /toggleID

This is to switch their check in value, and the value is
```json
{
  "id":"Mongo ID Integer",
  "where":"in/out can be configured for more",
  "key":"your chosen API key"
 }
 ```
 #### /sendmail

This is to send a mail to the group. `()b64code()` will be replaced with the base 64 url of their qr code and `()name()` will be replaced with their name.
```json
{
  "subject":"Subject of the email",
  "html":"<h1>your html code for the email</h1>",
  "key":"your chosen API key"
 }
 ```
 
 ### GUI/GET
 
 #### /form
 
 Has a basic form on what to put. You can add more/less, but then you need to configure the backend.
 
 #### /people/:apikey
 
 A list of the people that are signed up, and whether or not they are checked in.

#### /stats/:apikey
 
A list of the statistics about the people in your database.
 #### /email
 
A GUI to send a mail through the /sendmail post
 
 #### /reader
 
 An online QR code reader that if your scan the qr code you sent them, will change their checked status to in or out.
 
 <hr>
 
 ##### For contributions make a pull request!
