<?php

namespace App\Imports;

use App\Models\UploadModel; // Assuming UploadModel is your model to store the data
use Illuminate\Support\Facades\Log;
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
        Log::channel('custom_daily')->info('Row data received for import:', $row);
        return new UploadModel([
            'question'      => $row['question'],
            'instruction'   => $row['instruction'] ?? null,
            'ncref'         => $row['ncref'],
            'category'      => $row['category'],
            'subcategory'   => $row['subcategory'] ?? $row['category'],
            'mark'          => $row['mark'],
            'color'         => $row['color'],
            'answer'        => $row['answer'],
            'findings'      => $row['findings'],
            'risk_rating'   => $row['risk_rating'],
            'legal_ref'     => $row['legal_ref'],
            'recommendation'=> $row['recommendation'],
            'type'          => $row['type'],
        ]);
    }
}


