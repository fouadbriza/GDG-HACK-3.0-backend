
# Book Store API Express

## Overview

The **Book Store API** is a RESTful backend service developed using *Node.js* (Express.js framework) and *MongoDB* as the primary data store. It provides a scalable and modular backend architecture for managing books, authors, categories, and user-related functionalities, enabling seamless integration with any front-end or third-party system.

## Tech Stack

-`Node.js`:	JavaScript runtime for scalable server-side development.\
-`Express.js`:	Minimalist web framework for building RESTful APIs.\
-`MongoDB`:	NoSQL database for flexible document storage.\
-`Mongoose`:	ODM for MongoDB schema modeling and validation.\

## Core Features
### CRUD Operations for Books
Create, read, update, and delete book records with metadata such as title, author, category, price, and stock.

### Author and Category Management
Maintain structured data for book authors and categories for efficient querying and filtering.

### User Authentication (Optional)
JWT-based authentication for protected routes (e.g., admin-level book management).

### Search and Filter
Query books by author, title, category, or price range.

### Pagination and Sorting
Efficient listing of large datasets using query parameters.

## API Reference

### Books route `/books`

#### Get all Books

```http
  GET /books
```

#### Get book bu Id

```http
  GET /books/${id}
```

#### Add a new book

```http
  POST /books
```

#### Update a book

```http
  PUT /books/${id}
```

#### Delete a book

```http
  DELETE /books/${id}
```

### Authors route `/authors`

#### Get all authors

```http
  GET /authors
```

#### Get author by Id

```http
  GET /authors/${id}
```

#### Add a new author

```http
  POST /authors
```

#### Update an author

```http
  PUT /authors/${id}
```

#### Delete an author

```http
  DELETE /authors/${id}
```

### Authetication Route `/auth`

#### Register a new user

```http
  POST /auth/register
```

#### Login a user

```http
  POST /auth/login
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`\
`MONGO_URI`\
`JWT_SECRET`

## Run Locally

Clone the project

```bash
  git clone https://github.com/Lyes-Boudjabout/book-store-express-js
```

Go to the project directory

```bash
  cd book-store-express-js
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Support

For support, email nl_boudjabout@esi.dz.

