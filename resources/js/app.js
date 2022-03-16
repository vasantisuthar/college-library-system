let socket = io();
const qty = document.querySelector('#bookQty');

socket.on('getBook', (data) => {
    console.log("from app.js" , data);
    qty.innerHTML = data    
})