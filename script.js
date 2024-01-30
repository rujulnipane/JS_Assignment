



const url1 = 'https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest-user?username=dog';
const options1 = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
		'X-RapidAPI-Host': 'pinterest-video-and-image-downloader.p.rapidapi.com'
	}
};

const url2 = 'https://instagram130.p.rapidapi.com/media-info?code=CU-YfDbFMmf';
const options2 = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
		'X-RapidAPI-Host': 'instagram130.p.rapidapi.com'
	}
};

const url3 = 'https://pexelsdimasv1.p.rapidapi.com/v1/search?query=dog&locale=en-US&per_page=30&page=1';
const options3 = {
	method: 'GET',
	headers: {
		Authorization: 'StETECaNFCtc7ohSE7o6AxkEiyrM5tnKxdzrNoWGB00NQzOVaRGjb88o',
		'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
		'X-RapidAPI-Host': 'PexelsdimasV1.p.rapidapi.com'
	}
};



async function getData(){
    try {
        const response = await fetch(url3, options3);
        const result = await response.text();
        const obj = JSON.parse(result);
        console.log(result)
        let photos = obj.photos;
        photos.forEach(myFunction);
        function myFunction(value){
            
            let img = document.createElement('img');
            img.src = value.src.tiny;
            document.getElementById('container').appendChild(img);
            img.classList.add('img-responsive')
        }
    } catch (error) {
        console.error(error);
    }
}

getData();

// async function getData2(){
//     try {
//         const response = await fetch(url1, options1);
//         const result = await response.text();
//         const obj = JSON.parse(result);
//         console.log(obj)
//         // let photos = obj.photos;
//         // photos.forEach(myFunction);
//         // function myFunction(value){
//         //     console.log(value.src)
//         //     let img = document.createElement('img');
//         //     img.src = value.src.tiny;
//         //     document.getElementById('container').appendChild(img);
//         //     img.classList.add('img-responsive')
//         // }
//     } catch (error) {
//         console.error(error);
//     }
// }

// getData2();






//filckr 3701d6bf2e4d3c9789beaa053a5ab400
// c52d813ebf4b5858