'use strict';

const db = require('./DB').db;

exports.addHikeRefPoints = (HikeID, RefPointID, IsStart, IsEnd) => {
  return new Promise(async (resolve, reject) => {
    const sql = "INSERT INTO HikeRefPoints(HikeID, RefPointID, IsStart, IsEnd) VALUES (?,?,?,?)";
    db.run(sql, [HikeID, RefPointID, IsStart, IsEnd], function (err) {
      if (err)
        reject(err);
      else {
        resolve("New HikeRefPoint added");
      }
    });
  });
};

exports.getHutsAndParks = () =>{
  return new Promise(async (resolve, reject) =>{
    const sql = 'SELECT RP.RefPointID, RP.Type, H.Name, PL.Description FROM ReferencePoints RP LEFT JOIN ParkingLots PL ON RP.RefPointID = PL.ParkingID LEFT JOIN Huts H ON RP.RefPointID = H.RefPointID WHERE (RP.Type = ? OR RP.Type = ?)';
    db.all(sql, ["hut", "parking"], function (err, rows) {
      if(err)
        reject(err);
      else{
        const info = rows.map((r) => ({ RefPointID: r.RefPointID, Type: r.Type, Name: r.Name, Description: r.Description }));
        resolve(info);
      }
    })
  })
}

exports.getHikeInfo = (HikeID) =>{
  return new Promise(async (resolve, reject) =>{
    const sql = 'SELECT * FROM HikeRefPoints HRP, ReferencePoints RP, Hikes H WHERE H.HikeID = HRP.HikeID AND HRP.RefPointID = RP.RefPointID AND H.HikeID = ?';
    db.all(sql, [HikeID], function (err, rows) {
      if(err)
        reject(err);
      else{
        const hikes = rows.map((r) => ({ HikeID: r.HikeID, RefPointID: r.RefPointID, IsStart: r.IsStart, IsEnd: r.IsEnd, Lat: r.Lat, Lng: r.Lng, Type: r.Type, Title: r.Title, Length: r.Length, ExpectedTime: r.ExpectedTime, Ascent: r.Ascent, Difficulty: r.Difficulty, Start: r.STart, End: r.End, Description: r.Description }));
        resolve(hikes);
      }
    })
  })
}

exports.emptyHikeRefPoint = () => {
  return new Promise(async (resolve, reject) => {
    db.run("DELETE FROM HikeRefPoints", [], function (err) {
      if (err)
        reject(err);
      else
        resolve('HikeRefPoints emptied');
    });
  })
};

exports.setIsStart = (HikeID, isStart, RefPointID) =>{
  return new Promise(async (resolve, reject) =>{
    const sql = 'UPDATE HikeRefPoints SET isStart = ? WHERE HikeID = ? AND RefPointID = ?';
    db.run(sql, [isStart, HikeID, RefPointID], function(err) {
      if(err)
        reject(err);
      else
        resolve('Is Start setted');
    })
  })
}

exports.setIsEnd = (HikeID, isEnd, RefPointID) =>{
  return new Promise(async (resolve, reject) =>{
    const sql = 'UPDATE HikeRefPoints SET isEnd = ? WHERE HikeID = ? AND RefPointID = ?';
    db.run(sql, [isEnd, HikeID, RefPointID], function(err){
      if(err)
        reject(err);
      else
        resolve('Is End setted');
    })
  })
}