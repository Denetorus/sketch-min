<?php


namespace database\DBMain\object;


use database\DBMain\DB;
use sketch\database\ObjectBase;

class users extends ObjectBase
{

    public $table = "users";
    private $StatusNotActivate=0;
    private $StatusActivate=1;

    public function __construct($id=null)
    {
        $this->db = DB::getInstance();
        parent::__construct($id);
    }

    public function registration($login, $password, $auth_key=null, $first_name="", $last_name="")
    {
        $this->props['auth_key'] = ($auth_key === null)
            ? $this->db->createUUID()
            : $auth_key;

        $this->props['login']=$login;
        $this->props['password_hash']=password_hash($password, PASSWORD_DEFAULT);
        $this->props['first_name']=$first_name;
        $this->props['last_name']=$last_name;
        $this->props['status']=$this->StatusNotActivate;
        $this->props['created_at']=time();
        $this->props['updated_at']=$this->props['created_at'];

        $this->save();
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

    public function activateByLogin($login)
    {
        $this->db->updateRecord($this->table, ["login"=>$login], ["status"=>$this->StatusActivate]);
    }

    public function deactivateByLogin($login)
    {
        $this->db->updateRecord($this->table, ["login"=>$login], ["status"=>$this->StatusNotActivate]);
    }


}