const jwt = require("jsonwebtoken");

const authenticateJWT = (req: any, res: any, next: any) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null)
        return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next() // pass to next middleware
    })
}

function generateAccessToken(userid: number) {
    return jwt.sign(userid, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

export default { authenticateJWT };