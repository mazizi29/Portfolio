insert into public.profiles (id, display_name, title, intro, email, location, availability, portrait_url)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'Ayu Pramesti',
    'Creative Developer & UI/UX Enthusiast',
    'Saya membangun pengalaman digital yang terasa personal, bersih, dan mudah dipahami — dari desain visual hingga produk web yang siap dipakai.',
    'hello@ayupramesti.com',
    'Yogyakarta, Indonesia',
    'Open for freelance & collaboration',
    ''
  )
on conflict (id) do update set
  display_name = excluded.display_name,
  title = excluded.title,
  intro = excluded.intro,
  email = excluded.email,
  location = excluded.location,
  availability = excluded.availability,
  portrait_url = excluded.portrait_url,
  updated_at = now();

insert into public.site_settings (id, site_title, site_tagline, meta_description, open_internship, contact_email)
values
  (1, 'Portfolio', 'Informatics Student · UI/UX · Development · Visual Design', 'Personal portfolio of a design-minded Informatics student.', true, 'hello@portfolio.id')
on conflict (id) do update set
  site_title = excluded.site_title,
  site_tagline = excluded.site_tagline,
  meta_description = excluded.meta_description,
  open_internship = excluded.open_internship,
  contact_email = excluded.contact_email,
  updated_at = now();

insert into public.projects (sort_order, slug, title, subtitle, description, category, year, role, tools, tags, status, featured, cover_url, overview, problem, result, github_url, live_url)
values
  (1, 'nataArtha', 'NataArtha', 'Personal Finance Management App', 'A comprehensive personal finance management application designed to help users track expenses, set budgets, and visualize spending patterns through intuitive data visualization.', 'Mobile App', '2024', 'UI/UX Design · Front-End Development', array['Figma', 'React Native', 'Firebase'], array['UI/UX', 'React Native', 'Firebase'], 'published', true, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop&auto=format', 'NataArtha addresses the challenge of personal financial management for young professionals and students who struggle to maintain consistent budgeting habits.', 'Most budgeting apps are either too complex or too simplistic. Users need a middle ground that provides real insight without cognitive overload.', 'A clean, data-forward mobile application with an intuitive onboarding flow that reduced user drop-off by 40% in testing.', 'https://github.com', ''),
  (2, 'javanese-invitation', 'Interactive Javanese Invitation', 'Interactive Digital Invitation', 'A culturally rich, interactive digital invitation experience blending traditional Javanese visual motifs with modern web animation techniques.', 'Web Experience', '2024', 'UI Design · Frontend Development', array['Figma', 'HTML', 'CSS', 'JavaScript', 'GSAP'], array['UI Design', 'HTML', 'CSS', 'JavaScript', 'GSAP'], 'published', true, 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&h=800&fit=crop&auto=format', 'A fully interactive digital wedding invitation that honors Javanese cultural traditions through contemporary interaction design.', 'Traditional printed invitations cannot convey the richness of cultural ceremony. Digital alternatives often feel generic.', 'A critically appreciated digital experience shared across social media, with over 2,000 unique visitors within the first week.', '', 'https://example.com'),
  (3, 'digital-forensic-automation', 'Digital Forensic Automation', 'Digital Forensic Investigation System', 'An automated system for streamlining digital forensic investigation workflows, reducing manual processing time and improving evidence chain-of-custody documentation.', 'Systems', '2024', 'Backend Development · System Design', array['Python', 'Automation', 'Digital Forensics'], array['Python', 'Automation', 'Digital Forensics'], 'published', true, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop&auto=format', 'A Python-based automation toolkit for digital forensic investigators handling large volumes of digital evidence.', 'Manual forensic investigation is time-consuming and error-prone. Evidence handling requires meticulous documentation.', 'Reduced average investigation processing time by 60% in a university lab environment.', 'https://github.com', ''),
  (4, 'layar-putih', 'Layar Putih Creative Studio', 'Creative Studio & Visual Identity', 'Complete brand identity system and web presence for an emerging creative studio, from logo design through to digital collateral and website.', 'Branding', '2023', 'Brand Design · Art Direction · Web Design', array['Figma', 'Illustrator', 'Photoshop'], array['Branding', 'Graphic Design', 'Photography', 'Web'], 'published', true, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop&auto=format', 'Full brand identity system for Layar Putih, a creative studio specializing in commercial photography and videography.', 'The studio had strong creative output but lacked a cohesive visual identity that matched their production quality.', 'A refined visual identity that elevated their market positioning and supported a 30% increase in client inquiries.', '', '')
on conflict (slug) do update set
  sort_order = excluded.sort_order,
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  category = excluded.category,
  year = excluded.year,
  role = excluded.role,
  tools = excluded.tools,
  tags = excluded.tags,
  status = excluded.status,
  featured = excluded.featured,
  cover_url = excluded.cover_url,
  overview = excluded.overview,
  problem = excluded.problem,
  result = excluded.result,
  github_url = excluded.github_url,
  live_url = excluded.live_url,
  updated_at = now();

insert into public.project_gallery (project_id, image_url, sort_order)
select p.id, v.image_url, v.sort_order
from public.projects p
join (values
  ('nataArtha', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=800&fit=crop&auto=format', 1),
  ('nataArtha', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&auto=format', 2)
) as v(slug, image_url, sort_order) on v.slug = p.slug
on conflict do nothing;

insert into public.experience (sort_order, organization, position, type, start_date, end_date, description, skills, status)
values
  (1, 'Universitas Gadjah Mada', 'Informatics Student', 'Education', '2022-08-01', null, 'Bachelor of Informatics. Coursework spans algorithms, data structures, software engineering, and human-computer interaction.', array['Algorithms', 'Data Structures', 'Software Engineering', 'HCI'], 'active'),
  (2, 'Layar Putih Creative Studio', 'Graphic Designer', 'Freelance', '2023-01-01', '2024-06-01', 'Led brand identity projects for local SMEs and cultural organizations. Managed client relationships and produced print and digital collateral.', array['Brand Identity', 'Print Design', 'Photography', 'Client Management'], 'completed'),
  (3, 'Self-Directed', 'UI/UX Designer & Developer', 'Project', '2024-01-01', null, 'Independent product design and development projects bridging visual design with technical implementation.', array['UI/UX', 'React', 'React Native', 'Firebase'], 'active')
on conflict do nothing;

insert into public.skills (category, name, order_index)
values
  ('design', 'UI/UX Design', 1),
  ('design', 'Visual Design', 2),
  ('design', 'Typography', 3),
  ('design', 'Brand Identity', 4),
  ('design', 'Layout & Composition', 5),
  ('build', 'HTML / CSS / JavaScript', 1),
  ('build', 'React / React Native', 2),
  ('build', 'Firebase', 3),
  ('build', 'Node.js / Express', 4),
  ('build', 'MongoDB', 5),
  ('build', 'Git / GitHub', 6),
  ('visual', 'Photography', 1),
  ('visual', 'Photo Editing', 2),
  ('visual', 'Video Editing', 3),
  ('visual', 'Adobe Illustrator', 4),
  ('visual', 'Photoshop', 5),
  ('visual', 'After Effects', 6),
  ('visual', 'Lightroom', 7)
on conflict (category, name) do update set
  order_index = excluded.order_index,
  updated_at = now();

insert into public.messages (name, email, message, read, sent_at)
values
  ('Rizky Pratama', 'rizky@example.com', 'Hi, I came across your portfolio and I am really impressed with your work on NataArtha. Would love to discuss a potential collaboration on a fintech startup project.', false, '2026-08-05T00:00:00Z'),
  ('Anindya Kusuma', 'anindya@studio.id', 'We are looking for a UI/UX intern for our product team. Your background in both design and development is exactly what we need. Are you currently available?', false, '2026-08-03T00:00:00Z'),
  ('Budi Santoso', 'budi@agency.co', 'Great work on the Javanese Invitation project. We have a similar cultural project coming up and would love to discuss bringing you on.', true, '2026-07-28T00:00:00Z')
on conflict do nothing;
