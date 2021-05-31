const express = require('express')
const cors = require('cors')
const shortid = require('shortid')
const mongoose = require('mongoose')
const dns = require('dns')
const app = express()
const ShortURL = require('./models/url')


require('dotenv').config()
app.set('view engine', 'ejs')
app.use(cors())
app.use(express.urlencoded({extended:false}))


// MongoDB Connection
require('./utils')(mongoose, ShortURL)



app.get('/', (req, res)=> {

   res.render('pages/index')

})



// SHORT THE URL

app.post('/api/shorturl', async (req, res)=>{
   const fullBodyUrl = req.body.fullURL

   const validUrl = (str) => {
      let url;
      
      try {
        url = new URL(str);
      } catch (_) {
        return false;  
      }
    
      return url.protocol === "http:" || url.protocol === "https:";
    }

  
   if(!validUrl(fullBodyUrl)){
        return res.send({error: 'invalid url'})
   }

   const short_url = shortid.generate()

   const record = new ShortURL(
      {full: fullBodyUrl, short: short_url}
   )
  
   await record.save()

   res.send({original_url: fullBodyUrl, short_url: short_url })
})

// REDIRECT TO THE ORIGINAL URL


app.get('/api/shorturl/:shortid(*)', async (req ,res)=>{

   
   const dataURL = req.params.shortid
   const rec = await ShortURL.findOne({short: dataURL})
   

   if(dataURL === ''){
      return res.json({error: 'invalid url'})
   }

   const validUrl = (str) => {
      let url;
      
      try {
        url = new URL(str);
      } catch (_) {
        return false;  
      }
    
      return url.protocol === "http:" || url.protocol === "https:";
    }
   

   const redirectToOriginalURL =()=>{
         if(!rec){ res.json({error: 'invalid url'}) }

         res.redirect(301 , rec.full)
   }
      


   const saveDataToDb = async () => {
      const short_url = shortid.generate()
      const record = new ShortURL( {full: dataURL, short: short_url} )
      await record.save()
      res.send({original_url: dataURL, short_url: short_url })
   }


   if(validUrl(dataURL)){
      await saveDataToDb()
   }else{
      await redirectToOriginalURL()
   }



 
})


app.listen(process.env.PORT || 5000)