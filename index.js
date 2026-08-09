const mysql = require('mysql2');
const express=require("express");
const port=8080;
const app=express();
const path=require("path");
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.listen(port,()=>{
  console.log("app is listening");
})
// CJS
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
const { faker } = require('@faker-js/faker');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'backend',
  password:'afa00161'
});


let getRandomUser=()=> {
  return [
     faker.string.uuid(),
     faker.internet.username(),
    faker.internet.email(),
    
  faker.internet.password(),
    
];
}

let data=[];
for(let i=0;i<100;i++){
 
  data.push(getRandomUser());
}

app.get("/",(req,res)=>{
   let q=`select count(*) from user`;
try{
  connection.query(q,(err,result)=>{
    if (err) throw err;
    let count=result[0]["count(*)"];
   res.render("home.ejs",{count});
console.log(result);
});
}
catch(err){
  console.log(err);
}
});
app.get("/show",(req,res)=>{
  let q=`select * from user`;
  try{
    connection.query(q,(err,users)=>{
      if (err) throw err;
      res.render("show.ejs",{users});
    });
  }catch(err){
    console.log(err);
  }
});

app.get("/show/:id/edit",(req,res)=>{
let {id}=req.params;
 let q=` select * from user where id='${id}' `;
 try{
    connection.query(q,(err,users)=>{
      if (err) throw err;
      let user=users[0];
      console.log(users);
      res.render("edit.ejs",{user});
    });
  }catch(err){
    console.log(err);
  }

});
app.patch("/show/:id/",(req,res)=>{
  let {id}=req.params;
 let q=` select * from user where id='${id}' `;
 let {password:formPass,username:newUsername}=req.body;
   try{
    connection.query(q,(err,users)=>{
      if (err) throw err;
      let user=users[0];
      if(formPass!=user.password){
        res.send("wrong password !!");
      }else{
        let q2=" update user set username='${newUsername}' where id='${id}'";
        connection.query(q2,(err,result)=>{
          if (err) throw err;
          res.redirect("/show");
        })
      } 
    });
  }catch(err){
    console.log(err);
  }
});