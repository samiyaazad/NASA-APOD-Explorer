const API_KEY = "3p7bmb9KW0ObWpsVT0YUFZogJ2EAgXd5CK7UG8X3";
let isLoading = false;

// Tabs
document.getElementById("apodTab").addEventListener("click", () => switchTab("apod"));
document.getElementById("marsTab").addEventListener("click", () => switchTab("mars"));
document.getElementById("earthTab").addEventListener("click", () => switchTab("earth"));

// APOD buttons
document.getElementById("loadBtn").addEventListener("click", () => getAPOD());
document.getElementById("todayBtn").addEventListener("click", () => {
    document.getElementById("datePicker").value = "";
    getAPOD();
});
document.getElementById("randomBtn").addEventListener("click", () => {
    document.getElementById("datePicker").value = "";
    getAPOD(true);
});

// Load APOD by default
getAPOD();

// Switch tabs
function switchTab(tab) {
    document.getElementById("apodSection").classList.add("hidden");
    document.getElementById("marsSection").classList.add("hidden");
    document.getElementById("earthSection").classList.add("hidden");

    if (tab === "apod") document.getElementById("apodSection").classList.remove("hidden");
    else if (tab === "mars") {
        document.getElementById("marsSection").classList.remove("hidden");
        getMarsPhotos();
    } else if (tab === "earth") {
        document.getElementById("earthSection").classList.remove("hidden");
        getEarthEvents();
    }
}

// APOD Function
async function getAPOD(isRandom = false) {
    if (isLoading) return;
    const status = document.getElementById("status");
    const loader = document.getElementById("loader");

    try {
        isLoading = true;
        loader.classList.remove("hidden");
        status.innerText = "";

        const selectedDate = document.getElementById("datePicker").value;
        const today = new Date().toISOString().split("T")[0];

        if (selectedDate && selectedDate > today) throw new Error("Future dates not allowed.");

        let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
        if (isRandom) url += "&count=1";
        else if (selectedDate) url += `&date=${selectedDate}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Network error. Try again.");

        const data = await res.json();
        renderAPOD(isRandom ? data[0] : data);

    } catch (err) { status.innerText = err.message; }
    finally { isLoading = false; loader.classList.add("hidden"); }
}

function renderAPOD(data) {
    const container = document.getElementById("mediaContainer");
    const title = document.getElementById("title");
    const date = document.getElementById("date");
    const explanation = document.getElementById("explanation");

    container.innerHTML = "";
    title.innerText = data.title;
    date.innerText = "DATE: " + data.date;
    explanation.innerText = data.explanation;

    if (data.media_type === "image") {
        const img = document.createElement("img");
        img.src = data.url;
        img.alt = data.title;
        img.classList.add("fade-in");
        container.appendChild(img);
    } else if (data.media_type === "video") {
        const iframe = document.createElement("iframe");
        iframe.src = data.url;
        iframe.width = "100%";
        iframe.height = "500";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
    }
}

// Mars Rover
async function getMarsPhotos() {
    const container = document.getElementById("marsContainer");
    const status = document.getElementById("status");
    container.innerHTML = "";
    status.innerText = "Loading Mars photos...";

    try {
        const earthDate = "2022-08-01"; // Known date with photos
        const res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${earthDate}&api_key=${API_KEY}`);
        if (!res.ok) throw new Error("Failed to load Mars photos.");

        const data = await res.json();
        const photos = data.photos.slice(0, 8);
        if (!photos.length) container.innerHTML = "<p>No Mars photos found.</p>";

        photos.forEach(p => {
            const img = document.createElement("img");
            img.src = p.img_src;
            img.alt = "Mars Rover Photo";
            img.classList.add("mars-img");
            container.appendChild(img);
        });
        status.innerText = "";
    } catch (err) { status.innerText = err.message; }
}

// Earth Events (EONET)
async function getEarthEvents() {
    const container = document.getElementById("eventsContainer");
    const status = document.getElementById("status");
    container.innerHTML = "";
    status.innerText = "Loading Earth Events...";

    try {
        const res = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?status=open");
        if (!res.ok) throw new Error("Failed to load Earth events.");
        const data = await res.json();
        const events = data.events.slice(0, 12);

        if (!events.length) container.innerHTML = "<p>No events found.</p>";

        events.forEach(event => {
            const card = document.createElement("div");
            card.classList.add("event-card");

            const title = document.createElement("h3");
            title.innerText = event.title;

            const geomDate = event.geometry?.[0]?.date?.split("T")[0] || "N/A";
            const date = document.createElement("p");
            date.innerText = "Date: " + geomDate;

            const img = document.createElement("img");
            img.classList.add("event-img");

            const cats = event.categories.map(c => c.title.toLowerCase()).join(" ");
            if (cats.includes("wildfire")) img.src = "https://upload.wikimedia.org/wikipedia/commons/6/66/Wildfire.jpg";
            else if (cats.includes("storm") || cats.includes("hurricane") || cats.includes("tropical")) img.src = "https://upload.wikimedia.org/wikipedia/commons/8/85/Hurricane_Laura_2020_Landfall.jpg";
            else if (cats.includes("volcano")) img.src = "https://upload.wikimedia.org/wikipedia/commons/4/4b/Volcano_in_Hawaii.jpg";
            else img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/NASA_Earth.jpg/640px-NASA_Earth.jpg";

            img.alt = event.title;
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(date);
            container.appendChild(card);
        });

        status.innerText = "";
    } catch (err) { status.innerText = err.message; }
}

// Floating stars
for (let i = 0; i < 150; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = Math.random() * window.innerHeight + "px";
    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.width = star.style.height = Math.random() * 2 + 1 + "px";
    document.getElementById("stars").appendChild(star);
}
