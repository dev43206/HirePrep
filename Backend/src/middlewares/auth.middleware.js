const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function authUser(req,res,next){
    const tokenFromCookie = req.cookies?.token
    const tokenFromHeader = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null
    const token = tokenFromCookie || tokenFromHeader

    if(!token){
        return res.status(401).json({
            message: "Token not provided"
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Token is invalid"
        }) 
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = {authUser}