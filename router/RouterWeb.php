<?php

namespace router;

use sketch\router\RouterBase;

class RouterWeb extends RouterBase
{

    public function routesAvailableWithoutSignIn(){
        return [

            '' => [
                'path' => 'home/index',
                'status' => -1
            ],

        ];
    }

}
