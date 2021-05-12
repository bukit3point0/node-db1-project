const Accounts = require('./accounts-model')

exports.checkAccountPayload = (req, res, next) => {
  const {name, budget} = req.body
  try {
    console.log("test", name,budget)
    if (!name || !budget) {
    res.status(400).json({
      message: `name and budget are required`
    })
    }
    if (typeof budget !== "number") {
      res.status(400).json({
        message: `budget of account must be a number`
      })
    } else if (typeof name !== "string") {
      res.status(400).json({
        message: `name of account must be a string`
      }) 
    } else if (name.trim().length < 3 || name.trim().length > 100) {
      res.status(400).json({
        message: `name of account must be between 3 and 100`
      })
    } else if (budget < 0 || budget > 1000000) {
      res.status(400).json({
        message: `budget of account is too large or too small`
      })
    } else {next()}
    }
  catch (err) {
    next(err)
  }
}

// - `checkAccountNameUnique` returns a status 400 with a `{ message: "that name is taken" }` if the _trimmed_ `req.body.name` already exists in the database

exports.checkAccountNameUnique = async (req, res, next) => {
  const name = req.body.name
  Accounts.getByName(name)
  .then(account => {
    if(!account) {
      next()
    } else {
      res.status(400).json({
        message: `name is taken`
      })
    }
  })
  .catch(err => {
    next(err)
  })
  
  // const newAccount = req.body
  // console.log(newAccount)
  // try {
  //   const accounts = await Accounts.getAll()
  //   accounts.filter(account => {
  //     if (account.name === newAccount.name.trim()) {
  //       res.status(400).json({
  //         message: `that name is taken`
  //       })
  //     } else {
  //       req.body = accounts
  //       next()
  //     }
  //   })
  // } catch (err) {
  //   next({
  //     message: err.message
  //   })
  // }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Accounts.getById(req.params.id)
    if(!account) {
      next({
        status: 404,
        message: `account not found`
      })
    } else {
      req.account = account
      next()
    }
  } catch (err) {
    next(err)
  }
}