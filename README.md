# Dummy-backend

A minimal REST API compliant server so you can prototype your front end.

The server will create tables and record as you're using it. You can
then create, update, delete, get, list and query them using standard
CRUD requests.

## Install

Clone this repository

```sh
git clone git@github.com:debrice/dummy-backend.git
```

Install the dependencies using `yarn`

```sh
cd dummy-backend
yarn
```

Run the server using `yarn start`

```sh
yarn start
```

## Interactions

By default the server will run on port 8080 on your localhost. The convention is having the table name as the first part of the URL followed by optional ID. For example, if you want to interact with
your users table, use the following URLs:

| Method | URL        | description                             |
| ------ | ---------- | --------------------------------------- |
| GET    | /users/    | return a list of users                  |
| GET    | /users/123 | return the user with ID 123             |
| PUT    | /users/123 | updates the user with ID 123            |
| DELETE | /users/123 | delete the user with ID 123             |
| POST   | /users     | create a user (generate the ID for you) |

## Persistence

By default the database is stored in memory and is backed up to every
one seconds in a file named `database.json`. The database is loaded back in memory when the server starts.
