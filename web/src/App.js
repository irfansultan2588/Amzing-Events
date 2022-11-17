import './App.css';
import { useContext, useEffect } from 'react';
import Navbar from './Components/Navbar';
import { GlobalContext, } from './Context';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from './Components/Signup';
import Login from './Components/Login'
import Otp from './Components/Otp';
import axios from 'axios';
import CreateEvents from './Components/CreateEvents';
import Home from './Components/Home';
import Logout from './Components/Logout'
import MyEvents from './Components/MyEvents';


function App() {


  let { state, dispatch } = useContext(GlobalContext);


  useEffect(() => {


    const getProfile = async () => {

      try {
        let response = await axios({
          url: `${state.baseUrl}/profile`,
          method: "get",
          withCredentials: true,
          // headers: {
          //   'Access-Control-Allow-Origin': '*',
          //   "Content-Type": "application/json",

          // }
        })
        if (response.status === 200) {
          console.log("response: ", response.data);
          dispatch({
            type: "USER_LOGIN",
            payload: response.data
          })

        } else {
          dispatch({ type: "USER_LOGOUT" })
        }

      } catch (e) {
        console.log("Error in api", e);
        dispatch({
          type: "USER_LOGOUT"
        })
      }
    }
    getProfile();
  }, [])

  return (
    <>

      <Router>


        <Navbar />




        <Routes>

          {(state.isLogin === true) ?

            <>
              <Route path="/CreateEvents" element={<CreateEvents />} />
              <Route path="/logout" element={<SignUp />} />
              <Route path="/Home" element={<Home />} />
              <Route path="MyEvents" element={<MyEvents />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Home />} />



            </>
            :
            null
          }

          {(state.isLogin === false) ?

            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/Otp" element={<Otp />} />
              <Route path="/" element={<Home />} />

            </>
            :
            null
          }


          {(state.isLogin === null) ?

            <>
              <Route path="*" element={
                <div className='image_container234'>
                  {/* <img src={loddingimage} alt='loding_image' /> */}
                </div>
              } />
            </>
            :
            null
          }
        </Routes>
      </Router >








    </>
  );
}

export default App;
