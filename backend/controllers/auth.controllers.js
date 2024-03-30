import User from '../Models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const Jwt_secret = 'JGVHGFFFG&&JHG';




//  CODE TO SIGNUP NEW USER STARTS  //
export const signup = async(req,res) => {
    try{
        const {username,number,password} = req.body;
        const hash = await bcrypt.hash(password, 10);
        const userNumber = await User.findOne({number:number});

        if(userNumber){
            res.status(400).json({message: 'number already exists'});
        }

        else{
            const result = await User.create({username,number,password:hash,profilepic: `https://avatar.iran.liara.run/public?username=${username}`});
            res.json({message: 'user registered successfully'});
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Internal server error'});
    }
};
//  CODE TO SIGNUP NEW USER ENDS  //






// CODE TO LOGIN USER & GET JWT TOKEN  STARTS //
export const login =  async (req, res) => {
    try {
        const { number, password } = req.body;
        const user = await User.findOne({ number: number });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'No record existed' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ _id: user._id }, Jwt_secret);
            const { _id, username, number, profilepic } = user;

            return res.status(200).json({ status: 'success', message: 'Login successful', token, user: { _id, username, number, profilepic } });
        } else {
            return res.status(401).json({ status: 'error', message: 'Password is incorrect' });
        }
    } catch (err) {
        return res.status(500).json({ status: 'error', message: err.message });
    }
};
// CODE TO LOGIN USER & GET JWT TOKEN  ENDS //






// CODE TO GET OTHER USER DETAILS STARTS //
export const userDetail = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findOne({ _id: userId }).select('-password');
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
    } catch (err) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  };
// CODE TO GET OTHER USER DETAILS ENDS //
  