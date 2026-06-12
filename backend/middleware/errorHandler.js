function errorHandler(err, req, res, next) {
  console.error("🔥 ERRO INTERNO:", err);

  const status = err.status || 500;

  return res.status(status).json({
    erro: err.message || "Erro interno no servidor"
  });
}

module.exports = errorHandler;