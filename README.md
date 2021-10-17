## A collaborative todo list application

### Project Requirements
[Requirements](./misc/backend_capstone.pdf)

### ERD Diagram
[Diagram](./misc/ERD.png)


### Project Initialisation and local usage

* npm install
* npm run db:migrate

for development
* npm run dev
* docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management  
* npm run consume

for production
* npm run start
* docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management  
* npm run consume

### Deployment on Heroku

* Deployed using heroku interface
* heroku addons:create heroku-postgresql:hobby-dev
* heroku addons:create cloudamqp:lemur
* see [procfile](procfile)
* Herokuapp : https://backend-capstone-px.herokuapp.com/
* swagger docs : https://backend-capstone-px.herokuapp.com/api-docs/



