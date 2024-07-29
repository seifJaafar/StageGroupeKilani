## Create Database
-search Mongoose atlas and create an account and a cluster database
## Install the packages
- just cd to each folder and enter the command `npm i`
## .env files
- In each folder(admin,back,client) you need to create ".env" file (just .env) 
# for admin folder : 
   - PORT = enter the port number 
   - REACT_APP_API_HOST= enter the api url 
# for back folder : 
  - PORT = 3001 (`the port Number`)
    - JWT_SECRET ="$2b$10$yIS3fHwlyOYqD3JC7r/hTeSbppsODG.FvB/14vr6eZisFB0wUOlr6" (the jwt token better be hashed `you can just use this ecample`)
    - JWT_EXPIRATION=1440 (`the expiration time for the access token`)
    - MONGO_URL= "mongodb+srv://s3if2003:<password>@teststage.d1t42mm.mongodb.net/?retryWrites=true&w=majority&appName=testStage" (`the database url provided to you by mongo atlas just verify the username and password`).

    ` You Need To Configure Your Smtp Before The Next Part `

   -  EMAIL_NODEMAILER= (`the email from where the emails are sent`)
    - PASSWORD_EMAIL=(`the password for the smtp service (like from gmail smtp)`)
    - EMAIL_HOST=smtp.gmail.com (`smtp host`)
    - EMAIL_PORT=465(`smtp port`)
    - EMAIL_SECURE=true(`smtp secure`)

    - ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3009 (`the urls allowed to access your api (your admin and client app url)`)
    - SIGNIN_URL=http://localhost:3000/sign-in (`the url of the client app signIn page for the links in emails`)

    - ADMIN_EMAIL=(`the email of the first admin account`)
    - ADMIN_PASSWORD=(`the password for the first admin account better be hashed`)
    - ADMIN_USERNAME = firstAdmin (`the username for the first admin account`).

# for client folder : 

    - REACT_APP_API_HOST=http://localhost:3001 (`the api url same in the client .env file`)
### Create first admin profile : 
 - The admin is the one who adds accounts so you need to create first admin account for the first deploy and then connect to this account and add other accounts so just :
    - `cd to the back folder`
    - `node AddFirst.js` this will create the first admin account with email,username and password that you put in the .env file of the back folder
#### Start your web app : 
 # for Client and Admin apps : ( cd to the folder and type `npm run start`)
 # for The Back api : (cd to the back folder and type `npm run start` for production or `npm run dev` for dev mode)

enjoy ! 