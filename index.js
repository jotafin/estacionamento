
(function(){
    const $ = q => document.querySelector(q);

    const TOTAL_SPOTS = 50; // Total de vagas disponíveis

    function convertPeriod(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    };

    function calculateCost(timeInMillis) {
        // Convertendo o tempo de milissegundos para horas
        const hours = timeInMillis / (1000 * 60 * 60);
        // Calculando o custo total com base na taxa de R$ 3 por hora
        const cost = hours * 3;
        // Arredondando para duas casas decimais
        return cost.toFixed(2);
    }

    function renderGarage () {
        const garage = getGarage();
        $("#garage").innerHTML = "";
        garage.forEach(c => addCarToGarage(c));
        updateParkingInfo(garage.length); // Atualiza informações de vagas disponíveis e ocupadas
    };

    function addCarToGarage (car) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${car.name}</td>
            <td>${car.licence}</td>
            <td data-time="${car.time}">
                ${new Date(car.time)
                        .toLocaleString('pt-BR', { 
                            hour: 'numeric', minute: 'numeric' 
                })}
            </td>
            <td>
                <button class="delete">x</button>
            </td>
        `;

        $("#garage").appendChild(row);
        updateParkingInfo(); // Atualiza informações de vagas disponíveis e ocupadas
    };

    function checkOut(info) {
        let entryTime = new Date(info[2].dataset.time);
        let exitTime = new Date();
        let periodInMillis = exitTime - entryTime;
        let periodFormatted = convertPeriod(periodInMillis);
        let cost = calculateCost(periodInMillis);
        let entryTimeString = entryTime.toLocaleString('pt-BR', { 
            hour: 'numeric', minute: 'numeric', second: 'numeric' 
        });
        let exitTimeString = exitTime.toLocaleString('pt-BR', { 
            hour: 'numeric', minute: 'numeric', second: 'numeric' 
        });

        const name = info[0].textContent;
        const licence = info[1].textContent;
        const msg = `Detalhes do veículo:\n\nNome: ${name}\nPlaca: ${licence}\n\nHorário de entrada: ${entryTimeString}\nHorário de saída: ${exitTimeString}\nTempo total: ${periodFormatted}\n\nO custo total do estacionamento é R$ ${cost}. \n\nDeseja encerrar?`;

        if(!confirm(msg)) return;
        
        const garage = getGarage().filter(c => c.licence !== licence);
        localStorage.garage = JSON.stringify(garage);
        
        renderGarage();
        displayCost(cost); // Exibe o custo no DOM
        updateParkingInfo(garage.length); // Atualiza informações de vagas disponíveis e ocupadas
    };

    function displayCost(cost) {
        const costElement = document.createElement("div");
        costElement.classList.add("cost-details");
        costElement.innerHTML = `
            <p>Custo do estacionamento: R$ ${cost}</p>
        `;
        $(".cost-info").innerHTML = ""; // Limpa o conteúdo anterior
        $(".cost-info").appendChild(costElement);
    }

    function updateParkingInfo() {
        const garage = getGarage();
        const occupiedCount = garage.length;
        const availableSpots = TOTAL_SPOTS - occupiedCount;

        $("#available-spots").textContent = availableSpots;
        $("#occupied-spots").textContent = occupiedCount;
    }

    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderGarage();
    $("#send").addEventListener("click", e => {
        const name = $("#name").value;
        const licence = $("#licence").value;

        if(!name || !licence){
            alert("Os campos são obrigatórios.");
            return;
        }   

        const garage = getGarage();
        if (garage.length >= TOTAL_SPOTS) {
            alert("O estacionamento está lotado. Não é possível registrar mais veículos.");
            return;
        }

        const card = { name, licence, time: new Date() };

        garage.push(card);

        localStorage.garage = JSON.stringify(garage);

        addCarToGarage(card);
        $("#name").value = "";
        $("#licence").value = "";

        updateParkingInfo(); // Atualiza informações de vagas disponíveis e ocupadas
    });

    $("#garage").addEventListener("click", (e) => {
        if(e.target.className === "delete")
            checkOut(e.target.parentElement.parentElement.cells);
    });

    let totalCost = 0; // Variável para armazenar o total acumulado do custo

    function checkOut(info) {
        let entryTime = new Date(info[2].dataset.time);
        let exitTime = new Date();
        let periodInMillis = exitTime - entryTime;
        let periodFormatted = convertPeriod(periodInMillis);
        let cost = calculateCost(periodInMillis);
        let entryTimeString = entryTime.toLocaleString('pt-BR', { 
            hour: 'numeric', minute: 'numeric', second: 'numeric' 
        });
        let exitTimeString = exitTime.toLocaleString('pt-BR', { 
            hour: 'numeric', minute: 'numeric', second: 'numeric' 
        });

        const name = info[0].textContent;
        const licence = info[1].textContent;
        const msg = `Detalhes do veículo:\n\nNome: ${name}\nPlaca: ${licence}\n\nHorário de entrada: ${entryTimeString}\nHorário de saída: ${exitTimeString}\nTempo total: ${periodFormatted}\n\nO custo total do estacionamento é R$ ${cost}. \n\nDeseja encerrar?`;

        if(!confirm(msg)) return;

        const garage = getGarage().filter(c => c.licence !== licence);
        localStorage.garage = JSON.stringify(garage);

        renderGarage();
        displayCost(cost); // Exibe o custo no DOM
        updateParkingInfo(garage.length); // Atualiza informações de vagas disponíveis e ocupadas

        totalCost += parseFloat(cost); // Adiciona o custo atual ao total acumulado
        updateTotalCost(); // Atualiza o valor total na interface
    };

    function updateTotalCost() {
        const totalCostElement = $("#total-cost");
        totalCostElement.textContent = totalCost.toFixed(2); // Atualiza o valor total formatado
    }

    function toggleMenu() {
        const menuContainer = document.querySelector('.menu-container');
        menuContainer.classList.toggle('active');
    }

})();

