# Welcome to my Warehouse Managment Application

# First step
First of all clone the repository. 
Once cloning is ready please open a terminal and follow these steps. 
Navigate to the cloned project and then:

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

# Second step: Configure Strapi IMPORTANT!
Go to Settings -> Users & Permission Plugin -> Roles -> Authenticated

-> Select Package:
-> Enable all actions (create, find, update, delete, findOne)
-> Save

-> Select Warehouse
-> Enable all actions (create, find, update, delete, findOne)
-> Save

(This may cause server error if not configured properly)

# Third step
If Strapi Configuration is done then open up a new terminal and follow these steps:

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

# About the project
## Sign up & Login
If you are ready with the installations and with the Strapi configuration and both server runs, then you will see the login screen.
If you don't have an account yet, then you have to create one account, to log in to the application.

After logging in you will see the Archive page.

## Archive Page
On this page you will see all of the warehouses.
If you don't have any warehouse at the moment you can add easily by clicking on the plus button.
You can add new warehouses automatically with random filled data or by manually.
On the Archive Page you can sort the warehouses by some value, and filter by status.
If you click on the warehouse card you will see the Single Warehouse Page

## Single Page
On the Single Pages you have two options:
- see the warehouse data & edit warehouse data & you can run **automatized warehouse traffic simulation**
- see the packages what is inside the warehouse & edit or delete the packages & sort them / filter them / search inside them and also you can add more packages


