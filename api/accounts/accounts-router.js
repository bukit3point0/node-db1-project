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
  res.json(req.account)
})

router.post('/', 
checkAccountPayload, 
checkAccountNameUnique, 
(req, res, next) => {
  Accounts.create(req.body)
  .then(account => {
    res.status(201).json(account)
  })
  .catch(next)
})

router.put('/:id', 
checkAccountId, 
checkAccountNameUnique, 
checkAccountPayload,
(req, res, next) => {
  Accounts.updateById(req.params.id, req.body)
  .then(account => {
    res.status(201).json(account)
  })
  .catch(next)
});

router.delete('/:id', checkAccountId, (req, res, next) => {
  Accounts.remove(req.params.id)
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
