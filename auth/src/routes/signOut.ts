import express from 'express'

import { requireAuth } from '@shaktickets/common'

const router = express.Router()

router.get('/api/users/signout', requireAuth, (req, res) => {
  req.session = null

  res.send({})
})

export { router as signOutRouter }
