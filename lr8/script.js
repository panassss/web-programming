document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    todoInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const taskText = todoInput.value.trim();
            if (taskText !== '') {
                createTodoItem(taskText);
                todoInput.value = '';
            }
        }
    });

    function formatDate(date) {
        const pad = (num) => String(num).padStart(2, '0');
        
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = String(date.getFullYear()).slice(-2);
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${day}.${month}.${year}, ${hours}:${minutes}`;
    }

    function createTodoItem(text) {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                li.classList.add('completed');
            }
        });

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'todo-details';

        const spanText = document.createElement('span');
        spanText.className = 'todo-text';
        spanText.textContent = text;
        spanText.title = 'Подвійний клік для редагування';

        const spanDate = document.createElement('span');
        spanDate.className = 'todo-date';
        spanDate.textContent = formatDate(new Date());

        spanText.addEventListener('dblclick', () => {
            if (li.classList.contains('completed')) return;

            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.className = 'edit-input';
            editInput.value = spanText.textContent;

            detailsDiv.replaceChild(editInput, spanText);
            editInput.focus();

            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });

            editInput.addEventListener('blur', () => {
                saveEdit();
            });

            function saveEdit() {
                const newText = editInput.value.trim();
                if (newText !== '') {
                    spanText.textContent = newText;
                }
                if (editInput.parentNode === detailsDiv) {
                    detailsDiv.replaceChild(spanText, editInput);
                }
            }
        });

        detailsDiv.appendChild(spanText);
        detailsDiv.appendChild(spanDate);

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(detailsDiv);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Видалити завдання';

        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        todoList.prepend(li);
    }
});