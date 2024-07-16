(function(){
    const $ = q => document.querySelector(q);

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

    function renderReport() {
        const garage = getGarage();
        const reportBody = $("#report-body");
        let totalCost = 0;

        reportBody.innerHTML = "";

        garage.forEach(car => {
            const entryTime = new Date(car.time);
            const exitTime = new Date();
            const periodInMillis = exitTime - entryTime;
            const cost = calculateCost(periodInMillis);
            totalCost += parseFloat(cost);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${car.name}</td>
                <td>${car.licence}</td>
                <td>${cost}</td>
            `;
            reportBody.appendChild(row);
        });

        $("#total-cost").textContent = totalCost.toFixed(2);
    }

    const getGarage = () => localStorage.garage ? JSON.parse(localStorage.garage) : [];

    renderReport();
})();
