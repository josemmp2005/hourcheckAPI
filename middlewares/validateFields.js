export const validateFields = (campos) => {
  return (req, res, next) => {
    for (let campo of campos) {
      if (!req.body[campo]) {
        return res.status(400).json({ error: `El campo "${campo}" es requerido` });
      }
    }
    next();
  };
};
