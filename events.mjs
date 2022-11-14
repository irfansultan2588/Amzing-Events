import express, { request } from "express"
import cors from "cors"
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { stringToHash, varifyHash, } from "bcrypt-inzi"
import nodemailer from 'nodemailer';


let dbURI = process.env.MONGODBURI || 'mongodb+srv://abc:abc@cluster0.jqfzaar.mongodb.net/AmizingEvents?retryWrites=true&w=majority';
const SECRET = process.env.SECRET || "topsecret";
const port = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000', 'https://my-product-app-react.web.app', '*'],
    credentials: true
}));




const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    interests: [{ type: Array, required: true }],
    verify: { type: Boolean, default: false },
    otp: { type: String, },
    createdOn: { type: Date, default: Date.now },
});

const userModel = mongoose.model('user', userSchema);


const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    select: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    createdBy: { type: String, required: true },
    startDate: { type: String, default: Date.now },
    endDate: { type: String, default: Date.now },


});
const eventModel = mongoose.model('events', eventSchema);


app.post("/verifyotp", async (req, res) => {
    try {
        let { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).send("empty otp details ate not allowed");
        } else {
            const user = await userModel.findOne({ email });
            if (otp === user.otp) {
                await userModel.updateOne({ email }, { verify: true, otp: null })
                return res.status(200).send({ message: "correct otp" })
            } else {
                return res.status(403).send({ message: "incorrect otp" })
            }
        }
    } catch (error) {
        console.log(error, 'error')
        res.json({
            status: "failed",
            message: "error.message"

        })
    }
})



app.post("/signup", async (req, res) => {


    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
        || !body.interests

    ) {
        res.status(400).send(
            `required fields missing, request example: 
            {
                "firstName": "John",
                "lastName": "Doe",
                "email": "abc@abc.com",
                "password": "12345"
                 "interests": "Music"
            }`
        );
        return;
    }




    userModel.findOne({ email: body.email }, (err, user) => {
        if (!err) {
            console.log("user: ", user);

            if (user) { // user already exist
                console.log("user already exist: ", user);
                res.status(400).send({ message: "user already exist, please try a different email" });
                return;

            } else { // user not already exist

                stringToHash(body.password).then(hashString => {


                    ///////////////////////////////////////////////////////////////////////////////////////////////////////
                    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',

                        auth: {
                            user: 'irfansultan201@gmail.com',
                            pass: 'pokfdsamiscxtwjo'
                        }
                    });

                    let mailOptions = {
                        from: 'irfansultan201@gmail.com',
                        to: 'irfansultan201@gmail.com',
                        subject: 'Sending Email Using Node.js',
                        html: `<p>Enter <b>${otp} </b> in the app to verifiy your email address and complete</p>`,

                    };


                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {

                            console.log('Email sent: ' + info.response);


                            userModel.create({
                                firstName: body.firstName,
                                lastName: body.lastName,
                                email: body.email.toLowerCase(),
                                password: hashString,
                                interests: body.interests,
                                otp,

                            }).then(resss => {
                                console.log(resss, "res");
                                res.status(201).send({ message: "user is created" })
                            }).catch(err => {
                                console.log(err, "err");
                                res.status(500).send({ message: "internal server error" })
                            })


                        }
                    });

                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
        }
    })
});



app.post("/login", (req, res) => {

    let body = req.body;

    if (!body.email || !body.password) {
        res.status(400).send(
            `required fields missing, request example:
            {
                "email": "abc@abc.com",
                "password": "12345"
            }`
        );
        return;
    }


    userModel.findOne({ email: body.email },
        "email firstName lastName password verify",
        (err, user) => {
            if (!err) {
                console.log("user: ", user);

                if (user) { // user found

                    varifyHash(body.password, user.password).then(isMatched => {

                        if (isMatched && user.verify) {
                            var token = jwt.sign({
                                _id: user._id,
                                email: user.email,
                                iat: Math.floor(Date.now() / 1000) - 30,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                            }, SECRET);

                            console.log("token:", token);

                            res.cookie('Token', token, {
                                maxAge: 86_400_000,
                                httpOnly: true
                            });

                            res.send({
                                message: "Login successful",
                                profile: {
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    _id: user._id

                                }


                            });

                            return;
                        } else {

                            console.log("user not found: ");
                            res.status(401).send({ message: "Incorrect email.or password," });
                            return;

                        }
                    })


                } else { // user not found

                    console.log("user not found: ",);
                    res.status(401).send({ message: "Incorrect email.or password," });
                    return;



                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "Login failed please try later" });
            }
        })
});


app.post("/event", async (req, res) => {

    console.log(req.body, "req.body");


    try {

        const response = await eventModel.create({
            title: req.body.title,
            select: req.body.select,
            description: req.body.description,
            address: req.body.address,
            createdBy: req.body.createdBy,
            startDate: req.body.startDate,
            endDate: req.body.endDate,

        })
        console.error(response, "response")

        await response.save()
        try {
            res.send({
                message: "event added",
                data: "event created successfully"
            });
        } catch (err) {
            console.error(err)
        }

    } catch (error) {
        console.log('error', error)
        res.status(500).send({
            message: "faild to added event"
        });
    }

})

app.get("/events", async (req, res) => {

    try {
        const events = await eventModel.find({}).exec();
        console.log("all events: ", events);

        res.send({
            message: "all events",
            data: events
        });
    } catch (error) {
        res.status(500).send({
            message: "faild to get events"
        });
    }
})



// app.get("/event/:id", async (req, res) => {

//     try {
//         const event = await eventModel.findOne({ _id: req.params.id }).exec();
//         console.log("event: ", event);

//         res.send({
//             message: "event",
//             data: event
//         });
//     } catch (error) {
//         res.status(500).send({
//             message: "faild to get event"
//         });
//     }
// })


app.use(function (req, res, next) {
    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }
    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {
                res.status(401).send("token expired")
            } else {
                console.log("token approved");
                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
}),

    app.get("/profile", async (req, res) => {

        try {
            let user = await userModel.findOne({ _id: req.body.token._id }).exec();
            res.send(user);

        } catch (error) {
            res.status(500).send({ message: "error getting users" });
        }
    })

app.post("/logout", (req, res) => {
    res.cookie('Token', '', {
        maxAge: 0,
        httpOnly: true
    });
    res.send({ message: "Logout successful", });
});






app.use((req, res) => {
    res.status(404).send('404 not found')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})





// /////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////mongodb connected disconnected events///////////////////////////////////////////////                     