import React from 'react'
import { GlobalContext } from '../Context'
import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from 'axios';




const CreateEvents = () => {

    let { state, dispatch } = useContext(GlobalContext);
    const [toggleRefresh, setToggleRefresh] = useState(true);

    const formik = useFormik({
        initialValues: {
            title: "",
            select: "",
            description: "",
            address: "",
            startDate: "",
            endDate: "",

        },
        validationSchema: yup.object({
            title: yup.string("Enter your title"),
            select: yup.string("Enter your category"),
            description: yup.string("Enter your description"),
            address: yup.string("Enter your address"),
            startDate: yup.string("Enter your startDate"),
            endDate: yup.string("Enter your endDate"),

        }),

        onSubmit: async (values, { resetForm }) => {
            console.log(values, "Values");
            const data = new FormData();

            console.log(values, "hahah");
            axios({
                method: "post",
                url: `${state.baseUrl}/event`,
                data: {
                    title: values["title"],
                    select: values["select"],
                    description: values["description"],
                    address: values["address"],
                    startDate: values["startDate"],
                    endDate: values["endDate"],
                    createdBy: state?.user?._id
                },

                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
                .then((res) => {
                    console.log(`upload Success` + res.data);

                    setToggleRefresh(!toggleRefresh);
                    resetForm()
                })
                .catch((err) => {
                    console.log("ERROR", err);
                });

        },
    });

    return (
        <>
            <h1 className='create_hadding'>Create Events</h1>
            <div className="formMain">
                <form className="eventsForm" onSubmit={formik.handleSubmit}>

                    <div className='tit-div'>
                        <div>
                            <h5 className='headingg'>Title</h5>
                        </div>
                        <div>
                            <input
                                id="title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    {formik.touched.title && formik.errors.title ? (
                        <div className="errorMessage">{formik.errors.title}</div>
                    ) : null}

                    <div className='tit-div'>
                        <div>
                            <h5 className='headingg'>Category</h5>
                        </div>

                        <div>
                            <select
                                id="select"
                                name="select"
                                type="select"
                                value={formik.values.select}
                                onChange={formik.handleChange}
                            >
                                <option>None</option>
                                <option>Music</option>
                                <option>Visual Arts</option>
                                <option>Performing Arts</option>
                                <option>Film</option>
                                <option>Lectures & Books</option>
                                <option>Fashion</option>
                                <option>Nightlife</option>
                            </select>
                        </div>


                    </div>
                    {formik.touched.select && formik.errors.select ? (
                        <div className="errorMessage">{formik.errors.select}</div>
                    ) : null}

                    <div className='tit-div'>
                        <div>
                            <h5 className='headingg'>Description</h5>
                        </div>
                        <div>
                            <input
                                id="description"
                                name="description"
                                type="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    {formik.touched.description && formik.errors.description ? (
                        <div className="errorMessage">{formik.errors.description}</div>
                    ) : null}

                    <div className='tit-div'>
                        <div>
                            <h5 className='headingg'>Address</h5>
                        </div>
                        <input
                            id="address"
                            name="address"
                            type="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                        />
                    </div>
                    {formik.touched.address && formik.errors.address ? (
                        <div className="errorMessage">{formik.errors.address}</div>
                    ) : null}



                    <div className='tit-div'>
                        <div>
                            <h5 className='headingg'>Start Date</h5>
                        </div>
                        <div>
                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                minDate={new Date}
                                value={formik.values.startDate}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    {formik.touched.startDate && formik.errors.startDate ? (
                        <div className="errorMessage">{formik.errors.startDate}</div>
                    ) : null}

                    <div className='tit-div'>
                        <div>
                            <h5 className='headingg'>EndDate</h5>
                        </div>
                        <div>
                            <input
                                id="endDate"
                                name="endDate"
                                type="date"
                                minDate={formik.values.startDate}
                                value={formik.values.endDate}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>

                    {formik.touched.endDate && formik.errors.endDate ? (
                        <div className="errorMessage">{formik.errors.endDate}</div>
                    ) : null}

                    <div className='btn_container'>  <button className="addEvent_btn" type="submit">Create Events</button></div>
                </form>
            </div >


        </>
    )
}

export default CreateEvents