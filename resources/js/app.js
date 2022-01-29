
// const news = document.getElementById("news");
// news.addEventListener('click',(e) =>{
//     e.preventDefault();
//     let data = " ";
//     const xhttp = new XMLHttpRequest();
//         const url = 'https://newsapi.org/v2/top-headlines?category=technology&apiKey=650c76400703470f835d491065da0f9a';

//         xhttp.open('GET',url, true);
//         xhttp.onreadystatechange = function(){
//             if(this.status === 200 && this.readyState === 4){
//                 data = JSON.parse(this.response);
//                 console.log(data)

//             }else{
//                 console.log(data)
//             }
//         }
//         xhttp.send();
        
//         const newXhttp = new XMLHttpRequest();
//         const urlnew = 'http://localhost:3000/news';

//         newXhttp.open('POST',urlnew, true);
//                 console.log(data)
//                 newXhttp.send(data);

//         // xhttp.open('POST', 'http://localhost:3000/news')
//         // xhttp.send(data)
//         // console.log(data)
// })