const sql = require("mssql");

const config = {
  user: "sa",
  password: "Md@051080",
  server: "127.0.0.1",
  port: 1433,
  database: "Escola",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✔ SQL conectado com sucesso");
    return pool;
  })
  .catch(err => {
    console.log("❌ Erro SQL:", err);
    throw err;
  });

module.exports = { sql, poolPromise };