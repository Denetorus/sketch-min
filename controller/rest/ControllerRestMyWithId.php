<?php

namespace controller\rest;

use database\DBMain\ObjectMyWithId;
use sketch\controller\ControllerRest;

class ControllerRestMyWithId extends ControllerRest
{

    public function allowMethods(): string
    {
        return "GET, POST, PUT, DELETE";
    }

    public function getNewObject($id=-1, $notCreated=false)
    {
        return new ObjectMyWithId($id, $notCreated);
    }

    public function getIdFromGet(){
        if(isset($_GET['uid'])){
            return $_GET['uid'];
        }
        return null;
    }

    public function getList(): array
    {
        $obj = $this->getNewObject(-1,true);
        return $obj->getListWithExtension([], []);
    }


    public function actionGet()
    {
        $id = $this->getIdFromGet();

        if($id!==null){
            $obj = $this->getNewObject($id);
            return $obj->props;
        }

        return $this->getList();

    }

    public function actionPost()
    {
        $obj = $this->getNewObject();

        $gottenSorts = [];
        if (isset($_POST['sorts'])){
            $gottenSorts = json_decode($_POST['sorts']);
        }

        $gottenFilters = [];
        if (isset($_POST['filters'])){
            $gottenFilters = json_decode($_POST['filters']);
        }

        return $obj->getListWithExtension($gottenSorts, $gottenFilters);

    }

    public function actionDelete(){

        $id = $this->getIdFromGet();
        if($id!==null){
            $obj = $this->getNewObject($id);
            $obj->delete();
        }

    }

    public function actionPut()
    {

        $postData = file_get_contents('php://input');
        $data = json_decode($postData, true);

        $id = $this->getIdFromGet();
        if($id!==null){

            $obj = $this->getNewObject($id);
            $obj->props = $data;
            $obj->update();

        }else{

            $obj = $this->getNewObject();
            $obj->props = $data;
            $obj->save();

        }

    }
}
