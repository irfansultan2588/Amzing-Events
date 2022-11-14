import React, { useState, useContext } from 'react'
import { GlobalContext } from '../Context';
import OTPInput, { ResendOTP } from "otp-input-react";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';



const Otp = () => {

    let { state, dispatch } = useContext(GlobalContext);
    const [OTP, setOTP] = useState("");

    const { state: email } = useLocation();
    const navigate = useNavigate();

    console.log(email, "email")

    const codesender = async () => {
        console.log(email, "email")

        console.log(OTP, "code")
        try {
            let response = await axios.post(`${state.baseUrl}/verifyotp`, {
                email: email.email,
                otp: OTP,
            })
            navigate("/login")
        } catch (e) {
            console.log("Error in api", e);

        }

    };

    return (
        <div className='main-otp'>
            <div className='main-otp2'>
                <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={4} otpType="string" disabled={false} secure />


                <button onClick={codesender}> Send code</button>

                {/* <ResendOTP onResendClick={() => console.log("Resend clicked")} /> */}

            </div>
        </div>
    );
}

export default Otp