const validateRateParam = (req, res, next) => {
    const { rate } = req.query
    const rateNumber = parseFloat(rate)

    if (rateNumber < 1 || rateNumber > 5 || !Number.isInteger(rateNumber) ) {
        res.status(400).json({ message: "O campo \"rate\" deve ser um número inteiro entre 1 e 5" })
    } else {
        next()
    }
}

module.exports = {
    validateRateParam,
}