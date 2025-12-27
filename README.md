# ⚙️ GearGuard: Intelligent Maintenance Management System

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue) ![Prisma](https://img.shields.io/badge/Prisma-ORM-green) ![Status](https://img.shields.io/badge/Hackathon-Submission-orange)


---

## 📖 Project Overview

**GearGuard** is designed to solve the chaos of industrial maintenance. Instead of spreadsheets and manual phone calls, companies can use GearGuard to:

1.  **Track Assets:** Know exactly where every machine is and who is responsible for it.
2.  **Automate Workflows:** Automatically assign the right team (e.g., "Mechanics") when a specific machine breaks.
3.  **Visualize Work:** Drag-and-drop Kanban boards and interactive Calendars for technicians.

---

## 🚀 Key Features

### 1. 🏭 Centralized Equipment Database
* **Asset Tracking:** Detailed records including Serial Number, Location, Department, Purchase Date, and Warranty info.
* **Smart Status:** Real-time status indicators (Active vs. Scrapped).
* **Ownership:** Tracks which employee and department owns the asset.

### 2. ⚡ "Smart" Maintenance Logic (Automation)
* **Auto-Assign Teams:** When a user reports an issue with a machine (e.g., "CNC Machine"), the system *automatically* detects it belongs to the "Mechanical Team" and assigns the ticket to them. No manual entry required.
* **Scrap Logic:** If a repair request is dragged to the **"Scrap"** column in the Kanban board, the system automatically updates the Equipment's status to **"Scrapped"** in the database.

### 3. 📋 Request Management
* **Two Workflows:**
    * **Corrective:** For unplanned breakdowns (High Priority).
    * **Preventive:** For scheduled routine checkups.
* **Smart History Button:** A "Requests" button on every equipment card that filters the view to show *only* the history for that specific machine.

### 4. 📊 Visual Workspaces
* **Kanban Board:** Drag-and-drop interface for Technicians to move tickets from `New` → `In Progress` → `Repaired`.
* **Interactive Calendar:** Managers can schedule future maintenance, and technicians can see their monthly workload at a glance.

---

## 📸 Workflow Diagram

Here is how the "Smart Logic" works inside the system:

```mermaid
graph TD
    A[User Reports Issue] -->|Selects Equipment| B{System Checks DB}
    B -->|Finds Equipment Team| C[Auto-Assigns Ticket]
    C --> D[Kanban Board: New]
    D -->|Technician Drags| E[In Progress]
    E -->|Technician Drags| F{Final Status?}
    F -->|Repaired| G[Close Ticket & Log Hours]
    F -->|Scrap| H[Mark Equipment as SCRAPPED]

    ![Equpment](/public/Screenshot%202025-12-27%20154612.png)
    ![Kanban](/public/Screenshot%202025-12-27%20154636.png)

 🛠️ Tech Stack
        Framework: Next.js 14 (App Router, Server Actions)

        Database: PostgreSQL

        ORM: Prisma (Relational Data Modeling)

        Styling: Tailwind CSS

        UI Components: Lucide React (Icons), Hello Pangea DnD (Kanban), Date-Fns (Calendar)


Installation & Setup
Follow these steps to run GearGuard locally:

1. Clone the Repository
Bash

git clone [https://github.com/yourusername/gearguard.git](https://github.com/yourusername/gearguard.git)
cd gearguard
2. Install Dependencies
Bash

npm install
3. Configure Database
Create a .env file in the root directory and add your PostgreSQL connection string:

Code snippet

DATABASE_URL="postgresql://user:password@localhost:5432/maintenance_db"
4. Sync Database Schema
Push the Prisma schema to your local database:

Bash

npx prisma db push
npx prisma generate
5. Run the App
Bash

npm run dev
Open http://localhost:3000 in your browser.