import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    res.status(400).json(new jwt.JsonWebTokenError());
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json(new jwt.JsonWebTokenError());
  }
}

export const verifyAdmin = (req, res, next) => {
  validateToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "you are not allowed, only admin is allowed" });
    }
  })
}

export const verifyUserAndAdmin = (req, res, next) => {
  validateToken(req, res, () => {
    if (req.user.isAdmin || req.params.id === req.user.id) {
      next();
    } else {
      res.status(403).json({ message: "you are not allowed" });
    }
  })
}