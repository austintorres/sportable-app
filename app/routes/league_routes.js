const express = require('express')
const passport = require('passport')

// mongoose model for league
const League = require('../models/league')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router
const router = express.Router()

// INDEX
// GET /leagues
router.get('/leagues', requireToken, (req, res, next) => {
  League.find({'owner': req.user.id})
    .populate('owner')
    .then(leagues => {
      return leagues.map(league => league.toObject())
    })
    .then(leagues => res.status(200).json({ leagues: leagues }))
    .catch(next)
})

// SHOW
// GET /leagues/4wrewe4546
router.get('/leagues/:id', requireToken, (req, res, next) => {
  League.findById(req.params.id)
    .populate('owner')
    .then(handle404)
    .then(league => res.status(200).json({ league: league.toObject() }))
    .catch(next)
})

// CREATE
// POST /leagues
router.post('/leagues', requireToken, (req, res, next) => {
  req.body.league.owner = req.user.id

  League.create(req.body.league)
    .then(league => {
      res.status(201).json({ league: league.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /leagues/764536564
router.patch('/leagues/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.league.owner

  League.findById(req.params.id)
    .populate('owner')
    .then(handle404)
    .then(league => {
      requireOwnership(req, league)
      return league.updateOne(req.body.league)
    })
    .then(() => res.sendStatus(202))
    .catch(next)
})

// DESTROY
// DELETE /leagues/532446
router.delete('/leagues/:id', requireToken, (req, res, next) => {
  League.findById(req.params.id)
    .then(handle404)
    .then(league => {
      requireOwnership(req, league)
      league.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
