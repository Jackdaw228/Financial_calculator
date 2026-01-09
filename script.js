let transactions = JSON.parse(localStorage.getItem('myTransactions')) || [];
let totalIncome = 0;
let totalExpense = 0;
let totalBalance = 0;
let formMessage = document.getElementById('form-message');
function updateDashboard() {
    totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    totalBalance = totalIncome - totalExpense;
    document.getElementById("total-income").innerText = `${totalIncome} ₴`;
    document.getElementById("total-expense").innerText = `${totalExpense} ₴`;
    document.getElementById("total-balance").innerText = `${totalBalance} ₴`;
}
function renderHistory() {
    let historyList = document.getElementById("history-list");
    if (!historyList) return;
    historyList.innerHTML = ''; 
    transactions.forEach((t, index) => {
        let li = document.createElement("li");
        let categoryText = t.type === 'income' ? '(дохід)' : '(витрата)';
        let amountClass = t.type === 'income' ? 'income' : 'expense';
        li.innerHTML = `
            <div class="info">${t.description} <span>${categoryText}</span></div>
            <div class="amount-box">
                <span class="amount-text ${amountClass}">${t.amount} ₴</span>
                <span class="delete-btn" onclick="deleteTransaction(${index})">×</span>
            </div>
        `;
        historyList.prepend(li); 
    });
}
function addTransaction(type) {
    let amountInput = document.getElementById(`${type}-amount`);
    let descriptionInput = document.getElementById(`${type}-description`);
    let amount = Number(amountInput.value);
    let description = descriptionInput.value.trim();
    if (amountInput.value === '' || description === '' || amount <= 0) {
        showMessage("Будь ласка, введіть коректні дані!", "error");
        return;
    }
    let newTransaction = {
        type: type,
        amount: amount,
        description: description,
        id: Date.now()
    };
    transactions.push(newTransaction);
    saveData();
    amountInput.value = '';
    descriptionInput.value = '';
    showMessage("Додано успішно!", "success");
}
function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveData();
    showMessage("Запис видалено", "success");
}
function saveData() {
    localStorage.setItem('myTransactions', JSON.stringify(transactions));
    updateDashboard();
    renderHistory();
}
function showMessage(text, type) {
    let msgElement = document.getElementById('form-message');
    if (!msgElement) return;
    msgElement.textContent = text;
    msgElement.className = type;
    msgElement.style.display = 'block';
    setTimeout(() => {
        msgElement.style.display = 'none';
    }, 3500);
}
window.onload = function() {
    updateDashboard();
    renderHistory();
};