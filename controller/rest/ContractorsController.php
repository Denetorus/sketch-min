<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\contractors;

class ContractorsController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new contractors($ref);
    }
}