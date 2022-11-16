import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../Context'
import axios from 'axios'
import { Link } from "react-router-dom";


const MyEvents = () => {

    let { state, dispatch } = useContext(GlobalContext);
    let [toggleReload, setToggleReload] = useState(false);
    let [events, setEvents] = useState([])
    let [loading, setLoading] = useState(false);






    useEffect(() => {

        const getAllEvents = async () => {
            try {
                let response = await axios({
                    url: `${state.baseUrl}/event/${state.user?._id}`,
                    method: "get",
                    withCredentials: true,
                });
                if (response.status === 200) {
                    console.log("response: ", response.data.data);

                    setEvents(response.data.data.reverse());
                } else {
                    console.log("error in api call");
                }
            } catch (e) {
                console.log("Error in api call: ", e);
            }
        };
        getAllEvents();
    }, [toggleReload]);


    return (
        <>
            <div className="eventMain">
                {
                    events.map((item) => {

                        console.log(item, "item");
                        return <div className="eventsMainDiv">
                            <div className="titalMainDiv">
                                <div className="titleDiv" > <h1 className="titles"><i>{item.title}</i></h1></div>
                                <div className="titleDiv"><h4 className="select">{item.select}</h4></div>
                            </div>
                            <div className="titleDiv"><h3>Description: </h3><p className="dec">{item.description}</p></div>
                            <div className="addDiv"><h3>Address: </h3><p className="add">{item.address}</p></div>
                            <div className="dateMain">
                                <div className="dateDiv"><h3>StartDate</h3><h4>{item.startDate}</h4></div>
                                <div className="endDiv"><h3>EndDate</h3><h4>{item.endDate}</h4></div>
                            </div>

                            {(item.createdBy === state.user?._id) ? <>
                                <div className="btnDiv">
                                    <button className='EventDelete' onClick={async () => {
                                        try {

                                            setLoading(true)

                                            let deleted = await
                                                axios.delete(`${state.baseUrl}/event/${item?._id}`,
                                                    {
                                                        withCredentials: true
                                                    })
                                            console.log("deleted: ", deleted.data);
                                            setLoading(false)

                                            setToggleReload(!toggleReload);

                                        } catch (e) {
                                            console.log("Error in api call: ", e);
                                            setLoading(false)
                                        }

                                    }}>Delete Event</button>

                                    <Link to="/CreateEvents" state={{ event: item }}>
                                        <button className='EventEdit' onClick={() => {
                                        }
                                        }>Edit Event</button>
                                    </Link>
                                </div>
                            </> : <></>}


                        </div>
                    })
                }
            </div >

        </>
    )
}

export default MyEvents