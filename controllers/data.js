require("dotenv").config();

module.exports = {
    testApi: (req, res, next) => {
        return res.json({data: 'working'})
    }
}