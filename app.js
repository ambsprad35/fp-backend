// setup.. this is similar to when we use our default tags in html
const express =  require("express");
// we have to use cors in order to host a front end and backend on the same device
var cors = require('cors')

const bodyParser = require('body-parser')
const Course = require("./models/course")
const app = express();
app.use(cors());

app.use(express.json())
const router = express.Router();

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