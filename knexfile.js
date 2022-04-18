// we install knex to be able to write JavaScript
// this is a CONFIG file (for CONFIGURATION)

module.exports = {

  // I tell knex, my client is sqlite3
  // I am using SQLite as my database
  // create a "data" folder and inside it I will create my DATABASE, with "sqlite" as extension
  // "filename": our "database" was named => "dev"
  development: {
      client: 'sqlite3',
      connection: {
          filename: './data/dev.sqlite3'
      },
      useNullAsDefault:true // added, to avoid bugs
  },
  pool:{ // this "pool" is required for "foreign-key" to run properly
    afterCreate:(conn,done)=>{
      conn.run("PRAGMA foreign_keys=ON",done)
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tablename: 'knex_migrations',
      directory: './migrations'
    }
  }
};




// module.exports = {

//   development: {
//     client: 'sqlite3',
//     connection: {
//       filename: './dev.sqlite3'
//     }
//   },

//   staging: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   },

//   production: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }

// };


