# Charlulu Shop Backend

Charlulu Shop Backend is the backend service for the Charlulu Shop React site. It provides the necessary functionality and endpoints to support the e-commerce features of the Charlulu Shop website.


![Home Page](https://charlulu-shop-546c2a4689b9.herokuapp.com/readme/readme-items.png)

## Table of Contents

1. [Features](#⭐️-features)
2. [Technologies](#🤓-technologies)
3. [Getting Started](#🚀-getting-started)
4. [Contact Me](#👋-Contact-Me)


## ⭐️ Features

- **Authentication:** Secure login/logout.
- **Authorization:** Access control for endpoints.
- **API Endpoints:** Allow front-end website to use.
- **Data Storage:** Store product/user info, orders.
- **CRUD Items:** Manage items with attributes like image, name, description, price, and stock.
- **CRUD Tags:** Associate tags with each item.
- **CRUD Orders:** Manage buyer orders, including creation, viewing, updating, and deletion.
- **YouTube Integration:** Display the newest YouTube video from the seller's channel. Provides hourly updates and sends video data to the React site.
- **Email Notifications:** Nodemailer for order alerts.
- **Responsive Web Design (RWD):** Optimized for mobile and desktop viewing.


## 🤓 Technologies

- **Backend Framework:** Express.js
- **Frontend:** HTML, CSS, JavaScript, Handlebars.js for template
- **Database ORM:** Sequelize (with MySQL database)
- **Environment Variables:** dotenv
- **Image Handling:** Sharp for optimized resizing, Multer for media uploads.
- **YouTube Integration:** Google API for fetching latest shop video.
- **Email Service:** Nodemailer for order alerts.
- **Cross-Origin Resource Sharing (CORS):** Core for frontend-backend integration.


## 🚀 Getting Started

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

## 👋 Contact Me
If you have any questions, feedback, or suggestions, feel free to reach out:

- **Email:** [lukuoyu@gmail.com](mailto:your.email@example.com)
- **GitHub:** [klu0926](https://github.com/klu0926)









