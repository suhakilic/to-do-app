let form = document.querySelector("form")
let input = document.querySelector("#inputSection")
let taskList = document.querySelector("#taskList")
let deleteAllButton = document.querySelector("#deleteAll")
let items;
let sts;

// calling event listeners
eventListeners();
// load items from local storage
loadItems()

// defining event listeners
function eventListeners() {
    form.addEventListener("submit", addNewItem)
    taskList.addEventListener("click", deleteItem)
    taskList.addEventListener("click", doneItem)
    taskList.addEventListener("click", undoItem)
    deleteAllButton.addEventListener("click", deleteAll)
}

// getting items from local storage
function getItemsFromLS() {
    if (localStorage.getItem("items") === null) {
        items = []
    } else {
        items = JSON.parse(localStorage.getItem("items"))
    }
    return items
}

// loading items from local storage
function loadItems() {
    items = getItemsFromLS()
    items.forEach(function (item) {
        createItem(item)
    })
    // load status of the items (done/undone)
    loadSts()
}

// loading status
function loadSts() {
    // getting items and previous status of items (done or undone)
    items = getItemsFromLS()
    sts = getStsFromLS()

    items.forEach(function (item, index) {
        if (sts[index] === "done") {
            taskList.children[index].firstChild.classList.add("done-line-through")
        }
    })
}

// getting status from local storage
function getStsFromLS() {
    if (localStorage.getItem("sts") === null) {
        sts = []
    } else {
        sts = JSON.parse(localStorage.getItem("sts"))
    }
    return sts
}

// deleting status from local storage
function delStsFromLS(index) {
    sts = getStsFromLS()
    sts.splice(index, 1)
    localStorage.setItem("sts", JSON.stringify(sts))
}

// change status to done
function changeStsToDone(arg, arg2) {
    items = getItemsFromLS()
    items.forEach(function (item, index) {
        if (arg === item) {
            sts = getStsFromLS()
            sts[index] = "done"
            localStorage.setItem("sts", JSON.stringify(sts))
            arg2.classList.add("done-line-through")
        }
    })
}

// change status to undo
function changeStsToUndo(arg, arg2) {
    items = getItemsFromLS()
    items.forEach(function (item, index) {
        if (arg === item) {
            sts = getStsFromLS()
            sts[index] = "undone"
            localStorage.setItem("sts", JSON.stringify(sts))
            arg2.classList.remove("done-line-through")
        }
    })
}

// add item to local storage
function addItemToLS(text) {
    items = getItemsFromLS()
    items.push(text)
    localStorage.setItem("items", JSON.stringify(items))
}

// delete item from local storage
function deleteItemFromLS(text) {
    items = getItemsFromLS()
    items.forEach(function (item, index) {
        if (text === item) {
            items.splice(index, 1)
            delStsFromLS(index)
        }
    })
    localStorage.setItem("items", JSON.stringify(items))
}

// creating item
function createItem(text) {
    // creating li tag
    const li = document.createElement("li")
    li.classList.add("list-group-item", "bg-secondary", "bg-gradient")

    // creating text and adding to li
    const myText = document.createTextNode(text)
    const pText = document.createElement("p")
    pText.appendChild(myText)
    li.appendChild(pText)

    // creating delete button
    const delButton = document.createElement("input")
    delButton.classList.add("btn", "btn-danger", "btn-sm", "float-end", "ms-1")
    delButton.type = "button"
    delButton.value = "Delete"
    li.appendChild(delButton)

    // creating undo button
    const undoButton = document.createElement("input")
    undoButton.classList.add("btn", "btn-warning", "btn-sm", "float-end", "ms-1")
    undoButton.type = "button"
    undoButton.value = "Undone"
    li.appendChild(undoButton)

    // creating done button
    const doneButton = document.createElement("input")
    doneButton.classList.add("btn", "btn-success", "btn-sm", "float-end")
    doneButton.type = "button"
    doneButton.value = "Done"
    li.appendChild(doneButton)

    // adding li to ul
    taskList.appendChild(li)
}

// adding a new item
function addNewItem(e) {
    items = getItemsFromLS()
    // checking if the input is already in the list or not
    if (items.includes(input.value)) {
        alert("You have already created the same task. Please try a different task name.")
        // clear the input area
        input.value = ""
    } else {
        // creating item
        createItem(input.value)

        // setting to local storage
        addItemToLS(input.value)

        // creating status
        sts = getStsFromLS()
        sts.push("undone")
        localStorage.setItem("sts", JSON.stringify(sts))

        // clear the input area
        input.value = ""
    }
    // prevent default
    e.preventDefault()
}

// delete an item
function deleteItem(e) {
    if (e.target.value === "Delete") {
        e.target.parentElement.remove();
        deleteItemFromLS(e.target.parentElement.firstChild.textContent)
    }
}

// done an item
function doneItem(e) {
    if (e.target.value === "Done") {
        let parentElm = e.target.parentElement
        let targetElm = parentElm.firstChild
        changeStsToDone(parentElm.firstChild.textContent, targetElm)
    }
}

// undone an item
function undoItem(e) {
    if (e.target.value === "Undone") {
        let parentElm = e.target.parentElement
        let targetElm = parentElm.firstChild
        targetElm.classList.remove("done-line-through")
        changeStsToUndo(parentElm.firstChild.textContent, targetElm)
    }
}

// delete all items
function deleteAll() {
    if (confirm("Do you want to delete all items?")) {
        taskList.innerHTML = ""
        localStorage.clear()
    }
}


