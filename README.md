# About project

Note 1: I have separated the two Dockerfiles for both front and back end and hence two different docker images. This is for scalability in that front end and back end guys can function separately and do separate builds. But both images will be on the same instance.

It can be combined in one Dockerfile(or using docer compose), but for convenience, I have separated it.

Note 2: Assuming maven, java 8 and node.js is installed. If not, please visit https://maven.apache.org/download.cgi and http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html and https://nodejs.org/en/download/ and download the appropriate one for your OS.

Note 3: This setup is for windows 10 as Docker works a little differently for Windows and Mac. Apart from that, it should work on both Windows and Mac. It is explained further later.

Note 4: Assuming Docker is installed from this link ->https://docs.docker.com/toolbox/toolbox_install_windows/ as other methods don't work in Windows 10 home version. If Docker is installed any other way, then the file proxy.conf.json needs to change accordingly.(explained later)

If you want to just know the steps to run, skip to "Steps to run" Section

## Backend
- This is a simple light weight Spring Boot application in a Micro services ecosystem powered by Docker. 
- Please note that I have taken the liberty to implement the in-memory H2 database offered by Spring rather than storing in memory.
- I have also integrated Swagger just to showcase functionality. The documentation may not be that comprehensive. It can be accessed from 192.168.99.100:8085/swagger-ui.html or localhost:8085/swagger-ui.html depending on how you deploy it.(explained later). Just make sure that you login from the UI first  using credentials below, before you can access the APIs, otherwise you will get access denied.
- As per requirements, only admin user can read, write, update and delete users. Normal users will be able to see all the options on the front end, but when they hit the API, it will give error. This is just to showcase API functionality.
- Also implemented JWT token authentication configuring the rest authentication entry points & token authentication filter.

## Front end
- Completely developed using Angular 5(latest), HTML5, typescript and node.js
- Read, write, update and delete functionalities will be visible for both normal user and admin. However, when we hit the API, we will get the corresponding responses based on the user that has logged in. 
    Normal user : will get access denied when he tries to update user or add new user. He can only view his details.
    Admin user : can do everything.
- In the interest of time, I did not include delete functionality. However it is quite straightforward. It is present in the API though.


# Steps to run
I will give instructions to run the projects in two methods.
- Using Docker Image(assumption is Docker is installed and running, OS is Windows 10). For Windows, please install Docker by following this link.
https://docs.docker.com/toolbox/toolbox_install_windows/
- Using IDE(Intellij)

## Using Docker Image
### Back End Deployment
0. In case you are using windows, start up docker by clicking on "Docker Quickstart terminal". This should bring up the 'default' VM in virtualbox.
In case you are using linux or mac, the installation should be straight forward. So I am proceeding assuming docker has been started up.

1. Checkout the project from GitHub. Open command prompt and navigate to the root of the project UserProfile. Run mvn clean install.
2. Build the docker image using the following command
```
Rootfolder> docker build -f Dockerfile -t docker-backend .
```
In case you face any issues like "the docker daemon may not be running" run the following command
```
Rootfolder> @for /f "tokens=*" %i IN ('docker-machine env') DO @%i
```
It will take a while to import the required dependencies for the first time. Should be fast from second time as it will pick up from cache

3. Run the docker image
```
Rootfolder> docker run -p 8085:8085 docker-backend
```
4. This should bring up the Spring boot embedded tomcat instance and it should run in the port 8085. Go to the browser and access http://192.168.99.100:8085/. You should see an Access Denied page, which is fine, as it proves that Spring is up and running in Docker.

### Front End Deployment

This is very similar to the backend.

1. Open another command prompt and navigate to the root of the project UserProfile. Then issue the following command
```
> cd frontend
```
2. Build the docker image using the following command
```
> docker build -f Dockerfile -t docker-frontend .
```

It will take a while to import the required dependencies for the first time. Should be fast from second time as it will pick up from cache.

In case you face any issues like "the docker daemon may not be running" run the following command
```
Rootfolder> @for /f "tokens=*" %i IN ('docker-machine env') DO @%i
```
3. Run the docker image
```
> docker run -p 4200:4200 docker-frontend
```
4. This should bring up the npm instance and it should run in the port 4200. Access 192.168.99.100:4200/login. Try to login with the credentials below.

## Using IDE(Intellij)
1. Check out the code from github and import the project into Intellij. Run mvn clean install, or go to the right to Maven option and run the lifeycle of clean, install.
2. Next, run/debug the application. This should boot up the spring boot application in port 8085.
3. Open the proxy.conf.json, and replace the 192.168.99.100 to localhost.
4. Go to Terminal, and run the following commands
```
> cd frontend
> npm install
> npm start
```
5. This should bring up the npm server in port 4200. Note that npm install might take a while for the first time. Once it is run, subsequenty, just run npm start.
6. Access localhost:4200/login from the UI.
7. Try to login with the credentials below.

## Credentials

Admin
======
Username: admin
pass: 123

Normal User
===========
Username: normaluser
pass: 123


# Difficulties faced and Miscellaneous steps

1. Had to do quite a lot of workarounds to make sure Docker works fine in windows. Had to add an inbound firewall rule as well. Refer to this video, proved very handy:
https://www.youtube.com/watch?v=ymlWt1MqURY

2. There is a file in the frontend project called proxy.conf.json. Currently the ip is configured as 192.168.99.100. If you want the projects to work on localhost, make sure it is changed to localhost. Ideally, there should be a devmode and production mode.

3. Enabling swagger-ui.html was a bit of challenge. Had to code a few configurations in the DemoApplication.java.


