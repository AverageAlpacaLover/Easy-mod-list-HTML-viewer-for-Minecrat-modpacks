const SEARCH = document.querySelector('.input-group input'),
    FILE = document.querySelector('.input-file input'),
    TABLE_HEADINGS_SORTABLE = document.querySelectorAll('thead th.sortable'),
    CHOSEN_LOADERS = document.querySelector('thead select#loader'),
    CHOSEN_TYPES = document.querySelector('thead select#type');
let tableRows = document.querySelectorAll('tbody tr');

// 0. Adding formated .txt into a table

FILE.addEventListener('change', populateTable);

function populateTable() {
                let fr = new FileReader();
				let tbody = document.querySelector('tbody');         
                tbody.innerHTML = "";
                fr.onload = function () {
                    let txtTable=[]; //creating jagged array of 0link + 1name + 2loader + 3type + 4dep + 5needs + 6desc
                    txtTable.push([]);
                    let row = 0; // pointer for current row
                    fr.result.split('\r\n').forEach((element, index) => { //going through each line of txt file
                        if ( (index+1) % 8 === 0) //creating new row in table after ------ (8 row of txt file)
                        {
                            txtTable.push([]); //new row
                            row++; // moving pointer to new row
                        }
                        else
                        txtTable[row].push(element); // populating columns of the table with info from txt file
                    });
                    txtTable.forEach((element, index) => { //removing any row with bad number of elements in it
                        if (element.length<6)
                        txtTable.splice(index,1);   
                    });
                    
					for (let index = 0; index < txtTable.length; index++) {
                        //pushing every element of a row table to a specific array for better readability
                        let modLink = txtTable[index][0];
                        let modName = txtTable[index][1];
                        let modLoader = txtTable[index][2];
                        if (txtTable[index][2].toLowerCase().startsWith("neo"))
                        {
                            modLoader = "NeoForged";
                        }
                        let modType = txtTable[index][3];
                        let modDependencies = txtTable[index][4].split("/");
                        let modRequirements = txtTable[index][5].split("/");
                        let modDescription = txtTable[index][6];
                        //creating every cell of an *index row table for the HTML
                        let tableCellIcon = '<td><img src="modIcons/' + modName + '" onerror="this.src=\'pageImages/empty.webp\';"></td>'; //
                        let tableCellName = '<td><a href="' + modLink + '">' + modName + '</a></td>';
                        let tableCellLoader = '<td><img src="modLoaderIcons/' + modLoader.toLowerCase() + '.png" onerror="this.src=\'pageImages/empty.webp\';">' + modLoader + '</td>';
                        let tableCellType = '<td><p class="modtype ' + modType.toLowerCase() + '">' + modType + '</td>';
                        
                        let tableCellDependencies = '<td>';
                        for (let mIndex = 0; mIndex < modDependencies.length; mIndex++) { //Looping through every Mod Dependance
                            let linkFound = false;
                            for (let tIndex = 0; tIndex < txtTable.length; tIndex++) { //Looping through every Mod Name to extract a link to the mod
                                if (txtTable[tIndex][1] === modDependencies[mIndex]) { // Mod Name = Mod Dependance?
                                        let icon = '<img class="tooltipImage" src="modIcons/'+ txtTable[tIndex][1] +'" onerror="this.src=\'pageImages/empty.webp\';">' //icon when hovering over the link
                                        tableCellDependencies += '<a class="tooltip" href="'+ txtTable[tIndex][0] +'">'+ modDependencies[mIndex] + icon +'</a> | '; 
                                        linkFound = true;
                                } 
                            }
                            if (linkFound === false) {
                                tableCellDependencies += modDependencies[mIndex] + ' | ';
                            }
                        }
                        tableCellDependencies = tableCellDependencies.slice(0,tableCellDependencies.lastIndexOf(' | ')); //removing last " | "
                        tableCellDependencies += '</td>'

                        let tableCellRequirements = '<td>';
                        for (let mIndex = 0; mIndex < modRequirements.length; mIndex++) { //Looping through every Mod Dependance
                            let linkFound = false;
                            for (let tIndex = 0; tIndex < txtTable.length; tIndex++) { //Looping through every Mod Name to extract a link to the mod
                                if (txtTable[tIndex][1] === modRequirements[mIndex]) { // Mod Name = Mod Require?
                                    let icon = '<img class="tooltipImage" src="modIcons/' + txtTable[tIndex][1] + '" onerror="this.src=\'pageImages/empty.webp\';">' //icon when hovering over the link
                                        tableCellRequirements += '<a class="tooltip" href="' + txtTable[tIndex][0] + '">' + modRequirements[mIndex] + icon + '</a> | ';
                                        linkFound = true;
                                }
                            }
                            if (linkFound === false) {
                                tableCellRequirements += modRequirements[mIndex] + ' | ';
                            }
                        } 
                        tableCellRequirements = tableCellRequirements.slice(0,tableCellRequirements.lastIndexOf(' | ')); //removing last " | "
                        tableCellRequirements += '</td>'

                        let tableCellDescription = '<td>' + modDescription + '</td>';

                		tbody.innerHTML += '<tr class="' + modLoader.toLowerCase() + ' ' + modType.toLowerCase() + '">' + tableCellIcon + tableCellName + tableCellLoader + tableCellType + tableCellDependencies + tableCellRequirements + tableCellDescription + '</tr>';
        			}
                }

                fr.readAsText(this.files[0]);
}

// 1. Searching for specific data of HTML table
CHOSEN_LOADERS.addEventListener('change', function (){
    CHOSEN_LOADERS.classList = "";
    Array.from(CHOSEN_LOADERS.selectedOptions).forEach(option => CHOSEN_LOADERS.classList.add(option.value)) //adding classes to hide UNSELECTED mod loaders
    hideRows();
})

CHOSEN_TYPES.addEventListener('change', function(){
    CHOSEN_TYPES.classList = "";
    Array.from(CHOSEN_TYPES.selectedOptions).forEach(option => CHOSEN_TYPES.classList.add(option.value)) //adding classes to hide UNSELECTED mod types
    hideRows()
})

function hideRows() { //hide unselected mod loader + mod type in table
    let toHide =""; //empty string fot loader+type CLASSES that will be HIDDEN in table
    let toVisible = ""; //empty string fot loader+type CLASSES that will be SHOWN in table
    CHOSEN_LOADERS.classList.forEach(loaderValue => {
        CHOSEN_TYPES.classList.forEach(typeValue => {
            toVisible += "." + loaderValue + "." + typeValue + ", "; //CHOSEN classes to SHOW
            toHide += ":not(." + loaderValue + "." + typeValue + ")"; //UNSELECTED classes to HIDE
        });
    });

    tableRows = document.querySelectorAll('tbody > ' + toVisible.slice(0, toVisible.lastIndexOf(", ")) + ''); //select all rows with CHOSEN mod loaders+types classes
    tableRows.forEach(row => row.classList.remove('hide')); //SHOW CHOSEN loaders+types

    tableRows = document.querySelectorAll('tbody > ' + toHide + ''); //select all rows with UNSELECTED mod loaders+types classes
    tableRows.forEach(row => row.classList.add('hide')) //HIDE UNSELECTED loaders+types
}

SEARCH.addEventListener('input', searchTable)

function searchTable() {
    let toSearch ="";  //empty string fot loader+type CLASSES that will be SEARCHED in table
    CHOSEN_LOADERS.classList.forEach(loaderValue => {
        CHOSEN_TYPES.classList.forEach(typeValue => {
            toSearch += "." + loaderValue + "." + typeValue + ", "; //CHOSEN classes to SEARCH
        });
    });	
    tableRows = document.querySelectorAll('tbody > ' + toSearch.slice(0, toSearch.lastIndexOf(", ")) + ''); //select all rows to SEARCH
    tableRows.forEach((row, i) => {
        let tableData = row.textContent.toLowerCase(), //table row as string
            searchData = SEARCH.value.toLowerCase(); //string to SEARCH in rows from SEARCHBOX

        row.classList.toggle('hide', tableData.indexOf(searchData) < 0);
    })
}

// 2. Ordering data of HTML table
TABLE_HEADINGS_SORTABLE.forEach((head, i) => {		
    let sortAsc = true;
    head.onclick = () => {
        TABLE_HEADINGS_SORTABLE.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));

		tableRows = document.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            row.querySelectorAll('td')[head.cellIndex].classList.add('active');
        })

        head.classList.toggle('asc', sortAsc);
        sortAsc = head.classList.contains('asc') ? false : true;

        sortTable(head.cellIndex, sortAsc);
    }
})

function sortTable(column, sortAsc) {			
    [...tableRows].sort((a, b) => {
        let firstRow = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            secondRow = b.querySelectorAll('td')[column].textContent.toLowerCase();

        return sortAsc ? (firstRow < secondRow ? 1 : -1) : (firstRow < secondRow ? -1 : 1);
    })
        .map(sortedRow => document.querySelector('tbody').appendChild(sortedRow));
}

// 3. Converting HTML table to PDF
const PDF_BTN = document.querySelector('#toPDF');
const MODS_TABLE = document.querySelector('#mods_table');


const toPDF = function (MODS_TABLE) {
    const HTML_CODE = `
    <!DOCTYPE html>
    <link rel="stylesheet" type="text/css" href="style.css">
    <main class="table" id="mods_table">${mods_table.innerHTML}</main>`;

    const NEW_WINDOW = window.open();
     NEW_WINDOW.document.write(HTML_CODE);

    setTimeout(() => {
        NEW_WINDOW.print();
        NEW_WINDOW.close();
    }, 400);
}

PDF_BTN.onclick = () => {
    toPDF(MODS_TABLE);
}

// 4. Converting HTML table to JSON
const JSON_BTN = document.querySelector('#toJSON');

const toJSON = function (table) {
    let TABLE_DATA = [],
        t_head = [],

        t_headings = table.querySelectorAll('th'),
        t_rows = table.querySelectorAll('tbody tr');

    for (let t_heading of t_headings) {
        let actual_head = t_heading.textContent.trim().split(' ');

        t_head.push(actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase());
    }

    t_rows.forEach(row => {
        const ROW_OBJECT = {},
            T_CELLS = row.querySelectorAll('td');

        T_CELLS.forEach((t_cell, cell_index) => {
            const IMG = t_cell.querySelector('img');
            if (IMG) {
                ROW_OBJECT['customer image'] = decodeURIComponent(IMG.src);
            }
            ROW_OBJECT[t_head[cell_index]] = t_cell.textContent.trim();
        })
        TABLE_DATA.push(ROW_OBJECT);
    })

    return JSON.stringify(TABLE_DATA, null, 4);
}

JSON_BTN.onclick = () => {
    const JSON = toJSON(MODS_TABLE);
    downloadFile(JSON, 'json')
}

// 5. Converting HTML table to CSV File
const CSV_BTN = document.querySelector('#toCSV');

const toCSV = function (table) {
    const T_HEADS = table.querySelectorAll('th'),
        TBODY_ROWS = table.querySelectorAll('tbody tr');

    const HEADINGS = [...T_HEADS].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join(',') + ',' + 'image name';

    const TABLE_DATA = [...TBODY_ROWS].map(row => {
        const CELLS = row.querySelectorAll('td'),
            IMG = decodeURIComponent(row.querySelector('img').src),
            DATA_WITHOUT_IMG = [...CELLS].map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');

        return DATA_WITHOUT_IMG + ',' + IMG;
    }).join('\n');

    return HEADINGS + '\n' + TABLE_DATA;
}

CSV_BTN.onclick = () => {
    const CSV = toCSV(MODS_TABLE);
    downloadFile(CSV, 'csv', 'customer orders');
}

// 6. Converting HTML table to EXCEL File
const EXCEL_BTN = document.querySelector('#toEXCEL');

const toExcel = function (table) {
    // Code For SIMPLE TABLE
    // const T_ROWS = table.querySelectorAll('tr');
    // return [...T_ROWS].map(row => {
    //     const CELLS = row.querySelectorAll('th, td');
    //     return [...CELLS].map(cell => cell.textContent.trim()).join('\t');
    // }).join('\n');

    const T_HEADS = table.querySelectorAll('th'),
        TBODY_ROWS = table.querySelectorAll('tbody tr');

    const HEADINGS = [...T_HEADS].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join('\t') + '\t' + 'image name';

    const TABLE_DATA = [...TBODY_ROWS].map(row => {
        const CELLS = row.querySelectorAll('td'),
            IMG = decodeURIComponent(row.querySelector('img').src),
            DATA_WITHOUT_IMG = [...CELLS].map(cell => cell.textContent.trim()).join('\t');

        return DATA_WITHOUT_IMG + '\t' + IMG;
    }).join('\n');

    return HEADINGS + '\n' + TABLE_DATA;
}

EXCEL_BTN.onclick = () => {
    const EXCEL = toExcel(MODS_TABLE);
    downloadFile(EXCEL, 'excel');
}

const downloadFile = function (data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName;
    const MIME_TYPES = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    a.href = `
        data:${MIME_TYPES[fileType]};charset=utf-8,${encodeURIComponent(data)}
    `;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
