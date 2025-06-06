module.exports = (req, res, next) => {
  try {
    const isAdmin = req.headers['x-admin'] === 'true';
    if (!isAdmin) return res.status(403).json({ message: 'Forbidden: Admins only' });
    next();
  } catch (error) {
    console.error('Error in admin middleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
