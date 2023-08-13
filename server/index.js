const express = require("express");
const app = express();
//create instance of express
const http = require("http");
//for creating the server 

const cors = require("cors");
const server = http.createServer(app);


app.use(cors());
//for using the cors library and reslove many of the issue
//There is a server class that is on the socket.io (server class use karni padegi).
const { Server } = require("socket.io");
//we will make ainstance of this class.(now iska instance bna liya_ 
//and connect with the server (express server );
const io = new Server(server, {
  cors: {
    //(we will specify here that it is safe for using this server)
    //isse ab error nahi aayegi 
    //tell ki it is ok to accept this 
    //and we specify methods that we accpet
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
//Predefined library in socket io.
//(yahan se detect hoga ki koi connext kara
//means on catch karega jab koi connect to the server 
//socket io 
// and socket -->mein socket aayega jo connect karna chahta hai )
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  //jab client se join room karke event emit hoga to server par catch kese hoga via help of this .

  socket.on("join_room", (data) => {
    //now by the help of join function we enter the socket id by the client 
    //client wali yahan aayegi 
    //see data ==room id variable in frontend
    socket.join(data);
    //printing the message use of backtick for the displaying the message 
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  //see chat .js mein banaya hai wahan se send_message karke emit ko catch karne ke liye on the server side 
  //ye banaya hai and data mein sab hai time,username,room wagrh 
  socket.on("send_message", (data) => {
    //ho kya rha hai ki jab send message kara from client side 
    //yahan server catches and emit to the particular room id to who that are already connected to it 

    // io.emit() to send a message to all the connected clients.
    // This code will notify when a user connects to the server.
    //to everyone who is litening to all users inn same chat as you
    //it is the main condition flow hai ye .
    socket.to(data.room).emit("receive_message", data);
  });

  //when disconnect from the server so close or refresh the tab 
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

//yahan koi saa bhi aa skta tha but as react is running on 3000 
//so thats why 
//and whenever it is running server runnin g 
server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
