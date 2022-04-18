// we use knex.migration to create our tables
// "users" table is, the parent of "contents" table

exports.up = function(knex){
    return knex.schema.createTable('users',(tbl)=>{
        tbl.increments() // id column
        tbl.text('username',120).notNullable().unique().index() // username not longer than 120 letters, not blank
        tbl.text('password',200).notNullable()
        tbl.text('imageUrl').notNullable()
        tbl.timestamps(true,true) // 1st true for created_at, 2nd true for updated_at
    })
    // start with (.) cause content table is the CHILD
    .createTable('contents',(tbl)=>{
        tbl.increments()
        tbl.text('title').notNullable().index() // if .unique() then no user can create an already existed fruggie
        tbl.text('description').notNullable()
        tbl.text('category').notNullable() // mention it is a "fruit" or a "vegetable"
        tbl.text('imageUrl').notNullable()
        tbl.timestamps(true,true)
        // below is Foreign Key and will go to "users" table, and go to its "IDs"
        tbl.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

exports.down = function(knex){
    // if "users" table exists already, just update it
    return knex.schema.dropTableIfExists("users").dropTableIfExists("contents")
};



/*----------------------------------------*/
// exports.up = function(knex) {
  
// };

// exports.down = function(knex) {
  
// };
