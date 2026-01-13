import sql from 'mssql';

const config = {
  user: 'sa',
  password: 'Testdb123!@#',
  server: 'localhost',
  database: 'db_company_x',
  port: 1433,
  options: {
    encrypt: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export const poolPromise = sql.connect(config);
export default sql;
