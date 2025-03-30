const search = document.querySelector('.input-group input'),
	file = document.querySelector('.input-file input'),
	table_headings = document.querySelectorAll('thead th');	
    let table_rows = document.querySelectorAll('tbody tr');
// 0. Adding formated .txt into a table

file.addEventListener('change', function () {
                let fr = new FileReader();
				let tbody = document.querySelector('tbody');         
                tbody.innerHTML = "";
                fr.onload = function () {
                    let txtTable=[]; //creating jagged array of 0link + 1name + 2type + 3dep + 4needs + 5desc
                    txtTable.push([]);
                   /* var txtTable = [{
                        modLink: "",
                        modName: "",
                        modType: "",
                        modDependencies: "",
                        modRequireIn: "",
                        modDescription: "",
                    }];*/
                    let row = 0; // pointer for current row
                    fr.result.split('\r\n').forEach((element, index) => { //going through each line of txt file
                        if ( (index+1) % 7 === 0) //creating new row in table after ------ (7 row of txt file)
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
                    
					for (let index =0; index < txtTable.length; index++) {
                        //pushing every element of a row table to a specific array for better readability
                        let modLink = txtTable[index][0];
                        let modName = txtTable[index][1];
                        let modType = txtTable[index][2];
                        let modDependencies = txtTable[index][3].split("/");
                        let modRequireIn = txtTable[index][4].split("/");
                        let modDescription = txtTable[index][5];
                        //creating every cell of an *index row table for the HTML
                        let tableCellModIcon = '<td><img src="modIcons/' + modName + '.webp" onerror="this.src=\'pageImages/empty.webp\';"></td>';
                        let tableCellModName = '<td><a href="'+modLink+'">'+modName+'</a></td>';
                        let tableCellModType = '<td><p class="modtype '+modType.toLowerCase()+'">'+modType+'</td>';
                        
                        let tableCellModDependencies = '<td>';
                        for (let mIndex = 0; mIndex < modDependencies.length; mIndex++) { //Looping through every Mod Dependance
                            let linkFound = false;
                            for (let tIndex = 0; tIndex < txtTable.length; tIndex++) { //Looping through every Mod Name to extract a link to the mod
                                if (txtTable[tIndex][1] === modDependencies[mIndex]) { // Mod Name = Mod Dependance?
                                        let icon = '<img class="tooltipImage" src="modIcons/' + txtTable[tIndex][1] + '.webp" onerror="this.src=\'pageImages/empty.webp\';">' //icon when hovering over the link
                                        tableCellModDependencies += '<a class="tooltip" href="' + txtTable[tIndex][0] + '">' + modDependencies[mIndex] + icon + '</a>, '; 
                                        linkFound = true;
                                } 
                            }
                            if (linkFound === false) {
                                tableCellModDependencies += modDependencies[mIndex] + ', ';
                            }
                        }
                        tableCellModDependencies = tableCellModDependencies.substring(0,tableCellModDependencies.lastIndexOf(', ')) + tableCellModDependencies.substring(tableCellModDependencies.lastIndexOf(', ')+2 , tableCellModDependencies.length); //removing last ", "
                        tableCellModDependencies += '</td>'

                        let tableCellModRequireIn = '<td>';
                        for (let mIndex = 0; mIndex < modRequireIn.length; mIndex++) { //Looping through every Mod Dependance
                            let linkFound = false;
                            for (let tIndex = 0; tIndex < txtTable.length; tIndex++) { //Looping through every Mod Name to extract a link to the mod
                                if (txtTable[tIndex][1] === modRequireIn[mIndex]) { // Mod Name = Mod Require?
                                    let icon = '<img class="tooltipImage" src="modIcons/' + txtTable[tIndex][1] + '.webp" onerror="this.src=\'pageImages/empty.webp\';">' //icon when hovering over the link
                                        tableCellModRequireIn += '<a class="tooltip" href="' + txtTable[tIndex][0] + '">' + modRequireIn[mIndex] + icon + '</a>, ';
                                        linkFound = true;
                                }
                            }
                            if (linkFound === false) {
                                tableCellModRequireIn += modRequireIn[mIndex] + ', ';
                            }
                        } 
                        tableCellModRequireIn = tableCellModRequireIn.substring(0,tableCellModRequireIn.lastIndexOf(', ')) + tableCellModRequireIn.substring(tableCellModRequireIn.lastIndexOf(', ')+2 , tableCellModRequireIn.length); //removing last ", "
                        tableCellModRequireIn += '</td>'

                        let tableCellDescription = '<td>' + modDescription + '</td>';

                		tbody.innerHTML += '<tr>' + tableCellModIcon + tableCellModName + tableCellModType + tableCellModDependencies + tableCellModRequireIn + tableCellDescription + '</tr>';
        			}
                }

                fr.readAsText(this.files[0]);
            });

// 1. Searching for specific data of HTML table
search.addEventListener('input', searchTable);

function searchTable() {	
	table_rows = document.querySelectorAll('tbody tr');
    table_rows.forEach((row, i) => {
        let table_data = row.textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
    })
}

// 2. Sorting | Ordering data of HTML table
table_headings.forEach((head, i) => {		
    let sort_asc = true;
    head.onclick = () => {
		
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));

		table_rows = document.querySelectorAll('tbody tr');
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        })

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    }
})

function sortTable(column, sort_asc) {			
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}

// 3. Converting HTML table to PDF

const pdf_btn = document.querySelector('#toPDF');
const customers_table = document.querySelector('#customers_table');


const toPDF = function (customers_table) {
    const html_code = `
    <!DOCTYPE html>
    <link rel="stylesheet" type="text/css" href="style.css">
    <main class="table" id="customers_table">${customers_table.innerHTML}</main>`;

    const new_window = window.open();
     new_window.document.write(html_code);

    setTimeout(() => {
        new_window.print();
        new_window.close();
    }, 400);
}

pdf_btn.onclick = () => {
    toPDF(customers_table);
}

// 4. Converting HTML table to JSON

const json_btn = document.querySelector('#toJSON');

const toJSON = function (table) {
    let table_data = [],
        t_head = [],

        t_headings = table.querySelectorAll('th'),
        t_rows = table.querySelectorAll('tbody tr');

    for (let t_heading of t_headings) {
        let actual_head = t_heading.textContent.trim().split(' ');

        t_head.push(actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase());
    }

    t_rows.forEach(row => {
        const row_object = {},
            t_cells = row.querySelectorAll('td');

        t_cells.forEach((t_cell, cell_index) => {
            const img = t_cell.querySelector('img');
            if (img) {
                row_object['customer image'] = decodeURIComponent(img.src);
            }
            row_object[t_head[cell_index]] = t_cell.textContent.trim();
        })
        table_data.push(row_object);
    })

    return JSON.stringify(table_data, null, 4);
}

json_btn.onclick = () => {
    const json = toJSON(customers_table);
    downloadFile(json, 'json')
}

// 5. Converting HTML table to CSV File

const csv_btn = document.querySelector('#toCSV');

const toCSV = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join(',');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join(',') + ',' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.replace(/,/g, ".").trim()).join(',');

        return data_without_img + ',' + img;
    }).join('\n');

    return headings + '\n' + table_data;
}

csv_btn.onclick = () => {
    const csv = toCSV(customers_table);
    downloadFile(csv, 'csv', 'customer orders');
}

// 6. Converting HTML table to EXCEL File

const excel_btn = document.querySelector('#toEXCEL');

const toExcel = function (table) {
    // Code For SIMPLE TABLE
    // const t_rows = table.querySelectorAll('tr');
    // return [...t_rows].map(row => {
    //     const cells = row.querySelectorAll('th, td');
    //     return [...cells].map(cell => cell.textContent.trim()).join('\t');
    // }).join('\n');

    const t_heads = table.querySelectorAll('th'),
        tbody_rows = table.querySelectorAll('tbody tr');

    const headings = [...t_heads].map(head => {
        let actual_head = head.textContent.trim().split(' ');
        return actual_head.splice(0, actual_head.length - 1).join(' ').toLowerCase();
    }).join('\t') + '\t' + 'image name';

    const table_data = [...tbody_rows].map(row => {
        const cells = row.querySelectorAll('td'),
            img = decodeURIComponent(row.querySelector('img').src),
            data_without_img = [...cells].map(cell => cell.textContent.trim()).join('\t');

        return data_without_img + '\t' + img;
    }).join('\n');

    return headings + '\n' + table_data;
}

excel_btn.onclick = () => {
    const excel = toExcel(customers_table);
    downloadFile(excel, 'excel');
}

const downloadFile = function (data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName;
    const mime_types = {
        'json': 'application/json',
        'csv': 'text/csv',
        'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    a.href = `
        data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}
    `;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
