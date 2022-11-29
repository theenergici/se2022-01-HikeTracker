import 'bootstrap/dist/css/bootstrap.min.css'
//import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import AuthContext from './AuthContext'
import MainLayout from './Layout-components/MainLayout';
import API from './API';
import { LoginComponent } from './Layout-components/LoginComponent';
import { RegisterComponent } from './Layout-components/RegisterComponent';
import HikeDetails from './Layout-components/HikeDetails';
//import AddHike from './Layout-components/AddHike';
import ProfilePage from './Layout-components/ProfilePage';
import HutsPage from './Layout-components/Huts-components/HutsPage';
import ParkingForm from './Layout-components/ParkingForm';
import VerifiedMessage from './Layout-components/VerificationPage';
import HutForm from './Layout-components/AddHut';

import Register from "./pages/Signup";
import Login from './pages/Login'
import Hikes from './pages/Hikeslist'
import Huts from './pages/Hutslist'
import AddHike from './components/forms/AddHike'
import HikeDetail from "./pages/HikeDatail";
import "./style.css"
import "tailwindcss/lib/css/preflight.css"

function App() {

  const [message, setMessage] = useState(''); //message error state
  const [auth, setAuth] = useState({  // login information
    login: false,
    user: { Role: '' },
  });

  function errorHandler(err){
      if(err.hasOwnProperty('error'))
        setMessage(() => err.error.toString());
        else if (err.hasOwnProperty('message'))
        setMessage(() => err.message);
        else
        setMessage(() => err.toString());
  }

  const login = (email, password) => {
    API.logIn(email, password)
    .then(user => {
    setAuth({
      login: true,
      user: user,
    });
  }).catch(err => errorHandler(err));
  };

  const logout = async (navigate) => {
    await API.logOut();
    setAuth({
      login: false,
      user: { Role: '' },
    })
    navigate('/');
  };

  const register = (credentials) => {
    API.register(credentials)
    .then((res) => {console.log(res);if(res.hasOwnProperty('error')) errorHandler(res); else setMessage('Registration successful! Check email for confirmation and follow the instruction.')})
    .catch(err => errorHandler(err));
  }

  useEffect(() => {   // check login     
    const checkAuth = async () => {
      const user = await API.getUserInfo();
      if (user) {
        setAuth({
          login: true,
          user: user,
        });
      }
    };
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={auth}>   {/* this is used to pass user information*/}
        <AppLayout login={login} logout={logout} register={register} setLogged={setAuth} message={message} setMessage={setMessage}/>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

function AppLayout(props) {
  const auth = useContext(AuthContext);   // contains user information 
  
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [huts, setHuts] = useState([]);

  useEffect(() => {
    const reloadHikes = async () => {
      const hikes_array = await API.getHikes();
      console.log(hikes_array);
      setHikes(hikes_array);
      setLoading(false);
    }
    try {
      reloadHikes();
    } catch (err) {
      // handling error
    }
  }, []);

  return (
    <>
    <Container>
        <Row><Col>
        {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
        </Col></Row>
      </Container>
    <Routes>
      <Route path='/' element={
        <MainLayout
          logout={props.logout}
        />
      } />
      <Route path='/:hikeID' element={
        <HikeDetails logout={props.logout} />
      } />


      <Route path='/hikedetail' element={
          <HikeDetail />
      } />   {/* for test*/}
        <Route path='/register' element={
              <Register/>
        // <RegisterComponent register={props.register} />

      } />
      <Route path='/login' element={
          <Login/>
        // < LoginComponent  login={props.login} />
      } />
      <Route path='/addHike' element={
        <AddHike />
      } />
      <Route path='/hikes' element={
            <Hikes hikes={hikes} loading={loading} />
      } />
      <Route path='/huts' element={

            <Huts />
      } />

      <Route path='/profile/:userId' element={
        <ProfilePage logout={props.logout} />

      } />
      {/*<Route path='/huts' element={*/}
      {/*  <HutsPage logout={props.logout} />*/}
      {/*} />*/}
      <Route path='/addParkingLot' element={
        <ParkingForm />
      } />
      <Route path='/verify' element={
        < VerifiedMessage />
      } />
       <Route path='/addHut' element={
        < HutForm />
      } />
    </Routes>
    </>
  );
}



export default App;
