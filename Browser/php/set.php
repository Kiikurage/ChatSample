<?php
    require('./common.php');

    $post = (array)json_decode($_POST['val']);
    $key = (string)$_POST['key'];

    $data = (array)json_get('./data.json', $key);
    $posts = (array)$data["posts"];
    $posts[] = $post;
    $data["posts"] = $posts;

    json_set('./data.json', $key, $data);
?>
