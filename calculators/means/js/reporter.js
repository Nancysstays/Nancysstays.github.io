export class Reporter {
    constructor() { }

    generateReports(data) {
        const resultsHTML = `
            <p>Total Pay: $${data.totalPay.toFixed(2)}</p>
            <p>Hourly Rate: $${data.hourlyRate.toFixed(2)}</p>
            `;

        const reportsHTML = `
            <p>Daily: $${data.daily.toFixed(2)}</p>
            <p>Weekly: $${data.weekly.toFixed(2)}</p>
            <p>Monthly: $${data.monthly.toFixed(2)}</p>
            <p>Quarterly: $${data.quarterly.toFixed(2)}</p>
            <p>Yearly: $${data.yearly.toFixed(2)}</p>
        `;

        return { resultsHTML, reportsHTML };
    }
}
