const express = require('express');
const app = express();
const db = require('./db');
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello");
})

//User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const allData = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

    if (allData.rows.length > 0) {
      res.send({ message: 'Login Success' })
    } else {
      res.status(400).send({ message: 'Invalid Email or Password' });
    }

  } catch (error) {
    res.status(500).send({ message: 'Error saving employee' });
  }
})

//User Signup
app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNumber, password, reenterPassword } = req.body;
    const userInformation = await db.query('SELECT email from users WHERE email = $1', [email]);

    if ((await userInformation).rows.length > 0) {
      return res.status(400).send({ message: 'Account Already Exists!.' });
    }

    await db.query('INSERT INTO users (firstName, lastName, email, mobileNumber, password, reenterPassword) VALUES($1, $2, $3, $4, $5, $6)', [firstName, lastName, email, mobileNumber, password, reenterPassword]);

    res.status(200).send({ message: 'Account created successfully' })
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

//POST Employee
app.post('/addEmployee', async (req, res) => {
  try {
    const { firstName, lastName, employeeID, dateOfBirth, uploadFile, email, phone, address, city, state, pinCode, position, department, hireDate, salary, employmentStatus, employmentType, contactName, contactPhone, alternatePhone, emergencyContactRelationship } = req.body;

    const checkQuery = await db.query('SELECT email from employees WHERE email = $1', [email]);
    if (checkQuery.rows.length > 0) {
      return res.status(400).send({ message: 'User already exists.' });
    } else {
      await db.query('INSERT INTO employees (firstName, lastName, employeeID, dateOfBirth, uploadFile, email, phone, address, city, state, pinCode, position, department, hireDate, salary, employmentStatus, employmentType, contactName, contactPhone, alternatePhone, emergencyContactRelationship) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)', [firstName, lastName, employeeID, dateOfBirth, uploadFile, email, phone, address, city, state, pinCode, position, department, hireDate, salary, employmentStatus, employmentType, contactName, contactPhone, alternatePhone, emergencyContactRelationship]);
      return res.status(201).send({ message: 'User Details submitted successfully.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server Error', error });
  }
});

//GET Employees
app.get('/getEmployees', async (req, res) => {
  try {
    const getEmployeesQuery = await db.query('SELECT * FROM employees');
    res.status(200).send({ message: 'Employees retrieved successfully.', data: getEmployeesQuery.rows });
  } catch (error) {
    res.status(400).send({ message: 'Error fetching employees', error: error.message });
  }
})

//GET/:ID Employee
app.get(`/getEmployee/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const getEmployeeQuery = await db.query('SELECT * FROM employees WHERE employeeid = $1', [id]);
    if (getEmployeeQuery.rows.length > 0) {
      const userData = getEmployeeQuery.rows;
      res.status(200).send({ message: 'Employee Data Retrieved Successfully.', data: userData[0] });
    } else {
      res.status(400).send({ message: 'No employee exists with the provided ID.', error: error.message })
    }
  } catch (error) {
    console.error('Error retrieving employee:', error);
    res.status(500).send({
      message: 'An error occurred while retrieving employee data.',
      error: error.message,
    });
  }
})

//PUT/employee
app.put(`/edit/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName, lastName, employeeID, dateOfBirth, uploadFile, email, phone,
      address, city, state, pinCode, position, department, hireDate, salary,
      employmentStatus, employmentType, contactName, contactPhone,
      alternatePhone, emergencyContactRelationship
    } = req.body;

    const editEmployee = await db.query('SELECT * FROM employees WHERE employeeid = $1', [id]);

    if (editEmployee.rows.length > 0) {
      const updateQuery = `
        UPDATE employees SET
          firstname = $1,
          lastname = $2,
          employeeid = $3,
          dateofbirth = $4,
          uploadfile = $5,
          email = $6,
          phone = $7,
          address = $8,
          city = $9,
          state = $10,
          pincode = $11,
          position = $12,
          department = $13,
          hiredate = $14,
          salary = $15,
          employmentstatus = $16,
          employmenttype = $17,
          contactname = $18,
          contactphone = $19,
          alternatephone = $20,
          emergencycontactrelationship = $21
        WHERE employeeid = $22
        RETURNING *;
      `;

      const values = [
        firstName, lastName, employeeID, dateOfBirth, uploadFile, email, phone,
        address, city, state, pinCode, position, department, hireDate, salary,
        employmentStatus, employmentType, contactName, contactPhone,
        alternatePhone, emergencyContactRelationship, id
      ];

      const result = await db.query(updateQuery, values);
      res.status(200).json({ message: 'Employee updated successfully', data: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//DELETE Employee
app.delete('/deleteEmployee/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First check if employee exists
    const employeeExists = await db.query('SELECT * FROM employees WHERE employeeid = $1', [id]);

    if (employeeExists.rows.length > 0) {
      await db.query('DELETE FROM employees WHERE employeeid = $1', [id]);

      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
        deletedEmployee: employeeExists.rows[0]
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Application running on port ${port}`);
});