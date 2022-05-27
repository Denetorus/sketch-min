<?php


namespace database\DBMain\object;


use database\DBMain\DB;
use sketch\database\DBRecord\ObjectBase;
use sketch\database\UUID;

class users extends ObjectBase
{

    public $table = "users";
    private $statuses = [
        'blocked' => -1,
        'registration' => 0,
        'activated' => 1
    ];

    public function setDB(): void
    {
        $this->db = DB::getInstance();
    }

    public function generatePasswordHash(string $password):string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }


    public function getRegistrationParams():array
    {
        return [
            'login' => "",
            'password' => "",
            'password2' => "",
            'first_name' => "",
            'last_name' => "",
        ];
    }

    public function getUpdateInfoParams():array
    {
        return [
            'first_name' => "",
            'last_name' => "",
        ];
    }

    public function registration($params): void
    {
        $this->props['auth_key'] = $params['auth_key'] ?? UUID::createUUID();

        $this->props['login']=$params['login'];
        $this->props['password_hash']=$this->generatePasswordHash($params['password']);
        $this->props['first_name']=$params['first_name'] ?? '';
        $this->props['last_name']=$params['last_name'] ?? '';
        $this->props['status']=$this->statuses['registration'];
        $this->props['created_at']=time();
        $this->props['updated_at']=$this->props['created_at'];

        $this->save();
    }


    public function updateInfo($params):void
    {

        if ($params['first_name'])
            $this->props['first_name']=$params['first_name'];
        if ($params['last_name'])
            $this->props['last_name']=$params['last_name'];
        if ($params['status'])
            $this->props['status']=$params['status'];
        if ($params['rights'])
            $this->props['rights']=$params['rights'];

        $this->props['updated_at']=time();

        $this->update();

    }

    public function updateLogin($login):void
    {

        $this->props['login']=$login;
        $this->props['updated_at']=time();

        $this->update();

    }

    public function updatePassword($password):void
    {

        $this->props['password_hash']=$this->generatePasswordHash($password);
        $this->props['updated_at']=time();

        $this->update();

    }


    public function loadByLogin($login):void
    {
        $this->props = $this->db->getRecord($this->table, ["login"=>$login]);
    }

    public function deleteByLogin($login):void
    {
        $this->db->deleteRecord($this->table, ["login"=>$login]);
    }


    public function activateByLogin($login)
    {
        $this->db->updateRecord($this->table, ["login"=>$login],
            [
                "status"=>$this->statuses['activated'],
            ]);
    }

    public function deactivateByLogin($login)
    {
        $this->db->updateRecord($this->table, ["login"=>$login],
            ["status"=>$this->statuses['registration']]);
    }

    public function blockByLogin($login)
    {
        $this->db->updateRecord($this->table, ["login"=>$login],
            ["status"=>$this->statuses['blocked']]);
    }


    public function getListWithExtension($sorts=[], $filters=[]): array
    {
        $query_params = [];
        $query_text =
            "SELECT 
                users.*,
            FROM 
                users as users
            ";

        $filter_text = "";
        $is_first = true;
        $params_number = 0;
        foreach ($filters as $filter){

            if ($is_first){
                $is_first = false;
            }else{
                $filter_text .= ",";
            }

            $params_number += 1;
            $filter_text .= "users.".$filter['field']." ".$filter['type'].' :param'.$params_number;
            if ($filter['type']==='like'){
                $query_params['param'.$params_number] = '%'.$filter['value'].'%';
            }else{
                $query_params['param'.$params_number] = $filter['value'];
            }

        }
        if (!$is_first){
            $query_text .= " WHERE " . $filter_text;
        }

        $sort_text = "";
        $is_first = true;
        foreach ($sorts as $sort){
            if ($is_first) {
                $sort_text = $sort;
                $is_first = false;
            }else{
                $sort_text .= "," . $sort;
            };
        }
        if (!$is_first){
            $query_text .= " ORDER BY " . $sort_text;
        }

        return $this->db->select($query_text, $query_params);

    }


}