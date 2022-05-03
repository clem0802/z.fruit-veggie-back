// const knex = require('knex');
// const config = require("./knexfile"); // this file does many configurations for the database
// const db = knex(config.development);
const db = require('./dbConfig');

// (1) (USERS table)
/*---------------------"CREATE"---------------------*/
async function addUser(user){
    // await db('users').insert(user) // commented for DEPLOY
    // return db('users').where({username:user.username}) // commented for DEPLOY
    // check if this "1st username" === created "user.username" and return back to me
    return await db('users').insert(user,['id','username','imageUrl'])
}
/*---------------------"GET"---------------------*/
function getAllUsers(){
    return db("users") // db is my whole database, there is also "contents", but here only want "users"
    .orderBy("id","desc") // so the latest registered users will be on the top of the page: id10, id9, id8 ... id1
}
/*---------------------"GET"---------------------*/
function findUserByUsername(username){
    return db('users')
    .where({username:username})
    .first() // .first() stops when finds it
}
/*---------------------"GET"---------------------*/
function findUserById(id){
    return db('users')
    .where({id:id})
    .first() // .first() stops when finds it
}
/*---------------------"DELETE"---------------------*/
function removeUser(id){
    return db('users')
    .where({id:id}) // "users" table
    .del() 
}
/*---------------------"PATCH-user"---------------------*/
function updateUser(id,newUser){ // newUser === REQ.BODY
    return db("users")
    .where({id:id})
    .update(newUser) // send the new info
}
/*---------------------"JOIN => to COMBINE 2 tables"---------------------*/
// without this JOIN table, we will have to make 2 API calls
function getUserContents (user_id){
    return db("users") // => JOIN "users" table with "contents" table
    .join(  // ("table joined", "which column of users table", "connection point")
        "contents", 
        "users.id", 
        "contents.user_id") 
    .select(  // SELECT what to show of each table + RENAME the columns
        "users.id as UserId", 
        "users.imageUrl as UserImage", 
        "contents.id as ContentId", 
        "contents.title as ContentTitle") 
    .where({user_id:user_id}) // (1st => id from REQ.PARAMS) vs (2nd => user_id inside contents)
}


// (2) (CONTENTS table)
/*---------------------"GET"---------------------*/
function getAllContents(){
    return db('contents')
    .orderBy("title")
}
/*---------------------"CREATE"---------------------*/
async function addContent(newContent,user_id){
    await db("contents")
    .where({user_id:user_id}) // then it's correct, then insert
    .insert(newContent,['id']) // ['id']   added for DEPLOY
}
/*---------------------"DELETE"---------------------*/
function removeContent(id){
    return db("contents")
    .where({id:id})  // id === id
    .del()
}
/*---------------------"PATCH"---------------------*/
function updateContent(id,newContent){ // newContent === REQ.BODY
    return db("contents")
    .where({id:id})
    .update(newContent) // send the new info
}
/*---------------------"GET" (GROUP BY)---------------------*/
// the same "title" fruggies will not repeat but show only ONCE
// "COUNT()" will show how many times the fruggie has been used-created, the MOST WRITTEN ones
// "SELECT()", the output will be much shorter, only the columns we need
function groupContents(){
    return db('contents').count()
    .groupBy("title")
    .select(
        "contents.id",
        "contents.title"
    )
}
/*---------------------"GET" (for contentdetails PAGE))---------------------*/
function findContentByTitle(title){
    return db('contents')
    .where({title:title})
    .first() // .first() stops when finds it
}
/*---------------------"GET only fruit"---------------------*/
function getOnlyFruits(){
    return db("contents")
    .where({category:fruit})  // category === fruit
    .orderBy("title")
}
/*---------------------"GET only veggie"---------------------*/
function getOnlyVeggies(){
    return db("contents")
    .where({category:veggie})  // category === fruit
    .orderBy("title")
}


/*----------------------------------------------------------*/
// when functions are "exported", then we can use them in "index.js"
module.exports = {
    addUser,
    getAllUsers,
    findUserByUsername,
    findUserById,
    removeUser,
    updateUser,
    getUserContents,
    getAllContents, // (all fruggies)
    addContent,
    removeContent,
    updateContent,
    groupContents,
    findContentByTitle,
    getOnlyFruits, // (only fruit)
    getOnlyVeggies // (only veggie)
}