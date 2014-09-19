<?php
    require('./common.php');

    header('Content-type: application/json');

    $key = (string)$_GET['key'];
    $val = json_get('./data.json', $key);
    
    echo json_encode($val, JSON_UNESCAPED_UNICODE);
?>
