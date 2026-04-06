//Import d3 for csv reading
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//Create variables for the filesContainer, the workspaceContainer, the plotContainer, and the swapButton that will dynamically modified
const list = document.getElementById("filesContainer")
const workspaces = document.getElementById("workspaceContainer")
const plot = document.getElementById("plotContainer")
const swapButton = document.getElementById("swapButton")

//-------------------------------Swap Button---------------------------
swapButton.onclick = function () { swapBody() };

function swapBody() {
    if (swapButton.textContent == "Swap to Plot") {
        workspaces.style.display = 'none'
        plot.style.display = 'flex'
        swapButton.textContent = "Swap to Workspaces"
    }
    else {
        plot.style.display = 'none'
        workspaces.style.display = 'flex'
        swapButton.textContent = "Swap to Plot"
    }
}

//-------------------------------Workspace generation---------------------------
// Generates this
        //<div id="CIA_01" class="sortable-workspace" draggable="true">
        //  <h2>Workspace: ExampleFileName</h2>
        //  <p>ExampleFileContents</p>
        //</div>
function toggleWorkspace(fileName, fileContent) {
    let newDiv = document.getElementById(fileName)
    //If a workspace for a file exists, remove it
    if (newDiv) {
        newDiv.remove();
        return;
    //Else add the workspace
    }
    newDiv = document.createElement("div");
    newDiv.setAttribute("id", fileName);
    newDiv.setAttribute("class", "sortable-workspace");
    newDiv.setAttribute("draggable", "true");
    let title = document.createElement("h2");
    let fileNameNode = document.createTextNode("Workspace: " + fileName);
    title.appendChild(fileNameNode);
    let bodyText = document.createElement("p");
    let fileContentsNode = document.createTextNode(fileContent);
    bodyText.appendChild(fileContentsNode);
    newDiv.appendChild(title);
    newDiv.appendChild(bodyText);
    workspaces.append(newDiv);
}

//-------------------------------Filename generation---------------------------
// Generates this
        //<div class="sortable-item" draggable="true">
        //  <button type="fileButton">ExampleFileName</button>
        //</div>
function createFile(cluster, fileName, fileContents) {
    let toggle = 1
    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "sortable-item");
    newDiv.setAttribute("draggable", "true")
    let newButton = document.createElement("button");
    newButton.setAttribute("type", "fileButton");
    //Sets the onclick function of the buttons/filenames
    newButton.onclick = function () {
        if (toggle == 1) {
            newButton.setAttribute("style", "color: #f00");
            toggle = 0
        }
        else {
            newButton.setAttribute("style", "color: #0f0");
            toggle = 1
        }
        toggleWorkspace(fileName, fileContents)
    };
    let text = document.createTextNode(fileName);
    newButton.appendChild(text);
    newDiv.appendChild(newButton)
    cluster.append(newDiv);
}

//-------------------------------Cluster generation---------------------------
// Generates this
//  <div class="sortable-cluster" draggable="true"
//      <button type="clusterButton">Afghanistan</button>
//      files of cluster here from file generation
//  <div>

//Use d3 to read the csv and do the then section on read
d3.csv("datasetAsCSVwithClusters.csv",d=>{
    return{
        fileName: String(d.FileNames),
        fileContents: String(d.FileContents),
        fileClusters: String(d.Cluster)
    }
}).then(data=>{
    //This adds the clusters to the fileContainer (Cluster are made of files)
    //Make an array to track the amount of rows per cluster and one that tracks amount of rows past so far
    let amountPerCluster = []
    let amountSoFar = [0]
    let currentAmount = 0
    let currentCluster = data[0].fileClusters   
    //Get amount of clusters add add to array
    for (let i = 0; i < data.length; i++) {
        // If in current cluster increment
        if (currentCluster == data[i].fileClusters) {
            currentAmount += 1
        }
        // Else, push last clusterAmount and reset to 0
        else {
            amountPerCluster.push(currentAmount)
            amountSoFar.push(amountPerCluster[amountPerCluster.length-1] + amountSoFar[amountSoFar.length-1])
            currentCluster = data[i].fileClusters
            currentAmount = 1
        }
        // If last time, push currentAmount
        if (i == data.length-1) {
            amountPerCluster.push(currentAmount)
        }
    }

    // Generate the cluster html
    // Counts what row of data to address
    let sumOfRowsProcessed = 0
    for (let i = 0; i < amountPerCluster.length; i++) {
        let toggle = 1
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "sortable-cluster");
        newDiv.setAttribute("draggable", "true")
        let newButton = document.createElement("button");
        newButton.setAttribute("type", "clusterButton");
        //Sets the onclick function of the buttons/clusterNames
        //Toggles color from green and red if the workspace is open or not
        newButton.onclick = function () {
            if (toggle == 1) {
                    newButton.setAttribute("style", "color: #f00");
                    toggle = 0
                }
                else {
                    newButton.setAttribute("style", "color: #0f0");
                    toggle = 1
            }
            // Open the workspaces in this cluster
            for (let j = 0; j < amountPerCluster[i]; j++) {
                toggleWorkspace(data[amountSoFar[i]+j].fileName, data[amountSoFar[i]+j].fileContents)
            }
        };
        let text = document.createTextNode(data[amountSoFar[i]].fileClusters);
        newButton.appendChild(text);
        newDiv.appendChild(newButton)
        //Creates the files in the cluster
        for (let j = 0; j < amountPerCluster[i]; j++) {
            createFile(newDiv, data[amountSoFar[i]+j].fileName, data[amountSoFar[i]+j].fileContents, amountSoFar[i]+j)
        }
        list.append(newDiv);
    }
});

//-------------------------------CLuster Dragging---------------------------
//Variable for item being dragged
let draggingCluster = null;

//If an item is being dragged, target it
list.addEventListener('dragstart', (e) => {
    draggingCluster = e.target;
    e.target.classList.add('dragging');
});

//When it stops being dragged, stop targeting it
list.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.sortable-cluster').forEach(item => item.classList.remove('over'));
    draggingCluster = null;
});

//Animation for dragging over an element that can be replaced
list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingOverItem = getDragAfterCluster(list, e.clientY);

    // Remove .over from all items
    document.querySelectorAll('.sortable-item').forEach(item => item.classList.remove('over'));

    if (draggingOverItem) {
    draggingOverItem.classList.add('over'); // Add .over to the hovered item
    list.insertBefore(draggingCluster, draggingOverItem);
    } else {
    list.appendChild(draggingCluster); // Append to the end if no item below
    }
});

//Actual change if something is dragged onto the other
function getDragAfterCluster(container, y) {
    const draggableElements = [...container.querySelectorAll('.sortable-cluster:not(.dragging)')];

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