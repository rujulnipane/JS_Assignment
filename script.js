let pg_count = 0;
const access_key = "KL7bSNfzkmWueulyi4QXA8byTN-CaIHMLIIxoENZLw0";
const inputText = document.getElementById('search-input');
const search = document.getElementById("search-btn");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const img_container = document.getElementById('container');
const spinner = document.createElement('div');

async function getData(){
    
    console.log(pg_count)
    const inputdata = inputText.value.toLowerCase();
    if(inputdata.length == 0){
        return alert("Please Enter Text");
    }
    let imgurl = `https://api.unsplash.com/search/photos?page=${pg_count}&query=${inputdata}&client_id=${access_key}`;
    try{
        if(pg_count === 1){
            img_container.innerHTML = "";

        }
        spinner.innerHTML =  `<div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`
        img_container.appendChild(spinner);
        const response = await fetch(imgurl);
        const data = await response.json();
        spinner.innerHTML = "";
        const photos = data.results;
        if(photos.length == 0) {
            alert("no more images");
        }
        else{
            // console.log(photos);
            let matches = photos.filter(photo => {
                const regex = new RegExp(`${inputdata}`, 'gi');
                return photo.slug.match(regex) || photo.alt_description.match(regex);
               });
               console.log(matches)
            matches.sort(sortByFreshness);
            // console.log(photos);
            matches.forEach(imageMount);
        if(pg_count > 0){
            next.style.display = 'block';
        }
        }
    }
    catch(e){
        alert("something error happend")
        console.log(e);
    }
    
}

const parseISODate = (isoDateString) => {
    return new Date(isoDateString);
};

const sortByFreshness = (a, b) => {
    const dateA = parseISODate(a.created_at);
    const dateB = parseISODate(b.created_at);
    return dateB - dateA;
};


search.addEventListener("click",(event)=>{
    pg_count = 1;
    event.preventDefault();
    getData();
   
})


next.addEventListener("click",(event)=>{
    event.preventDefault();
    pg_count++;
    getData();
})


function next_page(){
    // pg_count++;
    // console.log(pg_count);
    document.getElementById('container').innerHTML="";
    
    // let url3 = `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${keyword}&locale=en-US&per_page=40&page=${pg_count}`;
    getData();
}

function imageMount(value) {
    let img_element = document.createElement('div');
    let img = document.createElement('img');
    img.src = value.urls.small;
    img.alt = value.alt_description;
    let img_caption = document.createElement('a');
    img_caption.textContent = value.alt_description;
    img_element.appendChild(img);
    img_element.appendChild(img_caption);
    img_caption.href = value.links.html;
    img_caption.setAttribute('target','_blank');
    img_container.appendChild(img_element);
    img_element.classList.add('img-element');
    img.classList.add('img-fluid');
    img_element.classList.add('m-2');
}






const url1 = 'https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest-user?username=viratkohli';
const options1 = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
        'X-RapidAPI-Host': 'pinterest-video-and-image-downloader.p.rapidapi.com'
    }
};

const url2 = 'https://instagram130.p.rapidapi.com/account-medias?userid=13460080&first=40';
const options2 = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
		'X-RapidAPI-Host': 'instagram130.p.rapidapi.com'
	}
};


const url3 = `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=dog&locale=en-US&per_page=30&page=1`;
const options3 = {
    method: 'GET',
    headers: {
        Authorization: 'StETECaNFCtc7ohSE7o6AxkEiyrM5tnKxdzrNoWGB00NQzOVaRGjb88o',
        'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
        'X-RapidAPI-Host': 'PexelsdimasV1.p.rapidapi.com'
    }
};





async function getData3(url) {
    try {
        const response = await fetch(url, options3);
        const result = await response.text();
        
        const obj = JSON.parse(result);
        console.log(obj)
        // document.getElementById('')
        let photos = obj.photos;
        if(photos.length == 0) {
            let ch  = document.createElement('h3');
            ch.textContent = "No Images Found";
            document.getElementById('container').appendChild(ch);
        }
        else{
            photos.forEach(imageMount);
        }
    }
    catch (error) {
        console.error(error);
    }
}



function myFunction(){
    document.getElementById('container').innerHTML="";
    let keyword = document.getElementById('keyword').value;
    if(keyword.length == 0){
        return alert("Please Enter Text");
    }
    console.log(keyword);
    let url3 = `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${keyword}&locale=en-US&per_page=40&page=1`;
    getData3(url3);
}



// function prev_page(){

//     pg_count--;
//     console.log(pg_count);  
//     document.getElementById('container').innerHTML="";
//     let keyword = document.getElementById('keyword').value;
//     if(keyword.length == 0){
//         return alert("Please Enter Text");
//     }
//     console.log(keyword);
//     let url3 = `https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${keyword}&locale=en-US&per_page=40&page=${pg_count}`;
//     getData3(url3);
// }

// async function getData2(){
//     try {
//         const response = await fetch(url2, options2);
//         const result = await response.text();
//         const obj = JSON.parse(result);
//         let photos = obj.edges;
//         // console.log(photos);
//         photos.forEach(myFunction);
//         function myFunction(value){
//             // console.log(value.node.thumbnail_src)
//             let img = document.createElement('img');
//             img.src = value.node.thumbnail_src;
//             document.getElementById('container').appendChild(img);
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }




// async function getData1() {
//     try {
//         const response = await fetch(url1, options1);
//         const result = await response.text();
//         const obj = JSON.parse(result);
//         // console.log(result)
//         let photos = obj.data;
//         // console.log(photos)
//         photos.forEach(myFunction);
//         function myFunction(value) {

//             let img = document.createElement('img');
//             img.src = value.thumbnail;
//             document.getElementById('container').appendChild(img);
//             img.classList.add('img-fluid');
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

// getData1();
// getData2();
// getData3(url3);

//filckr 3701d6bf2e4d3c9789beaa053a5ab400
// c52d813ebf4b5858


// const url = 'https://pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com/api/basesearch?query=dog';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
// 		'X-RapidAPI-Host': 'pinterest-downloader-download-pinterest-image-video-and-reels.p.rapidapi.com'
// 	}
// };

// async function getData3(url) {
//     try {
//         const response = await fetch(url, options);
//         const result = await response.text();
//         const obj = JSON.parse(result);
//         console.log(obj)
//         let photos = obj.resource_response.results;
//         photos.forEach(myFunction);
//         function myFunction(value) {
//             console.log(value);
//             let img = document.createElement('img');
//             img.src = value.images["170x"].url;
//             document.getElementById('container').appendChild(img);
//             img.classList.add('img-fluid', 'm-2', 'result-img');
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

// getData3(url);




// const url = 'https://bing-image-search1.p.rapidapi.com/images/search?q=tiger';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
// 		'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com'
// 	}
// };

// getData3(url)

// async function getData3(url) {
//     try {
//         const response = await fetch(url, options);
//         const result = await response.text();
//         const obj = JSON.parse(result);
//         console.log(result)
//         // let photos = obj.photos;
//         // photos.forEach(myFunction);
//         // function myFunction(value) {

//         //     let img = document.createElement('img');
//         //     img.src = value.src.medium;
//         //     document.getElementById('container').appendChild(img);
//         //     img.classList.add('img-fluid', 'm-2', 'result-img');
//         // }
//     } catch (error) {
//         console.error(error);
//     }
// }