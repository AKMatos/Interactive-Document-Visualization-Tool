//Import d3 for csv reading
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//Create variables for the filesContainer and the workspaceContainer that will dynamically modified
const list = document.getElementById("filesContainer")
const workspaces = document.getElementById("workspaceContainer")

//-------------------------------File names and workspace generation---------------------------
//Use d3 to read the csv and do the then section on read
d3.csv("datasetAsCSV.csv",d=>{
    return{
        fileName: String(d.FileNames),
        fileContents: String(d.FileContents),
    }
}).then(data=>{
    //This adds the file names to the file container
    for (let i = 0; i < data.length; i++) {
        //Generates this
        //<div class="sortable-item" draggable="true">
        //  <button type="fileButton">ExampleFileName</button>
        //</div>
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "sortable-item");
        newDiv.setAttribute("draggable", "true")
        let newButton = document.createElement("button");
        newButton.setAttribute("type", "fileButton");
        //Sets the onclick function of the buttons/filenames
        newButton.onclick = function () {
            let newDivWorkspace = document.getElementById(data[i].fileName)
            //If a workspace for a file exists, remove it and change the buttons color back to green
            if (newDivWorkspace) {
                newDivWorkspace.remove();
                newButton.setAttribute("style", "color: #0f0");
                return;
            //Else add the workspace and change the button color to red
            }
            //Generates this
            //<div id="CIA_01" class="sortable-workspace" draggable="true">
            //  <h2>Workspace: ExampleFileName</h2>
            //  <p>ExampleFileContents</p>
            //</div>
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
            workspaces.append(newDivWorkspace);
            newButton.setAttribute("style", "color: #f00");
        };
        let text = document.createTextNode(data[i].fileName);
        newButton.appendChild(text);
        newDiv.appendChild(newButton)
        list.append(newDiv);
    }
});

//-------------------------------List Dragging---------------------------
//Variable for item being dragged
let draggingItem = null;

//If an item is being dragged, target it
list.addEventListener('dragstart', (e) => {
    draggingItem = e.target;
    e.target.classList.add('dragging');
});

//When it stops being dragged, stop targeting it
list.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.sortable-item').forEach(item => item.classList.remove('over'));
    draggingItem = null;
});

//Animation for dragging over an element that can be replaced
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

//Actual change if something is dragged onto the other
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

//-------------------------------Workspace Dragging---------------------------
//If an item is being dragged, target it
let draggingFile = null;

//When it stops being dragged, stop targeting it
workspaces.addEventListener('dragstart', (e) => {
    draggingFile = e.target;
    e.target.classList.add('dragging');
});

//Animation for dragging over an element that can be replaced
workspaces.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.sortable-workspace').forEach(item => item.classList.remove('over'));
    draggingFile= null;
});

//Animation for dragging over an element that can be replaced
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

//Actual change if something is dragged onto the other
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