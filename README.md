# RegHack
Automated registration for your events!

## What is it?

This is a registration node app that uses mongodb as a database for storing and presenting people. There is a mass email mechanism (through a POST request or soon to come /email) which can include a qr code to check in and out people. This alo has a form to store and keep people. 

### For IN DEPTH DOCUMENTATION GO TO https://reghack.js.org

## Getting started

### Download/Config

1. First clone the repository with
```bash
git clone https://github.com/Hacker719/RegHack
```
2. Next is configuring the config.js. This is important because the entire program will make and store data based on this. So to do this you need to go to the config.js file. Then you will face the defualt options. You need to include all parts of data you want to record (ex. School, Age, Height etc.) You need to input those, and an example input (to determine between string and integer). There are some special configurations:

    1. First is `checked`. This will allow you to, see if they are checked in or out and use the QR reader function. To activate set it to `false`.
    2. Second is `email`. This will allow you to, mass email the people an html email. To activate set it to a string
 
 an example is:
 ```javascript
 module.exports = {
    "Name":"John Doe",
    "School":"Berkely College",
    "Grade":12,
    "age":42,
    "email":"joe@gmail.com",
    "checked":false
}
```
3. The last thing to do is configure the .env file. A model can be found in the model.env. The basics are

    - MONGO_URL=Your actual mongoDB url with a collection
    - EMAIL_USER=Your gmail email.(you need to configure with other smtp servers inside index.js
    - EMAIL_PASS=Your email password
    - API_KEY=This is any string of numbers and letters that are a basic password for your registration system.
4. Done! All you need to do now is run
```bash
npm install
node index.js
```
and it will run it on localhost:3000

## [Documentation](https://reghack.js.org)

### POST REQUESTS

 #### /toggleID

This can only be used if checked is enabled. This is to switch their check in value, and the value is
```json
{
  "id":"Mongo ID",
  "where":"in/out can be configured for more",
  "key":"your chosen API key"
 }
 ```
 #### /sendmail

 This can only be used with email enabled. This is to send a mail to the group. `()b64code(`) will be replaced with a base 64 url of a QR code that you can scan with the /reader GUI. You can also use `()anyconfigvalue()` for that to be displayed. An example includes:
```json
{
  "subject":"Subject of the email",
  "html":"<h1>your html code for the email</h1>",
  "key":"your chosen API key"
 }
 ```
 
 #### /clear
 This checked for the key, then clears the entire MongoDB collection, deleteing all data. THIS IS PERMANENT AND DANGEROUS. And example is:
 ```json
{
   "key":"your chosen API key"
}
```
 
 ### GUI/GET
 
 #### /form
 
This will give a GUI where you can use the POST `/addperson` function in a form.
 
 #### /people/:apikey
 
 A list of the people that are signed up, and whether or not they are checked in.

 #### /email
 
A GUI to send a mail through the `/sendmail` post. Needs `email` enabled.
 
 #### /reader
 
 An online QR code reader that if your scan the qr code you sent them, will change their checked status to in or out. Needs `checked` enabled
 
 ## Contributions

Please submit any issues and I would be happy to fix them! Submit a pull request to include your changes.

## License

This is under an AGPL-V3
 
