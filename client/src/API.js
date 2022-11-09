const APIURL = 'http://localhost:3001'

/* LOADING DATA FROM SERVER */
async function getHikes() {
    const response = await fetch(APIURL+'/getHikes');
    const hikes = await response.json();
    if (response.ok) {
      return hikes.map((r) => ({ HikeId: r.HikeID, Province: r.Province, City: r.City, start: r.start, end: r.end, Title: r.Title, Length: r.Length, ExpectedTime: r.ExpectedTime, Ascent: r.Ascent, Difficulty: r.Difficulty, ReferencePoints: r.ReferencePoints, Description: r.Description}) )
    } else {
      throw hikes; //which will contain an error if it is the case
    }
}

async function getFilteredHikes(minExpectedTime, maxExpectedTime ,minAscent ,maxAscent , Province, City, minDist, maxDist, Difficulty) {
    try
        {const response = await fetch(APIURL+'/getFilteredHikes', {
            method: 'POST',
            body: JSON.stringify({ 
                "minExpectedTime": minExpectedTime,
                "maxExpectedTime": maxExpectedTime,
                "minAscent": minAscent,
                "maxAscent": maxAscent,
                "Province": Province,
                "City": City,
                "minDist": minDist,
                "maxDist": maxDist,
                "Difficulty": Difficulty
            }),
            headers: {
            'Content-Type': 'application/json',
        },
    });
        const hikes = await response.json();
        if (response.ok) {
        return hikes.map((r) => ({ HikeId: r.HikeID, Province: r.Province, City: r.City, start: r.start, end: r.end, Title: r.Title, Length: r.Length, ExpectedTime: r.ExpectedTime, Ascent: r.Ascent, Difficulty: r.Difficulty, ReferencePoints: r.ReferencePoints, Description: r.Description}) )
        } else {
        throw hikes; //which will contain an error if it is the case
    }} catch (ex) {
        throw ex;
    }
}

function setDescription(Description, HikeID) {
  return new Promise((resolve, reject) => {
    fetch((APIURL+'/setDescription'), {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Description: Description, HikeID: HikeID }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); }) 
          .catch(() => { reject({ error: "Cannot parse server response." }) }); 
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); 
  });
}

/* LOGIN FUNCTIONS */
async function logIn(credentials) {
    let response = await fetch((APIURL+'/sessions'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  async function logOut() {
    await fetch((APIURL+'/sessions/current'), { method: 'DELETE', credentials: 'include' });
  }
  
  async function getUserInfo() {
    const response = await fetch((APIURL+'/sessions/current'), {credentials: 'include'});
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo; 
    }
  }

  async function register(hash, salt, email, role){
    const response = await fetch ((APIURL+'/sessions/new'), {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ 
        'hash': hash,
        'salt': salt,
        'email': email,
        'role': role
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.ok ? true : false;
  }

const API = {getHikes, logIn, logOut, getUserInfo, getFilteredHikes, register, setDescription};
export default API;