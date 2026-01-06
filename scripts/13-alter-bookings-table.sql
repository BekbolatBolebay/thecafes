-- Alter bookings table to add new columns and rename guests
ALTER TABLE bookings
ADD COLUMN table_id TEXT,
ADD COLUMN user_name TEXT,
ADD COLUMN restaurant_name TEXT,
ADD COLUMN restaurant_image TEXT;

ALTER TABLE bookings
RENAME COLUMN guests TO number_of_guests;
