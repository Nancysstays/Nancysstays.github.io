export class WageCalculator {
    constructor() { }

    calculate(data) {
        let totalPay;
        if (data.useEstimated) {
            totalPay = data.estimatedNumber;
        } else {
            totalPay = (data.hoursWorked * data.payPerHour) + (data.milesDriven * data.payPerMile);
        }

        return {
            totalPay,
            hourlyRate: data.payPerHour,
            daily: totalPay,
            weekly: totalPay * 5, // Assuming 5-day work week
            monthly: totalPay * 20, // Assuming 20 work days a month
            quarterly: totalPay * 60, // Assuming 60 work days a quarter
            yearly: totalPay * 240 // Assuming 240 work days a year
        };
    }
}
