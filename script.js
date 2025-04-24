let clickCount = 0;

const countrySearchInput = document.getElementById('countrySearch');
const countrySuggestions = document.getElementById('countrySuggestions');
let countries = [];
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        countries = data.map(country => country.name.common);
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function filterCountries(query) {
    const filtered = countries.filter(country =>
        country.toLowerCase().includes(query.toLowerCase())
    );
    displaySuggestions(filtered);
}

function displaySuggestions(filteredCountries) {
    countrySuggestions.innerHTML = '';
    filteredCountries.forEach(country => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = country;
        li.addEventListener('click', () => selectCountry(country));
        countrySuggestions.appendChild(li);
    });
}

function selectCountry(country) {
    countrySearchInput.value = country;
    countrySuggestions.innerHTML = '';
}

countrySearchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query) {
        filterCountries(query);
    } else {
        countrySuggestions.innerHTML = '';
    }
});


function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            selectCountry(country);
            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
        const countryCodeInput = document.getElementById('countryCode');
        if (countryCodeInput) {
            const option = Array.from(countryCodeInput.options).find(opt => opt.value === countryCode);
            if (option) {
                option.selected = true;
            } else {
                const newOption = document.createElement('option');
                newOption.value = countryCode;
                newOption.textContent = `${countryCode} (Automatycznie wykryty)`;
                newOption.selected = true;
                countryCodeInput.appendChild(newOption);
            }
        }
    })
    .catch(error => {
        console.error('Wystąpił błąd:', error);
    });
}

function validateForm(event) {
    const form = document.getElementById('form');
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
    }
}


function validateVAT() {
    const vatInput = document.getElementById('vatNumber');
    const vatPattern = /^[A-Z]{2}[0-9]{8,12}$/;

    if (!vatPattern.test(vatInput.value)) {
        vatInput.setCustomValidity('Numer VAT powinien zaczynać się od kodu kraju (2 litery) i zawierać od 8 do 12 cyfr, np. PL1234567890');
        vatInput.reportValidity();
        return false;
    } else {
        vatInput.setCustomValidity('');
        return true;
    }
}




(() => {
    fetchAndFillCountries();
    document.addEventListener('click', handleClick);
    document.addEventListener('DOMContentLoaded', fetchAndFillCountries);
    document.getElementById('form').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const form = event.target;
    
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.add('was-validated');
            } else {
                event.preventDefault();
                const clickCountElement = document.getElementById('click-count');
                clickCountElement.textContent = clickCount; // Use the clickCount variable here
                const modal = new bootstrap.Modal(document.getElementById('form-feedback-modal'));
                modal.show();
            }
        }
    
    });

    document.getElementById('form').addEventListener('submit', function (event) {
        const form = event.target;
    
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
        } else {
            event.preventDefault();
            const clickCountElement = document.getElementById('click-count');
            clickCountElement.textContent = clickCount; // Use the clickCount variable here
            const modal = new bootstrap.Modal(document.getElementById('form-feedback-modal'));
            modal.show();
        }
    });

})()



