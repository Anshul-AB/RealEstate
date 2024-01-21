import pkg from 'express-oauth2-jwt-bearer';
const {auth} = pkg;

const jwtCheck = auth({
    audience: "http://localhost:8000.com",
    issuerBaseURL: "http://dev-4kphirv10nnbh8bt.us.auth0.com",
    tokenSigningAlg:"RS256"
})

export default jwtCheck;