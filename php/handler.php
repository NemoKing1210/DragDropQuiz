<?php

$_MainDir = "../img/constructor/";
$_OriginDir = $_MainDir . "origin/";
$_ResultDir = $_MainDir . "result/";

$_File;
$_FileInfo;

$_xSize = isset($_POST['xSize']) ? $_POST['xSize'] : false;
$_ySize = isset($_POST['ySize']) ? $_POST['ySize'] : false;

$_DefaultTextFileName = "dataArray.txt";

$_cellsArray = array();

$_uploadFileError = false;

if (!is_dir($_MainDir)) {
    exit;
}

// ----------------------------------------------------------------------------------------

function getFileInfo($filename)
{
    $path_info = pathinfo($filename);
    return $path_info['extension'];
}

if (isset($_FILES['uploadFile'])) {
    $_uploadFileError = false;
    $file = $_FILES['uploadFile'];

    if (!is_dir($_OriginDir)) {
        mkdir($_OriginDir, 0777);
    }

    $fileInfo = pathinfo($file['name']);
    $uniqueName = uniqid() . '.' . $fileInfo['extension'];

    if (move_uploaded_file($file['tmp_name'], $_OriginDir . $uniqueName)) {
        $_File = $_OriginDir . $uniqueName;
        $_FileInfo = pathinfo($_File);
    } else {
        $_uploadFileError = true;
    }

}

if ($_xSize && $_ySize) {

    for ($y = 0; $y < $_ySize; $y++) {
        $_cellsArray[$y] = array();
    }

    for ($y = 0; $y < $_ySize; $y++) {
        for ($x = 0; $x < $_xSize; $x++) {
            $cellKey = $y . "|" . $x;
            if (isset($_POST[$cellKey])) {
                $_cellsArray[$y][$x] = $_POST[$cellKey] == "false" ? false : true;
            } else {
                $_cellsArray[$y][$x] = false;
            }
        }
    }

}

if (!$_uploadFileError) {

    if (!is_dir($_ResultDir)) {
        mkdir($_ResultDir, 0777);
    }

    $fileType = mime_content_type($_File);
    list($width, $height, $type, $attr) = getimagesize($_File);

    $cellSizeX = $width / $_xSize;
    $cellSizeY = $height / $_ySize;

    if ($fileType == "image/jpeg") {

        $newImg = imagecreatefromjpeg($_File);
        $newDir = $_ResultDir . $_FileInfo["filename"] . "/";

        $imagesArray = array();

        for ($y = 0; $y < $_ySize; $y++) {
            $imagesArray[$y] = array();
        }

        if (!is_dir($newDir)) {
            mkdir($newDir, 0777);
        }

        for ($y = 0; $y < $_ySize; $y++) {
            for ($x = 0; $x < $_xSize; $x++) {

                $uniqueName = uniqid() . '.' . $_FileInfo['extension'];

                $imagesArray[$y][$x] = $uniqueName;

                $posX = $x * $cellSizeX;
                $posY = $y * $cellSizeY;

                $cutWidth = $cellSizeX;
                $cutHeight = $cellSizeY;

                //$cutWidth = ($posY + $cellSizeY) > $width ? ($posY + $cellSizeY - $width) : $cellSizeY;
                //$cutHeight = ($posX + $cellSizeX) > $height ? ($posX + $cellSizeX - $height) : $cellSizeX;

                $cutImg = imagecrop($newImg, ['x' => $posX, 'y' => $posY, 'width' => $cutWidth, 'height' => $cutHeight]);
                imageJPEG($cutImg, $newDir . $uniqueName);

            }
        }

        $dataText = "var DataArray = [\n";

        $textFileName = $newDir . $_DefaultTextFileName;
        $textFile = fopen($textFileName, "w");

        for ($y = 0; $y < $_ySize; $y++) {
            $dataText = $dataText . "[";
            for ($x = 0; $x < $_xSize; $x++) {
                $addText = '`' . $imagesArray[$y][$x];

                if ($_cellsArray[$y][$x] == true) {
                    $addText = $addText . ' DROP`';
                } else {
                    $addText = $addText . '`';
                }

                if ($x != $_xSize - 1) {
                    $addText = $addText . ", ";
                }

                $dataText = $dataText . $addText;
            }

            if ($y != $_ySize - 1) {
                $dataText = $dataText . "],\n";
            } else {
                $dataText = $dataText . "]\n];";
            }

        }

        $dataText = $dataText . "\n\nvar ImgSrc = '" . $newDir . "';";

        fwrite($textFile, $dataText);
        fclose($textFile);

    }

    //var_dump(basename($_File));

    //var_dump($fileType);
    //$originFile = imagecreatefrompng($_OriginDir . basename($_File));

    //$fileInfo = pathinfo($file['name']);
    //$uniqueName = uniqid() . '.' . $fileInfo['extension'];

    //$img = imagecreatetruecolor(128, 128);
    //$im2 = imagecrop($originFile, ['x' => 0, 'y' => 0, 'width' => 128, 'height' => 128]);
    //imagePNG($im2, $_ResultDir . $uniqueName);
    //move_uploaded_file($file['tmp_name'], $_OriginDir . $uniqueName);
    //$im = imagecrop($im, ['x' => 0, 'y' => 0, 'width' => 100, 'height' => 100]);
    //var_dump($im);

}