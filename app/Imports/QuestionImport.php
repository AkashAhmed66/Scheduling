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
            'question'      => $row['question'],          // Column 'Question' from the Excel file maps to 'question' in the model
            'answer'        => $row['answer'],            // Column 'Answer' from the Excel file maps to 'answer' in the model
            'findings'      => $row['findings'],          // Column 'Findings' from the Excel file maps to 'findings' in the model
            'risk_rating'   => $row['risk_rating'],       // Column 'Risk Rating' from the Excel file maps to 'risk_rating' in the model
            'legal_ref'     => $row['legal_ref'],         // Column 'Legal Ref' from the Excel file maps to 'legal_ref' in the model
            'recommendation'=> $row['recommendation'],    // Column 'Recommendation' from the Excel file maps to 'recommendation' in the model
            'type'=> $row['type'],                        // Column 'Type' from the Excel file maps to 'type' in the model
        ]);
    }
}


