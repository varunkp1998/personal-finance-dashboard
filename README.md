#  Personal Finance Dashboard  

A **full-stack** personal finance dashboard built with **Next.js**, **Supabase**, and **MUI**, designed to track transactions, and net worth.  

---

## Tech Stack  

- **Frontend**: Next.js (React), TypeScript, Tailwind CSS, MUI  
- **Backend**: Supabase (PostgreSQL), API Integrations  
- **Authentication**: Supabase Auth (JWT-based)  
- **Storage**: LocalStorage (Dark Mode), Supabase Database  
- **Security**: SQL Injection & XSS Protection, CSRF Protection  

---

##  Features Implemented  

###  **Core Features**  
- **User Authentication** (Sign Up, Login, Logout)  
- **Transaction Management** (Add, Delete, Import via CSV)  
- **Pagination** (10 transactions per page)  
- **Net Worth Calculation** (Income vs. Expenses)  

###  **UI/UX Enhancements**  
- **Dark Mode Toggle** (Stored in `localStorage`)  
- **Responsive Design** (Mobile & Desktop Support)  
- **Animations & Theming** (Better UX)  

###  **Security Features**  
- **JWT-Based Authorization**  
- **CSRF & XSS Protection**  
- **SQL Injection Prevention**  

---

## Setup Instructions  

### 1️⃣ **Clone the Repository**  
```sh
git clone https://github.com/your-username/personal-finance-dashboard.git
cd personal-finance-dashboard
```

### 2️⃣ **Install Dependencies**  
```sh
npm install
# OR
yarn install
```

### 3️⃣ **Set Up Supabase**  
- Create a [Supabase](https://supabase.com) project  
- Get your **API Keys** & **Database URL**  
- Add them to `.env.local`  

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4️⃣ **Run the App Locally**  
```sh
npm run dev
# OR
yarn dev
```
App runs at **`http://localhost:3000`** 

---

##  How to Use  

###  **1. Login or Sign Up**  
- Users must authenticate before accessing the dashboard  

###  **2. Add Transactions**  
- Fill in **Description, Amount, Type (Income/Expense), Category**  
- Click **"Add"** to save the transaction  

###  **3. Import CSV Transactions**  
- Upload a `.csv` file with transactions  
- The app parses and stores the records automatically  

###  **4. Navigate Transactions (Pagination)**  
- **Only 10 transactions per page**  
- **"Next" & "Previous"** buttons to browse  

### 🌑 **5. Toggle Dark Mode**  
- Click the **🌙/☀️ button** in the navbar  
- Saves preference in `localStorage`  

---

##  Deployment  
### **Vercel**  
To deploy on **Vercel**, run:  
```sh
vercel
```
Or push to GitHub & connect the repo to **Vercel** for auto-deploys.  

### **Render (For Supabase Functions, Optional)**  
Use [Render](https://render.com) if deploying backend functions separately.  

 **Start tracking your finances today!**  
![IMG_6708](https://github.com/user-attachments/assets/faef41ca-8de6-4032-ab7c-620c721eaae8)
