const { response } = require('express');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    // console.log(req.body);
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'The email already exists in the database.'
            });
        }
        user = new User(req.body);
        // Encrypt Password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        await user.save();
        // Generate JWT
        const token = await generateJWT(user.id, user.name);
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact the administrator.'
        })
    }
};


const userLogin = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'The email does not exist in the databse.'
            });
        }
        // Password match
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrect'
            });
        }
        // Generate JWT
        const token = await generateJWT(user.id, user.name);
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact the administrator.'
        })
    }
}

const renewToken = async(req, res = response) => {

    const {uid, name} = req;
    // Generate a new JWT and return it
    const token = await generateJWT(uid, name);
    res.json({
        ok: true,
        token
    })
}


module.exports = {
    createUser,
    userLogin,
    renewToken
}