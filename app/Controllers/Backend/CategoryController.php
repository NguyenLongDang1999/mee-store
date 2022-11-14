<?php

namespace App\Controllers\Backend;

use App\Controllers\BaseController;
use App\Entities\Category as CategoryEntity;
use App\Models\Category;
use CodeIgniter\HTTP\Files\UploadedFile;
use CodeIgniter\HTTP\RedirectResponse;
use ReflectionException;

class CategoryController extends BaseController
{
    protected Category $category;

    public function __construct()
    {
        $this->category = new Category();
    }

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
        $data['getCategoryList'] = $this->getCategoryList();
        $data['route'] = route_to('admin.category.store');
        return $this->latte->render('backend/category/create_edit', $data);
    }

    /**
     * @param int $id
     * @return string
     */
    public function edit(int $id): string
    {
        $data['row'] = $this->category->getCategoryByID($id);
        $data['getCategoryList'] = $this->getCategoryList();
        $data['route'] = route_to('admin.category.update', $id);
        return $this->latte->render('backend/category/create_edit', $data);
    }

    /**
     * @throws ReflectionException
     */
    public function store(): RedirectResponse
    {
        $input = $this->request->getPost();
        $file = $this->request->getFile('image');

        if ($file) {
            if ($file->isValid() && !$file->hasMoved()) {
                $input['imageURL'] = $this->serviceUploadImage($file, $input['slug']);
            }
        }

        $category = new CategoryEntity($input);

        if (!$this->category->save($category)) {
            return redirectMessage('admin.category.create', 'error', MESSAGE_ERROR);
        }

        return redirectMessage('admin.category.index', 'success', "Danh mục <strong class='text-capitalize'>" . esc($input['name']) . "</strong> đã được thêm.");
    }

    /**
     * @throws ReflectionException
     */
    public function update(int $id): RedirectResponse
    {
        $input = $this->request->getPost();
        $file = $this->request->getFile('image');

        if ($file) {
            if ($file->isValid() && !$file->hasMoved()) {
                $input['image_uri'] = $this->serviceUploadImage($id, $file);
                deleteImage($input['imageRoot']);
            }
        }

        if (!$this->category->update($id, $input)) {
            return redirectMessage('admin.category.index', 'error', MESSAGE_ERROR);
        }

        return redirectMessage('admin.category.index', 'success', "Danh mục <strong class='text-capitalize'>" . esc($input['name']) . "</strong> đã được cập nhật.");
    }

    private function serviceUploadImage(UploadedFile $file, mixed $slug): string
    {
        $file->move(PATH_CATEGORY_IMAGE, $slug);

        $savePath = PATH_CATEGORY_IMAGE . getExtensionImage($slug);
        $data = [
            'path' => PATH_CATEGORY_IMAGE,
            'fileName' => $slug,
            'savePath' => $savePath,
            'resize' => [
                'resizeX' => '200',
                'resizeY' => '200'
            ]
        ];

        imageManipulation($data);
        return $savePath;
    }

    private function getCategoryList(): array
    {
        $getCategoryList = $this->category->getCategoryList();
        $option = [
            '' => '[-- Vui Lòng Chọn --]',
            '0' => 'Danh mục gốc'
        ];

        foreach ($getCategoryList as $item) {
            $option[$item->id] = esc($item->name);
        }

        return $option;
    }
}
