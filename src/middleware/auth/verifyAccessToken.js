const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

// function validateToken(req, res, next) {
//     const token = req.headers['authorization'];
//     if(token) {
//         const user = jwt.verify(token, SECRET);
//         req.user = user;
//     } else {
//         res.status(401).send('user is not authorized');
//     }
//     next();
// }

const verifyAccessToken = async (req, res, next ) => {
    // const username = req.body.username;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401);
    jwt.verify(token, SECRET, (error, user) => {
        if(error) return res.status(403);
        req.user = user;
        next();
    });
};


module.exports = verifyAccessToken;
