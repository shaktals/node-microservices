import express from 'express'

import { requireAuth } from '../middlewares/requireAuth'

const router = express.Router()

router.get('/api/users/signout', requireAuth, (req, res) => {
  req.session = null

  res.send({})
})

export { router as signOutRouter }
