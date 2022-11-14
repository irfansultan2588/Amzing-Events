import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { GlobalContext } from '../Context';


const Home = () => {



    let { state, dispatch } = useContext(GlobalContext);
    let [events, setEvents] = useState([]);
    // let [editProduct, setEditProduct] = useState(null);
    let [loading, setLoading] = useState(false);
    let [toggleReload, setToggleReload] = useState(false);


    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    useEffect(() => {

        const getAllEvents = async () => {
            try {
                let response = await axios({
                    url: `${state.baseUrl}/events`,
                    method: "get",
                    withCredentials: true
                })
                if (response.status === 200) {
                    console.log("response: ", response.data.data);

                    setEvents(response?.data?.data?.reverse());

                } else {
                    console.log("error in api call")
                }
            } catch (e) {
                console.log("Error in api call: ", e.message);
            }
        }
        getAllEvents();

    }, [toggleReload]);

    return (
        <div>


            <h1 className='productHeading'>Events Page</h1>
            {/* <div className='card_container'>
                {products?.map(eachProduct => (
                    <div className='card-produdct23' key={eachProduct?._id}>

                        <div className='card_child-main' >
                            <div className='card_child'>
                                <h5 className='cardDiv'>{eachProduct?.title}</h5>
                            </div>
                            <div className='card_child'>
                                <h5 className='price'>Rs.{eachProduct?.price}</h5>
                            </div>
                        </div>
                        <div className='card_child'>
                            <h4 className='condition'>{eachProduct?.condition}</h4>
                        </div>
                        <div className='card_child'>
                            <p className='description'>{eachProduct?.description}</p>
                        </div>

                        <div className="btnDiv">
                            <button className='productDelete' onClick={async () => {
                                try {

                                    setLoading(true)

                                    let deleted = await
                                        axios.delete(`${state.baseUrl}/product/${eachProduct?._id}`,
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

                            }}>Delete product</button>

                            <button className='productEdit' onClick={() => {
                                setEditProduct({
                                    _id: eachProduct._id,
                                    productPicture: eachProduct?.productPicture,
                                    title: eachProduct?.title,
                                    price: eachProduct?.price,
                                    condition: eachProduct?.condition,
                                    description: eachProduct?.description,
                                })
                                setOpen(true)
                            }
                            }>Edit Product</button>
                        </div>

                    </div>
                ))}
            </div> */}


        </div>
    )
}

export default Home