'use client';

import type { ComponentType } from 'react';
import React from 'react';
import { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';
import jquery from 'jquery';
import '@boldreports/javascript-reporting-controls/Content/v2.0/tailwind-light/bold.report-viewer.min.css';

interface BoldReportViewerProps {
    id: string;
    reportServiceUrl: string;
    reportPath: string;
    parameters: { name: string; values: string[] }[];
    toolbarSettings: { showToolbar: boolean };
    ajaxBeforeLoad: (args: { headers: { Key: string; Value: string }[] }) => void;
    style: React.CSSProperties;
}

declare global {
    interface Window {
        React: typeof React;
        ReactDOM: typeof ReactDOM;
        createReactClass: typeof createReactClass;
        $: typeof jquery;
        jQuery: typeof jquery;
        BoldReportViewerComponent: ComponentType<BoldReportViewerProps>;
    }
}

const REPORT_SERVICE_URL = '/api/report/sales-by-category';
const REPORT_PATH = '/ReportFiles/NorthwindSalesByCategory.rdl';
const REPORT_SCRIPTS = [
    '/vendor/boldreports/jsrender.min.js',
    '/vendor/boldreports/jquery.validate.min.js',
    '/vendor/boldreports/bold.reports.common.min.js',
    '/vendor/boldreports/bold.reports.widgets.min.js',
    '/vendor/boldreports/bold.report-viewer.min.js',
    '/vendor/boldreports/bold.reports.react.min.js',
];

let boldReportsLoadPromise: Promise<void> | undefined;

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load Bold Reports script: ${src}`));
        document.head.appendChild(script);
    });
}

function loadBoldReports(): Promise<void> {
    if (!boldReportsLoadPromise) {
        window.React = React;
        window.ReactDOM = ReactDOM;
        window.createReactClass = createReactClass;
        window.$ = jquery;
        window.jQuery = jquery;

        boldReportsLoadPromise = REPORT_SCRIPTS.reduce(
            (chain, src) => chain.then(() => loadScript(src)),
            Promise.resolve(),
        ).catch((error: unknown) => {
            boldReportsLoadPromise = undefined;
            throw error;
        });
    }

    return boldReportsLoadPromise;
}

export default function ReportSalesByCategory() {
    const [startDate, setStartDate] = useState('1996-07-01');
    const [endDate, setEndDate] = useState('1998-05-31');
    const [applied, setApplied] = useState({ startDate: '1996-07-01', endDate: '1998-05-31' });
    const [Viewer, setViewer] = useState<ComponentType<BoldReportViewerProps> | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        loadBoldReports()
            .then(() => {
                if (!cancelled) setViewer(() => window.BoldReportViewerComponent);
            })
            .catch((error: unknown) => {
                if (!cancelled) {
                    setLoadError(error instanceof Error ? error.message : String(error));
                }
            });
        console.log(REPORT_PATH)
        return () => {
            cancelled = true;
        };
    }, []);

    const invalid = !startDate || !endDate || startDate > endDate;
    const parameters = [
        { name: 'StartDate', values: [applied.startDate] },
        { name: 'EndDate', values: [applied.endDate] },
    ];
    const addAuthorizationHeader = (args: { headers: { Key: string; Value: string }[] }) => {
        const token = localStorage.getItem('token');
        if (token) {
            args.headers.push({ Key: 'Authorization', Value: `Bearer ${token}` });
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <h2 style={{ marginBottom: 12 }}>Northwind - Sales by Category</h2>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <label>
                    Start Date{' '}
                    <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                </label>
                <label>
                    End Date{' '}
                    <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                </label>
                <button disabled={invalid} onClick={() => setApplied({ startDate, endDate })}>
                    View Report
                </button>
                {invalid && startDate && endDate && (
                    <span style={{ color: 'crimson' }}>Start date must be before end date</span>
                )}
            </div>

            {loadError ? (
                <p role="alert" style={{ color: 'crimson' }}>{loadError}</p>
            ) : !Viewer ? (
                <p>Loading report viewer...</p>
            ) : (
                <Viewer
                    key={`${applied.startDate}_${applied.endDate}`}
                    id="salesByCategoryViewer"
                    reportServiceUrl={REPORT_SERVICE_URL}
                    reportPath={REPORT_PATH}
                    parameters={parameters}
                    toolbarSettings={{ showToolbar: true }}
                    ajaxBeforeLoad={addAuthorizationHeader}
                    style={{ height: '700px', width: '100%' }}
                />
            )}
        </div>
    );
}
