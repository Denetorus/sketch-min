<?php

namespace controller\rest;

use database\DBMain\DBObject;
use database\DBMain\object\contractor_requests;

class Contractor_requestsController extends ControllerRestDBObject
{

    public function getNewObject($ref=null, $notCreated=false): DBObject
    {
        return new contractor_requests($ref);
    }
}