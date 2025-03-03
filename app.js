// setup.. this is similar to when we use our default tags in html
const express =  require("express");
// we have to use cors in order to host a front end and backend on the same device
var cors = require('cors')

const bodyParser = require('body-parser')
const jwt = require('jwt-simple')
const User = require("./models/users")
const Course = require("./models/course")
const app = express();
app.use(cors());

app.use(express.json())
const router = express.Router();
const secret = "supersecret"

// Creting a new user
router.post("/user", async (req, res) =>{
   if(!req.body.username || !req.body.password){
      res.status(400).json({error: "Missing username or paswword."})
   }

   const newUser = await new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
      status: req.body.status
   })

   try{
      await newUser.save()
      console.log(newUser)
      res.status(201).json(newUser)
   }
   catch(err){
      res.status(400).send(err)
   }
})

router.post("/auth", async(req, res) =>{
   if(!req.body.username || !req.body.password){
      res.status(400).json({error: "Missing username or password"})
      return
   }
   // try to find username in DB, then see if it matches with a un and pw
   // await finding a user
   let user = await User.findOne({username : req.body.username})
      // connection or server error
   // can't find user
   if(!user){
      res.status(401).json({error: "Bad username"})
   }
      // check to see it the user's pw match the pw in the DB
   else{
      if(user.password != req.body.password){
         res.status(401).json({error: "Bad password"})
      }
         // successful login
      else{
            // create a token that is encoded with the jwt library and send back the username
            // will also send back as part of the token that your are currently authorized
            
         username2 = user.username
         role2 = user.role
         const token = jwt.encode({username: user.username, role: user.role}, secret)
         const auth = 1

         //respond with the token
         res.json({
            username2,
            role2,
            token:token,
            auth:auth
         })

      }
   }
})

// check status of user with a valid token to see if it matches the front end token
router.get("/status", async(req, res) =>{
   if(!req.headers["x-auth"]){
      return res.status(401).json({error: "missing X-Auth"})
   }

   // if x-auth contains token
   const token = req.headers["x-auth"]
   try{
      const decoded = jwt.decode(token,secret)

      // send back all username and status fields to the suer/frontend
      let users = User.find({}, "username status")
      res.json(users)
   }
   catch(ex){
      res.status(401).json({error: "invalid jwt token"})
   }
})


// Grab all courses
router.get("/courses", async(req,res) =>{
   try{
      const courses = await Course.find({})
      res.send(courses)
      console.log(courses)
   }
   catch (err){
      console.log(err)
   }
})

// Get course by id
router.get("/courses/:id", async (req, res) => {
    try{
       const courses = await Course.findById(req.params.id)
       res.json(courses)
    }
    catch(err){
       res.status(400).send(err)
    }
 })

// Create a new course
router.post("/courses", async(req,res) =>{
    try{
       const courses = await new Course(req.body)
       await courses.save()
       res.status(201).json(courses)
       console.log(courses)
    }
    catch(err){
       res.status(400).send(err)
    }
 })

 router.put("/courses/:id", async(req, res) =>{
   try{
      const course = req.body
      await Course.updateOne({_id: req.params.id},course)  
      console.log(course)
      res.sendStatus(204)
   }
   catch(err){
      res.status(400).send(err)  
   }
})

router.delete("/courses/:id", async(req, res) =>{
   try{
      await Course.deleteOne({_id: req.params.id})
   }
   catch(err){
      res.status(400).send(err)
   }
   
})



 app.use("/api", router);
app.listen(3000);