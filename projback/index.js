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
  project : "60b82acacad91a4604502c8b",  //_id if the project
  member : "60b82b5d7f24f91b845e3474" , // _id of the string
  heading : "Task 1", // heading of the task
  description : "This is a task description, pleaase do the task on time", // description of the task
  assigned : "21/5/21", // assigned date
  deadline : "21/6/21", // deadline
  urgent : false // urgency of the task.

}

const task2 = {
  type : "task", //type of schema
  project : "60b82acacad91a4604502c8b",  //_id if the project
  member : "60b82b5d7f24f91b845e3473" , // _id of the string
  heading : "Task 2", // heading of the task
  description : "This is a task description, pleaase do the task on time", // description of the task
  assigned : "21/5/21", // assigned date
  deadline : "21/6/21", // deadline
  urgent : false // urgency of the task.

}

const task3 = {
  type : "task", //type of schema
  project : "60b82acdcad91a4604502c8c",  //_id if the project
  member : "60b82b5d7f24f91b845e3475" , // _id of the string
  heading : "Task 3", // heading of the task
  description : "This is a task description, pleaase do the task on time", // description of the task
  assigned : "21/5/21", // assigned date
  deadline : "21/6/21", // deadline
  urgent : false // urgency of the task.

}

const member1 = {
  type : "member", // type of addition
  project : "60b82acacad91a4604502c8b", //project id
  name : "Diana",  // name of member
  // working : [projectSchema],
  email : "testemail@test.com", // email of member
  tasks : [], // tasks of member
  role : "design",  // role of member
  special : "this is special text",  // special note about the member
}

const member2 = {
  type : "member", // type of addition
  project : "60b82acacad91a4604502c8b", //project id
  name : "John",  // name of member
  // working : [projectSchema],
  email : "testemail@test.com", // email of member
  tasks : [], // tasks of member
  role : "design",  // role of member
  special : "this is special text",  // special note about the member
}
const member3 = {
  type : "member", // type of addition
  project : "60b82acdcad91a4604502c8c", //project id
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
    
    // console.log(project);
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
    // console.log(project[0].members)
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
  console.log(obj)
  Project.find({_id : obj.project} , function(err, project){
    project[0].checkpoints.push(obj.checkpoint);
    project[0].save();
  } )
}

function AddCheckPoints(){
  let list = [
    "This is task 1 , you have to do it",
    "this is task 2 , you have to do it",
    "this is Task 3 , you have to do it"
  ]
  Project.find({} , function(err , projects){
    projects.forEach((project)=>{
      list.forEach((item)=>{
        console.log(project.checkpoints)
        project.checkpoints.push(item);
        console.log(item)
        
      })
      project.save()
    })
    

    
    
  })
  console.log("done")

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

app.post("/data/:type" , function(req , res ){
  
  const data = req.body.data;
  const type = req.params.type;
  console.log("req to /data")
  console.log(req.params)

  if(type == "member"){
    saveNewMember(data)
  }else if(type == "project"){
    saveNewProject(data)
  }else if(type == "task"){
    saveNewTask(data)
  }else if(type == "checkpoint"){
    saveNewCheckpoint(data);
  }
  
})

app.get("/projects" , function(req , res){
  console.log("request made to /project" + req.body);
  var list = [];
  Project.find({} , function(err , project){
  
    project.forEach((proj)=>{
      
      const stuff = {
        name : proj.name,
        org : proj.org,
        status : proj.status,
        _id : proj._id
        
      }
      
      list.push(stuff);
      

    })
    res.send(list)
    
  })
  
  


})

app.get("/members/:id" , function(req , res){
  console.log("GET request to /members")
  
  const _id = req.params.id

  var list = []
  Project.find({_id : _id} , function(err , project){
    if(err){
      console.log(err);
    }else{
      const link = project[0].link
      const checkpoints = project[0].checkpoints;
      console.log(checkpoints)
      project[0].members.forEach((member)=>{
        const stuff = {
          name : member.name,
          role : member.role,
          email : member.email,
          _id : member._id
        }
        list.push(stuff)
      })
      res.send({list : list , link : link , checkpoints : checkpoints});
    }
  })

})

app.get("/checkpoints" , function(req, res){
  console.log("request made to /checkpints" + req);
})

app.get("/tasks/:project/:member" , function(req , res){
  console.log("request made to /tasks");
  console.log(req.params)
  const toSend = []
  Project.find({_id : req.params.project} , function(err , projects){
    projects[0].members.forEach((member)=>{
      if(member._id == req.params.member){
          member.tasks.forEach((task)=>{
            const stuff = {
              heading : task.heading,
              description : task.description,
              assigned : task.assigned,
              deadline : task.deadline,
              urgent : task.urgent
            }
            toSend.push(stuff);
          })
      }
    })
    res.send(toSend);
    console.log(toSend)
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



// AddCheckPoints()