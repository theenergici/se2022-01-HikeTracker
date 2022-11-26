'use strict';

const db = require('./DB').db;


class Hut{
    constructor(RefPointID, Name, Elevation, City, Province, Region, Country, WhenOpen, Beds, AvgPrice, Description){
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
    }
}

exports.addHut = (RefPointID, Name, Elevation, City, Province, Region, Country, WhenOpen, Beds, AvgPrice, Description) => {
  return new Promise(async (resolve, reject) => {
    const sql = 'INSERT INTO HUTS(RefPointID, Name, Elevation, City, Province, Region, Country, WhenOpen, Beds, AvgPrice, Description) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
    db.run(sql, [
      RefPointID, Name, Elevation, City, Province, Region, Country, WhenOpen, Beds, AvgPrice, Description
    ], function (err) {
      if (err)
        reject(err);
      else
        resolve('Hut added');
    });
  });
};

exports.emptyHuts = () => {
  return new Promise(async (resolve, reject) => {
    db.run("DELETE FROM Huts;", [], function (err) {
      if (err)
        reject(err);
      else
        resolve('Huts emptied');
    });
  })
};

exports.getHuts = () => {
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

exports.getHutsFilters = (name = null, locationType = null, location = null, WhenOpen = null, beds = null, avgPrice = null) => {
  return new Promise(async (resolve, reject) => {
    let sql = "SELECT * FROM Huts WHERE ";
    let parameters = [];

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
        sql += "AvgPrice = ?";
      else
        sql += " AND AvgPrice = ?";
      parameters.push(avgPrice);
    }

    sql += ";"
    // console.log(sql);
    db.all(sql, parameters, function (err, rows) {
      if (err)
        reject(err);
      else {
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

exports.deleteHut = (id) => {
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

exports.getHutCity = () => {
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

exports.getHutProvince = () => {
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

exports.getHutRegion = () => {
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

exports.getHutCountry = () => {
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