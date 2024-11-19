function calculateMortgage() {
  // Get input values
  const loanAmount = parseFloat(document.getElementById("loanAmount").value);
  const interestRate = parseFloat(document.getElementById("interestRate").value) / 100 / 12; // Monthly interest rate
  const loanTerm = parseFloat(document.getElementById("loanTerm").value) * 12; // Loan term in months

  // Calculate monthly payment
  const monthlyPayment = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) / (Math.pow(1 + interestRate, loanTerm) - 1);

  // Calculate total payment
  const totalPayment = monthlyPayment * loanTerm;

  // Display results
  document.getElementById("monthlyPayment").textContent = "$" + monthlyPayment.toFixed(2);
  document.getElementById("totalPayment").textContent = "$" + totalPayment.toFixed(2);
}
