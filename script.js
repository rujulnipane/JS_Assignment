// const url = 'https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest?url=https%3A%2F%2Fin.pinterest.com%2Fpin%2F1095852521805152932%2F';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
// 		'X-RapidAPI-Host': 'pinterest-video-and-image-downloader.p.rapidapi.com'
// 	}
// };




// const url = 'https://pinterest-video-and-image-downloader.p.rapidapi.com/pinterest-user?username=dog';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
// 		'X-RapidAPI-Host': 'pinterest-video-and-image-downloader.p.rapidapi.com'
// 	}
// };

const url = 'https://instagram130.p.rapidapi.com/media-info?code=CU-YfDbFMmf';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1541e54116msh122880b1fc2de60p1c441ejsndb9c34fab85c',
		'X-RapidAPI-Host': 'instagram130.p.rapidapi.com'
	}
};



async function getData(){
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        document.write(result);
    } catch (error) {
        console.error(error);
    }
}

getData();
