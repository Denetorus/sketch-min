<?php

namespace database\DBMain;

use sketch\database\DBRecord\DBRecordFull;

class DBObject extends DBRecordFull
{

    public $key_name = 'uid';

    public function setDB(): void
    {
        $this->db = DB::getInstance();
    }



    public function getFieldByName($name):array
    {
        $fields = $this->getFields();
        foreach ($fields as $field){
            if ($field['name'] === $name){
                return $field;
            }
        }
        return ["name"=>$name];
    }

    /**
     * @param $filters
     * @return array{ text: string,  params: array}
     */
    public function getFiltersParameters($filters): array
    {
        $query_params = [];
        $filter_text = "";
        $is_first = true;
        $params_number = 0;
        foreach ($filters as $filter) {

            if ($is_first) {
                $is_first = false;
            } else {
                $filter_text .= ",";
            }

            $params_number += 1;

            $field_full =  $filter['field'];
            $dotPosition = strpos($filter['field'], '.');
            if ($dotPosition===false){
                $field = $this->getFieldByName($filter['field'] );
                $cn = $field['column_name'] ?? $field['name'];
                $tn = $field['table_name'] ?? 'list';
                $field_full = $tn . "." . $cn;
            }

            $filter_text .= $field_full . " " . $filter['type'] . ' :param' . $params_number;
            if ($filter['type'] === 'like') {
                $query_params['param' . $params_number] = '%' . $filter['value'] . '%';
            } else if ($filter['type'] === 'ilike'){
                $query_params['param' . $params_number] = '%' . $filter['value'] . '%';
            } else {
                $query_params['param' . $params_number] = $filter['value'];
            }

        }

        return [
            'text' => $filter_text,
            'params' => $query_params
        ];
    }


}