-- Seed products for Hyderabad Clothing E-Commerce Platform
-- Using existing seller ID: 70105ec3-6c98-4b8b-a0c1-a7af86d84b2c

INSERT INTO products (seller_id, name_en, name_te, description_en, category, subcategory, fabric_type, price, mrp, status, total_stock, images, featured)
VALUES
-- Sarees
('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Pure Kanjivaram Silk Saree', 'కంజీవరం పట్టు చీర', 'Exquisite handwoven Kanjivaram silk saree with traditional temple border and rich zari work', 'saree', 'silk', 'Pure Silk', 15850.00, 18500.00, 'active', 12, '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600", "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=600"]', true),

('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Banarasi Georgette Saree', 'బనారసీ జార్జెట్ చీర', 'Elegant Banarasi georgette saree with intricate floral motifs and golden zari border', 'saree', 'georgette', 'Georgette', 8950.00, 10500.00, 'active', 18, '["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600", "https://i.pinimg.com/564x/a0/dc/84/a0dc8404f9cb05fd8e1fb85e77d1f8b8.jpg"]', true),

('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Cotton Handloom Saree', 'పత్తి చేనేత చీర', 'Comfortable everyday cotton saree with traditional handloom weave', 'saree', 'cotton', 'Cotton', 2450.00, 2850.00, 'active', 35, '["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600"]', false),

-- Kurtas
('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Chikankari Embroidered Kurta', 'చికన్‌కారీ కుర్తా', 'Premium white chikankari kurta with delicate hand embroidery and pearl buttons', 'kurta', 'embroidered', 'Cotton', 3850.00, 4500.00, 'active', 25, '["https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=600", "https://i.pinimg.com/564x/8f/92/4a/8f924a4c0c8c5e8e9b9b0c0c0c0c0c0c.jpg"]', true),

('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Anarkali Kurta Set', 'అనార్కలీ కుర్తా సెట్', 'Flowy anarkali kurta with palazzo pants and dupatta, perfect for festive occasions', 'kurta', 'anarkali', 'Rayon', 4250.00, 5000.00, 'active', 20, '["https://images.unsplash.com/photo-1598522325074-042db73aa4e6?q=80&w=600"]', true),

('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Straight Cut Cotton Kurta', 'కాటన్ కుర్తా', 'Simple and elegant straight cut kurta for daily wear', 'kurta', 'straight', 'Cotton', 1850.00, 2200.00, 'active', 40, '["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600"]', false),

-- Salwars
('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Punjabi Salwar Suit', 'పంజాబీ సల్వార్ సూట్', 'Vibrant Punjabi salwar kameez with phulkari dupatta', 'salwar', 'punjabi', 'Cotton Silk', 5250.00, 6000.00, 'active', 15, '["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=600"]', true),

('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Patiala Salwar Set', 'పాటియాలా సల్వార్', 'Traditional Patiala salwar with kurti and dupatta', 'salwar', 'patiala', 'Cotton', 2950.00, 3500.00, 'active', 22, '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600"]', false),

-- Shirts (Men)
('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Premium Linen Shirt', 'లినెన్ షర్ట్', 'Breathable linen shirt for formal and casual occasions', 'shirt', 'formal', 'Linen', 2450.00, 2850.00, 'active', 30, '["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600"]', false),

('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Printed Casual Shirt', 'ప్రింటెడ్ షర్ట్', 'Trendy printed casual shirt for weekend outings', 'shirt', 'casual', 'Cotton', 1650.00, 1950.00, 'active', 35, '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600"]', false),

-- Pants (Men)
('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Slim Fit Formal Trousers', 'ఫార్మల్ ట్రౌజర్లు', 'Classic slim fit formal trousers for office wear', 'pants', 'formal', 'Polyester Blend', 1950.00, 2300.00, 'active', 28, '["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600"]', false),

('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Casual Chinos', 'చినోస్', 'Comfortable chinos for casual and smart-casual occasions', 'pants', 'casual', 'Cotton', 1750.00, 2050.00, 'active', 32, '["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600"]', false),

-- Dress (Women)
('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Floral Maxi Dress', 'ఫ్లోరల్ మ్యాక్సీ డ్రెస్', 'Beautiful floral print maxi dress for summer', 'dress', 'maxi', 'Cotton', 2850.00, 3300.00, 'active', 18, '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600"]', true),

('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Party Wear Gown', 'పార్టీ గౌన్', 'Elegant evening gown with sequin work', 'dress', 'gown', 'Georgette', 6850.00, 7500.00, 'active', 10, '["https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600"]', true),

-- Accessories
('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Silk Embroidered Dupatta', 'సిల్క్ దుప్పట్ట', 'Luxurious silk dupatta with golden embroidery', 'accessories', 'dupatta', 'Silk', 1450.00, 1650.00, 'active', 25, '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600"]', false),

('70105ec3-6c98-4b8b-a0c1-a7af86d84b2c', 'Traditional Jewelry Set', 'సాంప్రదాయ ఆభరణాల సెట్', 'Complete jewelry set with necklace, earrings, and tikka', 'accessories', 'jewelry', 'Artificial', 2950.00, 3500.00, 'active', 15, '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600"]', false);
