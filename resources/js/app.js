// let socket = io();
import {io} from 'socket.io-client';
const SEVER_ENDPOINT = 'http://localhost:3000';

const socket = io(SEVER_ENDPOINT);
const qty = document.querySelector('#bookQty');

socket.on('connect',() => {
    console.log("connected");
})

socket.on('getBook', async (data) => {
    qty.textContent = data    
})