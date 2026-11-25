import {Server} from 'socket.io'
import {Server as HttpServer} from 'http'
import { email, success } from 'zod';
import getUserDetailsFromToken from '@app/helpers/getUserDetailsFromToken.js';

let connectedUser =[];
const userIdToGetSocketId = new Map<string,string>()
const socketIdToGetUserId = new Map<string, string>();

const getSoceketId =(userId:string)=>{
   const socketId =userIdToGetSocketId.get(userId)
   return socketId
}
const getUserId =(socketId:string)=>{
   const userId =userIdToGetSocketId.get(socketId)
   return userId
}
const initiateSocketServer = (server:HttpServer)=>{
     const io = new Server(server,{
        cors:{
            origin:'*'
        },
     });

     io.on('connection', socket => {

      const token = socket?.handshake?.auth?.token || socket?.handshake?.headers?.token;
      const user:any =getUserDetailsFromToken(token);
      userIdToGetSocketId.set(user?.id,socket?.id)
      socketIdToGetUserId.set(socket?.id,user?.id)
      socket.join(user?.id)
      
      socket?.on("onlineUser",(data,callBack)=>{
         try {
            io.to(socket?.id).emit("onlineUser",connectedUser)
            if(callBack){
               callBack({
                  success:true,
                  message:"online user get sucecessfully",
                  data:connectedUser
               })
            }
         } catch (error) {
            console.log('🚀 ~ initiateSocketServer ~ error:', error);
            if(callBack){
              callBack({
                success:true,
               message:"online user get failed",
               data:null
              })
            }
            
         }
      })
      socket.on("join",async data =>{
         io.emit('getData', {
            data:`My name is:${data?.name}`,
            email:`emial@email.com`
         });
         console.log(data)
      })
      socket.on('disconnect',()=>{
         console.log(`A user Disconnected :`,socket?.id);
         userIdToGetSocketId.delete(user?.id);
         socketIdToGetUserId.delete(socket?.id)
      })
});
return io;
};
export default initiateSocketServer;