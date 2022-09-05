# Board Games API

Welcome to Michael's Board Games API! This readme file will be maintained and updated throughout the project. 

## Developer files

In order to connect locally to either of the two databases contained within this project, user will need to create .env.test and .env.development files for their project. Once these have been created, a user should add "PGDATABASE=<database_name_here>" to each of these files. The correct database name for each can be found within /db/setup.sql. The user should check that these .env files are .gitignored. This can be done by adding ".env.*" to the .gitignore file.