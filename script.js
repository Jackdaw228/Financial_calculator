let formMessage = document.createElement('div');
formMessage.id = 'form-message';
document.body.appendChild(formMessage);
let showMessage = (text, type) => {
    formMessage.textContent = text;
    formMessage.className = type;
    formMessage.style.display = 'block';
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 3000);
};
let totalIncome = 0;
let totalExpense = 0;
let totalBalance = 0;
let transactions = [];
let setCookie = (name, value, days = 365) => {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}
let getCookie = (name) => {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
};
let saveData = () => {
    let data = {
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        transactions: transactions
    };
    setCookie('budgetData', JSON.stringify(data));
};
let loadData = () => {
    let savedData = getCookie('budgetData');
    if (savedData) {
        try {
            let data = JSON.parse(savedData);
            totalIncome = data.totalIncome || 0;
            totalExpense = data.totalExpense || 0;
            transactions = data.transactions || [];
            let historyList = document.getElementById("history-list");
            transactions.forEach(trans => {
                let li = createTransactionElement(trans);
                historyList.appendChild(li);
            });
            updateDashboard();
        } catch (e) {
            console.error('Помилка завантаження даних:', e);
        }
    }
};
let createTransactionElement = (trans) => {
    let li = document.createElement("li");
    li.innerHTML = `
        <div class="info">
            ${trans.description} <span>${trans.categoryText}</span>
        </div>
        <div class="amount-box">
            <span class="amount-text ${trans.amountClass}">${trans.amount} ₴</span>
            <span class="delete-btn">×</span>
        </div>
    `;
    li.querySelector('.delete-btn').onclick = () => {
        if (trans.type === 'income') {
            totalIncome -= trans.amount;
        } else {
            totalExpense -= trans.amount;
        }
        transactions = transactions.filter(t => t.id !== trans.id);
        li.remove();
        updateDashboard();
        saveData();
    };
    return li;
};
let updateDashboard = () => {
    totalBalance = totalIncome - totalExpense;
    document.getElementById("total-income").innerText = `${totalIncome} ₴`;
    document.getElementById("total-expense").innerText = `${totalExpense} ₴`;
    document.getElementById("total-balance").innerText = `${totalBalance} ₴`;
};
let addTransaction = (type) => {
    let amountInput = document.getElementById(`${type}-amount`);
    let descriptionInput = document.getElementById(`${type}-description`);
    let historyList = document.getElementById("history-list");
    let amount = Number(amountInput.value);
    let description = descriptionInput.value.trim();
    if (!description || isNaN(amount) || amount <= 0) {
        showMessage('Будь ласка, заповніть усі поля коректно (сума має бути більша за 0)!', 'error');
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
    let transaction = {
        id: Date.now(),
        type: type,
        amount: amount,
        description: description,
        categoryText: categoryText,
        amountClass: amountClass
    };
    transactions.unshift(transaction);
    let li = createTransactionElement(transaction);
    historyList.prepend(li);
    updateDashboard();
    saveData();
    amountInput.value = '';
    descriptionInput.value = '';
    showMessage(
        type == 'income'
            ? 'Дохід додано успішно 💚'
            : 'Витрату додано успішно ❤️',
        'success'
    );
};
window.addEventListener('DOMContentLoaded', loadData);