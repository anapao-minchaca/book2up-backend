const jwt = require('jsonwebtoken');
const User = require("../schemas/usermodel");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // authorization === 'Bearer <token>'

    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in. '});
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in. '});
        }

        const { userId } = payload;

        const user = await User.findById(userId);
        req.user = user;
        next();
    });
}