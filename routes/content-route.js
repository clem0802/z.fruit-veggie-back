// (CONTENTS table) ROUTES:
const express = require("express");
const Fruggies = require('../dbHelpers'); // this imports the WHOLE file
const router = express.Router(); // this creates a route for me


/*---------------(1)(GET-ALL)---------------*/
router.get('/contents',(req,res)=>{
    Fruggies.getAllContents() 
    .then(contents=>{
        res.status(200).json(contents)
    })
    .catch(error=>{
        res.status(500).json({message:"Cannot get contents"})
    })
})

/*---------------(2)(POST)---------------*/
router.post('/users/:id/contents',(req,res)=>{ // a content is created by a user, so it can't exist all by itself
     const {id}=req.params; // "user_id" via REQ.PARAMS
     const newContent = req.body; // "title", "description", "category", "imageUrl" are inside REQ.BODY (newContent)
     if(!newContent.user_id){
        newContent["user_id"] = parseInt(id,10) 
        // if there is no "newDContent" (if no "user_id" inside REQ.BODY)
        // then add and convert the "id" into integer & store it in "newContents"
        // now I send this newContent to BACKEND
     }

     Fruggies.findUserById(id)
     .then(user=>{
         if(!user){
             res.status(404).json({message:"User does not exist."})
         }
         if(!newContent.title || !newContent.description){
             res.status(400).json({message: "All fields must be complete."})
         }



    if(newContent.description.length > 170){
    res.status(400).json({message: "Description too long."})
    } 
    


     Fruggies.addContent(newContent,id)
     .then(content=>{  // send it to Front
         res.status(200).json(content)
     })
     .catch(error=>{
         res.status(500).json({message: "Server failed"})
     }) 
   })
})

/*---------------(3)(DELETE)---------------*/
router.delete("/contents/:id",(req,res)=>{
    const {id} = req.params;
    Fruggies.removeContent(id)
    .then(count=>{
        if(count>0){
            res.status(200).json({message: "Content is deleted"})
        } else{
            res.status(404).json({message: "No Content with that id"})
        }
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})

/*---------------(4)(UPDATE)---------------*/
// "patch" updates only the one I send, ie only update the "title"
// "put" I will have to send the whole data, not just "title", but WHOLE DATA OBJECT
router.patch("/contents/:id",(req,res)=>{
    const {id} = req.params;
    Fruggies.updateContent(id,req.body) // REQ.BODY is the "new info" that will replace the old one
    .then(content=>{ // content sent back to me
        res.status(200).json({message:"Content updated"})
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})

/*---------------(5)(GROUP BY)---------------*/
router.get('/contentNumbers',(req,res)=>{
    Fruggies.groupContents()
    .then(content=>{ // content sent back to me
        res.status(200).json(content)
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})

/*---------------(6)(GET)(for contentdetails PAGE)---------------*/ 
// router.get('contentdetails/contents/:id',(req,res)=>{  // a URL that changes dynamically
//     const {id} = req.params
//     Fruggies.findContentByTitle(id,req.body)
//     .then(content=>{
//             res.status(200).json(content)
//     })
//     .catch(error=>{
//         res.status(500).json(error)
//     })
 

router.get('/contentdetails/:title',(req,res)=>{  // a URL that changes dynamically
    const {title} = req.params
    const {id} = req.params //
    Fruggies.findContentByTitle(title,id)
    .then(title=>{
        if(title){
            res.status(200).json(title)
        } else{
            res.status(404).json({message:"Content does not exist, NO GET"})
        }
    })
    .catch(error=>{
        res.status(500).json(error)
    })
})  


module.exports = router;