# Database Tables

## Table: users

Primary Key:
- user_id

Columns:
- user_id (PK)
- username
- password_hash
- account_created
- is_vendor

Relationships:
- One user can have many sessions.
- One user can have many transactions.
- One user can write many reviews.

----------------------------------------------------

## Table: sessions

Primary Key:
- session_id

Columns:
- session_id (PK)
- user_id (FK)
- login_time
- expiration_time
- active

Foreign Key:
- user_id → users.user_id

----------------------------------------------------

## Table: products

Primary Key:
- product_id

Columns:
- product_id (PK)
- vendor_id (FK)
- product_name
- description
- price

Foreign Key:
- vendor_id → users.user_id

----------------------------------------------------

## Table: transactions

Primary Key:
- transaction_id

Columns:
- transaction_id (PK)
- user_id (FK)
- product_id (FK)
- purchase_date
- total_price
- status

Foreign Keys:
- user_id → users.user_id
- product_id → products.product_id

----------------------------------------------------

## Table: reviews

Primary Key:
- review_id

Columns:
- review_id (PK)
- user_id (FK)
- product_id (FK)
- rating
- review_text
- review_date

Foreign Keys:
- user_id → users.user_id
- product_id → products.product_id