let totalIncome = 0;
let totalExpense = 0;
let totalBalance = 0;

function updateDashboard() {
    totalBalance = totalIncome - totalExpense;
    document.getElementById("total-income").innerText = `${totalIncome} ₴`;
    document.getElementById("total-expense").innerText = `${totalExpense} ₴`;
    document.getElementById("total-balance").innerText = `${totalBalance} ₴`;
}

function addTransaction(type) {
    let amountInput = document.getElementById(`${type}-amount`);
    let descriptionInput = document.getElementById(`${type}-description`);
    let historyList = document.getElementById("history-list");
    let amount = Number(amountInput.value);
    let description = descriptionInput.value;

    if (amountInput.value === '' || description === '' || amount <= 0) {
        alert("Будь ласка, введіть коректну суму та опис.");
        return;
    }

    let categoryText;
    let amountClass;

    if (type === 'income') {
        categoryText = '(дохід)';
        amountClass = 'income';
        totalIncome += amount;
    } else {
        categoryText = '(витрата)';
        amountClass = 'expense';
        totalExpense += amount;
    }

    let li = document.createElement("li");
    li.innerHTML = `
        <div class="info">${description} <span>${categoryText}</span></div>
        <div class="amount-box">
            <span class="amount-text ${amountClass}">${amount} ₴</span>
            <span class="delete-btn">×</span>
        </div>
    `;

    li.querySelector('.delete-btn').onclick = function() {
        if (type === 'income') {
            totalIncome -= amount;
        } else {
            totalExpense -= amount;
        }
        li.remove();
        updateDashboard(); 
    };

    historyList.prepend(li); 
    
    updateDashboard();

    amountInput.value = '';
    descriptionInput.value = '';
}
    