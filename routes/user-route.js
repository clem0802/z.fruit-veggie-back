/*-------------------------------------------*/
// (USERS table) ROUTES:
// without this route, it will be "Cannot GET /" on the webpage
// when we get the request, we send the response in a specific format: JSON
// the "users" string msg below should be connected to the database, 
// and get the information from database, when a user hits this endpoint, that function will work
// we will tell that function what to do later on
const express = require("express");
const bcrypt = require('bcryptjs');
const Fruggies = require('../dbHelpers'); // this imports the WHOLE file
const router = express.Router(); // this creates a route for me


/*---------------(1)(GET-ALL)---------------*/
router.get('/users',(req,res)=>{
    Fruggies.getAllUsers()
    .then(users=>{ // promise => "users" is what we GET from this function
        res.status(200).json(users) // if runs successfully, it gives me this info
        // {message:"Let's jump hard at the users!"}  on localhost:8000/users
        // {message:"Let's jump hard at the USERS!"} replaced by "users"
    })
    .catch(error=>{
        res.status(500).json({message:"Cannot get the users"})
    }) 
})

/*---------------(2)(POST-REGISTER)---------------*/
router.post('/users/register',(req,res)=>{  // the URL is a SERVER
    console.log(req.body)

    const credentials = req.body; // req.body => has my password and username in it
    const {username,password} = credentials; // want to extract them separately from creditials
    if(!(username && password)){
        return res.status(400).json({message:"Username and password required."})
    }

    const hash = bcrypt.hashSync(credentials.password,12) // will run 12 times
    credentials.password = hash;

    Fruggies.addUser(credentials) // now send req.body to func addUser, and it sends back to .then()
                                 // and I will grab this info and send it to frontEnd(client)
    .then(user=>{
        res.status(200).json(user) // frontEnd can have the whole "user" info back
    })
    .catch(error=>res.status(500).json(error))
})

/*---------------(3)(POST-LOGIN)---------------*/
router.post('/users/login',(req,res)=>{
    const {username,password} = req.body;
    Fruggies.findUserByUsername(username,password)
    .then(user=>{
        if(user && bcrypt.compareSync(password,user.password)){ // => (oroginal mdp, hashed mdp)
            res.status(200).json(user)
        } else{
            res.status(404).json({message:"User does not exist"})
        }
    })
    .catch(error=>{
        // res.status(500).json(error)
        // below added 2022.05.05 (elif)
        if(error.errno === 19){
            resstatus(400).json({message:"Username already exists."})
        } else {
            res.status(500).json(error)
        }
    })
})

/*---------------(4)(GET)---------------*/ 
router.get('/users/:username',(req,res)=>{  // a URL that changes dynamically
    const {username} = req.params
    Fruggies.findUserByUsername(username)
    .then(user=>{
        if(user){
            res.status(200).json(user)
        } else{
            res.status(404).json({message:"User does not exist, NO GET"})
        }
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})  

/*---------------(5)(DELETE)---------------*/ 
router.delete("/users/:id",(req,res)=>{
    const {id} = req.params; // get the whole thing from the URL
    Fruggies.removeUser(id)
    .then(count=>{
        if(count > 0){
            res.status(200).json({message:"User is deleted"})
        } else{
            res.status(404).json({message:"No user with that id"})
        }
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})

/*---------------(6)(UPDATE-user)(by cléms)(BACK-5)---------------*/
// "patch" updates only the one I send, ie only update the "username"
// "put" I will have to send the whole data, not just "title", but WHOLE DATA OBJECT
router.patch("/users/:id",(req,res)=>{
    const {id} = req.params;
    Fruggies.updateUser(id,req.body) // REQ.BODY is the "new info" that will replace the old one
    .then(user=>{ // user sent back to me
        res.status(200).json({user})
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})

/*---------------(7)(GET-get all contents created by one user)(BACK-5)---------------*/ 
router.get('/users/:id/contents',(req,res)=>{ 
    const {id} = req.params;
    Fruggies.getUserContents(id)
    .then(contents=>{
        res.status(200).json(contents)
    })
    .catch(error=>{
        res.status(500).json({message:"Cannot get contents"})
    })
})


module.exports = router;