// State Management 
let isLoading = false;

//Event Listener 
document.getElementById("loadBtn").addEventListener("click",getSpace);

// Auto-load today's APOD 
getSpace();

// Main Fetch Function 
async function getSpace() {

    if (isLoading) return;

    const status = document.getElementById("status");
    const button = document.getElementById("loadBtn");

    try {
        isLoading = true;
        button.disabled = true;
        status.innerText = "Fetching data from NASA...";

        const selectedDate = document.getElementById("datePicker").value;
        const today = new Date().toISOString().split("T")[0];

        // Prevent Future date selection 
        if (selectedDate && selectedDate > today ) {
            throw new Error("NASA hasn't published future APODs yet.");
        }

        const API_KEY = "3p7bmb9KW0ObWpsVT0YUFZogJ2EAgXd5CK7UG8X3";
        let url = "https://api.nasa.gov/planetary/apod?api_key=3p7bmb9KW0ObWpsVT0YUFZogJ2EAgXd5CK7UG8X3";

        if (selectedDate) {
            url += "&date=" + selectedDate;
        }

        // Caching Layer 

        const cacheKey = `apod-${selectedDate || "today"}`;
        const cachedDate = localStorage.getItem(cacheKey);

        let data;

        if (cachedDate) {
            data = JSON.parse(cachedDate);
            console.log("Loaded from cache");
        } else {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Network response failed.");
            }

            data = await response.json();
            localStorage.setItem(cacheKey, JSON.stringify(data));
            console.log("Fetched from NASA API");

        }

        renderData(data);
        status.innerText = "";


    } catch (error) {
        status.innerText = error.message;
        console.error(error);
    } finally {
        isLoading = false;
        button.disabled = false;
    }

}


// Render Function (Separation of Concerns) 

function renderData(data) {
     
    const title = document.getElementById("title");
    const date = document.getElementById("date");
    const explanation = document.getElementById("explanation");
    const container = document.getElementById("mediaContainer");

    title.innerText = data.title;
    date.innerText = "Date: " + data.date;
    explanation.innerText = data.explanation;

    container.innerHTML = "";

    if (data.media_type === "image") {

        const img = document.createElement("img");
        img.src = data.url;
        img.classList.add("fade-in");

        container.appendChild(img);

    } else if (data.media_type === "video") {

        const iframe = document.createElement("iframe");
        iframe.src = data.url;
        iframe.width = "100%";
        iframe.height = "500px";
        iframe.frameBorder = "0";
        iframe.allow = 
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        container.appendChild(iframe);

    }

}