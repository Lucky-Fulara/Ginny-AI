📁 ginny-ai-auth/
│── 📁 backend/               # Backend (Node.js, Express, Nodemailer)
│   ├── 📁 config/            # Configurations (e.g., database)
│   │   ├── db.js             # Database connection setup (if needed)
│   ├── 📁 routes/            # API routes
│   │   ├── authRoutes.js     # Authentication routes (send OTP, verify OTP)
│   ├── 📁 controllers/       # Logic for handling requests
│   │   ├── authController.js # OTP generation & verification logic
│   ├── 📁 models/            # Database models (optional)
│   │   ├── User.js           # User schema/model (MongoDB, MySQL, etc.)
│   ├── 📁 utils/             # Utility functions
│   │   ├── mailer.js         # Nodemailer configuration
│   ├── .env                  # Environment variables (Email, DB credentials)
│   ├── server.js             # Main backend file
│   ├── package.json          # Dependencies & scripts
│
│── 📁 frontend/              # Frontend (HTML, CSS, JS, Bootstrap)
│   ├── 📁 css/               # Styles
│   │   ├── style.css         # Main CSS file
│   ├── 📁 js/                # Scripts
│   │   ├── script.js         # Main JavaScript file
│   ├── 📁 assets/            # Images, icons, etc.
│   ├── index.html            # Register & Login UI
│   ├── dashboard.html        # Home page after login
│
└── README.md                 # Project documentation
