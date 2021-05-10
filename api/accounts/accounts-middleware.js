const yup = require('yup')
const Accounts = require('./accounts-model')

const accountSchema = yup.object({
  name: yup.string(`name of account must be a string`)
    .trim()
    .min(3, `name of account must be between 3 and 100`)
    .max(100, `name of account must be between 3 and 100`)
    .required(`name and budget are required`),
  budget: yup.integer(`budget of account must be a number`)
    .trim()
    .positive(`budget of account is too large or too small`)
    .max(1000000, `budget of account is too large or too small`)
    .required(`name and budget are required`)
})

exports.checkAccountPayload = async (req, res, next) => {
  try {
    const validated = await accountSchema.validate(req.body {
      stripUnknown: true
    })
    req.body = validated
    next()
  } catch(err) {
    next({
      status: 400,
      message: err.message
    })
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  // DO YOUR MAGIC
  // checkAccountNameUnique returns a status 400 with a { message: "that name is taken" } if the trimmed req.body.name already exists in the database
  try {
    const accounts = await db.getAll()
    accounts.filter(account => {
      if (account.name === req.body.name.trim) {
        res.status(400).json({
          message: `that name is taken`
        })
      } else {
        return account
      }
    })
  } catch (err) {
    next({
      message: err.message
    })
  }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const accountId = await Accounts.getById(req.params.id)
    if(!accountId) {
      next({
        status: 404,
        message: 'account not found'
      })
    } else {
      req.accountId = accountId
      next()
    }
  } catch(err) {
    next(err)
  }
}
