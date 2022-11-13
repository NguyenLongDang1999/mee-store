<?php

namespace App\Libraries;

use Latte\Engine;

class Latte
{
    /**
     * @param string $name
     * @param array $data
     * @return string
     */
    public function render(string $name, array $data = []): string
    {
        $latte = new Engine();
//        $latte->setTempDirectory(WRITEPATH . '/cache/latte');
        $latte->setAutoRefresh(false);

        $template = VIEW_PATH . $name . '.latte';

        return $latte->renderToString($template, $data);
    }
}