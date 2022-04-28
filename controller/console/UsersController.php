<?php


namespace controller\console;


use model\Users;

class UsersController
{
    public function actionList()
    {
          $user = new users();
          echo "Users: \n";
          var_dump($user->getList());
          return "";
    }

    public function actionAdd($login="", $password="")
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
        $params = $user->getSignUpParams();
        $params['login'] = $login;
        $params['password'] = $password;
        $params['auth_key'] = null;
        $user->SignUp($params);
        echo "Add user: \n login: ".$login." \n password: ".$password." \n";
        return "";
    }

    public function actionDelete($login="")
    {
        if ($login==="") {
            echo "login is empty";
            return "";
        }

        $user = new users();
        $user->Delete($login);
        echo "user deleted: \n login: ".$login." \n";
        return "";
    }

}