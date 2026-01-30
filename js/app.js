// app.js - Lógica principal de la aplicación

// Emojis por categoría
const categoryEmojis = {
    'comida': '🍔',
    'transporte': '🚗',
    'entretenimiento': '🎬',
    'salud': '💊',
    'hogar': '🏠',
    'otros': '📦'
};

// Inicializar la app cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    updateMonthTotal();
    displayExpenses();
    
    // Escuchar el submit del formulario
    document.getElementById('expenseForm').addEventListener('submit', handleFormSubmit);
});

// Manejar el envío del formulario
function handleFormSubmit(e) {
    e.preventDefault(); // Prevenir que la página se recargue
    
    // Obtener valores del formulario
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const note = document.getElementById('note').value;
    
    // Crear objeto de gasto
    const expense = {
        id: Date.now(), // ID único basado en timestamp
        amount: amount,
        category: category,
        note: note,
        date: new Date().toISOString()
    };
    
    // Guardar en localStorage
    ExpenseStorage.addExpense(expense);
    
    // Actualizar la interfaz
    updateMonthTotal();
    displayExpenses();
    
    // Limpiar el formulario
    document.getElementById('expenseForm').reset();
    
    // Scroll suave hacia la lista
    document.querySelector('.expense-list').scrollIntoView({ behavior: 'smooth' });
}

// Actualizar el total del mes
function updateMonthTotal() {
    const total = ExpenseStorage.getMonthTotal();
    document.getElementById('monthTotal').textContent = `$${total.toFixed(2)}`;
}

// Mostrar la lista de gastos
function displayExpenses() {
    const expenses = ExpenseStorage.getCurrentMonthExpenses();
    const expensesList = document.getElementById('expensesList');
    
    // Si no hay gastos, mostrar mensaje
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="empty-state">No hay gastos registrados todavía</p>';
        return;
    }
    
    // Ordenar por fecha (más recientes primero)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generar HTML para cada gasto
    expensesList.innerHTML = expenses.map(expense => {
        const date = new Date(expense.date);
        const formattedDate = date.toLocaleDateString('es-AR', { 
            day: 'numeric', 
            month: 'short' 
        });
        
        return `
            <div class="expense-item">
                <div class="expense-info">
                    <div>
                        <span class="expense-category">${categoryEmojis[expense.category]}</span>
                        <strong>${expense.note || expense.category}</strong>
                    </div>
                    <div class="expense-date">${formattedDate}</div>
                </div>
                <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                <button class="btn-delete" onclick="deleteExpense(${expense.id})">🗑️</button>
            </div>
        `;
    }).join('');
}

// Función para borrar un gasto
function deleteExpense(id) {
    if (confirm('¿Estás seguro de que querés borrar este gasto?')) {
        ExpenseStorage.deleteExpense(id);
        updateMonthTotal();
        displayExpenses();
    }
}