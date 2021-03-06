﻿/// <reference path="Scripts/jquery-2.2.0.js" />


(function () {
    $.fn.JqTable = function (options) {
        var settings = $.extend({
            //dJson: [],
            Header: [],
            border: '1px',
            type: "GET",
            url: "",
            sdata: "",
            surl: "",
            contentType: "application/json; charset=utf-8",
            search: "",
            tableCss: '',
            Editable: false

        }, options);
        var s = "<div style='float:right;'>Search:<input id='searchtxt' type='text'></div>";
        this.append(s);



        var table = $('<table id="tbl"></table>').addClass(settings.tableCss);

        //---Ajax call-----------------------------
        var JsonData;
        $.ajax({
            type: settings.type,
            url: settings.url,
            async: false,
            contentType: settings.contentType,
            success: function (data) {
                JsonData = data.d;
            },
            error: function (xhr, x, p) {
                console.log(xhr.error.toString());
                console.log(x.toString());
            }
        });

        //-------------------------


        //Header from Json

        var headerRow = $('<thead><tr></tr></thead>').addClass("HeaderCss");
        if (settings.Header.length === 0) {

            var array = [];

            $.each(JsonData, function (i, value) {
                delete value.__type;
                array = $.map(value, function (value, index) {
                    return [index];
                });
                return;
            });

            $.each(array, function (index, value) {
                var cell = $('<th></th>').text(value);
                headerRow.append(cell);
                if (settings.Editable && array.length - 1 == index) {
                    var ActionCell = $('<th>Action</th>');
                    headerRow.append(ActionCell);
                }
            });

        } else {
            $.each(settings.Header, function (index, value) {
                var cell = $('<th></th>').text(value);
                headerRow.append(cell);

                if (settings.Editable && settings.Header.length - 1 == index) {
                    var ActionCell = $('<th>Action</th>');
                    headerRow.append(ActionCell);
                }

            });
        }
        table.append(headerRow);


        GenerateTable(JsonData, settings, table);

        $('').click(function () {
            JsonData.sort(dynamicSort("Id"));
        })



        //Search---------------------------

        $('#searchtxt').on("input", function () {
            //--------Search----------------------------

            var txt = $('#searchtxt').val();
            var FilteredObjects = [];
            if (txt != "") {
                var listOfSelected = [];
                $.each(JsonData, function (i, value) {
                    delete value.__type;
                    var array = $.map(value, function (v, index_j) {
                        return [v];
                    });

                    $.each(array, function (index_i, valueOfEle) {
                        var vvalue = valueOfEle.toString();

                        if (vvalue.toLowerCase().indexOf(txt.toLowerCase()) >= 0)
                        { listOfSelected.push(i); return; }
                    });



                });
                var uniqueofSelected = [];
                $.each(listOfSelected, function (i, el) {
                    if ($.inArray(el, uniqueofSelected) === -1) uniqueofSelected.push(el);
                });

                $.each(uniqueofSelected, function (index, Value) {
                    FilteredObjects.push(JsonData[Value]);
                });

                if (FilteredObjects.length != 0) {
                    $('#tbl tbody').remove();
                    GenerateTable(FilteredObjects, settings, table);
                }
                //else {
                //    $('#tbl tbody').remove();
                //    //var array=
                //    GenerateTable(JsonData, settings, table);
                //}

            } else {
                $('#tbl tbody').remove();
                //var array=
                GenerateTable(JsonData, settings, table);
            }




        });


        //--Sort--------------------------------------------------------------------------
        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }








        this.append(table);
        return this;
    }

    function GenerateTable(JsonData, settings, table) {

        //------Json Header--------------------------------
        var JsonHeader = [];
        $.each(JsonData, function (i, value) {
            delete value.__type;
            JsonHeader = $.map(value, function (value, index) {
                return [index];
            });
            return;
        });
        //--------------------------------------------

        table.attr('border', settings.border);
        var flag = false;
        //--Records from Json-------------------------------------------
        var row = $('<tr></tr>').addClass("HeaderCss");
        var tbody = $('<tbody></tbody>');
        $.each(JsonData, function (i, value) {
            if (flag)
            { return; }

            var row = $('<tr></tr>').addClass("rowCss");
            delete value.__type;
            if (JsonData.length > 1) {
                var array = $.map(value, function (value, index) {
                    return [value];
                });
                $.each(array, function (index, value) {
                    //if (index == 3) {
                    //    var url = '<a href="' + value + '">X</a>';
                    //    var cell = $('<td></td>').append(url);
                    //} else {



                    var cell = $('<td  cellIndex ="' + i + "_" + index + '"><p id="par_' + i + "_" + index + '">' + value + '</p></td>').append();
                    //}
                    var TxtBox = $('<input id="txtbox_' + i + "_" + index + '" value="' + value + '"style="display: none;width: 100%; "></button>');
                    cell.append(TxtBox);



                    row.append(cell);
                    if (settings.Editable && array.length - 1 == index) {

                        //var EditCell = $('<td><input type="button" id="btnEdit_' + i + '" value="Edit" /></td>');
                        var Editbutton = $('<button id="Edit_' + i + "_" + index + '"">Edit</button>').click(function () {
                            // alert('#Save_' + i + '_' + index);
                            $(this).css("display", "none");
                            $('#Save_' + i + '_' + index).css("display", "");
                            $('#Save_' + i + '_' + index).css("float", "left");
                            $('#Cancel_' + i + '_' + index).css("display", "");
                            $('#Cancel_' + i + '_' + index).css("float", "left");
                            $('#Cancel_' + i + '_' + index).css("margin-left", "2px");

                            for (var j = 0; j < array.length; j++) {
                                $('#txtbox_' + i + "_" + j).css("display", "");
                                $('#par_' + i + "_" + j).css("display", "none");

                            }



                            return false;
                        });


                        var Savebutton = $('<button id="Save_' + i + "_" + index + '" style="display: none;">Save</button>').click(function () {

                            var em = {};
                            $.each(JsonHeader, function (indexOfJsonHeader, ValueofJsonHeader) {
                                em[ValueofJsonHeader] = $('#txtbox_' + i + "_" + indexOfJsonHeader).val();
                            });
                            var JsonStringified = JSON.stringify(em);

                            var successFlag = false;
                            $.ajax({
                                type: "POST",
                                url: settings.surl,
                                async: false,
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8",
                                data: "{" + settings.sdata + ":" + JsonStringified + "} ",
                                success: function (data) {
                                    console.log("saved Successfully");
                                    successFlag = true;
                                },
                                error: function (xhr, x, p) {
                                    console.log('something went wrong, please try again');
                                }
                            });
                            if (successFlag) {
                                for (var j = 0; j < array.length; j++) {
                                    $('#txtbox_' + i + "_" + j).css("display", "none");
                                    $('#par_' + i + "_" + j).css("display", "");

                                }

                                $.ajax({
                                    type: settings.type,
                                    url: settings.url,
                                    async: false,
                                    contentType: settings.contentType,
                                    success: function (data) {
                                        JsonData = data.d;
                                    },
                                    error: function (xhr, x, p) {
                                        console.log(xhr.error.toString());
                                        console.log(x.toString());
                                    }
                                });
                            }
                            $(this).css("display", "none");
                            $('#Cancel_' + i + '_' + index).css("display", "none");
                            $('#Edit_' + i + '_' + index).css("display", "");
                            $('#Edit_' + i + '_' + index).css("float", "left");



                            return false;
                        });
                        var Cancelbutton = $('<button id="Cancel_' + i + "_" + index + '" style="display: none;">Cancel</button>').click(function () {
                            //alert("Cancel Button");
                            $(this).css("display", "none");
                            $('#Save_' + i + '_' + index).css("display", "none");
                            $('#Edit_' + i + '_' + index).css("display", "");
                            $('#Edit_' + i + '_' + index).css("float", "left");

                            for (var j = 0; j < array.length; j++) {
                                $('#txtbox_' + i + "_" + j).css("display", "none");
                                $('#par_' + i + "_" + j).css("display", "");

                            }

                            return false;
                        });

                        var EditCell = $('<td></td>').append(Editbutton);
                        EditCell.append(Savebutton);
                        EditCell.append(Cancelbutton);

                        row.append(EditCell);
                    }
                });
            }
            else {
                var array = [];
                $.each(JsonData, function (i, value) {
                    //delete value.__type;
                    array = $.map(value, function (value, index) {
                        return [value];
                    });
                    //return;
                });

                //var array = JsonData;
                flag = true;
                $.each(array, function (index, value) {
                    //var cell = $('<td></td>').text(value);
                    // var TxtBox = $('<input id="txtbox_' + i + "_" + index + '"  style="visibility: hidden; "></button>').val();

                    var cell = $('<td  cellIndex ="' + i + "_" + index + '"><p id="par_' + i + "_" + index + '">' + value + '</p></td>').append();
                    var TxtBox = $('<input id="txtbox_' + i + "_" + index + '" value="' + value + '"style="display: none;width: 100%; "></button>');



                    cell.append(TxtBox);

                    row.append(cell);




                    if (settings.Editable && array.length - 1 == index) {
                        //var EditCell = $('<td><input type="button" id="btnEdit_' + i + '" value="Edit" /></td>').append();

                        var Editbutton = $('<button id="Edit_' + i + "_" + index + '"">Edit</button>').click(function () {
                            // alert('#Save_' + i + '_' + index);
                            $(this).css("display", "none");
                            $('#Save_' + i + '_' + index).css("display", "");
                            $('#Save_' + i + '_' + index).css("float", "left");
                            $('#Cancel_' + i + '_' + index).css("display", "");
                            $('#Cancel_' + i + '_' + index).css("float", "left");
                            $('#Cancel_' + i + '_' + index).css("margin-left", "2px");

                            for (var j = 0; j < array.length; j++) {
                                $('#txtbox_' + i + "_" + j).css("display", "");
                                $('#par_' + i + "_" + j).css("display", "none");

                            }



                            return false;
                        });


                        var Savebutton = $('<button id="Save_' + i + "_" + index + '" style="display: none;">Save</button>').click(function () {

                            var em = {};
                            $.each(JsonHeader, function (indexOfJsonHeader, ValueofJsonHeader) {
                                em[ValueofJsonHeader] = $('#txtbox_' + i + "_" + indexOfJsonHeader).val();
                            });
                            var JsonStringified = JSON.stringify(em);

                            var successFlag = false;
                            $.ajax({
                                type: "POST",
                                url: settings.surl,
                                async: false,
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8",
                                data: "{" + settings.sdata + ":" + JsonStringified + "} ",
                                success: function (data) {
                                    console.log("saved Successfully");
                                    successFlag = true;
                                },
                                error: function (xhr, x, p) {
                                    console.log('something went wrong, please try again');
                                }
                            });
                            if (successFlag) {
                                for (var j = 0; j < array.length; j++) {
                                    $('#txtbox_' + i + "_" + j).css("display", "none");
                                    $('#par_' + i + "_" + j).css("display", "");

                                }

                                $.ajax({
                                    type: settings.type,
                                    url: settings.url,
                                    async: false,
                                    contentType: settings.contentType,
                                    success: function (data) {
                                        JsonData = data.d;
                                    },
                                    error: function (xhr, x, p) {
                                        console.log(xhr.error.toString());
                                        console.log(x.toString());
                                    }
                                });
                            }
                            $(this).css("display", "none");
                            $('#Cancel_' + i + '_' + index).css("display", "none");
                            $('#Edit_' + i + '_' + index).css("display", "");
                            $('#Edit_' + i + '_' + index).css("float", "left");



                            return false;
                        });

                        var Cancelbutton = $('<button id="Cancel_' + i + "_" + index + '" style="display: none;">Cancel</button>').click(function () {
                            //alert("Cancel Button");
                            $(this).css("display", "none");
                            $('#Save_' + i + '_' + index).css("display", "none");
                            $('#Edit_' + i + '_' + index).css("display", "");
                            $('#Edit_' + i + '_' + index).css("float", "left");

                            for (var j = 0; j < array.length; j++) {
                                $('#txtbox_' + i + "_" + j).css("display", "none");
                                $('#par_' + i + "_" + j).css("display", "");

                            }

                            return false;
                        });

                        var EditCell = $('<td></td>').append(Editbutton);
                        EditCell.append(Savebutton);
                        EditCell.append(Cancelbutton);
                        row.append(EditCell);
                    }

                });


                //$.each(array, function (index, value) {
                //    if (index == 3) {
                //        var url = '<a href="' + value + '">X</a>';
                //        var cell = $('<td></td>').append(url);
                //    } else {
                //        var cell = $('<td></td>').text(value);
                //    }
                //    row.append(cell);
                //});
                //tbody.append(row);
                //table.append(tbody);

            }
            tbody.append(row);

        });
        table.append(tbody);
    }



})(jQuery());

