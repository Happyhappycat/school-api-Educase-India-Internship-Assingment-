const db=require('../db');

//INPUT VALIDATI0N
function validateInput(name,address,latitude,longitude){
    if (!name || !address || latitude==undefined || longitude==undefined){
        return "All fields are required";
    }
    if(isNaN(latitude) || isNaN(longitude)){
        "Latitude and Longitude should be numbers"
    }
    return null;
}

//ADDING SCHOOL API

exports.addSchool=async(req, res)=>{
    try{
        const {name,address,latitude, longitude}=req.body

        //INPUT VALIDATION
        const error=validateInput(name,address,latitude,longitude);
        if(error){
            return res.status(400).json({error});
        }

        //INSERT INTO DATABASE
        const [result] = await db.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );
    res.status(201).json({
        message: "School Added Successfully!!",
        schoolId: result.insertId
    });

    }catch(err){
        console.error(err);
        res.status(500).json({
            error: "Database error!!"
        })
    }
}


//Calculate and sort by the geographical distance between the user's coordinates and each school's coordinates(Haversine formula).
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


exports.listSchools= async(req,res)=>{
    try{
        const {lat,long}= req.query;

        //VALIDATING QUERY PARAMS
        if(!lat || !long || isNaN(lat) || isNaN(long)){
            return res.status(400).json({
                error: "Latitude and longitude are required and must be numbers!"
            });

        }
        //FETCH ALL SCHOOLS
        const[schools]= await db.query("SELECT *FROM SCHOOLS");

        //ATTACH THE DISTANCE TO EACH SCHOOL
        const schoolsWithDistance = schools.map(school => {
        const distance = getDistance(Number(lat), Number(long), school.latitude, school.longitude);
        return { ...school, distance };
        });

        //SORTING BY NEAREST
        schoolsWithDistance.sort((a,b)=>a.distance-b.distance);
        res.json(schoolsWithDistance);
    }catch(err){
        console.error("DB ERROR:", err);
        res.status(500).json({
            error: "Database error"
        })
    }
}