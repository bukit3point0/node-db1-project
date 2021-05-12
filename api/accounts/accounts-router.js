const router = require('express').Router()
const Accounts = require('./accounts-model')
const {
  checkAccountPayload,
  checkAccountNameUnique,
  checkAccountId
} = require('./accounts-middleware')

router.get('/', (req, res, next) => {
  Accounts.getAll()
  .then(accounts => {
    res.status(200).json(accounts)
  })
  .catch(next)
})

router.get('/:id', checkAccountId, (req, res) => {
  Accounts.getById(req.params.id)
  .then(account => {
    res.status(200).json(account)
  })
  .catch(err => {
    next(err)
  })
})

router.post('/', checkAccountPayload, checkAccountNameUnique, (req, res, next) => {
  Accounts.create(req.body)
  .then(account => {
    const accountName = account.name.trim()
    res.status(201).json({...account, name: accountName})
  })
  .catch(next)
})

router.put('/:id', checkAccountPayload, checkAccountNameUnique, checkAccountId, (req, res, next) => {
  Accounts.updateById(req.params.id, req.body)
  .then(account => {
    res.status(200).json(req.body)
  })
  .catch(next)
});

router.delete('/:id', checkAccountId, (req, res, next) => {
  Accounts.deleteById(req.params.id)
  .then(()=> {
    res.status(200).json({
      message: `account deleted`
    })
  })
  .catch(next)
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    note: 'something bad in accounts',
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router;
