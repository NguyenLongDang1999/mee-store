<?php

namespace App\Controllers\Backend;

use App\Controllers\BaseController;

class CategoryController extends BaseController
{
    /**
     * @return string
     */
    public function index(): string
    {
        return $this->latte->render('backend/category/index');
    }

    /**
     * @return string
     */
    public function create(): string
    {
        return $this->latte->render('backend/category/create_edit');
    }
}
