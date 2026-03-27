USE dj_booking;

-- Password hashes are placeholders; app will create real bcrypt hashes at runtime.
INSERT INTO users(name,email,mobile,password_hash,otp_verified,role,status) VALUES
('Admin','admin@djbook.com','9000000000','$2a$10$abcdefghijklmnopqrstuv',1,'ADMIN','ACTIVE'),
('Asha Customer','asha@example.com','9000000001','$2a$10$abcdefghijklmnopqrstuv',1,'CUSTOMER','ACTIVE'),
('Ravi Customer','ravi@example.com','9000000002','$2a$10$abcdefghijklmnopqrstuv',1,'CUSTOMER','ACTIVE'),
('DJ Aryan','aryan.dj@example.com','9000000101','$2a$10$abcdefghijklmnopqrstuv',1,'DJ','ACTIVE'),
('DJ Meera','meera.dj@example.com','9000000102','$2a$10$abcdefghijklmnopqrstuv',1,'DJ','ACTIVE'),
('DJ Kabir','kabir.dj@example.com','9000000103','$2a$10$abcdefghijklmnopqrstuv',1,'DJ','ACTIVE');

INSERT INTO djs(user_id,stage_name,location,base_price,avg_rating,rating_count,is_approved) VALUES
((SELECT id FROM users WHERE email='aryan.dj@example.com'),'DJ Aryan','Bangalore',15000,4.70,10,1),
((SELECT id FROM users WHERE email='meera.dj@example.com'),'DJ Meera','Hyderabad',12000,4.40,8,1),
((SELECT id FROM users WHERE email='kabir.dj@example.com'),'DJ Kabir','Pune',18000,4.90,12,0);

INSERT INTO dj_profiles(dj_id,bio,experience_years,genres_json,images_json,videos_json,packages_json) VALUES
((SELECT id FROM djs WHERE stage_name='DJ Aryan'),
 'High-energy EDM + Bollywood sets with premium sound coordination.', 7,
 JSON_ARRAY('EDM','Bollywood'),
 JSON_ARRAY('https://picsum.photos/seed/aryan1/800/600','https://picsum.photos/seed/aryan2/800/600'),
 JSON_ARRAY('https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'),
 JSON_ARRAY(
   JSON_OBJECT('name','Silver (2 hrs)','price',15000,'includes',JSON_ARRAY('DJ','Basic lights')),
   JSON_OBJECT('name','Gold (4 hrs)','price',26000,'includes',JSON_ARRAY('DJ','Lights','MC')),
   JSON_OBJECT('name','Platinum (6 hrs)','price',38000,'includes',JSON_ARRAY('DJ','Lights','MC','Sound coordination'))
 )
),
((SELECT id FROM djs WHERE stage_name='DJ Meera'),
 'Bollywood + Hip-hop mixes for weddings and parties.', 5,
 JSON_ARRAY('Bollywood','Hip-hop'),
 JSON_ARRAY('https://picsum.photos/seed/meera1/800/600'),
 JSON_ARRAY(),
 JSON_ARRAY(
   JSON_OBJECT('name','Party Pack (3 hrs)','price',12000,'includes',JSON_ARRAY('DJ')),
   JSON_OBJECT('name','Wedding Pack (5 hrs)','price',22000,'includes',JSON_ARRAY('DJ','MC'))
 )
),
((SELECT id FROM djs WHERE stage_name='DJ Kabir'),
 'Corporate-friendly curated sets and seamless transitions.', 9,
 JSON_ARRAY('EDM','Hip-hop'),
 JSON_ARRAY('https://picsum.photos/seed/kabir1/800/600'),
 JSON_ARRAY(),
 JSON_ARRAY(
   JSON_OBJECT('name','Corporate (3 hrs)','price',18000,'includes',JSON_ARRAY('DJ','Clean edit playlist'))
 )
);

-- Availability slots (next 7 days, sample windows)
INSERT INTO availability_slots(dj_id,start_at,end_at,is_booked) VALUES
((SELECT id FROM djs WHERE stage_name='DJ Aryan'), DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 22 HOUR, 0),
((SELECT id FROM djs WHERE stage_name='DJ Aryan'), DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 18 HOUR, DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 22 HOUR, 0),
((SELECT id FROM djs WHERE stage_name='DJ Meera'), DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR, DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 23 HOUR, 0),
((SELECT id FROM djs WHERE stage_name='DJ Meera'), DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 18 HOUR, DATE_ADD(CURDATE(), INTERVAL 3 DAY) + INTERVAL 22 HOUR, 0);

-- A completed booking with review (for listing ratings/moderation examples)
INSERT INTO bookings(customer_id,dj_id,event_type,start_at,end_at,quoted_price,notes) VALUES
((SELECT id FROM users WHERE email='asha@example.com'), (SELECT id FROM djs WHERE stage_name='DJ Aryan'),
 'PARTY', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY) + INTERVAL 3 HOUR, 15000, 'Birthday party');
INSERT INTO booking_status(booking_id,status,remarks) VALUES
((SELECT id FROM bookings ORDER BY id DESC LIMIT 1),'COMPLETED','Event completed');
INSERT INTO payments(booking_id,amount,payment_type,status,provider_txn_id) VALUES
((SELECT id FROM bookings ORDER BY id DESC LIMIT 1),15000,'FULL','SUCCESS','TXN-SEED-001');
INSERT INTO reviews(booking_id,dj_id,user_id,rating,comment,moderation_status) VALUES
((SELECT id FROM bookings ORDER BY id DESC LIMIT 1),
 (SELECT id FROM djs WHERE stage_name='DJ Aryan'),
 (SELECT id FROM users WHERE email='asha@example.com'),
 5,'Amazing vibe and perfect transitions!','APPROVED');
