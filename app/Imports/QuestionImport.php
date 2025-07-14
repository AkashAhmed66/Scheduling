<?php

namespace App\Imports;

use App\Models\UploadModel; // Assuming UploadModel is your model to store the data
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class QuestionImport implements ToModel, WithHeadingRow
{
    /**
     * Map each row to the corresponding model.
     *
     * @param array $row
     * @return \App\Models\UploadModel
     */
    public function model(array $row)
    {
        return new UploadModel([
            'question'      => $row['question'],
            'ncref'         => $row['ncref'],
            'category'      => $row['category'],
            'subcategory'   => $row['subcategory'],
            'mark'          => $row['mark'],
            'color'         => $row['color'],
            'answer'        => $row['answer'],
            'findings'      => $row['findings'],
            'risk_rating'        => $row['risk_rating'],
            'legal_ref'     => $row['legal_ref'],
            'recommendation'=> $row['recommendation'],
            'type'          => $row['type'],
        ]);
    }
}


