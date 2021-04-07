const _Form = document.getElementById("ctr-form");

const _InputFile = document.getElementById("ctr-input-file");
const _MainImg = document.getElementById("ctr-main-img");
const _ImgCont = document.getElementById("ctr-img-cont");
const _SubmitButton = document.getElementById("ctr-submit");

const _XnumInput = document.getElementById("ctr-x-input");
const _YnumInput = document.getElementById("ctr-y-input");

const _CellsCont = document.getElementById("ctr-cells-cont");

const _HandlerUrl = "/php/handler.php";

const _MaxCell = 25;
const _DefaultCell = 4;

var _SrcImage = null;

// ------------------------------------------------------------------------------------------

function clearAllChildren(elem) {
    if (Array.isArray(elem)) {
        Array.from(elem.children).forEach(function(child) {
            child.innerHTML = "";
        });
    } else {
        elem.innerHTML = "";
    }
}

function changeCellsOnImage() {
    if (_SrcImage != null || _SrcImage != undefined) {
        clearAllChildren(_CellsCont);

        const xValue = _XnumInput.value;
        const yValue = _YnumInput.value;
        const numberOfCells = xValue * yValue;
        const sizeCellX = _CellsCont.offsetWidth / xValue;
        const sizeCellY = _CellsCont.offsetHeight / yValue;

        for (var y = 0; y < yValue; y++) {
            for (var x = 0; x < xValue; x++) {
                const keyInput = y + "|" + x;

                const newCellElement = document.createElement("div");
                newCellElement.classList.add("constructor__cell");
                newCellElement.style.height = sizeCellY + "px";
                newCellElement.style.width = sizeCellX + "px";
                _CellsCont.append(newCellElement);

                const newInputElement = document.createElement("input");
                newInputElement.type = "checkbox";
                newInputElement.classList.add("constructor__cell-input");
                newInputElement.setAttribute("name", keyInput);
                newCellElement.append(newInputElement);
            }
        }

        _CellsCont.style.gridTemplateColumns = "repeat(" + xValue + ", " + sizeCellX + "px)";
    }
}

_XnumInput.addEventListener('change', e => {
    const xValue = _XnumInput.value < 2 || _XnumInput.value > _MaxCell ? _DefaultCell : _XnumInput.value;
    _XnumInput.value = xValue;
    changeCellsOnImage();
});

_YnumInput.addEventListener('change', e => {
    const yValue = _YnumInput.value < 2 || _YnumInput.value > _MaxCell ? _DefaultCell : _YnumInput.value;
    _YnumInput.value = yValue;
    changeCellsOnImage();
});

_SubmitButton.addEventListener('click', e => {
    e.preventDefault();

    if (_SrcImage != null || _SrcImage != undefined) {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', _HandlerUrl, true);
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        // var resultArray = {};
        // resultArray.xSize = _XnumInput.value;
        // resultArray.ySize = _YnumInput.value;

        var formData = new FormData();
        formData.append("uploadFile", _InputFile.files[0]);
        formData.append("xSize", _XnumInput.value);
        formData.append("ySize", _YnumInput.value);

        console.log(formData);

        //resultArray.file = formData;

        const cellsInput = document.querySelectorAll(`input[type="checkbox"].constructor__cell-input`);

        var cellsArray = {};
        cellsInput.forEach(function(elem, i) {
            if (elem.checked) {
                formData.append(`${elem.getAttribute("name")}`, true);
            } else formData.append(`${elem.getAttribute("name")}`, false);
        });

        //resultArray.cells = JSON.stringify(cellsArray);

        console.log(formData.get("file"));

        //console.log(resultArray);
        //xhr.send(JSON.stringify(resultArray));
        xhr.send(formData);


        xhr.addEventListener("load", function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    document.body.innerHTML = document.body.innerHTML + xhr.responseText;
                }
            }
        });

        // _Form.submit();

    } else alert("Загрузите изображение");
});

_InputFile.addEventListener('change', e => {
    clearAllChildren(_CellsCont);

    var addedFiles = e.target.files;
    if (addedFiles[0].type.match('image.*')) {
        var curFile = addedFiles[0];
        var fileReader = new FileReader();
        fileReader.onload = (function(theFile) {
            return function(e) {
                _MainImg.src = e.target.result;
                _SrcImage = e.target.result;
                setTimeout(changeCellsOnImage, 1000);
            };
        })(curFile);

        fileReader.readAsDataURL(curFile);
    }
});