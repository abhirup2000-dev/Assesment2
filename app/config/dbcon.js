require('dotenv').config()

const mongoose = require('mongoose')

const DATABASE_URL = process.env.DATABASE_URL

const DatabaseConnecting = async (req,res)=>{
  try{
  const connect = await mongoose.connect(DATABASE_URL)
  if(connect){
    console.log('Database Connected')
  }else{
    console.log('Database not Connected')
  }
  }catch(err){
  console.log(err)
  }
}


module.exports = DatabaseConnecting