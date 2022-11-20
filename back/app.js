const express  =  require ('express')

//access environment variables
require("dotenv").config();

//require the database connection
require("./mongodb");
const app  =  express ()
app.listen ( 3000 ,  ()  =>  console.log( 'Server is running on port 3000'))

//require the routes
const indexRoutes  =  require ( './routes/index.routes' )
const authRoutes  =  require ( './routes/auth.routes' )

//define the routes
app.use ( '/' , indexRoutes)
app.use ( '/auth' , authRoutes)

module.exports  =  app


