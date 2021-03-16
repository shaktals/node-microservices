import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/api/users/currentuser', (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }
