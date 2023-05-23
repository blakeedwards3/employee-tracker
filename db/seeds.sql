INSERT INTO department (name)
VALUES ('Sales'),
('Customer Service'),
('Tech'),
('Human Resources'),
('Management');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Associate', 50000, 1),
('Customer Service Clerk', 30000, 2),
('IT Professional', 95000, 3),
('HR Representative', 55000, 4),
('Manager', 80000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 1),
('Ashley', 'Johnson', 1, 1),
('James', 'Smith', 2, 1),
('Isaac', 'Wilson', 2, 2),
('Billy', 'Henderson', 3, 2),
('Tessa', 'Young', 4, 1),
('Lindsay', 'Lohan', 5, 2),
('Chris', 'Moore', 5, 1),
('Lauren', 'Fox', 1, 2);