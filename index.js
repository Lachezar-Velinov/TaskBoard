const form = document.querySelector("form")
const todoCol = document.querySelector(".todo")
const inProgressCol = document.querySelector(".in-progress")
const doneCol = document.querySelector(".done")
const toInProgressBtn = document.querySelector("#to-in-progress")
const toDoneBtn = document.querySelector("#to-done")

function createTask(title, description) {
    const card = document.createElement("div")
    card.classList.add("card")

    const titleElement = document.createElement("h3")
    titleElement.textContent = title
    const descElement = document.createElement("p")
    descElement.textContent = description
    card.appendChild(titleElement)
    card.appendChild(descElement)
    card.addEventListener("click", (e) => {
        e.target.classList.toggle("selected")
    })

    return card
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const title = e.target.querySelector("input").value
    const desc = e.target.querySelector("textarea").value
    card = createTask(title, desc)
    todoCol.appendChild(card)
    e.target.reset()
})

toInProgressBtn.addEventListener("click", (e) => {
    todoCol.querySelectorAll(".selected").forEach((card) => {
        todoCol.removeChild(card)
        inProgressCol.appendChild(card)
        card.classList.remove("selected")
    })
})
toDoneBtn.addEventListener("click", (e) => {
    inProgressCol.querySelectorAll(".selected").forEach((card) => {
        inProgressCol.removeChild(card)
        doneCol.appendChild(card)
        card.classList.remove("selected")
    })
})

fetch("http://localhost:3000/tasks")
    .then(data => data.json())
    .then(data => {
        data.forEach(task => {
            const { id, title, description, completed, isInProgress } = task
            card = createTask(title, description)
            card.setAttribute("data-id", id)
            if (completed) {
                doneCol.appendChild(card)
            } else if (isInProgress) {
                inProgressCol.appendChild(card)
            } else {
                todoCol.appendChild(card)
            }
    })
})
fetch("http://localhost:3000/tasks{taskId}")
    .then(data => data.json())
    .then(data => {
        data.forEach(task => {
            const { id, title, description, completed, isInProgress } = task
            if(id == taskId) {
                card = createTask(title, description)
                card.setAttribute("data-id", id)
                if (completed) {
                    doneCol.appendChild(card)
                } else if (isInProgress) {
                    inProgressCol.appendChild(card)
                } else {
                    todoCol.appendChild(card)
                }
            }
    })
})

fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'ap plication/json'
    },
    body: JSON.stringify({
        title:"Buy milk", 
        description: "A 3.7% one", 
        completed: "false", 
        isInProgress: "false"
        })
    }
)
.then(response => response.json())
.then(response => {
    const {id} = response
    card.setAttribute("data-id", id)
})



todoCol.querySelectorAll(".selected").forEach((task) => {
    fetch(`http://localhost:3000/${task.getAttribute("data-id")}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title:task.title,
            description: task.description, 
            completed: false,
            isInProgress: true
        }).then(response => response.json()).then(response => {
        todoCol.removeChild(task)
        inProgressCol.appendChild(task)
        task.classList.remove("selected")
        })
    })
})