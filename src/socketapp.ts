import {Server} from 'socket.io'
import {Server as HttpServer} from 'http'
import { email } from 'zod';

let connectedUser =[]
const initiateSocketServer = (server:HttpServer)=>{
     const io = new Server(server,{
        cors:{
            origin:'*'
        },
     });

     io.on('connection', socket => {
        console.log(socket)
 connectedUser.push(socket?.id)
console.log('a user com=nected');


 socket.on('join',async data =>{
    io.emit('getData',{
        data:`My name is: ${data?.name}`,
        email:`example@gmail.com`,
    });
    console.log(data)
 })
});
return io;
};
export default initiateSocketServer;