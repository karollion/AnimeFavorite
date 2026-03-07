module.exports = (req, res, next) => {

  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" })
  }

  next()
}