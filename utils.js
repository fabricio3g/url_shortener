
const  connectToDb = ( mongoose, ShortURL ) =>{
   mongoose.connect(process.env.MONGOURI, {useNewUrlParser: true, useUnifiedTopology:true})

   const db = mongoose.connection;
   db.on('error', console.error.bind(console, 'connection error:'));
   db.once('open', async function() {
   
      console.log('We are connected to the database')
   });
}



module.exports = connectToDb
