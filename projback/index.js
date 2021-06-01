const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {spawn} = require("child_process")
const {makeCopy , deleteFile} = require("./makeCopy.js")





mongoose.connect("mongodb://localhost:27017/projmanDB" , { useNewUrlParser: true  , useUnifiedTopology: true });


const taskSchema = new mongoose.Schema({
  type : String, //type of schema
  project : String,  //_id if the project
  member : String , // _id of the string
  heading : String, // heading of the task
  description : String, // description of the task
  assigned : String, // assigned date
  deadline : String, // deadline
  urgent : Boolean // urgency of the task.
})

const memberSchema = new mongoose.Schema({
  type : String, // type of addition
  project : String, //project id
  name : String,  // name of member
  // working : [projectSchema],
  email : String, // email of member
  tasks : [taskSchema], // tasks of member
  role : String,  // role of member
  special : String,  // special note about the member
})


const projectSchema = new mongoose.Schema({
  type : String, // type of addition
  name : String, //name of project
  org : String, // organization
  link : String, // link to sheet
  start : String, // start date
  deadline : String, // deadline
  members : [memberSchema], // member
  checkpoints : [String], // lis of checkpints
  special : [String], // list of special notes
  status : String, // status of the project
  
})

const task1 = {
  type : "task", //type of schema
  project : "60b4b4766678935ba0bed0ac",  //_id if the project
  member : "60b4b673af3ac73c8cb623ef" , // _id of the string
  heading : "Task 1", // heading of the task
  description : "This is a task description, pleaase do the task on time", // description of the task
  assigned : "21/5/21", // assigned date
  deadline : "21/6/21", // deadline
  urgent : false // urgency of the task.

}

const task2 = {
  type : "task", //type of schema
  project : "60b4b4766678935ba0bed0ac",  //_id if the project
  member : "60b4b673af3ac73c8cb623ef" , // _id of the string
  heading : "Task 2", // heading of the task
  description : "This is a task description, pleaase do the task on time", // description of the task
  assigned : "21/5/21", // assigned date
  deadline : "21/6/21", // deadline
  urgent : false // urgency of the task.

}

const task3 = {
  type : "task", //type of schema
  project : "60b4b4766678935ba0bed0ab",  //_id if the project
  member : "60b5a508ca41dc27b87182d0" , // _id of the string
  heading : "Task 3", // heading of the task
  description : "This is a task description, pleaase do the task on time", // description of the task
  assigned : "21/5/21", // assigned date
  deadline : "21/6/21", // deadline
  urgent : false // urgency of the task.

}

const member1 = {
  type : "member", // type of addition
  project : "60b4b4766678935ba0bed0ac", //project id
  name : "Diana",  // name of member
  // working : [projectSchema],
  email : "testemail@test.com", // email of member
  tasks : [], // tasks of member
  role : "design",  // role of member
  special : "this is special text",  // special note about the member
}

const member2 = {
  type : "member", // type of addition
  project : "60b4b4766678935ba0bed0ac", //project id
  name : "John",  // name of member
  // working : [projectSchema],
  email : "testemail@test.com", // email of member
  tasks : [], // tasks of member
  role : "design",  // role of member
  special : "this is special text",  // special note about the member
}
const member3 = {
  type : "member", // type of addition
  project : "60b4b4766678935ba0bed0ab", //project id
  name : "Morgan",  // name of member
  // working : [projectSchema],
  email : "testemail@test.com", // email of member
  tasks : [], // tasks of member
  role : "design",  // role of member
  special : "this is special text",  // special note about the member
}



const project1 = {
  type : "project", // type of addition
  name : "ABC", //name of project
  org : "abc.org", // organization
  link : "", // link to sheet
  start : "21/4/21", // start date
  deadline : "21/5/21", // deadline
  members : [], // member
  checkpoints : [], // lis of checkpints
  special : [], // list of special notes
  status : "ongoing", // status of the project
  
}

const project2 = {
  type : "project", // type of addition
  name : "XYZ", //name of project
  org : "xyz.org", // organization
  link : "", // link to sheet
  start : "21/4/21", // start date
  deadline : "21/5/21", // deadline
  members : [], // member
  checkpoints : [], // lis of checkpints
  special : [], // list of special notes
  status : "ongoing", // status of the project
}



const Project = new mongoose.model("Project" , projectSchema);
const Member = new mongoose.model("Member"  , memberSchema )
const Task = new mongoose.model("Task" , taskSchema);



  function   getNewSheetLink(){
  const link = makeCopy();
  return link;
}

async function saveNewProject(obj){
  try{
    const link = await getNewSheetLink();

    const project =  new Project({
      type : obj.type,
      name : obj.name,
      org : obj.org,
      link : link,
      start : obj.start,
      deadline : obj.deadline,
      members : obj.members,
      checkpoints : obj.checkpoints,
      special : obj.special,
      status : obj.status,
    });
    
    
    project.save();
  }catch(err){
    console.log("error hai");

    console.log(err);
  }
  
}
 
function saveNewMember(obj){
  const member = new Member(obj);
  AddMemberToProject(member , obj);

}

function AddMemberToProject(member , obj){
  Project.find({_id : obj.project} , function(err, project){
    console.log(project[0].members);
    project[0].members.push(member);
    project[0].save();
  } )
}

function saveNewTask(obj){
  const task = new Task(obj);
  
  AddTaskToMember(task  , obj);
}

function AddTaskToMember(task , obj){
  Project.find({_id : obj.project} , function(err, project){
    
    project[0].members.forEach((member)=>{
      
      if (member._id == obj.member){
        
        member.tasks.push(task)
      }
    })
    project[0].save();
    console.log("added " , task);
  } )
}

function saveNewCheckpoint(obj){
  Project.find({_id : obj.project} , function(err, project){
    project[0].checkpoints.push(obj.checkpoint);
    project[0].save();
  } )
}


// saveNewProject(project1)
// saveNewProject(project2)

// saveNewMember(member1)
// saveNewMember(member2)
// saveNewMember(member3)

// saveNewTask(task1)
// saveNewTask(task2)
// saveNewTask(task3)



const app = express()
const port = 9000

app.use(bodyParser.json());
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.get("/api" , function(req , res){
    res.send( "The API is now connected");
})

app.post("/data" , function(req , res ){
  console.log(req.body.data);
  const data = req.body.data;

  if(data.type == "member"){
    saveNewMember(data)
  }else if(data.type == "project"){
    saveNewProject(data)
  }else if(data.type == "task"){
    saveNewTask(data)
  }else if(data.type == "checkpoint"){
    saveNewCheckpoint(data);
  }
  
})

app.get("/projects" , function(req , res){

})

app.get("/members" , function(req , res){

})

app.get("/checkpoints" , function(req, res){

})

app.get("/tasks" , function(req , res){

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})