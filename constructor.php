<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">

    <title>Document</title>
</head>

<body>

    <form id="ctr-form" class="constructor" action="/php/handler.php" method="POST">
        <div class="constructor__header">
            <h4 class="constructor__header-title">Конструктор</h4>
        </div>
        <div id="ctr-body" class="constructor__body">
            <span id="ctr-img-cont" class="constructor__img-cont">
                <img id="ctr-main-img" class="constructor__main-img" src="">
                <div id="ctr-cells-cont" class="constructor__cells-cont"></div>
            </span>
        </div>
        <div class="constructor__footer">
            <input id="ctr-submit" class="constructor__input" type="submit" value="Дальше">
            <label class="input-file">
                <img class="input-file__img" src="/img/download.png">
                <span class="input-file__title">Добавить файл</span>
                <input id="ctr-input-file" name="_file" class="input-file__event" type="file"
                    accept=".jpg, .jpeg, .png">
            </label>
            <div class="constructor__size-cont">
                <label class="constructor__size-label">X: <input id="ctr-x-input" name="_xSize"
                        class="constructor__size-input" type="number" placeholder="4" value="4"></label>
                <label class="constructor__size-label">Y: <input id="ctr-y-input" name="_ySize"
                        class="constructor__size-input" type="number" placeholder="4" value="4"></label>
            </div>
            <button id="ctr-color" class="constructor__input">Сменить цвет ячеек</button>
        </div>
    </form>

    <script src="js/constructor.js"></script>
</body>

</html>