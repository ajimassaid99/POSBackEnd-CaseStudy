const User = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const {getToken} = require('../../utils');

const register = async(req,res,next)=>{
    try{
        const payload = req.body;
        let user = new User(payload);
        await user.save();
        return res.json(user);
    }catch(err){
        if(err && err.name === 'ValidationError'){
            return res.json({
                error:1,
                massage: err.massage,
                fields: err.errors
            });
        }
        next(err);
    }
}

const localStrategy = async (email,password,done)=>{
    try{
        let user =
        await User.findOne({email})
        .select('-__v -createdAt -updatedAt -cart_items -token');

        if(!user) return done();
        if (bcrypt.compareSync(password, user.password)) {
            const { password: _, ...userWithoutPassword } = user.toObject();
            return done(null, userWithoutPassword);
        }
        
    }catch(err){
        done(err,null);
    }
    done();
}

const login= (req,res,next)=>{
    return passport.authenticate('local', async function(err,user){
        if(err) return next(err);
        if(!user)return res.json({error:1,massage:'Email or Passport Salah'});

        try {
            let signed = await new Promise((resolve, reject) => {
                jwt.sign(user, config.secretKey, function(err, token) {
                    if (err) reject(err);
                    resolve(token);
                });
            });

            await User.findByIdAndUpdate(user._id,{$push:{token:signed}});

            return res.json({
                massage:'Login Successfully',
                user,
                token:signed
            });

        } catch (err) {
            return next(err);
        }
    })(req, res, next);
}

const logout = async (req,res,next)=>{
    let token = getToken(req);

    let user = await User.findOneAndUpdate({token: {$in:[token]}},{$pull:{token:token}}, {useFindAndModify:false});

    if(!token||!user){
        res.json({
            error:1,
            message:'No User Found!!'
        });
    }
    return res.json({
        error:0,
        message:'LogOut Berhasil'
    });
}

const me = (req,res,next)=>{
    if(!req.user){
        res.json({
            err:1,
            message:"You're Not Login or Token Failed"
        })
    }
    res.json(req.user);
}

module.exports = {
    register,
    localStrategy,
    login,
    logout,
    me
}