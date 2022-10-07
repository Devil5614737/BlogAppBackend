const dotenv=require('dotenv');
const express=require('express');
const app=express();
const cors=require('cors')
const mongoose=require('mongoose');
const signup=require('./routes/signup');
const login=require('./routes/login');
const blogpost=require('./routes/blogpost');

dotenv.config({path:'./.env'})

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.URI,{ useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log('connected to mongodb')).catch(e=>console.log(e))

app.use('/api',signup);
app.use('/api',login);
app.use('/api',blogpost);

const port=process.env.PORT||5000

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})