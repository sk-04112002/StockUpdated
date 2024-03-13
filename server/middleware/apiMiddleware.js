require('dotenv').config();

const apiMiddleware = (req,res,next) => {

    const providedKey = req.headers.authorization;
    
    if (
      !providedKey ||
      providedKey !== `Bearer ${process.env.API_KEY}`
    ) {
      res.status(500).send("Unauthorized");
    }
    next()
}
module.exports = apiMiddleware;