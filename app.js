const express = require('express')
const path = require("path");
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Db
const DatabaseConnect = require('./app/config/dbcon')
DatabaseConnect()

app.use("uploads", express.static(path.join(__dirname, "/uploads")));
app.use('/uploads', express.static('uploads'));

app.use(express.static('public'))

app.use(require('./app/routes/index'))

const port = 5002
app.listen(port, (err)=>{
  if(err){
    console.log(`error: ${err}`)
  }
  console.log(`Server running on port ${port}`)
})