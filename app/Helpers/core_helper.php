<?php

use CodeIgniter\HTTP\RedirectResponse;
use Config\Services;

function optionStatus(): array
{
    return [
        '' => '[-- Chọn ' . lang('trans.status.name') . ' --]',
        STATUS_ACTIVE => lang('trans.status.active'),
        STATUS_INACTIVE => lang('trans.status.inactive')
    ];
}

function optionPopular(): array
{
    return [
        '' => '[-- Chọn ' . lang('trans.popular.name') . ' --]',
        POPULAR_ACTIVE => lang('trans.popular.active'),
        POPULAR_INACTIVE => lang('trans.popular.inactive')
    ];
}

function getMenuActive($patterns): bool
{
    return url_is($patterns);
}

function menuListCMS(): object
{
    return json_decode(json_encode([
        'manage-dashboard' => [
            'content' => [
                [
                    'title' => lang('trans.dashboard'),
                    'icon' => 'home',
                    'href' => route_to('admin.dashboard.index')
                ]
            ]
        ],
        'manage-product' => [
            'title' => 'Sản phẩm',
            'content' => [
                [
                    'title' => lang('trans.category.manager'),
                    'icon' => 'grid',
                    'href' => route_to('admin.category.index')
                ]
            ]
        ]
    ]));
}

function redirectMessage($route, $key, $message): RedirectResponse
{
    return redirect()->route($route)->with($key, $message);
}

function getExtensionImage($fileName): string
{
    $parts = explode('.', $fileName);
    $parts[count($parts) - 1] = 'jpg';
    return implode('.', $parts);
}

function deleteImage($path): void
{
    if (file_exists($path)) {
        unlink($path);
    }
}

function imageManipulation($data): bool
{
    $image = Services::image();
    $withFile = $data['path'] . $data['fileName'];

    if (!file_exists($data['path'])) {
        mkdir($data['path'], 0755);
    }

    $image->withFile($withFile);
    $image->resize($data['resize']['resizeX'], $data['resize']['resizeY'], true);
    $image->convert(IMAGETYPE_JPEG);
    deleteImage($withFile);

    return $image->save($data['savePath']);
}

function createSlug($str): array|string|null
{
    $str = trim(mb_strtolower($str));
    $str = preg_replace('/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/', 'a', $str);
    $str = preg_replace('/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/', 'e', $str);
    $str = preg_replace('/(ì|í|ị|ỉ|ĩ)/', 'i', $str);
    $str = preg_replace('/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/', 'o', $str);
    $str = preg_replace('/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/', 'u', $str);
    $str = preg_replace('/(ỳ|ý|ỵ|ỷ|ỹ)/', 'y', $str);
    $str = preg_replace('/(đ)/', 'd', $str);
    $str = preg_replace('/[^a-z0-9-\s]/', '', $str);
    return preg_replace('/(\s+)/', '-', $str);
}