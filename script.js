document.getElementById("loadBtn").addEventListener("click", getSpace);

async function getSpace() {
    try {
        const selectedDate = document.getElementById("datePicker").value;
        let url = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

        if (selectedDate) url += "&date=" + selectedDate;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Nasa data");

        const data = await response.json();

        document.getElementById("title").innerText = data.title;
        document.getElementById("date").innerText = "Date: " + data.date;
        document.getElementById("explanation").innerText = data.explanation;

        const container = document.getElementById("mediaContainer");
        container.innerHTML = "";

        if (data.media_type === "image") {
            const img = document.createElement("img");
            img.src = data.url;

            img.classList.remove("fade-in");
            void img.offsetWidth;
            img.classList.add("fade-in");

            container.appendChild(img);

        } else if (data.media_type === "video")  {
            const iframe = document.createElement("iframe");
            iframe.src = data.url;
            iframe.width = "100%";
            iframe.height = "500px";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullScreen = true;
            container.appendChild(iframe);
        }

    } catch (error) {
        alert("Oops! Something went wrong: " + error.message);
        console.error(error);
    }
}

getSpace();