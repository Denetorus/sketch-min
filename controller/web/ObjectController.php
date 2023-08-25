<?php

namespace controller\web;

use sketch\controller\ControllerBase;

class ObjectController extends ControllerBase
{

    public function actionIndex(){
        return $this->render(
            'catalogs.php',
            ['page_name' => 'city_types']
        );
    }

    public function actionForm_choice($page_name=null){

        if ($page_name===null){
            return "test";
        }

        return $this->render(
            'catalogs.php',
            ['page_name' => $page_name]
        );

    }

}