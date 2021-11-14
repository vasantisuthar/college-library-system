
var srcContent;
const inputFile = document.getElementById("#btnupload");
const btnPrev = document.getElementById('#btnPrvw');
const embedLink = document.getElementById('#embdLink');

// function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             srcContent=  e.target.result;
//         }
//         reader.readAsDataURL(input.files[0]);
//     }
// }   

// inputFile.addEventListener('change',function(e){
//     if(e.files[0].name != " "){
//         console.log(e);
//         readURL(e);
//     }
// })

// btnPrev.addEventListener('click',function(){
//     console.log("clicked")
//     embedLink.setAttribute('src','srcContent');
// })

// // $document.ready(() =>{
// //     var filename;
// //     $("#inputFile").change(function(){
// //         if(this.files[0].name != ""){
// //             readUrl(this);
// //         }
// //     });
// //     $('#btnPrvw').click(function () {              
// //         $('#embdLink').attr('src', srcContent);
// //     });
// // })