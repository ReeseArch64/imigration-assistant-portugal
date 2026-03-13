# Immigration Assistant Portugal

A web platform to track and manage your immigration expenses for Portugal. Monitor spending across categories, record partial payments, and keep a clear view of outstanding amounts.

## Features

- **Spending Dashboard** – Cards showing Total Expenses, Amount Paid, Amount Due, and Payment Progress.
- **Category Filters** – Filter items by category: Clothing, Accessories, Documentation, Travel.
- **Status Filters** – Filter by status: Pending, Purchased, Paying, Paid, Cancelled.
- **Expense Table** – View all items with Image, Name, Quantity, Unit Price, Total Value, Amount Paid, Remaining Value, Category, and Status.
- **Pay Action** – Register full or partial (installment) payments for any item.
- **Edit Action** – Update any item's details.
- **Cancel Action** – Mark items as cancelled instead of deleting them.
- **View Details** – See a full breakdown of any item with a payment progress bar.
- **404 Page** – Custom not-found page.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) components
- [Prisma 5](https://www.prisma.io/) ORM
- [MongoDB](https://www.mongodb.com/) database

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ReeseArch64/imigration-assistant-portugal.git
cd imigration-assistant-portugal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the database

Copy `.env.example` to `.env` and update the MongoDB connection string:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/immigration?retryWrites=true&w=majority"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The `Item` model tracks:

| Field      | Type     | Description                                             |
|------------|----------|---------------------------------------------------------|
| id         | ObjectId | Auto-generated MongoDB ID                               |
| imageUrl   | String?  | Optional image URL                                      |
| name       | String   | Item/expense name                                       |
| quantity   | Int      | Number of units                                         |
| unitPrice  | Float    | Price per unit (€)                                      |
| amountPaid | Float    | Total amount paid so far                                |
| category   | Enum     | CLOTHING / ACCESSORIES / DOCUMENTATION / TRAVEL         |
| status     | Enum     | PAID / PURCHASED / PENDING / CANCELLED / PAYING         |
| createdAt  | DateTime | Record creation timestamp                               |
| updatedAt  | DateTime | Last update timestamp                                   |

## API Endpoints

| Method | Endpoint          | Description               |
|--------|-------------------|---------------------------|
| GET    | `/api/items`      | List items (with filters) |
| POST   | `/api/items`      | Create a new item         |
| GET    | `/api/items/[id]` | Get a specific item       |
| PATCH  | `/api/items/[id]` | Update / pay an item      |
