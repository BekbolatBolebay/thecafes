-- Insert sample restaurants (мейрамханалар)
INSERT INTO restaurants (name, name_kk, name_ru, name_en, description, description_kk, description_ru, description_en, image_url, rating, delivery_time, category, is_new) VALUES
('Cozy Coffee', 'Cozy Coffee', 'Cozy Coffee', 'Cozy Coffee', 'Кофе • Десерттер', 'Кофе • Десерттер', 'Кофе • Десерты', 'Coffee • Desserts', '/placeholder.svg?height=200&width=300', 4.8, '15 мин', 'Кофе', true),
('Noodle House', 'Noodle House', 'Noodle House', 'Noodle House', 'Азиялық • Лағман', 'Азиялық • Лағман', 'Азиатская • Лагман', 'Asian • Noodles', '/placeholder.svg?height=200&width=300', 4.6, '25 мин', 'Азиялық', true),
('Додо Пицца', 'Додо Пицца', 'Додо Пицца', 'Dodo Pizza', 'Пицца • Фастфуд', 'Пицца • Фастфуд', 'Пицца • Фастфуд', 'Pizza • Fast Food', '/placeholder.svg?height=200&width=300', 4.7, '30-40 мин', 'Пицца', false),
('Burger King', 'Burger King', 'Burger King', 'Burger King', 'Бургерлер • Фастфуд', 'Бургерлер • Фастфуд', 'Бургеры • Фастфуд', 'Burgers • Fast Food', '/placeholder.svg?height=200&width=300', 4.5, '20-30 мин', 'Бургерлер', false),
('KFC', 'KFC', 'KFC', 'KFC', 'Тауық • Фастфуд', 'Тауық • Фастфуд', 'Курица • Фастфуд', 'Chicken • Fast Food', '/placeholder.svg?height=200&width=300', 4.4, '25-35 мин', 'Тауық', false),
('Hardee''s', 'Hardee''s', 'Hardee''s', 'Hardee''s', 'Бургерлер • Американдық', 'Бургерлер • Американдық', 'Бургеры • Американская', 'Burgers • American', '/placeholder.svg?height=200&width=300', 4.6, '15-25 мин', 'Бургерлер', false),
('Subway', 'Subway', 'Subway', 'Subway', 'Сэндвичтер • Салаттар', 'Сэндвичтер • Салаттар', 'Сэндвичи • Салаты', 'Sandwiches • Salads', '/placeholder.svg?height=200&width=300', 4.3, '10-20 мин', 'Сэндвичтер', false);

-- Insert sample food items (тағамдар)
INSERT INTO food_items (restaurant_id, name, name_kk, name_ru, name_en, description, description_kk, description_ru, description_en, image_url, price, rating, delivery_time, category, discount) 
SELECT 
  r.id,
  'Маргарита пицца',
  'Маргарита пицца',
  'Пицца Маргарита',
  'Margherita Pizza',
  'Үлкен өлшем, 30 см',
  'Үлкен өлшем, 30 см',
  'Большой размер, 30 см',
  'Large size, 30 cm',
  '/placeholder.svg?height=300&width=300',
  2500,
  4.8,
  '20 мин',
  'Пицца',
  0
FROM restaurants r WHERE r.name = 'Додо Пицца' LIMIT 1;

INSERT INTO food_items (restaurant_id, name, name_kk, name_ru, name_en, description, description_kk, description_ru, description_en, image_url, price, rating, delivery_time, category, discount)
SELECT 
  r.id,
  'Классик бургер',
  'Классик бургер',
  'Классический бургер',
  'Classic Burger',
  'Ет, ірімшік, қырыққабат',
  'Ет, ірімшік, қырыққабат',
  'Мясо, сыр, овощи',
  'Beef, cheese, vegetables',
  '/placeholder.svg?height=300&width=300',
  1800,
  4.9,
  '15 мін',
  'Бургерлер',
  0
FROM restaurants r WHERE r.name = 'Burger King' LIMIT 1;

INSERT INTO food_items (restaurant_id, name, name_kk, name_ru, name_en, description, description_kk, description_ru, description_en, image_url, price, rating, delivery_time, category, discount)
SELECT 
  r.id,
  'Цезарь салаты',
  'Цезарь салаты',
  'Салат Цезарь',
  'Caesar Salad',
  'Тауық етімен',
  'Тауық етімен',
  'С курицей',
  'With chicken',
  '/placeholder.svg?height=300&width=300',
  2800,
  4.7,
  '10 мін',
  'Салаттар',
  0
FROM restaurants r WHERE r.name = 'Cozy Coffee' LIMIT 1;

INSERT INTO food_items (restaurant_id, name, name_kk, name_ru, name_en, description, description_kk, description_ru, description_en, image_url, price, rating, delivery_time, category, discount)
SELECT 
  r.id,
  'Суши сеті -30%',
  'Суши сеті -30%',
  'Суши сет -30%',
  'Sushi Set -30%',
  'Барлық сушы роллдарына жеңілдік',
  'Барлық сушы роллдарына жеңілдік',
  'Скидка на все суши роллы',
  'Discount on all sushi rolls',
  '/placeholder.svg?height=300&width=300',
  8800,
  4.8,
  '18 мін',
  'Суши',
  30
FROM restaurants r WHERE r.name = 'Noodle House' LIMIT 1;

INSERT INTO food_items (restaurant_id, name, name_kk, name_ru, name_en, description, description_kk, description_ru, description_en, image_url, price, rating, delivery_time, category, discount)
SELECT 
  r.id,
  'Пепперони пицца',
  'Пепперони пицца',
  'Пицца Пепперони',
  'Pepperoni Pizza',
  'Үлкен өлшем, 30 см',
  'Үлкен өлшем, 30 см',
  'Большой размер, 30 см',
  'Large size, 30 cm',
  '/placeholder.svg?height=300&width=300',
  4200,
  4.8,
  '20 мін',
  'Пицца',
  0
FROM restaurants r WHERE r.name = 'Додо Пицца' LIMIT 1;

INSERT INTO food_items (restaurant_id, name, name_kk, name_ru, name_en, description, description_kk, description_ru, description_en, image_url, price, rating, delivery_time, category, discount)
SELECT 
  r.id,
  'Карбонара',
  'Карбонара',
  'Карбонара',
  'Carbonara',
  'Сосын спагетті',
  'Сосын спагетті',
  'Паста спагетти',
  'Spaghetti pasta',
  '/placeholder.svg?height=300&width=300',
  2200,
  4.8,
  '25 мін',
  'Паста',
  0
FROM restaurants r WHERE r.name = 'Noodle House' LIMIT 1;
