<?php


namespace database\DBMain\object;


use database\DBMain\DB;
use sketch\database\ObjectBase;

class users extends ObjectBase
{

    public $table = "users";
    private $StatusBlocked=-1;
    private $StatusNotActivate=0;
    private $StatusActivate=1;


    public function __construct($id=null)
    {
        $this->db = DB::getInstance();
        parent::__construct($id);
    }

    public function getRegistrationParams(){
        return [
            'login' => "",
            'password' => "",
            'password2' => "",
            'first_name' => "",
            'last_name' => "",
        ];
    }

    public function getUpdateInfoParams(){
        return [
            'first_name' => "",
            'last_name' => "",
        ];
    }

    public function registration($params)
    {
        $this->props['auth_key'] = ($params['auth_key'] === null)
                                        ? $this->db->createUUID()
                                        : $params['auth_key'];

        $this->props['login']=$params['login'];
        $this->props['password_hash']=password_hash($params['password'], PASSWORD_DEFAULT);
        $this->props['first_name']=$params['first_name'];
        $this->props['last_name']=$params['last_name'];
        $this->props['status']=$this->StatusNotActivate;
        $this->props['created_at']=time();
        $this->props['updated_at']=$this->props['created_at'];

        $this->save();
    }

    public function updateInfo($params)
    {

        $this->props['first_name']=$params['first_name'];
        $this->props['last_name']=$params['last_name'];
        $this->props['status']=$params['status'];

        $this->props['updated_at']=time();

        $this->update();

    }

    public function updateLogin($login)
    {

        $this->props['login']=$login;
        $this->props['updated_at']=time();

        $this->update();

    }

    public function updatePassword($password)
    {

        $this->props['password_hash']=password_hash($password, PASSWORD_DEFAULT);
        $this->props['updated_at']=time();

        $this->update();

    }

    public function loadByLogin($login)
    {
        $result = $this->db->getRecord($this->table, ["login"=>$login]);
        $this->props = ($result!==false) ? $result : null;
    }

    public function deleteByLogin($login)
    {
        $this->db->deleteRecord($this->table, ["login"=>$login]);
    }

    public function activateByLogin($login, $start, $finish)
    {
        $this->db->updateRecord($this->table, ["login"=>$login],
            [
                "status"=>$this->StatusActivate,
            ]);
    }

    public function deactivateByLogin($login)
    {
        $this->db->updateRecord($this->table, ["login"=>$login],
            ["status"=>$this->StatusNotActivate]);
    }

    public function blockByLogin($login)
    {
        $this->db->updateRecord($this->table, ["login"=>$login],
            ["status"=>$this->StatusBlocked]);
    }

    public function getListWithExtension($sorts=[], $filters=[])
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

        //var_dump($query_text);

        return $this->db->select($query_text, $query_params);

    }

}