<?php

namespace App\Models;

use App\Entities\Category as CategoryEntity;
use CodeIgniter\Model;

class Category extends Model
{
    protected $table = 'category';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = CategoryEntity::class;
    protected $useSoftDeletes = true;
    protected $protectFields = true;
    protected $allowedFields = [
        'name',
        'slug',
        'parent_id',
        'image_uri',
        'description',
        'status',
        'popular',
        'meta_title',
        'meta_keyword',
        'meta_description',
        'deleted_at'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    // Validation
    protected $validationRules = [
        'name' => 'required|min_length[2]|max_length[50]',
        'slug' => 'is_unique[category.slug,id,{id}]',
        'parent_id' => 'required',
        'description' => 'max_length[160]',
        'meta_title' => 'max_length[60]',
        'meta_keyword' => 'max_length[160]',
        'meta_description' => 'max_length[160]'
    ];
    protected $validationMessages = [];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;
    protected $beforeInsert = ['convertToSlug'];

    public function getCategoryList($parent_id = 0): array
    {
        return $this->select('id, name')->where('parent_id', $parent_id)->findAll();
    }

    public function getCategoryByID($id): object
    {
        return $this->select('id, name, parent_id, description, status, popular,  meta_title, meta_keyword, meta_description, image_uri')
            ->where('category.id', $id)
            ->first();
    }

    protected function convertToSlug(array $data): array
    {
        if (!isset($data['data']['name'])) {
            return $data;
        }

        $data['data']['slug'] = createSlug($data['data']['name']);
        return $data;
    }
}
