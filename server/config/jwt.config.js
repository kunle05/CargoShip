const jwt = require("jsonwebtoken");

module.exports = {
    base: (req, res, next) => {
        var SECRET;
        var level = req.params.level;
        // if(req.method == 'GET') level = req.params.level;
        // if(req.method == 'POST') level = req.body.level;

        switch(level) {
            case '3':
            case 3:
                SECRET = process.env.SECRET_KEY_ASST;
                break;
            case '5':
            case 5:
                SECRET = process.env.SECRET_KEY_ADMIN;
                break;
            default:
                SECRET = process.env.SECRET_KEY_ONE;
        }
        jwt.verify(req.cookies._usl_sign, SECRET, (err, payload) => {
            if (err) { 
                res.status(401).json({verified: false});
            } else {
                next();
            }
        });
    },
    asst: (req, res, next) => {
        var SECRET;
        var level = req.params.level;
        // if(req.method == 'GET') level = req.params.level;
        // if(req.method == 'POST') level = req.body.level

        switch(level) {
            case '5':
                SECRET = process.env.SECRET_KEY_ADMIN;
                break;
            default:
                SECRET = process.env.SECRET_KEY_ASST;
        }
        jwt.verify(req.cookies._usl_sign, SECRET, (err, payload) => {
            if (err) { 
                res.status(401).json({verified: false});
            } else {
                next();
            }
        });
    },
    admin: (req, res, next) => {
        const SECRET = process.env.SECRET_KEY_ADMIN;
        jwt.verify(req.cookies._usl_sign, SECRET, (err, payload) => {
            if (err) { 
                res.status(401).json({verified: false});
            } else {
                next();
            }
        });
    }
}