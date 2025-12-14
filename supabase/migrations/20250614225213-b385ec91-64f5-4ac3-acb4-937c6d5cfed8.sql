-- Insert sample products for the store
INSERT INTO public.products (name, description, price, images, category_id, stock_quantity, rating, review_count, is_active) VALUES 
(
  'Premium Dog Food - Adult',
  'High-quality nutrition for adult dogs with real meat as the first ingredient. Contains essential vitamins and minerals for optimal health.',
  45.99,
  ARRAY['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'],
  (SELECT id FROM product_categories WHERE name = 'Food & Treats'),
  25,
  4.8,
  245,
  true
),
(
  'Interactive Cat Toy Set',
  'Keep your cat entertained for hours with this collection of interactive toys including feather wands, balls, and puzzle feeders.',
  24.99,
  ARRAY['https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400'],
  (SELECT id FROM product_categories WHERE name = 'Toys & Entertainment'),
  50,
  4.6,
  189,
  true
),
(
  'Cozy Pet Bed - Large',
  'Ultra-soft and comfortable bed perfect for large dogs. Machine washable with non-slip bottom.',
  89.99,
  ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400'],
  (SELECT id FROM product_categories WHERE name = 'Accessories'),
  12,
  4.9,
  156,
  true
),
(
  'Organic Cat Treats',
  'All-natural treats made with organic ingredients. Perfect for training or just showing your cat some love.',
  16.99,
  ARRAY['https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400'],
  (SELECT id FROM product_categories WHERE name = 'Food & Treats'),
  75,
  4.7,
  98,
  true
),
(
  'Grooming Kit Complete',
  'Professional-grade grooming tools including brushes, nail clippers, and shampoo for all coat types.',
  39.99,
  ARRAY['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'],
  (SELECT id FROM product_categories WHERE name = 'Health & Care'),
  30,
  4.5,
  67,
  true
),
(
  'Smart Water Fountain',
  'Automatic water fountain with filtration system to keep your pet hydrated with fresh, clean water.',
  64.99,
  ARRAY['https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400'],
  (SELECT id FROM product_categories WHERE name = 'Accessories'),
  18,
  4.8,
  134,
  true
),
(
  'Dog Training Clicker',
  'Professional training clicker with wrist strap. Essential tool for positive reinforcement training.',
  8.99,
  ARRAY['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'],
  (SELECT id FROM product_categories WHERE name = 'Training'),
  100,
  4.4,
  203,
  true
),
(
  'Cat Scratching Post Tower',
  'Multi-level scratching post with perches and hiding spots. Keeps cats entertained and protects furniture.',
  129.99,
  ARRAY['https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400'],
  (SELECT id FROM product_categories WHERE name = 'Toys & Entertainment'),
  8,
  4.7,
  89,
  true
);