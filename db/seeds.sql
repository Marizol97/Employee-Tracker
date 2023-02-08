INSERT INTO department (department_name)
VALUES
  ('HR'),
  ('Tech'),
  ('Marketing'),
  ('Finance'),
  ('Sales'),
  ('Engineering'),
  ('Legal');
  
INSERT INTO role (title, salary, department_id)
VALUES
  ('Manager ', 22000, 1),
  ('Marketing assistance', 45394, 3),
  ('IT Technician', 29000, 2),
  ('Judge', 160000, 7),
  ('Sales Recruiter', 70619, 5),
  ('Manufacturing Sales', 140210, 6),
  ('Legal Assistance', 38000, 7),
  ('Sales Manager', 41000, 5),
  ('Salesperson', 420000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Rick', 'Novak', 9, 1),
  ('Susan', 'Connor', 2, 2),
  ('Margaret', 'Adelman', 3, 1),
  ('Ronald', 'Barr', 4, 3),
  ('Roger', 'Lum', 5, 1),
  ('Marlene', 'Donahue', 6, 3);