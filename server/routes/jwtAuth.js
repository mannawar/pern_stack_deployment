const router = require('express').Router();
const pool = require("../db");
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');
const authorization = require('../middleware/authorization');

//register route
router.post("/register", validInfo,async(req, res) => {
    try {
        //1. destructure the req.body(name, email, password)
        const { name, email, password } = req.body;

        //2. check if user exist, (if exist throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if(user.rows.length !== 0) {
            return res.status(401).json("user already exist");
            ;          
        }
        
        //3. Bcrypt the user password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. Enter the new user inside our database
        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);

        //5 .Generating or jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({token});

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})

//Login route
router.post('/login', validInfo,async (req, res) => {
    try {

        //1. destructure the req.body
        const { email, password } = req.body;

        //2. check if user exist, otherwise throw error
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if(user.rows.length === 0) {
            return res.status(401).json("Email or password is incorrect");
        }
        //3. Check if the incoming password is same as the database password
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if(!validPassword) {
            return res.status(401).json('Email or Password is not correct');
        }

        //4. generate a jwt token
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({ token });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");   
    }
});

router.get("/is-verify", authorization, async(req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error");  
    }
})

module.exports = router;