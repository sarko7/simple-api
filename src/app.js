var express = require('express');
var app = express();
var db = require('./db');
var auth = require('./auth');

app.get('/', (req, res) => {
    res.status(200).json({message:"API is online"})
});

app.get('/students', (req, res) => {
    auth.checkApiKey(req.query?.apiKey, (err, result) => {
        if (err) throw err
        if (result) {
            db.mysqldriver.query("SELECT * FROM students;", (err, result) => {
                if (err) throw err;
                res.status(200).json(JSON.stringify(result))
            });
        } else {
            res.status(401).json({message:"Invalid API Key"})
        }
    });
});

app.post('/student', (req, res) => {
    auth.checkApiKey(req.query?.apiKey, (err, result) => {
        if (err) throw err
        if (result) {
            var { firstname, lastname, dob, isMale } = req.query;
            if (!firstname || !lastname || !dob || !isMale) {
                return res.status(400).json({ error: 'Tous les paramètres sont requis.'});
            };
            db.mysqldriver.query(`INSERT INTO students (\`firstname\`, \`lastname\`, \`dob\`, \`isMale\`) VALUES ('${firstname}', '${lastname}', '${dob}', '${parseInt(isMale)}')`, (err, result) => {
                if (err) {
                    res.status(400).json({message:"Une erreur est survenue"});
                    throw err;
                };
                res.status(201).json({message:"Student was successfully registered"})
            });
        } else {
            res.status(401).json({message:"Invalid API Key"})
        }
    });
});

app.route('/students/:id')
    .get((req, res, next) => {
        auth.checkApiKey(req.query?.apiKey, (err, result) => {
            if (err) throw err
            if (result) {
                const studentId = req.params.id
                db.mysqldriver.query(`SELECT \`firstname\`, \`lastname\`, \`dob\`, \`isMale\` FROM \`students\` WHERE \`id\`=${studentId}`, (err, result) => {
                    if (err) {
                        res.status(400).json({message:"Une erreur est survenue"})
                        throw err
                    };
                    res.status(200).json(JSON.stringify(result[0]))
                });
            } else {
                res.status(401).json({message:"Invalid API Key"})
            }
        });
    })
    .delete((req, res, next) => {
        auth.checkApiKey(req.query?.apiKey, (err, result) => {
            if (err) throw err
            if (result) {
                const studentId = req.params.id
                db.mysqldriver.query(`DELETE FROM \`students\` WHERE \`id\` = ${studentId}`, (err, result) => {
                    if (err) {
                        res.status(400).json({message:"Une erreur est survenue"})
                        throw err
                    };
                    res.status(200).json({message: "Student deleted successfully"})
                });
            } else {
                res.status(401).json({message:"Invalid API Key"})
            }
        });
    });

app.listen(3000, async () => {
    await db.connectDB();
    console.log("API server running");
});
