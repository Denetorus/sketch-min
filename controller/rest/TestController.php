<?php

namespace controller\rest;

use sketch\controller\ControllerRest;
use sketch\rest\RequestResult;


class TestController extends ControllerRest
{

    public function allowMethods():string
    {
        return "GET";
    }

    public function actionGet()
    {
        $result = new RequestResult();
        $result->insertData([ 'message' => 'rest test is execute']);
        return $result->toJson();
    }
}
