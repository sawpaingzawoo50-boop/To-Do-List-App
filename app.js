const day = document.querySelector('#day');
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const priority = document.querySelector('#task-priority');
const taskList = document.querySelector('.task-list');
const counter = document.querySelector('#number');
const filterAll = document.getElementById('task-all');
const filterActive = document.getElementById('task-active');
const filterDone = document.getElementById('task-done');

//////////////////////////////////////////////
// Splash Window
////////////////////////////////////////////
const splash = document.getElementById('splash');

setTimeout (function () {
    splash.style.display = 'none';
}, 3000 )

////////////////////////////////////////////
// New Date
const toDay = new Date ();
const weekday = toDay.toDateString('en-US', {weekday : 'long'});
// console.log(toDay);
day.textContent = weekday; 

// Create an Array
let tasks = [];

// Save tasks on page start
const saved = localStorage.getItem('tasks');
if (saved) {
    tasks = JSON.parse(saved);
}

// Filter Mode
let currentFilter = 'all';

// Convert Tag Priority
const priorityClass = {
    High: 'high',
    Medium: 'med',
    Low: 'low'
};

// call render 
render();

// Add task
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (text == '')  {
      alert('You need to add the task!!')
      taskInput.value = '';
        return;
    }

    if (priority.value === '') {
        alert('Add a priority to your task');
        return;
    }

    const newTasks = {
        text: text,
        priority: priority.value,
        done: false
    };

    // Push to array
    tasks.push(newTasks);
    taskInput.value = '';
    // console.log(newTasks);
    priority.value = '';
    render();
})


// Add eventlistener to filter
filterAll.addEventListener('click', function(e) {
    e.preventDefault();
    currentFilter = 'all';
    render();
    
})

filterActive.addEventListener('click', function(e) {
    e.preventDefault();
    currentFilter = 'active';
    render();
    
})

filterDone.addEventListener('click', function(e) {
    e.preventDefault();
    currentFilter = 'done';
    render();
    
})

// Save tasks to local storage
function saveTasks () {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render Function
function render() {
    taskList.innerHTML = '';

    // Hightlight the filters
    filterAll.classList.remove('active');
    filterActive.classList.remove('active');
    filterDone.classList.remove('active');

    if (currentFilter === 'all') {
        filterAll.classList.add('active');
    } if (currentFilter === 'active') {
        filterActive.classList.add('active');
    } if (currentFilter === 'done') {
        filterDone.classList.add('active');
    }

    // Shown task
    let shown = 0;

    // Implement the element into task list
    tasks.forEach(function(task, index) {

        // Check the filter
        if (currentFilter === 'active' && task.done) {
            return;
        } 
        if (currentFilter === 'done' && !task.done) {
            return;

        }

        // Add shown task
        shown++;

        
        const li = document.createElement('li');
        li.classList.add('task');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 't' + index;
        checkbox.checked = task.done;

        // Add eventlistener to checkbox
        checkbox.addEventListener('change', function() {  
            task.done = checkbox.checked;

            // Array for alltask
            const allDone = tasks.length > 0 && tasks.every(function (t) {
                return t.done;
            });

            render();

            if (allDone) {
                setTimeout(function() {
                    tasks = [];
                    currentFilter = 'all';
                    render ();
                }, 1000);
            }
        })

        const label = document.createElement('label');
        label.setAttribute('for', 't' + index);

        const box = document.createElement('span');
        box.classList.add('box');

        const text = document.createElement('span');
        text.classList.add('text');
        text.textContent = task.text;

        const tag = document.createElement('span');
        tag.classList.add('tag', priorityClass[task.priority]);
        tag.textContent = task.priority;

        if (task.done) {
                label.classList.add('text-checked');
                tag.style.opacity = '.5';
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete');

        deleteBtn.addEventListener('click', function () {
            tasks = tasks.filter(function(t, i) {
                return i !== index;
            });
            render();
        })


        label.appendChild(box);
        label.appendChild(text);
        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(tag);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    })

    // No tasks
    if (shown === 0 ) {
        taskList.textContent = 'No tasks available';
        taskList.classList.add('center-ele');
    } else {
        taskList.classList.remove('center-ele');
    }

    const remaining = tasks.filter(function(t) {
        return !t.done;
    }).length;

    if (counter) {
        counter.textContent = remaining;
    }

    // Call SaveTask 
    saveTasks ();
}

