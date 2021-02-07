require('dotenv').config()

module.exports = {
    'secretKey': '12345-67890-98765-43210',
    'mongoUrl': 'mongodb://localhost:27017/conFusion',
    'facebook': {
        clientId: process.env.APPID,
        clientSecret: process.env.APPSECRET
    }
}