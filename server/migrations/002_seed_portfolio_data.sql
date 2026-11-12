
-- =========================================
-- 002: Seed Portfolio Content
-- =========================================

-- Projects
INSERT INTO projects (
    title,
    description,
    technologies,
    category,
    github_url,
    live_demo_url,
    image_url
)
SELECT
    'Marketing & Advertising Platform',
    'A full-stack web application built to support over 5,000 users, featuring a React frontend and a Node.js backend.',
    ARRAY['React', 'Node.js', 'JavaScript', 'Express', 'MongoDB', 'TailwindCSS'],
    'Full Stack Development',
    'https://github.com/Pill4rs',
    NULL,
    NULL
WHERE NOT EXISTS (
    SELECT 1 FROM projects
    WHERE title = 'Marketing & Advertising Platform'
);

INSERT INTO projects (
    title,
    description,
    technologies,
    category,
    github_url,
    live_demo_url,
    image_url
)
SELECT
    'Tech Blog Application',
    'An interactive technology blog featuring user registration, authentication, article publishing, comments, and admin functionality.',
    ARRAY['Web Development', 'Authentication', 'CRUD'],
    'Full-Stack Development',
    'https://github.com/SamuelOluyemi/Tech-Blog-World.git',
    NULL,
    '/images/tech-blog-home.png'
WHERE NOT EXISTS (
    SELECT 1 FROM projects
    WHERE title = 'Tech Blog Application'
);

-- Journey milestones
INSERT INTO journey_milestones (
    organization,
    title,
    description,
    date_label,
    display_order
)
SELECT
    'Athabasca University',
    'Computer Science Foundations',
    'Completed coursework in Introduction to Programming (C++), Data Structures and Algorithms, and Operating Systems.',
    NULL,
    1
WHERE NOT EXISTS (
    SELECT 1 FROM journey_milestones
    WHERE organization = 'Athabasca University'
      AND title = 'Computer Science Foundations'
);

INSERT INTO journey_milestones (
    organization,
    title,
    description,
    date_label,
    display_order
)
SELECT
    'Harvard edX',
    'Practical Web Development',
    'Developed an interactive technology blog as a course project, implementing user registration, authentication, articles, comments, and admin functionality.',
    NULL,
    2
WHERE NOT EXISTS (
    SELECT 1 FROM journey_milestones
    WHERE organization = 'Harvard edX'
      AND title = 'Practical Web Development'
);

INSERT INTO journey_milestones (
    organization,
    title,
    description,
    date_label,
    display_order
)
SELECT
    'Current Focus',
    'Cloud, Security & Privacy',
    'Expanding my knowledge of software engineering, cloud systems, information security, and privacy.',
    NULL,
    3
WHERE NOT EXISTS (
    SELECT 1 FROM journey_milestones
    WHERE organization = 'Current Focus'
      AND title = 'Cloud, Security & Privacy'
);
