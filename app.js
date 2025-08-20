const express=require('express');
const app=express();
const schoolRoutes=require('./routes/schoolRoutes')

app.use(express.json());
app.use('/', schoolRoutes)



//Server Start
const PORT=5000
app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`);
    
});
