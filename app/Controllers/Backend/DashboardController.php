<?php

namespace App\Controllers\Backend;

use App\Controllers\BaseController;

class DashboardController extends BaseController
{
    /**
     * @return string
     */
    public function index(): string
    {
        return $this->latte->render('backend/dashboard/index');
    }
}
