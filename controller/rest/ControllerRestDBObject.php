<?php

namespace controller\rest;

use database\DBMain\DBObject;
use sketch\controller\ControllerRest;
use sketch\rest\RequestResult;

abstract class ControllerRestSK extends ControllerRest
{

    public function allowMethods(): string
    {
        return "GET, POST, PUT, DELETE";
    }

    abstract public function getNewObject($ref=null, $notCreated=false): DBObject;

    public function getPKeyFromGetParams(){
        if(isset($_GET['ref'])){
            return $_GET['ref'];
        }
        return null;
    }

    public function getRefAttrName(): string
    {
        return 'uid';
    }

    public function getPresentationAttrName(): string
    {
        return 'description';
    }

    public function getList($gottenSorts=[], $gottenFilters=[]): array
    {
        $obj = $this->getNewObject(null,true);
        return $obj->getListWithExtension($gottenSorts, $gottenFilters);
    }

    public function getListForSelect($gottenSorts=[], $gottenFilters=[]):array
    {
        $result = [];
        $obj = $this->getNewObject("",true);
        $list = $obj->getListWithExtension($gottenSorts, $gottenFilters);
        $refAttrName = $this->getRefAttrName();
        $presentationAttrName = $this->getPresentationAttrName();
        foreach ($list as $value){
            $result[] = [
                'ref' => $value[$refAttrName],
                'presentation' => $value[$presentationAttrName]
            ];
        }
        return $result;

    }


    public function actionGet()
    {
        $PKey = $this->getPKeyFromGetParams();

        $result = new RequestResult();

        if($PKey!==null){
            $obj = $this->getNewObject($PKey);
            $result->insertData($obj->props);
        }else if(isset($_GET['for_select'])){
            $result->insertData($this->getListForSelect());
        }else{
            $result->insertData($this->getList());
        }

        return $result->toJson();

    }

    public function actionPost()
    {

        $result = new RequestResult();

        $entityBody = json_decode(file_get_contents('php://input'));

        $gottenSorts = [];
        if (isset($_POST['sorts'])){
            $gottenSorts = json_decode($_POST['sorts']);
        }
        if (isset($entityBody->sorts)){
            $gottenSorts = json_decode($entityBody->sorts);
        }

        $gottenFilters = [];
        if (isset($_POST['filters'])){
            $gottenFilters = json_decode($_POST['filters']);
        }
        if (isset($entityBody->filters)){
            $gottenFilters = json_decode($entityBody->filters);
        }

        if(isset($_GET['for_select'])){
            $result->insertData($this->getListForSelect($gottenSorts, $gottenFilters));
        }else{
            $result->insertData($this->getList($gottenSorts, $gottenFilters));
        }


        return $result->toJson();

    }

    public function actionDelete(){

        $result = new RequestResult();

        $ref = $this->getPKeyFromGetParams();
        if($ref!==null){
            $obj = $this->getNewObject($ref);
            $obj->delete();
            $result->insertData(['result' => 1]);
        }else{
            $result->insertData(['result' => 0, 'message' => 'parameter uid is absent']);
        }

        return $result->toJson();

    }

    public function actionPut()
    {

        $result = new RequestResult();

        $postData = file_get_contents('php://input');
        $data = json_decode($postData, true);

        $ref = $this->getPKeyFromGetParams();
        if($ref!==null and $ref!==""){

            $obj = $this->getNewObject($ref);
            $this->fillObjByProps($obj->props, $data);
            $obj->update();
            $result->insertData(['result' => 1, 'ref' => $ref]);

        }else{

            unset($data['uid']);
            $obj = $this->getNewObject();
            $this->fillObjByProps($obj->props, $data);
            $answer = $obj->save();
            $result->insertData(['result' => 1, 'ref' => $answer]);

        }

        return $result->toJson();

    }

    public function fillObjByProps(&$props, $data){
        foreach($data as $key => $value) {
            $props[$key] = $value;
        }
    }
}
