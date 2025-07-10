const BASE_URL = "https://pixabay.com/api/"
const API_KEY = "51262611-6f73fdc02abdf9318271eddeb"
const api_type = "photo"

const btnSearch = document.querySelector(".btnSearch");
const input = document.querySelector(".inputSearch");
const form = document.querySelector(".fromSearch");
const gallery = document.querySelector(".main");

const loadImage = async (e) => {
        e.preventDefault();
        const text = input.value.trim();
        console.log(text);
        try {
            const res = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${text}&image_type=${api_type}`);
            const data = res.data;
            console.log(data);
    
            input.value = '';

            // const div = document.createElement("div")
            // div.innerHTML`
            // <img class="foto" src="${data.pageURL}" alt="${input}">
            // `
        }
        
        catch (error) {
             console.error(error);
        }
        
    }


form.addEventListener("submit", loadImage)