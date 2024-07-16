(function() {
    const $ = q => document.querySelector(q);

    const TOTAL_SPOTS = 50; // Total de vagas disponíveis

    function renderGarage(vehicles) {
        const garage = vehicles || getGarage();
        $("#garage").innerHTML = "";
        garage.forEach(c => addCarToGarage(c));
        updateParkingInfo(garage.length); // Atualiza informações de vagas disponíveis e ocupadas
    }

    function addCarToGarage(car) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.name}</td>
            <td>${car.licence}</td>
            <td data-time="${car.time}">
                ${new Date(car.time).toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric' })}
            </td>
            <td>
                <button class="delete">x</button>
            </td>
        `;
        $("#garage").appendChild(row);
    }

    function updateParkingInfo() {
        const garage = getGarage();
        const occupiedCount = garage.length;
        const availableSpots = TOTAL_SPOTS - occupiedCount;

        $("#available-spots").textContent = availableSpots;
        $("#occupied-spots").textContent = occupiedCount;
    }

    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    document.addEventListener("DOMContentLoaded", () => {
        renderGarage();
        
        $("#search-button").addEventListener("click", () => {
            performSearch();
        });

        $("#search-licence").addEventListener("input", () => {
            performSearch();
        });

        $("#garage").addEventListener("click", (e) => {
            if (e.target.className === "delete") {
                const row = e.target.parentElement.parentElement;
                checkOut(row.cells);
            }
        });
    });

    function performSearch() {
        const searchValue = $("#search-licence").value.trim().toUpperCase();
        const garage = getGarage();
        
        if (searchValue === "") {
            renderGarage(garage); // Mostra todos os carros se o campo de busca estiver vazio
        } else {
            const filteredCars = garage.filter(car => car.licence.toUpperCase().includes(searchValue));
            renderGarage(filteredCars);
        }
    }

    function checkOut(info) {
        const licence = info[1].textContent;
        const garage = getGarage().filter(c => c.licence !== licence);
        localStorage.garage = JSON.stringify(garage);
        renderGarage();
    }
})();
