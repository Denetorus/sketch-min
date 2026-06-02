<?php

use sketch\SK;

//set_error_handler(function ($error_number, $message, $file, $line) {
//    throw new ErrorException($message, 0, $error_number, $file, $line);
//});

try {

    if (!isset($_SERVER["USE_SESSIONS"])){
        $_SERVER["USE_SESSIONS"]=true;
    }

    define('HOST', 'https://'.$_SERVER['HTTP_HOST']);

    include 'skCommon.php';

    if ($_SERVER["USE_SESSIONS"]) {
        session_start();
    }

    if($_SERVER['HTTP_ACCEPT'] == 'application/json') {

        if($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT') {
            $postData = json_decode(file_get_contents('php://input'), true);
            if($postData != null) {
                foreach ($postData as $key => $value) {
                    $_POST[$key] = $value;
                }
            }
        }
    }

    SK::run(CONFIG."/web.json");

}catch (Exception $e){
    $RR = new \sketch\rest\RequestResult();
    $RR->addError(4,
        "System Error",
        "Message: " . $e->getMessage()
        . "; File: " . $e->getFile()
        . ";Line: " . $e->getLine()
    );
    echo json_encode($RR);
}
