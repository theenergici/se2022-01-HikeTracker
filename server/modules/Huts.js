'use strict';

const db = require('./DB').db;


class Hut{
    constructor(
        RefPointID,
        Name,
        Elevation, 
        City, 
        Province, 
        Region, 
        Country, 
        WhenOpen, 
        Beds, 
        AvgPrice, 
        Description,
        Picture,
        HutManagerID,
        Website,
        Phone){
      
      this.RefPointID=RefPointID;
      this.Name=Name;
      this.Elevation=Elevation;
      this.City=City;
      this.Province=Province;
      this.Region=Region;
      this.Country=Country;
      this.WhenOpen=WhenOpen;
      this.Beds=Beds;
      this.AvgPrice=AvgPrice;
      this.Description=Description;
      this.Picture=Picture
      this.HutManagerID=HutManagerID;
      this.Website=Website
      this.Phone=Phone
    }
}

 function addHut  (Hut)  {
  return new Promise(async (resolve, reject) => {
    const sql = 'INSERT INTO HUTS( RefPointID, Name, Elevation, City,Province,  Region, Country, WhenOpen, Beds, AvgPrice, Description,HutManagerID,Website,Phone,Picture) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.run(sql, [
       Hut.RefPointID, Hut.Name, Hut.Elevation, Hut.City,Hut.Province, Hut.Region, Hut.Country, Hut.WhenOpen, Hut.Beds, Hut.AvgPrice, Hut.Description,Hut.HutManagerID,Hut.Website,Hut.Phone,Hut.Picture
    ], function (err) {
      if (err)
        reject(err);
      else
        resolve('Hut added');
    });
  });
};
 function emptyHuts  ()  {
  return new Promise(async (resolve, reject) => {
    db.run("DELETE FROM Huts;", [], function (err) {
      if (err)
        reject(err);
      else
        resolve('Huts emptied');
    });
  })
};
 function getHuts  ()  {
  return new Promise(async (resolve, reject) => {
    const sql = "SELECT * FROM Huts";
    db.all(sql, [], function (err, rows) {
      if (err)
        reject(err);
      else {

        // const huts = rows.map((r) => ({RefPointID: r.RefPointID, Name: r.Name, Elevation: r.Elevation, City: r.City, Province: r.Province, Region: r.Region, Country: r.Country, WhenOpen: r.WhenOpen, Beds: r.Beds, AvgPrice: r.AvgPrice, Description: r.Description }));
       const huts=[]
        rows.forEach(r => {
          let h = new Hut(r.RefPointID, r.Name, r.Elevation, r.City, r.Province, r.Region, r.Country, r.WhenOpen, r.Beds, r.AvgPrice, r.Description)
          huts.push(h);
         // console.log(h);
       });
        
        resolve(huts);
      }
    })
  })
}
 function getHutsFilters  (name = null, locationType = null, location = null, WhenOpen = null, beds = null, avgPrice = null)  {
  return new Promise(async (resolve, reject) => {
    let sql = "SELECT * FROM Huts";
    let parameters = [];

    if(name !== null || locationType !== null || WhenOpen !== null || location !== null || beds !== null || avgPrice !== null ) sql += " WHERE ";

    if (name !== null) {
      sql += "Name = ?";
      parameters.push(name);
    }
    if (locationType !== null) {
      if (parameters.length === 0)
        sql += locationType + " = ?";
      else
        sql += " AND " + locationType + " = ?";
      parameters.push(location);
    }
    if (WhenOpen !== null) {
      if (parameters.length === 0)
        sql += "WhenOpen = ?";
      else
        sql += " AND WhenOpen = ?";
      parameters.push(WhenOpen);
    }
    if (beds !== null) {
      if (parameters.length === 0)
        sql += "Beds = ?";
      else
        sql += " AND Beds = ?";
      parameters.push(beds);
    }
    if (avgPrice !== null) {
      if (parameters.length === 0)
        sql += "AvgPrice <= ?";
      else
        sql += " AND AvgPrice <= ?";
      parameters.push(avgPrice);
    }

    sql += ";"
    
    db.all(sql, parameters, function (err, rows) {
      if (err)
        reject(err);
      else {
        const huts=[]
        rows.forEach(r => {
          let h = new Hut(r.RefPointID, r.Name, r.Elevation, r.City, r.Province, r.Region, r.Country, r.WhenOpen, r.Beds, r.AvgPrice, r.Description,r.Picture)
          huts.push(h);
       });
        
        resolve(huts);
      }
    })
  })
}

 function deleteHut  (id)  {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Huts WHERE RefPointID = ?";
    db.run(sql, [id], function (err) {
      if (err)
        reject(err);
      else
        resolve("Entry deleted");
    })
  })
}

 function getHut(id){
  return new Promise( (resolve, reject) => {
    const sql = "SELECT * FROM Huts WHERE RefPointID = ?;";
    db.all(sql, [id], function (err, rows) {
      if(err)
        reject(err);
      else{
        const huts = [];
        rows.forEach(r => {
          let h = new Hut(id, r.Name, r.Elevation, r.City, r.Province, r.Region, r.Country, r.WhenOpen, r.Beds, r.AvgPrice, r.Description);
          huts.push(h);
        })
        resolve(huts[0]);
      }
    })
  })
 }

 function getHutCoordinates(id){
  return new Promise ( (resolve, reject) =>{
    const sql = "SELECT Lat, Lng FROM ReferencePoints WHERE RefPointID = ?;";
    db.all(sql, [id], function (err, rows) {
      if(err)
        reject(err)
      else{
        const coords = [];
        rows.forEach( r => {
          let h = {Lat: r.Lat, Lng: r.Lng}
          coords.push(h);
        })
        resolve(coords[0]);
      }
    })
  })
 }

 function getHutCity ()  {
  return new Promise((resolve, reject) => {
    const sql = " SELECT DISTINCT City FROM Huts;"
    db.all(sql, [], function (err, rows) {
      if (err)
        reject(err);
      else {
        const city = rows.map((r) => (r.City));
        resolve(city);
      }
    })
  })
}

 function getHutProvince  ()  {
  return new Promise((resolve, reject) => {
    const sql = " SELECT DISTINCT Province FROM Huts;"
    db.all(sql, [], function (err, rows) {
      if (err)
        reject(err);
      else {
        const province = rows.map((r) => (r.Province));
        resolve(province);
      }
    })
  })
}

 function getHutRegion  ()  {
  return new Promise((resolve, reject) => {
    const sql = " SELECT DISTINCT Region FROM Huts;"
    db.all(sql, [], function (err, rows) {
      if (err)
        reject(err);
      else {
        const region = rows.map((r) => (r.Region));
        resolve(region);
      }
    })
  })
}

 function getHutCountry  ()  {
  return new Promise((resolve, reject) => {
    const sql = " SELECT DISTINCT Country FROM Huts;"
    db.all(sql, [], function (err, rows) {
      if (err)
        reject(err);
      else {
        const country = rows.map((r) => (r.Country));
        resolve(country);
      }
    })
  })
}

 function setHutDescription  (Description, RefPointID)  {
  return new Promise((resolve, reject) => {
    const sql = " UPDATE Huts SET Description=? WHERE RefPointID=?;"
    db.run(sql, [Description, RefPointID], function (err, rows) {
      if (err)
        reject(err);
      else {
        resolve({message: "Description set"});
      }
    })
  })
}

function addHutToHike(HikeID,RefPointID,IsStart=0,IsEnd=0){
  const referencePoints= require("./HikeRefPoints").addHikeRefPoints;
  return new Promise(async(resolve, reject)=>{
      try{
          let returnmsg =await  referencePoints(HikeID,RefPointID,IsStart,IsEnd);
          resolve(returnmsg);    
      }catch(err){
          reject(err);
      }

  });
} 
module.exports={
  addHutToHike,
  getHutCity,
  getHutCountry,
  getHutProvince,
  getHutRegion,
  getHuts,
  getHutsFilters,
  setHutDescription,
  deleteHut,
  emptyHuts,
  addHut,
  Hut,
  getHut,
  getHutCoordinates
}