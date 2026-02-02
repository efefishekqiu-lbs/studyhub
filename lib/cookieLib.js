const jwt = require('jsonwebtoken')

const JWT_SECRET = 'scoutVWEbCooklieLibSecretJWWSTsSTX'

function createAuthToken(user) {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      sessionVersion: user.sessionVersion
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function setAuthCookie(res, token) {
  res.cookie('sessionID', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7
  })
}

function authGuard(req, res, next) {
  const token = req.cookies?.sessionID
  if (!token) return res.render('signup')

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.render('signup')
  }
}

function clearAuth(res) {
  res.clearCookie('sessionID')
}

module.exports = {
  createAuthToken,
  setAuthCookie,
  authGuard,
  clearAuth
}