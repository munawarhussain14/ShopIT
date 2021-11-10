const mongoose  = require("mongoose");

const contactDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con=>{
        console.log(`Mongodb Database connected with Host ${con.connection.host}`);
    });
}

module.exports = contactDatabase;