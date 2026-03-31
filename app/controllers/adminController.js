const Admin = require('../models/admin')

const {userRegisterSchemaValidation} = require('../utils/SchemaValidation')

class Admincontroller{
  
  userRegisterview(req,res){
    res.render('admin/user_register',{
      title: "User Registration Page"
    })
  }

  async userRegister(req, res) {
    try {
      const { name, email, about } = req.body;
      if (!name || !email || !about) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const user = await Admin.findOne({ email });
      if (user) {
        return res.status(401).json({
          success: false,
          message: "User already exists",
        });
      }

      const userData = {
        name,
        email,
        about,
      };

      const {error, value} = userRegisterSchemaValidation.validate(userData)
      if(error){
        console.log('error: Schema validation failed')
        return res.redirect('/register-view')
      }
      const data = new Admin(value);
      await data.save();

      return res.redirect('/products/dashboard')
      // return res.status(201).json({
      //   success: true,
      //   message: "User registered successfully",
      //   user: saved,
      // });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}



module.exports = new Admincontroller;