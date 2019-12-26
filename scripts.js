var FILE = null;

function onImagePicked(file){
    FILE = file
}

function onImageUpload(){
    const fileForm = new FormData();
    let status = document.getElementById("status")
    status.innerHTML = "Uploading..."
    fileForm.append('image', FILE);
    fetch("https://35.241.136.34/fileSharing/api/v1/upload", {method: "POST", body: fileForm})
    .then((res) => res.text())
    .then((string) =>  status.innerHTML = JSON.parse(string).message)
    .then(() => refreshList())
}

function getFileList(){
    fetch("https://35.241.136.34/fileSharing/list", {method: "GET"})
    .then((res) => res.text())
    .then((string) => displayList(JSON.parse(string)))
}

function downloadFile(filename){
    fetch('https://35.241.136.34/fileSharing/download/'+ filename, {method: "GET"})
    .then((res)=>res.text())
    .then((string) => JSON.parse(string))
    .then((json) => window.open(json.link))
}


function displayList(files){
    let list = []
    columns = {"name": "File Name", "download": "Download"}
    files.files.forEach((item, index) => list.push({name: item, download: "LINK"}))
    
    let data = {data: list, columns: columns}
    
    var table = $('#root').tableSortable({
        data: data.data,
        columns: data.columns,
        pagination: 10,
        showPaginationLabel: true,
        prevText: 'Previous',
        nextText: 'Next',
        searchField: $('#search'),
        processHtml: function(row, key) {
            if (key=="download"){
               return '<p onclick="downloadFile(`' + row["name"] + '`)">LINK</p>' 
               
            }
            else{
                return row[key]
            }
            
        }
    })   
}


function refreshList(){
    let node = document.getElementById("root")
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    getFileList()
}