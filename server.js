import express from 'express';
import sql from 'mssql';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: 'daniel',
  password: 'ESAF2025',
  server: 'MSSQLSERVER02',
  database: 'ESAF2025',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.post('/api/lookup', async (req, res) => {
  try {
    await sql.connect(config);
    const { code } = req.body;
    const result = await sql.query`SELECT * FROM QRCodes WHERE code = ${code}`;
    
    if (result.recordset.length > 0) {
      res.json({ status: 'OK' });
    } else {
      res.json({ status: 'Not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while looking up the code' });
  } finally {
    await sql.close();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});