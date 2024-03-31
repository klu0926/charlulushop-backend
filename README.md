# Charlulu Shop Backend

Charlulu Shop Backend is the backend server for the Charlulu Shop React site. It provides the necessary functionality and endpoints to support features of the Charlulu Shop react website.

![items Page](https://charlulu-shop-546c2a4689b9.herokuapp.com/readme/readme-items.png)
![orders Page](https://charlulu-shop-546c2a4689b9.herokuapp.com/readme/readme-orders.png)

## Table of Contents 📖

1. [Features](#1-features-%EF%B8%8F)
2. [Technologies](#2-technologies-)
3. [Getting Started](#3-getting-started-)
4. [Contact Me](#4-contact-me-)


## 1. Features ⭐️

- **Authentication:** Secure login/logout.
- **Authorization:** Access control for endpoints.
- **Data Storage:** Store product/user info, orders.
- **CRUD Items:** Manage items with attributes like image, name, description, price, and stock.
- **CRUD Tags:** Associate tags with each item.
- **CRUD Orders:** Manage buyer orders, including creation, viewing, updating, and deletion.
- **YouTube Integration:** Display the newest YouTube video from the seller's channel. Provides hourly updates and sends video data to the React site.
- **Email Notifications:** Nodemailer for order alerts, see [example](https://charlulu-shop-546c2a4689b9.herokuapp.com/readme/readme-email.png) <-


## 2. Technologies 🤓

- **Backend Framework:** Express.js
- **Frontend:** HTML, CSS, JavaScript, Handlebars.js for template
- **Database ORM:** Sequelize (with MySQL database)
- **Environment Variables:** dotenv
- **Image Handling:** Sharp for optimized resizing, Multer for media uploads.
- **YouTube Integration:** Google API for fetching latest shop video.
- **Email Service:** Nodemailer for order alerts.
- **Cross-Origin Resource Sharing (CORS):** Core for frontend-backend integration.


## 3. Getting Started 🚀

### Prerequisites

- Node.js installed on your machine
- MySQL database server

### Installation

1. Clone the repository:
```
git clone https://github.com/klu0926/charlulushop-backend.git
```

2. Navigate to the project directory:
```
cd charluluShop-backend
```

3. Install npm modules
```
npm install
```
4. Create a `.env` file in the root directory based on the provided `.env.example` file. Fill in the required values, such as database credentials and any API keys.
```
USERNAME = 
PASSWORD = 
SECRET = 
SERVER_GMAIL = 
SERVER_GMAIL_APP_PASSWORD = 
SELLER_GMAIL = 
DEVELOPER_GMAIL = 
YOUTUBE_CHANNEL_ID = 
YOUTUBE_API_KEY = 
```

### Setting Up Database
1. Create a MySQL database 'charlulu_shop' for the project.
2. Migrate the database schema using Sequelize.
```
npx sequelize db:migrate:all
```
3. Seed the database with initial data.
```
npx sequelize db:seed:all
```

### Start the Server
```
npm run dev
```

## 4. Contact Me 👋
If you have any questions, feedback, or suggestions, feel free to reach out:

- **Email:** [lukuoyu@gmail.com](mailto:your.email@example.com)
- **GitHub:** [klu0926](https://github.com/klu0926)