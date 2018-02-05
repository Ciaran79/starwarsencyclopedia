var nextUrl;
var previousUrl;
var baseUrl = "https://swapi.co/api/";
var category = document.getElementById('category');
var searchBox = document.getElementById('search-box');
var searchForm = document.getElementById('search-form');
var catData;


$(document).ready(function () {

    // Event handlers
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        getResults();
    });

    $('#search-button').click(function () {
        searchSwapi();
    });

    $('#next-page').click(function () {
        changePage("next");
    });

    $('#previous-page').click(function () {
        changePage("previous");
    });

    $('#show-results').click(function () {
        getResults();
    });

   
    function changePage(arg) {

        if (arg == "next") {
            if ((nextUrl !== null) && (nextUrl !== undefined)) {
                displayArticles(nextUrl);
            } else {
                alert('This is the last page...');
            }
        } else {
            if ((previousUrl !== null) && (previousUrl !== undefined)) {
                displayArticles(previousUrl);
            } else {
                alert('This is the first page...');
            }
        }
    }



    function getLinkData() {
        // let suffix = cellTextContent.slice(baseUrl.length);
        // let id = suffix.slice(suffix.indexOf('/'));
        // let baseCategory = suffix.slice(0, suffix.indexOf('/'));
        let categoryTypes = ['films', 'people', 'planets', 'species', 'starships', 'vehicles'];
               
        categoryTypes.forEach(element => {

            var newUrl = baseUrl + element;

            $.ajax({
    
                url: newUrl,
                type: "get",
    
                error: function () {
                    // alert('<p>An error has occurred</p>');
                    console.log(status);
                },
    
                success: function (data, status) {
                    console.log(data);
                    catData = data;
                    var catLinkList = document.getElementById('main-table').getElementsByTagName('a');
                    for (var n = 0; n < catLinkList.length; n++) {
                        if (catLinkList[n].innerHTML.includes(element)){
                            catLinkList[n].innerHTML = Object.values(catData.results[n])[0];
                        }
                    }
                    
                }
            });
        });

       
    }

   
    function clearTable() {
        // // let mainTable = $('#main-table');
        // if ((typeof mainTable !== "null") && (typeof mainTable !== "undefined")) {
            $('#main-table').remove();
        
    }

    function getResults() {

        if (searchBox.value != "") {
            searchSwapi();
        } else {
            displayArticles();
        }
    }

    function searchSwapi() {
        let searchUrl = baseUrl + category.value + "?search=" + searchBox.value;
        displayArticles(searchUrl);
    }

    function displayArticles() {
        "use strict";
        clearTable();

        let combinedUrl = baseUrl + category.value;

        if (arguments.length > 0) {
            combinedUrl = arguments[0];
        }


        //Get data from Api
        $.ajax({

            url: combinedUrl,


            error: function () {
                alert('<p>An error has occurred</p>');
                console.log(status);
            },

            success: function (data, status) {
                console.log(data);
                if (data.count == 0) {
                    alert('sorry couldn\'t find anything');
                    return;
                }
                nextUrl = data.next;
                previousUrl = data.previous;

                var rows;
                var headers;
                if (typeof data.results === "undefined") {
                    rows = 1;
                    headers = Object.keys(data).length;
                } else {
                    rows = data.results.length;
                    headers = Object.keys(data.results[0]).length;
                }


                generate_table(headers, rows);

                function generate_table(headers, rows) {
                    // get the reference for the body
                    var main = document.getElementById("main");

                    // creates a <table> element and a <tbody> element
                    var tbl = document.createElement("table");
                    var tblBody = document.createElement("tbody");

                    var firstRow = document.createElement("tr");
                    tblBody.appendChild(firstRow);

                    var headerData;
                    if (typeof data.results === "undefined") {
                        headerData = Object.keys(data);
                    } else {
                        headerData = Object.keys(data.results[0]);
                    }


                    for (var k = 0; k < headers; k++) {
                        var tblHeader = document.createElement("th");
                        var headerTextContent = headerData[k];
                        headerTextContent = headerTextContent.replace('_', ' ');
                        var headerText = document.createTextNode(headerTextContent);
                        tblHeader.appendChild(headerText);
                        tblBody.appendChild(tblHeader);
                    }


                    // creating all cells
                    for (var i = 0; i < rows; i++) {
                        var row = document.createElement("tr");

                        var cellTextData;
                        if (typeof data.results === "undefined") {
                            cellTextData = data;
                        } else {
                            cellTextData = data.results[i];
                        }

                        for (var j = 0; j < headers; j++) {

                            var cell = document.createElement("td");
                            var cellTextContent = Object.values(cellTextData)[j];

                            if (typeof cellTextContent === "string") {
                                if (cellTextContent.includes("https://")) {
                                    let cellLink = document.createElement("a");
                                    cellLink.setAttribute('href', cellTextContent);

                                    cellLink.innerHTML = cellTextContent;
                                    cell.appendChild(cellLink);
                                } else {
                                    let cellText = document.createTextNode(cellTextContent);
                                    cell.appendChild(cellText);
                                }
                            } else if (typeof cellTextContent === "object") {
                                var extraObjectText;
                                let cellDiv = document.createElement("div");

                                for (var l = 0; l < cellTextContent.length; l++) {
                                    if (typeof cellTextContent[l] === "string") {
                                        if (cellTextContent[l].includes("https://")) {
                                            let cellLink = document.createElement("a");
                                            let linkBreak = document.createElement("br");
                                            cellLink.setAttribute('href', cellTextContent[l]);
                                            cellLink.innerHTML = cellTextContent[l];
                                            cellDiv.appendChild(cellLink);
                                            cellDiv.appendChild(linkBreak);
                                        } else {
                                            extraObjectText += cellTextContent[l] + "\n";
                                        }

                                    }

                                }
                                cellTextContent = extraObjectText;
                                cell.appendChild(cellDiv);

                            } else {
                                let cellText = document.createTextNode(cellTextContent);
                                cell.appendChild(cellText);
                            }

                            row.appendChild(cell);
                        }
                        tblBody.appendChild(row);
                    }
                    tbl.appendChild(tblBody);
                    main.appendChild(tbl);
                    tbl.setAttribute("border", "2");
                    tbl.setAttribute('id', 'main-table');
                    tbl.setAttribute('class', 'rwd-table');
                }
                $('table a').click(function (e) {
                    e.preventDefault();
                    displayArticles(this.href);
                });

                getLinkData();

            },
        });
    }
});