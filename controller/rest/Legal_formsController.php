<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\legal_forms;

class Legal_formsController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new legal_forms($ref);
    }
}