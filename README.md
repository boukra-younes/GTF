# GTF - User Management System

A full-stack web application for managing users with a modern React frontend and PHP backend.

## Features

- User authentication and authorization
- User management (create, read, update, delete)
- Real-time notifications system
- Responsive and modern UI
- Secure session management
- Role-based access control

## Tech Stack

### Frontend

- React.js
- CSS3
- Axios (for API calls)

### Backend

- PHP
- MySQL
- Apache Server

## Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache Server
- Node.js 14.x or higher
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/GTF.git
cd GTF
```

2. Set up the database:

   - Import the `gtf.sql` file into your MySQL database
   - Update the database credentials in `backend/config.php`

3. Configure the backend:

   - Make sure your Apache server is running
   - Place the project in your web server's root directory (e.g., htdocs for XAMPP)

4. Set up the frontend:

```bash
cd frontend
npm install
npm run dev
```

5. Configure environment variables:
   - Create a `.env` file in the frontend directory with:
   ```
   VITE_API_URL=http://localhost/GTF/backend
   ```

## Project Structure

```
GTF/
├── backend/
│   ├── config.php
│   ├── notifications/
│   ├── usersmanagement/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── ...
│   ├── public/
│   └── package.json
└── gtf.sql
```

## API Endpoints

### Authentication

- `POST /backend/auth/login.php` - User login
- `POST /backend/auth/register.php` - User registration
- `POST /backend/auth/logout.php` - User logout

### User Management

- `GET /backend/usersmanagement/getusers.php` - Get all users
- `POST /backend/usersmanagement/modifyuser.php` - Update user
- `POST /backend/usersmanagement/deleteuser.php` - Delete user

### Notifications

- `GET /backend/notifications/get_notifications.php` - Get user notifications
- `POST /backend/notifications/mark_as_read.php` - Mark notification as read
- `POST /backend/notifications/delete_notification.php` - Delete notification

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped with this project
- Special thanks to the open-source community for their tools and libraries

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/GTF](https://github.com/yourusername/GTF)
