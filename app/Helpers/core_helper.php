<?php

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