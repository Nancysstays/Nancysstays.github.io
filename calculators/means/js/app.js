import { DataManager } from './dataManager.js';
import { WageCalculator } from './wageCalculator.js';
import { Reporter } from './reporter.js';

(function () {
    const dataManager = new DataManager();
    const wageCalculator = new WageCalculator();
    const reporter = new Reporter();

    document.getElementById('wageForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const hoursWorked = parseFloat(document.getElementById('hoursWorked').value);
        const payPerHour = parseFloat(document.getElementById('payPerHour').value);
        const payPerMile = parseFloat(document.getElementById('payPerMile').value) || 0;
        const milesDriven = parseFloat(document.getElementById('milesDriven').value) || 0;
        const estimatedNumber = parseFloat(document.getElementById('estimatedNumber').value) || 0;
        const useEstimated = document.getElementById('useEstimatedYes').checked;

        const wageData = {
            hoursWorked,
            payPerHour,
            payPerMile,
            milesDriven,
            estimatedNumber,
            useEstimated
        };

        dataManager.saveData(wageData);

        const calculatedData = wageCalculator.calculate(wageData);
        const reports = reporter.generateReports(calculatedData);

        document.getElementById('results').innerHTML = reports.resultsHTML;
        document.getElementById('reports').innerHTML = reports.reportsHTML;

    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./serviceWorker.js')
            .then(reg => console.log('Service Worker Registered', reg))
            .catch(err => console.log('Service Worker Registration Failed', err));
    }
})();
