# Billing System



## 📋 Description

A simple billing system for a store, built with **FastAPI** (backend) and **ReactJS** (frontend). It allows store staff to manage products and generate customer bills efficiently.


## 🚀 Features

### Product Management
- **Product CRUD**: Store staff can create, read, update, and delete product records.

### Bill Management
- **Bill Creation**: Create new bill and email it to customer email id.
- **View Bill**: Store staff can view all bills, filter them by customer email, and see detailed product information for each bill.

## 🛠️ Technologies Used

- **Frontend:**
  - React.js
  - Axios (for API requests)
  - React Router DOM (for routing)
  - Material UI (for UI components)

- **Backend:**
  - FastAPI
  - PostgreSQL



## 🔧 Setup Instructions

### Prerequisites
- **Python**
- **Node.js**
- **pip** (Python package installer)
- **venv** (for creating a virtual environment)
- **PostgreSQL** (For the database)
- **SMTP Access** (Gmail SMTP with App Password)


### Installation Steps

**Clone the Repository:**

```bash
    git clone https://github.com/arjunvjn/Billing-System.git
```

 #### Backend Setup

```bash
    cd Billing-System
    cd backend
```
 **Create and Activate a Virtual Environment:**

```bash

    # Create virtual environment
    python -m venv myenv

    # Activate virtual environment
    # On macOS/Linux:
    source myenv/bin/activate

    # On Windows (Command Prompt):
    myenv\Scripts\activate

    # On Windows (PowerShell):
    myenv\Scripts\Activate.ps1
```

 **Install the Required Packages:**

```bash
    pip install -r requirements.txt
```

 **Setup the .env File:**

Create a .env file in the root of your project (next to main.py).

```bash
    # SMTP Email settings
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USERNAME=your_email@gmail.com
    EMAIL_PASSWORD=your_password

    # PostgreSQL settings
    # Format: postgresql://<username>:<password>@<host>:<port>/<database_name>
    DATABASE_URL=postgresql://username:password@localhost:5432/db_name


    # Allowed Origins settings
    ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```


 **Run the FastAPI Server:**

```bash
    uvicorn main:app --reload
```
 #### Frontend Setup

 Open a new terminal and 
```bash
    cd Billing-System
    cd frontend
 ```
**Setup the .env File:**

Create a .env file in the root of your project (next to package.json).

```bash
    REACT_APP_BACKEND_URL=http://localhost:8000
```

**Install the Required Packages:**
```bash
    npm install
```
**Run the React Server:**

```bash
    npm start
```

