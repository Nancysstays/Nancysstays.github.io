(function() {
    "use strict";

    class LoanCalculator {
        #loanAmount;
        #interestRate;
        #loanTerm;

        constructor() {
            this.#loanAmount = 0;
            this.#interestRate = 0;
            this.#loanTerm = 0;
            this.init();
        }

        init() {
            this.downPaymentInput = document.getElementById('down-payment');
            this.taxesFeesInput = document.getElementById('taxes-fees');
            this.tradeInInput = document.getElementById('trade-in');
            this.showFullTable = true;
            this.repaymentScheduleDiv = document.getElementById('repayment-schedule');
            this.loanForm = document.getElementById('loan-form');
            this.loanAmountInput = document.getElementById('loan-amount');
            this.interestRateInput = document.getElementById('interest-rate');
            this.loanTermInput = document.getElementById('loan-term');
            this.calculateButton = document.querySelector('.btn-primary');
            this.resultsDiv = document.getElementById('results');
            this.repaymentScheduleDiv = document.getElementById('repayment-schedule');
            this.plotlyChartDiv = document.getElementById('plotly-chart');

            this.calculateButton.addEventListener('click', this.calculateLoan.bind(this));
            this.repaymentScheduleDiv.addEventListener('click', this.toggleRepaymentSchedule.bind(this));
        }

        calculateLoan(event) {
            event.preventDefault();

            const downPayment = parseFloat(this.downPaymentInput.value) || 0;
            const taxesFees = parseFloat(this.taxesFeesInput.value) || 0;
            const tradeIn = parseFloat(this.tradeInInput.value) || 0;
            this.#loanAmount = parseFloat(this.loanAmountInput.value);
            this.#interestRate = parseFloat(this.interestRateInput.value);
            this.#loanTerm = parseFloat(this.loanTermInput.value);

            const loanAmount = this.#loanAmount - downPayment + taxesFees - tradeIn;

            if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(this.#interestRate) || isNaN(this.#loanTerm) ||
                this.#interestRate <= 0 || this.#loanTerm <= 0) {
                alert("Please enter valid loan details.");
                return;
            }

            const monthlyInterestRate = this.#interestRate / 12 / 100;
            const numberOfPayments = this.#loanTerm * 12;
            const monthlyPayment = (loanAmount * monthlyInterestRate) /
                (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

            this.#displayResults(monthlyPayment);
            this.generateRepaymentSchedule(loanAmount);
            this.displayPlotlyChart(loanAmount);
        }

        #displayResults(monthlyPayment) {
            this.resultsDiv.innerHTML = `
                <p>Monthly Payment: ${LoanCalculator.formatCurrency(monthlyPayment)}</p>
            `;
        }

        generateRepaymentSchedule(loanAmount) {
            const schedule = [];
            let balance = loanAmount;
            const monthlyInterestRate = this.#interestRate / 12 / 100;
            const monthlyPayment = parseFloat(this.resultsDiv.querySelector('p').textContent.split(': ')[1].replace(/[^0-9.]/g, ''));

            for (let i = 1; i <= this.#loanTerm * 12; i++) {
                const interest = balance * monthlyInterestRate;
                const principal = monthlyPayment - interest;
                balance -= principal;

                schedule.push({
                    month: i,
                    payment: monthlyPayment,
                    interest: interest,
                    principal: principal,
                    balance: balance
                });
            }

            this.#displayRepaymentSchedule(schedule);
        }

        #displayRepaymentSchedule(schedule) {
            let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Payment</th>
                            <th>Interest</th>
                            <th>Principal</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            if (this.showFullTable) {
                schedule.forEach(item => {
                    tableHTML += `
                        <tr>
                            <td>${item.month}</td>
                            <td>${LoanCalculator.formatCurrency(item.payment)}</td>
                            <td>${LoanCalculator.formatCurrency(item.interest)}</td>
                            <td>${LoanCalculator.formatCurrency(item.principal)}</td>
                            <td>${LoanCalculator.formatCurrency(item.balance)}</td>
                        </tr>
                    `;
                });
            } else {
                for (let i = 0; i < 5; i++) {
                    const item = schedule[i];
                    tableHTML += `
                        <tr>
                            <td>${item.month}</td>
                            <td>${LoanCalculator.formatCurrency(item.payment)}</td>
                            <td>${LoanCalculator.formatCurrency(item.interest)}</td>
                            <td>${LoanCalculator.formatCurrency(item.principal)}</td>
                            <td>${LoanCalculator.formatCurrency(item.balance)}</td>
                        </tr>
                    `;
                }

                tableHTML += `<tr><td colspan="5">...</td></tr>`;

                for (let i = schedule.length - 5; i < schedule.length; i++) {
                    const item = schedule[i];
                    tableHTML += `
                        <tr>
                            <td>${item.month}</td>
                            <td>${LoanCalculator.formatCurrency(item.payment)}</td>
                            <td>${LoanCalculator.formatCurrency(item.interest)}</td>
                            <td>${LoanCalculator.formatCurrency(item.principal)}</td>
                            <td>${LoanCalculator.formatCurrency(item.balance)}</td>
                        </tr>
                    `;
                }
            }

            tableHTML += `</tbody></table>`;
            this.repaymentScheduleDiv.innerHTML = tableHTML;
        }

        displayPlotlyChart(loanAmount) {
            const x = [];
            const y = [];

            for (let i = 1; i <= this.#loanTerm * 12; i++) {
                x.push(i);
                y.push(this.#calculateBalance(i, loanAmount));
            }

            const data = [{
                x: x,
                y: y,
                type: 'scatter'
            }];

            const layout = {
                title: 'Loan Balance Over Time',
                xaxis: {
                    title: 'Month'
                },
                yaxis: {
                    title: 'Balance'
                }
            };

            Plotly.newPlot(this.plotlyChartDiv, data, layout);
        }

        #calculateBalance(month, loanAmount) {
            const monthlyInterestRate = this.#interestRate / 12 / 100;
            const monthlyPayment = parseFloat(this.resultsDiv.querySelector('p').textContent.split(': ')[1].replace(/[^0-9.]/g, ''));
            let balance = loanAmount;

            for (let i = 1; i <= month; i++) {
                const interest = balance * monthlyInterestRate;
                const principal = monthlyPayment - interest;
                balance -= principal;
            }

            return balance;
        }

        sendEmail() {
            // Implementation for sending email (using AJAX/jQuery) - Not implemented in this example
        }

        static formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
        }

        toggleRepaymentSchedule() {
            this.showFullTable = !this.showFullTable;
            this.calculateLoan();
        }
    }

    new LoanCalculator();
})();
