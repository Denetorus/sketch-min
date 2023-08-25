<?php

namespace controller\web;

use sketch\controller\ControllerBase;
use sketch\SK;

class HomeController extends ControllerBase
{

    public function actionIndex(){
       return $this->render('catalogs.php', ['SK_props' => SK::getProps()]);
    }


}