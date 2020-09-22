import "@babel/polyfill";
import dotenv from "dotenv";
import "./db";
import app from "./app";

dotenv.config();

import "./models/Video";
import "./models/Comment";
import "./models/User";

const PORT = process.env.PORT || 4000;

//const handleListening = () => console.log(`✅ Listening on: http://localhost:${PORT}`);
const handleListening = () => console.log(`✅ Listening on: https://lit-springs-71914.herokuapp.com/`);

app.listen(PORT, handleListening);