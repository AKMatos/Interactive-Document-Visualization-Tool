import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const list = document.getElementById("filesContainer")
const workspaceList = document.getElementById("workspaceContainer")

d3.csv("datasetAsCSV.csv",d=>{
    return{
        fileName: String(d.FileNames),
        fileContents: String(d.FileContents),
    }
}).then(data=>{
    for (let i = 0; i < data.length; i++) {
        //Generates this
        //<div class="sortable-item" draggable="true"><button type="fileButton" onclick="fileClick()">Filename</button></div>
        //  <button type="fileButton" onclick="fileClick()">Filename</button>
        //</div>
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "sortable-item");
        newDiv.setAttribute("draggable", "true")
        let newButton = document.createElement("button");
        newButton.setAttribute("type", "fileButton");
        newButton.onclick = function () {
            let id = data[i].fileName;
            let newDivWorkspace = document.getElementById(data[i].fileName)
            if (newDivWorkspace) {
                newDivWorkspace.remove();
                return;
            }
            newDivWorkspace = document.createElement("div");
            newDivWorkspace.setAttribute("id", data[i].fileName);
            newDivWorkspace.setAttribute("class", "sortable-workspace");
            newDivWorkspace.setAttribute("draggable", "true");
            let title = document.createElement("h2");
            let fileNameNode = document.createTextNode("Workspace: " + data[i].fileName);
            title.appendChild(fileNameNode);
            let bodyText = document.createElement("p");
            let fileContentsNode = document.createTextNode(data[i].fileContents);
            bodyText.appendChild(fileContentsNode);
            newDivWorkspace.appendChild(title);
            newDivWorkspace.appendChild(bodyText);
            console.log(newDivWorkspace)
            workspaceList.append(newDivWorkspace);
        };
        //newButton.setAttribute("id", data[i].fileName);
        let text = document.createTextNode(data[i].fileName);
        newButton.appendChild(text);
        newDiv.appendChild(newButton)
        list.append(newDiv);
    }
});

let draggingItem = null;

list.addEventListener('dragstart', (e) => {
    draggingItem = e.target;
    e.target.classList.add('dragging');
});

list.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.sortable-item').forEach(item => item.classList.remove('over'));
    draggingItem = null;
});

list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingOverItem = getDragAfterElement(list, e.clientY);

    // Remove .over from all items
    document.querySelectorAll('.sortable-item').forEach(item => item.classList.remove('over'));

    if (draggingOverItem) {
    draggingOverItem.classList.add('over'); // Add .over to the hovered item
    list.insertBefore(draggingItem, draggingOverItem);
    } else {
    list.appendChild(draggingItem); // Append to the end if no item below
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
    } else {
        return closest;
    }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

const workspaces = document.querySelector('.workspaceContainer');
let draggingFile = null;

workspaces.addEventListener('dragstart', (e) => {
    draggingFile = e.target;
    e.target.classList.add('dragging');
});

workspaces.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.sortable-workspace').forEach(item => item.classList.remove('over'));
    draggingFile= null;
});

workspaces.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingOverFile = getDragAfterWorkspace(workspaces, e.clientX);

    // Remove .over from all items
    document.querySelectorAll('.sortable-workspace').forEach(item => item.classList.remove('over'));

    if (draggingOverFile) {
    draggingOverFile.classList.add('over'); // Add .over to the hovered item
    workspaces.insertBefore(draggingFile, draggingOverFile);
    } else {
    workspaces.appendChild(draggingFile); // Append to the end if no item below
    }
});

function getDragAfterWorkspace(container, x) {
    const draggableElements = [...container.querySelectorAll('.sortable-workspace:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
    } else {
        return closest;
    }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}