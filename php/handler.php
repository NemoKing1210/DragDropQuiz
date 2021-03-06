<?php

$_RootDir = "../";
$_MainDir = $_RootDir . "img/constructor/";
$_OriginDir = $_MainDir . "origin/";
$_ResultDir = $_MainDir . "result/";

$_JS_ResultDir = "img/constructor/result/";

$_DefaultTextFileName = "dataArray.txt";
$_DefaultMinCellNumber = 2;
$_DefaultMaxCellNumber = 25;

$_File;
$_FileInfo;
$_TextFile;

$_xSize = isset($_POST['xSize']) ? $_POST['xSize'] : false;
$_ySize = isset($_POST['ySize']) ? $_POST['ySize'] : false;

$_xSize = $_xSize <= 0 ? $_DefaultMinCellNumber : $_xSize;
$_ySize = $_ySize <= 0 ? $_DefaultMinCellNumber : $_ySize;

$_xSize = $_xSize > $_DefaultMaxCellNumber ? $_DefaultMaxCellNumber : $_xSize;
$_ySize = $_ySize > $_DefaultMaxCellNumber ? $_DefaultMaxCellNumber : $_ySize;

$_cellsArray = array();

$_uploadFileError = false;

if (!is_dir($_MainDir) || !isset($_FILES['uploadFile'])) {
    exit;
}

if (!is_dir($_OriginDir)) {
    mkdir($_OriginDir, 0777);
}

if (!is_dir($_ResultDir)) {
    mkdir($_ResultDir, 0777);
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

                $cutWidth = ($posX + $cellSizeX) > $width ? ($posX + $cellSizeX - $width) : $cellSizeX;
                $cutHeight = ($posY + $cellSizeY) > $height ? ($posY + $cellSizeY - $height) : $cellSizeY;

                $cutImg = imagecrop($newImg, ['x' => $posX, 'y' => $posY, 'width' => $cutWidth, 'height' => $cutHeight]);
                imageJPEG($cutImg, $newDir . $uniqueName);

            }
        }

        $dataText = "var DataArray = [\n";

        $textFileName = $newDir . $_DefaultTextFileName;
        $_TextFile = fopen($textFileName, "w");

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

        $dataText = $dataText . "\n\nvar ImgSrc = '" . $_JS_ResultDir . $_FileInfo["filename"] . "/" . "';";

        fwrite($_TextFile, $dataText);
        fclose($_TextFile);

        if (isset($_TextFile)) {
            echo file_get_contents($textFileName);
        }

    } elseif ($fileType == "image/png") {

        $newImg = imagecreatefrompng($_File);
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

                $cutWidth = ($posX + $cellSizeX) > $width ? ($posX + $cellSizeX - $width) : $cellSizeX;
                $cutHeight = ($posY + $cellSizeY) > $height ? ($posY + $cellSizeY - $height) : $cellSizeY;

                $cutImg = imagecrop($newImg, ['x' => $posX, 'y' => $posY, 'width' => $cutWidth, 'height' => $cutHeight]);
                imagePNG($cutImg, $newDir . $uniqueName);

            }
        }

        $dataText = "var DataArray = [\n";

        $textFileName = $newDir . $_DefaultTextFileName;
        $_TextFile = fopen($textFileName, "w");

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

        $dataText = $dataText . "\n\nvar ImgSrc = '" . $_JS_ResultDir . $_FileInfo["filename"] . "/" . "';";

        fwrite($_TextFile, $dataText);
        fclose($_TextFile);

        if (isset($_TextFile)) {
            echo file_get_contents($textFileName);
        }

    }

}