import express from 'express';
import sql, { poolPromise } from '../db.js';
import { validateEmployee } from '../validators/employeeValidator.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Employees');

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Employees WHERE EmployeeID = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const error = validateEmployee(req.body);
  if (error) {
    return res.status(400).json({ warning: error });
  }

  const { name, position, salary } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.VarChar(100), name.trim())
      .input('position', sql.VarChar(50), position.trim())
      .input('salary', sql.Decimal(12, 2), salary)
      .query(`
        INSERT INTO Employees (Name, Position, Salary)
        VALUES (@name, @position, @salary)
      `);

    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const error = validateEmployee(req.body);
  if (error) {
    return res.status(400).json({ warning: error });
  }

  const { name, position, salary } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('name', sql.VarChar(100), name.trim())
      .input('position', sql.VarChar(50), position.trim())
      .input('salary', sql.Decimal(12, 2), salary)
      .query(`
        UPDATE Employees
        SET Name = @name,
            Position = @position,
            Salary = @salary
        WHERE EmployeeID = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Employees WHERE EmployeeID = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
