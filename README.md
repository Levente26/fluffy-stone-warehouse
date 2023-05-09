# Welcome to my Warehouse Managment Application

# First step
First of all clone the repository
Once cloning is ready please open a terminal and follow these steps:

## Installation (Backend)
```bash
cd backend

# yarn
yarn install

# npm
npm install
```

## Development Server (Backend)

Start the development server on `http://localhost:1337`

```bash
#yarn
yarn develop
#npm
npm run develop
```

# Second step: Set up Strapi IMPORTANT!
Go to Settings -> Users & Permission Plugin -> Roles -> Authenticated

-> Select Package:
-> Enable all of the operations
-> Save

-> Select Warehouse
-> Enable all of the operations
-> Save

(This may cause server error if not configured properly)

# Third step
Once the Strapi setup is done then open up a new terminal and follow these steps:

## Installation (Frontend)
```bash
cd frontend

# yarn
yarn install

# npm
npm install
```

## Development Server (Frontend)

Start the development server on `http://localhost:3000`

```bash
#yarn
yarn dev
#npm
npm run dev
```