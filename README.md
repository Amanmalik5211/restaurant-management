# **Restaurant Management Application**

## **Project Overview**
This project is a restaurant management application built using React.js for the frontend. It includes features for user authentication, managing a menu, cart functionality, and order placement. The app is styled with TailwindCSS and ensures responsiveness for a seamless experience on desktop and mobile devices.

---

## **Features**

### **Core Features**
1. **Login Page**  
   - A form to accept username and password.  
   - Stores the JWT token locally upon successful login.

2. **Menu Page**  
   - Displays all menu items in a grid layout.  
   - Options to create, update, and delete menu items.

3. **Cart Component**  
   - Allows users to add menu items to the cart with quantities.

4. **Order Page**  
   - Displays cart items with the total price.  
   - Allows users to place an order and view their order history.

### **State Management**
- React Context and Redux is used to manage the application state, including user session, menu items, and cart details.

### **API Integration**
- Axios is used to interact with the backend for CRUD operations.

### **Styling**
- TailwindCSS is used for styling.  
- Fully responsive design for both desktop and mobile views.

---

## **Features**
- **Search/Filter**: Search menu items or filter tasks by specific criteria.  
- **Pagination/Infinite Scroll**: Handles large task or menu lists efficiently.  
- **Authentication**: JWT-based user authentication for secure access.  
- **Sorting**: Sort tasks/menu items by title, creation date, or status.

---

## **Installation and Setup**

### **Prerequisites**
- Node.js (v14 or later)
- npm or yarn
- Backend API server (ensure the API is running for full functionality)

### **Steps to Run the Application**
1. Clone the repository:
   ```bash
   git clone https://github.com/Amanmalik5211/restaurant-management.git

   cd restaurant-management

   npm install

   npm start

   Open your browser and navigate to http://localhost:5173

