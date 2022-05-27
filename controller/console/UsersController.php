<?php


namespace controller\console;


use database\DBMain\object\users;

class UsersController
{
    public function actionList():string
    {
          $user = new users();
          echo "Users: \n";
          var_dump($user->getList());
          return "";
    }

    public function actionAdd($login="", $password=""):string
    {
        if ($login==="") {
            echo "login is empty";
            return "";
        }
        if ($password==="") {
            echo "password is empty";
            return "";
        }

        $user = new users();
        $params = $user->getRegistrationParams();
        $params['login'] = $login;
        $params['password'] = $password;
        $params['auth_key'] = null;
        $user->registration($params);
        echo "Add user: \n login: ".$login." \n password: ".$password." \n";
        return "";
    }

    public function actionDelete($login=""):string
    {
        if ($login==="") {
            echo "login is empty";
            return "";
        }

        $user = new users();
        $user->deleteByLogin($login);
        echo "user deleted: \n login: ".$login." \n";
        return "";
    }

}