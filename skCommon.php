<?php

define('ROOT', dirname(__FILE__));
const VIEW = ROOT . '/view';
const VENDOR = ROOT . '/vendor';
const CONFIG = ROOT . '/config';
const SKETCH = VENDOR . '/denetorus/sketch';

require_once(SKETCH.'/AutoLoad.php');

header('Content-type: text/html');
header('Access-Control-Allow-Origin: *');

$parse_url = parse_url($_SERVER['REQUEST_URI']);
$_SERVER['REQUEST_URI'] = $parse_url["path"];
if (isset($parse_url['query'])){
    parse_str($parse_url['query'], $_GET);
}
