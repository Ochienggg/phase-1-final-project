document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById('add');
    const nameInput = document.getElementById('name');
    const locationInput = document.getElementById('location');
    const priceInput = document.getElementById('price');
    const descriptionInput = document.getElementById('description');
    const airbnbsTable = document.getElementById('airbnbsTable').getElementsByTagName('tbody')[0];
    
    const placesContainer = document.querySelector('.places-container');
    const bestPlacesTableBody = document.querySelector('.best-places tbody');

    // Initial data for Places and Best Places Traveled
    const placesToVisit = [
        { image: "images/miami.jpg", name: "Miami Beach", price: 200, description: "Enjoy the beautiful sandy beaches and vibrant nightlife." },
        { image: "images/santamonica.jpg", name: "Santa Monica", price: 150, description: "Relax on the iconic beaches of Santa Monica." },
        { image: "images/hawaii.jpg", name: "Hawaii", price: 350, description: "Discover the islands of Hawaii with incredible beaches." }
    ];

    const bestPlaces = [
        { location: "Maldives", highlights: "Private overwater bungalows, crystal-clear waters", rating: "5/5" },
        { location: "Bora Bora", highlights: "Luxury resorts, turquoise lagoons", rating: "4.8/5" },
        { location: "French Riviera", highlights: "Exclusive beaches, world-class dining", rating: "4.9/5" }
    ];

    // Function to display Places We Charge People to Visit
    function displayPlacesToVisit() {
        placesToVisit.forEach(place => {
            const placeElement = document.createElement('div');
            placeElement.classList.add('place');
            placeElement.innerHTML = `
                <img src="${place.image}" alt="${place.name}">
                <h3>${place.name}</h3>
                <p>Price: $${place.price} per day</p>
                <p>${place.description}</p>
            `;
            placesContainer.appendChild(placeElement);
        });
    }

    // Function to display Best Places Traveled
    function displayBestPlaces() {
        bestPlaces.forEach(place => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${place.location}</td>
                <td>${place.highlights}</td>
                <td>${place.rating}</td>
            `;
            bestPlacesTableBody.appendChild(row);
        });
    }

    // Fetch existing Airbnbs and display them
    function fetchAirbnbs() {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                airbnbsTable.innerHTML = ''; // Clear existing data
                data.forEach(airbnb => {
                    const row = airbnbsTable.insertRow();
                    row.innerHTML = `
                        <td>${airbnb.name}</td>
                        <td>${airbnb.location}</td>
                        <td>$${airbnb.price}</td>
                        <td>${airbnb.description}</td>
                        <td>
                            <button class="edit" onclick="editAirbnb('${airbnb.id}')">Edit</button>
                            <button class="delete" onclick="deleteAirbnb('${airbnb.id}')">Delete</button>
                        </td>
                    `;
                });
            });
    }

    // Add new Airbnb
    addButton.addEventListener('click', () => {
        const name = nameInput.value;
        const location = locationInput.value;
        const price = priceInput.value;
        const description = descriptionInput.value;

        if (name && location && price && description) {
            const newAirbnb = {
                id: Date.now().toString(),
                name: name,
                location: location,
                price: price,
                description: description
            };

            fetch('db.json')
                .then(response => response.json())
                .then(data => {
                    data.push(newAirbnb);
                    return fetch('db.json', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
                .then(() => {
                    fetchAirbnbs(); // Refresh the Airbnb list
                });

            // Reset the form inputs
            nameInput.value = '';
            locationInput.value = '';
            priceInput.value = '';
            descriptionInput.value = '';
        }
    });

    // Edit Airbnb
    window.editAirbnb = (airbnbId) => {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                const airbnb = data.find(a => a.id === airbnbId);
                nameInput.value = airbnb.name;
                locationInput.value = airbnb.location;
                priceInput.value = airbnb.price;
                descriptionInput.value = airbnb.description;

                addButton.textContent = 'Update Airbnb';
                addButton.onclick = () => updateAirbnb(airbnbId);
            });
    };

    // Update Airbnb
    function updateAirbnb(airbnbId) {
        const name = nameInput.value;
        const location = locationInput.value;
        const price = priceInput.value;
        const description = descriptionInput.value;

        if (name && location && price && description) {
            fetch('db.json')
                .then(response => response.json())
                .then(data => {
                    const airbnbIndex = data.findIndex(a => a.id === airbnbId);
                    if (airbnbIndex !== -1) {
                        data[airbnbIndex].name = name;
                        data[airbnbIndex].location = location;
                        data[airbnbIndex].price = price;
                        data[airbnbIndex].description = description;
                    }

                    return fetch('db.json', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
                .then(() => {
                    fetchAirbnbs(); // Refresh the Airbnb list
                    addButton.textContent = 'Add Airbnb';
                    addButton.onclick = () => addAirbnb();
                });
        }
    }

    // Delete Airbnb
    window.deleteAirbnb = (airbnbId) => {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                const updatedData = data.filter(airbnb => airbnb.id !== airbnbId);

                return fetch('db.json', {
                    method: 'POST',
                    body: JSON.stringify(updatedData),
                    headers: { 'Content-Type': 'application/json' }
                });
            })
            .then(() => {
                fetchAirbnbs(); // Refresh the Airbnb list
            });
    };

    // Load Airbnbs, Places and Best Places on page load
    fetchAirbnbs();
    displayPlacesToVisit();
    displayBestPlaces();
});

