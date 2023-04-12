const taskLists = document.querySelectorAll('.task-list');
const backLogTask = document.querySelector('#backlog .task-list');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const submitButton = document.querySelector('#submit-button');
const errorConatiner = document.querySelector('.error-container');

let tasks = [
    {
        id: 0,
        title: "Fix submit button",
        description: "The submit button has stopped working since the last release."
    },
    {
        id: 1,
        title: "Change Text on T and C",
        description: "The terms and conditions need updating as per the business meeting"
    },
    {
        id: 2,
        title: "Chnage banner picture",
        description: "Marketing has requested a new banner to be added to the website"
    }
];

let elementBeingDragged;

const dragStart = (e) => {
    elementBeingDragged = e.target;
}

const dragOver = (e) => {
    e.preventDefault();
}

const dragDrop = (e) => {
    const color = addColor(e.target.parentNode.id)
    elementBeingDragged.firstChild.style.backgroundColor = color;
    e.target.append(elementBeingDragged);
}

const addColor = (column) => {
    let color;
    switch (column) {
        case 'backlog':
            color = 'rgb(96,96,192)'
            break;
        case 'doing':
            color = 'rgb(83,156,174)'
            break;
        case 'done':
            color = 'rgb(224,165,116)'
            break
        case 'discard':
            color = 'rgb(222,208,130)'
        default:
            color = 'rgb(232,232,232)'
    }
    return color;

}

const showError = (message) => {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.classList.add('error-message');
    errorConatiner.append(errorMessage);

    setTimeout(() => {
        errorConatiner.textContent = '';
    }, 2000)
}

const deleteTask = (e) => {
    const headerTitle = e.target.parentNode.firstChild.textContent;

    const filteredTask = tasks.filter(task => {
        return task.title === headerTitle
    });

    task = tasks.filter(task => {
        return task !== filteredTask[0]
    });

    e.target.parentNode.parentNode.remove();
}

const createTask = (task) => {

    const { id, title, description } = task;

    const taskCard = document.createElement('div');
    const taskHeader = document.createElement('div');
    const taskTitle = document.createElement('p');
    const taskDescriptionContainer = document.createElement('div');
    const taskDescription = document.createElement('p');
    const deleteIcon = document.createElement('p');

    taskCard.classList.add('task-container');
    taskHeader.classList.add('task-header');
    taskDescriptionContainer.classList.add('task-description-container');

    taskTitle.textContent = title;
    deleteIcon.textContent = '✗'
    taskDescription.textContent = description;

    taskCard.setAttribute('draggable', true);
    taskCard.setAttribute('task-id', id);

    taskCard.addEventListener('dragstart', dragStart);
    deleteIcon.addEventListener('click', deleteTask);

    taskHeader.append(taskTitle, deleteIcon);
    taskDescriptionContainer.append(taskDescription)
    taskCard.append(taskHeader, taskDescriptionContainer);

    backLogTask.append(taskCard);
}

const addTasks = () => {
    tasks.forEach(task => createTask(task))
}

taskLists.forEach(taskList => {
    taskList.addEventListener('dragover', dragOver);
    taskList.addEventListener('drop', dragDrop);
});

addTasks();


const addTask = (e) => {
    e.preventDefault();
    const filteredTitles = tasks.filter(task => {
        return task.title === titleInput.value
    })

    if (!filteredTitles.length) {
        const task = {
            id: tasks.length,
            title: titleInput.value,
            description: descriptionInput.value
        }
        tasks.push(task);
        createTask(task);

        titleInput.value = '';
        descriptionInput.value = '';
    } else {
        showError('Title must be unique!')
    }
}

submitButton.addEventListener('click', addTask)
