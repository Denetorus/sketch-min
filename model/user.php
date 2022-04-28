<?php

namespace model;


use sketch\rest\RequestResult;
use database\DBMain\object\users;

class user
{

    /** @var users() */
    private $user = null;
    /** @var RequestResult */
    private $check_result = null;

    public function __construct($id=null)
    {
        $this->Connect($id);
    }

    private function Connect($id=null){
        if ($this->user === null){
            $this->user = new users($id);
        }
    }

    public function LoadByLogin($login){
        $this->user->loadByLogin($login);
    }

    public function getUserProps(){
        return $this->user->props;
    }

    public function getSignUpParams(){
        return $this->user->getRegistrationParams();
    }

    public function getUpdateInfoParams(){
        return $this->user->getUpdateInfoParams();
    }

    public function getList(){
        return $this->user->getList();
    }

    public function getListWithExtension($sorts=[], $filters=[]){

        $list = $this->user->getListWithExtension($sorts, $filters);

        $result = [];
        foreach ($list as $row){
            $result[] = [
                'id' => $row['id'],
                'login' => $row['login'],
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'status' => $row['status'],
                'created_at' => $row['created_at'],
            ];
        }

        return $result;

    }


    public function Delete($login){
        $this->user->deleteByLogin($login);
    }

    public function Activate($login, $start, $finish){
        $this->user->activateByLogin($login, $start, $finish);
    }

    public function Deactivate($login){
        $this->user->deactivateByLogin($login);
    }

    public function Block($login){
        $this->user->blockByLogin($login);
    }

    public function SignUp($params){
        $this->user->registration($params);
        return true;
    }

    public function UpdateInfo($params){
        $this->user->updateInfo($params);
    }

    public function UpdateLogin($login){
        $this->user->updateLogin($login);
    }

    public function UpdatePassword($password){
        $this->user->updatePassword($password);

    }


    public function CheckSignUpParams($params){

        $this->check_result = new RequestResult();

        $NeedParams = $this->user->getRegistrationParams();
        unset($NeedParams['auth_key']);

        foreach ($NeedParams as $key => $val){
            if (!isset($params[$key])) {
                $this->check_result->addError(
                    1,
                    $key,
                    $key.' is empty'
                );
            }
        }

        if (!$this->check_result->hasErrors){

            if ($params['login']===""){
                $this->check_result->addError(
                    2,
                    'reg_login',
                    'login is empty'
                );
            }

            if (!$this->LoginIsCorrect($params['login'])){
                $this->check_result->addError(
                    2,
                    'reg_login',
                    'enter business email for login'
                );
            }

            if ($params['password']===""){
                $this->check_result->addError(
                    2,
                    'reg_password',
                    'password is empty'
                );
            }

            if ($params['password']!==$params['password2']){
                $this->check_result->addError(
                    2,
                    'reg_password2',
                    'passwords do not match'
                );
            }


            if ($params['first_name']===""){
                $this->check_result->addError(
                    2,
                    'first_name',
                    'first name is empty'
                );
            }

            if ($params['last_name']===""){
                $this->check_result->addError(
                    2,
                    'last_name',
                    'last name is empty'
                );
            }

        }

        return $this->check_result;
    }

    public function CheckUpdateInfoParams($params){

        $this->check_result = new RequestResult();

        $NeedParams = $this->user->getUpdateInfoParams();

        foreach ($NeedParams as $key => $val){
            if (!isset($params[$key])) {
                $this->check_result->addError(
                    1,
                    $key,
                    $key.' is empty');
            }
        }

        if (!$this->check_result->hasErrors){

            if ($params['first_name']===""){
                $this->check_result->addError(
                    2,
                    'first_name',
                    'first name is empty'
                );
            }

            if ($params['last_name']===""){
                $this->check_result->addError(
                    2,
                    'last_name',
                    'last name is empty'
                );
            }


        }

        return $this->check_result;
    }

    public function CheckUpdateLoginParams($params){

        $this->check_result = new RequestResult();

        if (!isset($params['login'])) {
            $this->check_result->addError(1, 'reg_login', 'login is empty');
        }

        if (!$this->LoginIsCorrect($params['login'])){
            $this->check_result->addError(
                2,
                'reg_login',
                'enter business email for login'
            );
        }

        if ($this->LoginIsPresent($params['login'])){
            $this->check_result->addError(
                2,
                'reg_login',
                'login already exists'
            );
        }


        return $this->check_result;
    }

    public function CheckUpdatePasswordParams($params){

        $this->check_result = new RequestResult();

        if (!isset($params['password_old']) || $params['password_old']==="") {
            $this->check_result->addError(
                1,
                'password_old',
                'current password is empty'
            );
        }

        if (!isset($params['password']) || $params['password']==="") {
            $this->check_result->addError(
                1,
                'reg_password',
                'password is empty'
            );
        }

        if (!isset($params['password2']) || $params['password2']==="") {
            $this->check_result->addError(
                1,
                'reg_password2',
                'second password is empty'
            );
        }


        if (!$this->check_result->hasErrors) {

            if ($params['password']!==$params['password2']){
                $this->check_result->addError(
                    2,
                    'reg_password2',
                    'passwords do not match'
                );
            }

            if (!password_verify($params['password_old'], $this->user->props['password_hash'])) {
                $this->check_result->addError(
                    2,
                    'password_old',
                    'current password does not match'
                );
            }

        }

        return $this->check_result;

    }

    public function CheckUpdatePasswordByTokenParams($params){

        $this->check_result = new RequestResult();

        if (!isset($params['login'])) {
            $this->check_result->addError(
                1,
                'login',
                'login is empty'
            );
        }

        if (!isset($params['password'])) {
            $this->check_result->addError(
                1,
                'reg_password',
                'password is empty'
            );
        }

        if (!isset($params['password2'])) {
            $this->check_result->addError(
                1,
                'reg_password2',
                'second password is empty'
            );
        }

        if (!isset($params['reset_token'])) {
            $this->check_result->addError(
                1,
                'reset_token',
                'reset token is empty'
            );
        }

        if (!$this->check_result->hasErrors) {

            if ($params['password']!==$params['password2']){
                $this->check_result->addError(
                    2,
                    'reg_password2',
                    'passwords do not match'
                );
            }

        }

        $this->CheckToken($params);

        return $this->check_result;
    }

    public function CheckResetPasswordParams($params){

        $this->check_result = new RequestResult();

        if (!isset($params['login'])) {
            $this->check_result->addError(1, 'login', 'login is empty');
        }

        if (!isset($params['reset_token'])) {
            $this->check_result->addError(
                1,
                'reset_token',
                'reset token is empty'
            );
        }

        $this->CheckToken($params);

        return $this->check_result;
    }

    private function CheckToken($params){

        if (!$this->check_result->hasErrors) {

            if (!$this->FoundUser($params['login'])) {
                $this->check_result->addError(
                    2,
                    'login',
                    'login is not registered'
                );
            }

        }

        if (!$this->check_result->hasErrors) {

            if ($this->user->props['password_reset_token']!==$params['reset_token']){
                $this->check_result->addError(
                    2,
                    'reset_token',
                    'reset token does not match'
                );
            }

        }
    }

    public function LoginIsCorrect($login){

        return true;
    }


    public function FoundUser($login){
        $this->user->loadByLogin($login);
        if ($this->user->props === null){
            $this->user->ref = 0;
            return false;
        }
        $this->user->ref = $this->user->props["id"];
        return true;
    }

    public function LoginIsPresent($login){
        $user = new \database\DBMain\object\users();
        $user->loadByLogin($login);
        return $user->props !== null;
    }

    public function FillSignUpParamsByPost(){

        $params = $this->getSignUpParams();

        if (isset($_POST['reg_login'])) $params['login'] = $_POST['reg_login'];
        if (isset($_POST['reg_password'])) $params['password'] = $_POST['reg_password'];
        if (isset($_POST['reg_password2'])) $params['password2'] = $_POST['reg_password2'];
        if (isset($_POST['first_name'])) $params['first_name'] = $_POST['first_name'];
        if (isset($_POST['last_name'])) $params['last_name'] = $_POST['last_name'];

        return $params;
    }

    public function FillUpdateInfoParamsByPost(){

        $params = $this->getUpdateInfoParams();

        if (isset($_POST['first_name'])) $params['first_name'] = $_POST['first_name'];
        if (isset($_POST['last_name'])) $params['last_name'] = $_POST['last_name'];
        if (isset($_POST['status'])) $params['status'] = $_POST['status'];

        return $params;

    }

    public function FillUpdatePasswordParamsByPost(){

        $params = [];

        $params['password_old'] = isset($_POST['password_old']) ? $_POST['password_old'] : "";
        $params['password'] = isset($_POST['reg_password']) ? $_POST['reg_password'] : "";
        $params['password2'] = isset($_POST['reg_password2']) ? $_POST['reg_password2'] : "";

        return $params;
    }

    public function FillUpdatePasswordByTokenParamsByPost(){

        $params = [];

        $params['login'] = isset($_POST['login']) ? $_POST['login'] : "";
        $params['password'] = isset($_POST['reg_password']) ? $_POST['reg_password'] : "";
        $params['password2'] = isset($_POST['reg_password2']) ? $_POST['reg_password2'] : "";
        $params['reset_token'] = isset($_POST['reset_token']) ? $_POST['reset_token'] : "";

        return $params;
    }
}