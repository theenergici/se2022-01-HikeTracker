'use strict';

const db = require('./DB').db;

exports.addReferencePoint = (RefPointID, lat, lng, type) => {
  return new Promise(async (resolve, reject) => {
    const sql = "INSERT INTO ReferencePoints(RefPointID, Lat, Lng, Type) VALUES (?,?,?,?);";
    db.run(sql, [RefPointID, lat, lng, type], function (err) {
      if (err)
        reject(err);
      else {
        resolve("New RefPoint added");
      }
    });
  });
};

exports.updateReferencePoint = (RefPointID, lat, lng, type) =>{
  return new Promise(async (resolve, reject) =>{
    const sql = 'UPDATE ReferencePoints SET lat = ?, lng = ?, type = ? WHERE RefPointID = ?';
    db.run(sql, [lat, lng, type, RefPointID], function (err){
      if(err)
        reject(err);
      else
        resolve('Entry updated');
    })
  })
}

exports.emptyReferencePoint = () => {
  return new Promise(async (resolve, reject) => {
    db.run("DELETE FROM ReferencePoints;", [], function (err) {
      if (err)
        reject(err);
      else
        resolve('ReferencePoints emptied');
    });
  })
}

exports.getStartingPoints = () => {
  return new Promise(async (resolve, reject) => {
    const sql = "SELECT HikeID, Lat, Lng FROM HikeRefPoints JOIN ReferencePoints ON HikeRefPoints.RefPointID = ReferencePoints.RefPointID WHERE IsStart=1;";
    db.all(sql, [], function (err, rows) {
      if (err)
        reject(err);
      else {
        const points = rows.map((r) => ({ HikeID: r.HikeID, Lat: r.Lat, Lng: r.Lng }));
        resolve(points);
      }
    });
  })
};

exports.getFromType = (type) => {
  return new Promise(async (resolve, reject) => {
    const sql="SELECT RefPointID FROM ReferencePoints WHERE Type=?;";
    db.all(sql, [type],function (err,rows) {
      if(err)
      reject(err);
      else {
        const hutPoints = rows.map((r)=> ({RefPointID: r.RefPointID}));
        console.log(hutPoints);
        resolve(hutPoints);
      }
    })
  })
}