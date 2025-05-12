document.addEventListener("DOMContentLoaded", async function() {
    const select = document.getElementById("company-select");
    const tbody = document.getElementById("stock-data");
    const downloadBtn = document.getElementById("download-csv");
    const loading = document.getElementById("loading");

    async function fetchData(ticker) {
        loading.style.display = "block";
        try {
            const response = await fetch(`/api/stock/${ticker}`);
            const data = await response.json();

            tbody.innerHTML = "";
            if (!data.results) {
                tbody.innerHTML = "<tr><td colspan='8'>No data available</td></tr>";
                return;
            }

            let csvData = "Date,Volume,VWAP,Open,Close,High,Low,Trades\n";
            data.results.forEach(result => {
                const row = document.createElement("tr");
                const dateString = new Date(result.t).toLocaleDateString();

                row.innerHTML = `
                    <td>${dateString}</td>
                    <td>${result.v}</td>
                    <td>${result.vw.toFixed(2)}</td>
                    <td>${result.o.toFixed(2)}</td>
                    <td>${result.c.toFixed(2)}</td>
                    <td>${result.h.toFixed(2)}</td>
                    <td>${result.l}</td>
                    <td>${result.n}</td>
                `;
                tbody.appendChild(row);
                csvData += `${dateString},${result.v},${result.vw.toFixed(2)},${result.o.toFixed(2)},${result.c.toFixed(2)},${result.h.toFixed(2)},${result.l},${result.n}\n`;
            });

            downloadBtn.dataset.csv = csvData;
        } catch (e) {
            console.error("Error fetching data:", e);
        } finally {
            loading.style.display = "none";
        }
    }

    function downloadCSV() {
        const csvContent = downloadBtn.dataset.csv;
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "stock_data.csv";
        link.click();
    }

    select.addEventListener("change", () => fetchData(select.value));
    downloadBtn.addEventListener("click", downloadCSV);

    fetchData(select.value);
});
