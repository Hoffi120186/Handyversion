document.addEventListener("DOMContentLoaded", function () {
    let startTime = localStorage.getItem("startTime");
    if (!startTime) {
        startTime = Date.now();
        localStorage.setItem("startTime", startTime);
    }

    const statusButton = document.getElementById("status4Button");
    const endButton = document.getElementById("einsatzEndeButton");
    const categoryButton = document.getElementById("sichtungskategorieButton");
    const categoryContainer = document.getElementById("categoryContainer");
    const categories = document.querySelectorAll(".categoryButton");

    if (statusButton) {
        statusButton.addEventListener("click", function () {
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            localStorage.setItem("gesamtEinsatzzeit", totalTime);
        });
    }

    if (endButton) {
        endButton.addEventListener("click", function () {
            const patientEndTime = Date.now();
            const patientTotalTime = patientEndTime - startTime;
            localStorage.setItem(window.location.pathname, patientTotalTime);
        });
    }

    if (categoryButton) {
        categoryButton.addEventListener("click", function () {
            categoryContainer.style.display = "block";
        });
    }

    categories.forEach(button => {
        button.addEventListener("click", function () {
            categories.forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
            localStorage.setItem("category_" + window.location.pathname, this.dataset.category);
        });
    });

    function loadSummary() {
        let summary = "Gesamtzeiten:\n";
        let categoriesCount = { rot: 0, gelb: 0, grün: 0, schwarz: 0 };
        
        for (let key in localStorage) {
            if (key.startsWith("/") && key !== "startTime") {
                summary += `${key}: ${localStorage.getItem(key)} ms\n`;  // Verwende Backticks
            }
            if (key.startsWith("category_")) {
                let cat = localStorage.getItem(key);
                if (categoriesCount[cat] !== undefined) {
                    categoriesCount[cat]++;
                }
            }
        }
        
        summary += "\nSichtungskategorien:\n";
        for (let cat in categoriesCount) {
            summary += `${cat}: ${categoriesCount[cat]}\n`;  // Verwende Backticks
        }
        
        alert(summary);
    }

    document.getElementById("showSummaryButton").addEventListener("click", loadSummary);
});

    function resetAndRedirect() {
        window.location.href = "/index.html"; // Hier kannst du die gewünschte Seite angeben
    }




