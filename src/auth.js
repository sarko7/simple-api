var db = require('./db')
var generateApiKey = require('generate-api-key').default;
var bcrypt = require('bcrypt')
var dotenv = require('dotenv')
dotenv.config()

var addAdmin = (username, password) => {
    if (!username || typeof(username)!='string' || !password || typeof(password)!='string') {
        throw new Error("Invalid data")
    }
    try {
        bcrypt.hash(password, parseInt(process.env.PWD_HASH_SALT_ROUNDS), async (err, h_pwd) => {
            if (err) throw err
            var newApiKey = generateApiKey({
                method: 'uuidv4',
                dashes:false
            });
            await db.mysqldriver.query(`INSERT INTO \`admins\` (\`username\`, \`password\`, \`apiKey\`) VALUES ('${username}', '${h_pwd}', '${newApiKey}')`)
        })
    } catch (err) {
        throw err
    }
}

var checkApiKey = (apiKey, callback) => {
    try {
        db.mysqldriver.query(`SELECT \`username\` AS uname FROM \`admins\` WHERE \`apiKey\`= "${apiKey}"`, (err, result) => {
            if (err) callback(err, false)
            var linkedName = result[0]?.uname
            if (!linkedName) {
                callback(null, false)
            } else {
                callback(null, true)
            }
        });
    } catch (err) {
        throw err
    }
}

exports.addAdmin = addAdmin
exports.checkApiKey = checkApiKey

