const yup = require('yup')
const Accounts = require('./accounts-model')

// const accountSchema = yup.object({
//   name: yup.string(`name of account must be a string`)
//     .trim()
//     .min(3, `name of account must be between 3 and 100`)
//     .max(100, `name of account must be between 3 and 100`)
//     .required(`name and budget are required`),
//   budget: yup.number(`budget of account must be a number`)
//     // .trim()
//     .positive(`budget of account is too large or too small`)
//     .max(1000000, `budget of account is too large or too small`)
//     .required(`name and budget are required`)
// })

exports.checkAccountPayload = (req, res, next) => {
  // try {
  //   const validated = await accountSchema.validate(req.body, {
  //     stripUnknown: true
  //   })
  //   req.body = validated
  //   next()
  // } catch(err) {
  //   next({
  //     status: 400,
  //     message: err.message
  //   })
  // }
  const {name,budget} = req.body
  try {
    if (!name || !budget) {
      res.status(400).json({ message: "name and budget are required" });
    } else if (typeof name !== "string") {
      res.status(400).json({ message: "name of account must be a string" });
    } else if (name.trim().length() < 3 || name.trim().length() > 100) {
      res
        .status(400)
        .json({ message: "name of account must be between 3 and 100" });
    } else if (typeof budget !== "number") {
      res.status(400).json({ message: "budget of account must be a number" });
    } else if (budget < 0 || budget > 1000000) {
      res
        .status(400)
        .json({ message: "budget of account is too large or too small" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

// exports.checkAccountNameUnique = async (req, res, next) => {
//   try {
//     const accounts = await db.getAll()
//     accounts.filter(account => {
//       if (account.name === req.body.name.trim) {
//         res.status(400).json({
//           message: `that name is taken`
//         })
//       } else {
//         return account
//       }
//     })
//   } catch (err) {
//     next({
//       message: err.message
//     })
//   }
// }

// exports.checkAccountId = async (req, res, next) => {
//   try {
//     const accountId = await Accounts.getById(req.params.id)
//     if(!accountId) {
//       next({
//         status: 404,
//         message: 'account not found'
//       })
//     } else {
//       req.accountId = accountId
//       next()
//     }
//   } catch(err) {
//     next(err)
//   }
// }

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const account = await Accounts.getByName(req.body.name.trim());
    if (account) {
      res.status(400).json({ message: "that name is taken" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

exports.checkAccountId = async (req, res, next) => {
  const id = req.params.id;

  try {
    const account = await Accounts.getById(id);
    if (!account) {
      res.status(404).json({ message: "account not found" });
    } else {
      req.account = account;
      next();
    }
  } catch (err) {
    next(err);
  }
};