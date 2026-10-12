import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const frontendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDirectory = path.join(frontendDirectory, 'public', 'vendor', 'boldreports');
const assets = [
    ['node_modules/jquery/dist/jquery.min.js', 'jquery.min.js'],
    ['node_modules/jsrender/jsrender.min.js', 'jsrender.min.js'],
    [
        'node_modules/@boldreports/javascript-reporting-controls/node_modules/jquery-validation/dist/jquery.validate.min.js',
        'jquery.validate.min.js',
    ],
    [
        'node_modules/@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.common.min.js',
        'bold.reports.common.min.js',
    ],
    [
        'node_modules/@boldreports/javascript-reporting-controls/Scripts/v2.0/common/bold.reports.widgets.min.js',
        'bold.reports.widgets.min.js',
    ],
    [
        'node_modules/@boldreports/javascript-reporting-controls/Scripts/v2.0/bold.report-viewer.min.js',
        'bold.report-viewer.min.js',
    ],
    [
        'node_modules/@boldreports/react-reporting-components/Scripts/bold.reports.react.min.js',
        'bold.reports.react.min.js',
    ],
];

fs.mkdirSync(assetsDirectory, { recursive: true });

for (const [source, destination] of assets) {
    const sourcePath = path.join(frontendDirectory, source);
    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Required Bold Reports asset was not found: ${sourcePath}`);
    }

    fs.copyFileSync(sourcePath, path.join(assetsDirectory, destination));
}
