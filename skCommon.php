<?php

define('ROOT', dirname(__FILE__));
const VIEW = ROOT . '/view';
const MODEL = ROOT . '/model';
const CONTROLLER = ROOT . '/controller';
const VENDOR = ROOT . '/vendor';
const CONFIG = ROOT . '/config';
const SIGN = ROOT . '/sign';
const SKETCH = VENDOR . '/denetorus/sketch';

require_once(SKETCH.'/AutoLoad.php');

header('Content-type: text/html');
header('Access-Control-Allow-Origin: *');

$NewURI = strstr($_SERVER['REQUEST_URI'], '?', true);
if ($NewURI !== false) {
    $_SERVER['REQUEST_URI'] = $NewURI;
}
