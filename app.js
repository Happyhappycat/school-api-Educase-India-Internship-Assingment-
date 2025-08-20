const express=require('express');
const app=express();
const schoolRoutes=require('./routes/schoolRoutes')

app.use(express.json());
app.use('/', schoolRoutes)



//Server Start
const PORT = process.env.PORT || 5000;   // fallback to 5000 locally
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));