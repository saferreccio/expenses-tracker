// storage.js - Maneja el guardado y lectura de gastos en localStorage

const ExpenseStorage = {
    // Obtener todos los gastos
    getExpenses: function() {
        const expenses = localStorage.getItem('expenses');
        return expenses ? JSON.parse(expenses) : [];
    },

    // Guardar un nuevo gasto
    addExpense: function(expense) {
        const expenses = this.getExpenses();
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        return expense;
    },

    // Obtener gastos del mes actual
    getCurrentMonthExpenses: function() {
        const expenses = this.getExpenses();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
        });
    },

    // Calcular total del mes
    getMonthTotal: function() {
        const monthExpenses = this.getCurrentMonthExpenses();
        return monthExpenses.reduce((total, expense) => total + expense.amount, 0);
    }
};