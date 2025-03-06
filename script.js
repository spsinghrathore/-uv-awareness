// Initialize headers and options for OpenUV API
const myHeaders = new Headers();
myHeaders.append("x-access-token", "openuv-ijuvrm3cqr412-io"); // Replace with your actual token
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
async function fetchUVIndex() {
    try {
        // Fetching UV Index data from OpenUV API for specified latitude and longitude
       const response = await fetch("https://api.openuv.io/api/v1/uv?lat=26.9124&lng=75.7873", requestOptions);
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Log full data for debugging

        // Extract the UV index from the API response
        const uvIndex = Math.floor(data.result.uv);
        console.log('UV Index:', uvIndex);

        // Update the UV Index value in the HTML
        const uvIndexElement = document.querySelector('.uvIndex');
        if (uvIndexElement) {
            uvIndexElement.textContent = uvIndex;
        } else {
            console.error("Element with class '.uvIndex' not found.");
        }

        // Set up variables for sun image and tips based on the UV index
        const sunImage = document.querySelector('.header__sun');
        let tipsContent = '';

        // Determine tips and image based on UV index
        if (uvIndex < 3) {
            sunImage.src = '/images/sun__low.png';
            tipsContent = `
                <strong>Low UV Index 🌤️</strong><br>
                Enjoy the outdoors safely. Minimal sun protection required.<br>
                Wear sunglasses to protect your eyes. 👓
            `;
        } else if (uvIndex < 6) {
            sunImage.src = 'images/sun__medium.png';
            tipsContent = `
                <strong>Moderate UV Index 🌥️</strong><br>
                Stay cautious and take basic protective measures.<br>
                Wear sunscreen (SPF 30+), a hat, and sunglasses. 🧴🕶️
            `;
        } else if (uvIndex < 8) {
            sunImage.src = 'images/sun__high.png';
            tipsContent = `
                <strong>High UV Index 🌞</strong><br>
                Reduce direct sun exposure, especially during midday.<br>
                Apply sunscreen (SPF 30+), wear a wide-brimmed hat, and seek shade if possible. 🧴👒🌳
            `;
        } else {
            sunImage.src = 'images/sun__extreme.png';
            tipsContent = `
                <strong>Extreme UV Index 🔥</strong><br>
                Take extra precautions; unprotected skin can burn within minutes.<br>
                Avoid direct sunlight, wear long sleeves, and apply high-SPF sunscreen (50+). 🧴🧢🧥🏠
            `;
        }

        // Update the tips section with the appropriate content
        const tipsContentElement = document.querySelector('.tips__content');
        if (tipsContentElement) {
            tipsContentElement.innerHTML = tipsContent;
        } else {
            console.error("Element with class '.tips__content' not found.");
        }


        // Call function to update the position of the pointer
        updateUVIndicator(uvIndex);

    } catch (error) {
        // Handle any errors in the API call
        console.error('Error fetching UV index:', error);

        const uvIndexElement = document.querySelector('.uvIndex');
        if (uvIndexElement) {
            uvIndexElement.textContent = 'N/A';
        } else {
            console.error("Element with class '.uvIndex' not found.");
        }

        const tipsContentElement = document.querySelector('.tips__content');
        if (tipsContentElement) {
            tipsContentElement.textContent = 'Could not load sun safety tips.';
        } else {
            console.error("Element with class '.tips__content' not found.");
        }
    }
}

function updateUVIndicator(uvIndex) {
    const pointer = document.getElementById('sun__pointer');

    // Constrain UV index to a maximum of 11 for positioning purposes
    const uvMax = Math.min(uvIndex, 11);

    // Calculate the bottom position based on the UV index (since 0 = bottom, 11 = top)
    const maxPosition = 200; // Height of the container (indicator-container)
    const position = (uvMax / 11) * maxPosition;

    // Update the position of the pointer
    pointer.style.bottom = `${position}px`;

    console.log(`Pointer position set to: ${position}px for UV Index: ${uvIndex}`);
}

// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function() {
    fetchUVIndex();
});


