// map settings
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' // Sett kildehenvisning for kartet

var map = L.map('map1').setView([39.827, -98.965], 5); // Opprett kart og sett visningen til et bestemt koordinat og zoom-nivå
let tileURL = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map); // Last inn kartfliser fra OpenStreetMap og legg dem til kartet
const tiles = L.tileLayer(tileURL, { attribution }) // Definer kartflisene med kildehenvisning

async function show_me() {
    let place = document.getElementById("searchbar").value; // Hent verdien fra søkefeltet
    let api_url = `https://api.openbrewerydb.org/v1/breweries/search?query=${place}&by_country=United%20States&per_page=200`; // Sett API URL med søkeparameter
    let response = await fetch(api_url); // Utfør API-kall
    let data = await response.json(); // Konverter API-responsen til JSON
    console.log(data); // Logg dataene til konsollen
    data.forEach(element => {
        // If element does not have lat or long, escape
        if (element.latitude == null || element.longitude == null) return; // Hvis elementet mangler lat eller long, hopp over det
        let marker = L.marker([element.latitude, element.longitude]).addTo(map); // Legg til en markør på kartet for hver bryggeri
        let Adress = element.street ? element.street : 'N/A'; // Hent adresse eller sett til 'N/A' hvis den mangler
        let Website = element.website_url ? `<a href="${element.website_url}" target="_blank">${element.website_url}</a>` : 'N/A'; // Hent nettside eller sett til 'N/A' hvis den mangler
        let Phone = element.phone ? element.phone : 'N/A'; // Hent telefonnummer eller sett til 'N/A' hvis det mangler
        marker.bindPopup(`
        <b>${element.name}</b><br>
        Adresse: ${Adress}<br>
        Nettside: ${Website}<br>
        Telefon: ${Phone}<br>
        Kordinater: ${element.latitude},  ${element.longitude}`).openPopup(); // Bind popup-informasjon til markøren

        // Add to sidebar
        const card = document.createElement("div") // Opprett et nytt div-element for kortet
        card.classList.add("card"); // Legg til 'card' klasse til div-elementet
        card.id = `${element.id}` // Sett ID for kortet
        card.innerHTML = `
            <h2>${element.name}</h2>
            <a href="${element.website_url}" target="_blank">Website</a>
            <p>📍 ${element.address_1}, ${element.city}, ${element.postal_code} ${element.state_province}</p>
            <p>📞 ${element.phone}</p>` // Sett HTML-innholdet for kortet

        document.getElementById("sidebar_container").appendChild(card); // Legg kortet til sidebar-containeren
        
        // add overflow-y to container 
        document.getElementById("sidebar_container").classList.add("overflow-y"); // Legg til 'overflow-y' klasse til sidebar-containeren for å tillate vertikal rulling
    });
}
