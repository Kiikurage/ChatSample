<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

function json_get($path, $key) {
    $datafile_json = file_get_contents($path);
    $datafile = (array)json_decode($datafile_json);
    
    return array_key_exists($key, $datafile) ?
            $datafile[$key] :
            array();
}

function json_set($path, $key, $input) {

    $datafile_json = file_get_contents($path);
    $datafile = (array)json_decode($datafile_json);

    $datafile[$key] = $input;

    $datafile_json = json_encode($datafile, JSON_UNESCAPED_UNICODE);

    file_put_contents($path, $datafile_json);
}

?>
