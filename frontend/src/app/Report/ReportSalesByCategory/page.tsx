"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import '@mescius/activereportsjs/styles/ar-js-ui.css';
import '@mescius/activereportsjs/styles/ar-js-viewer.css';

// Proxied to the backend by the rewrite in next.config.ts
const REPORT_SERVICE_URL = '/api/report/sales-by-category';
const REPORT_PATH = '/ReportFiles/NorthwindSalesByCategory.rdlx-json';

// Wrapper so the underlying viewer ref survives next/dynamic.
const Viewer = dynamic(
    async () => {
        const { Viewer: ARJSViewer } = await import('@mescius/activereportsjs-react');
        const Wrapped = ({ viewerRef }: { viewerRef: (instance: any) => void }) => (
            <ARJSViewer ref={viewerRef} />
        );
        return Wrapped;
    },
    {
        ssr: false,
        loading: () => <p>Loading report viewer...</p>
    }
);

type SalesRow = {
    CategoryName: string;
    ProductName: string;
    UnitsSold: number;
    TotalSales: number;
};

export default function SalesByCategoryPage() {
    const [startDate, setStartDate] = useState<string>('1996-07-01');
    const [endDate, setEndDate] = useState<string>('1998-05-31');
    const [applied, setApplied] = useState({ startDate: '1996-07-01', endDate: '1998-05-31' });
    const [loadError, setLoadError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [viewerReady, setViewerReady] = useState(false);
    const [rowCount, setRowCount] = useState<number | null>(null);

    const viewerInstance = useRef<any>(null);

    const invalid = useMemo(() => {
        if (!startDate || !endDate) return true;
        return new Date(startDate) > new Date(endDate);
    }, [startDate, endDate]);

    const setViewerRef = (instance: any) => {
        viewerInstance.current = instance;
        if (instance) setViewerReady(true);
    };

    useEffect(() => {
        if (!viewerReady) return;

        let cancelled = false;

        async function load() {
            setLoading(true);
            setLoadError(null);
            try {
                const query = new URLSearchParams({
                    StartDate: applied.startDate,
                    EndDate: applied.endDate
                });

                // Fetch the data and the report definition in parallel.
                const token = localStorage.getItem("token");

                const [dataResponse, reportResponse] = await Promise.all([
                    fetch(`${REPORT_SERVICE_URL}?${query.toString()}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    fetch(REPORT_PATH)
                ]);

                if (!dataResponse.ok) {
                    throw new Error(`Data request failed (${dataResponse.status})`);
                }
                if (!reportResponse.ok) {
                    throw new Error(`Report definition not found (${reportResponse.status})`);
                }

                const payload = await dataResponse.json();
                const rows: SalesRow[] = Array.isArray(payload) ? payload : payload.rows ?? [];
                const definition = await reportResponse.json();

                // Embed the fetched data directly into the report's JSON data source.
                const dataSource = definition.DataSources[0];
                dataSource.ConnectionProperties = {
                    DataProvider: 'JSON',
                    ConnectString: `jsondata=${JSON.stringify({ rows })}`
                };
                definition.DataSets[0].Query.CommandText = '$.rows[*]';
                console.log('Report rows:', rows.length, rows[0]);
                setRowCount(rows.length);

                if (cancelled) return;

                await viewerInstance.current.Viewer.open(definition, {
                    ReportParams: [
                        { Name: 'StartDate', Value: applied.startDate },
                        { Name: 'EndDate', Value: applied.endDate }
                    ]
                });
            } catch (error: any) {
                if (!cancelled) setLoadError(error?.message ?? 'Failed to load the report.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [applied, viewerReady]);

    return (
        <div style={{ padding: 16 }}>
            <h2 style={{ marginBottom: 12 }}>Northwind - Sales by Category</h2>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <label>
                    Start Date{' '}
                    <input
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                    />
                </label>
                <label>
                    End Date{' '}
                    <input
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                    />
                </label>
                <button disabled={invalid || loading} onClick={() => setApplied({ startDate, endDate })}>
                    {loading ? 'Loading...' : 'View Report'}
                </button>
                {invalid && startDate && endDate && (
                    <span style={{ color: 'crimson' }}>Start date must be before end date</span>
                )}
            </div>

            {loadError && (
                <p role="alert" style={{ color: 'crimson' }}>{loadError}</p>
            )}

            <div style={{ height: '700px', width: '100%' }}>
                <Viewer viewerRef={setViewerRef} />
            </div>
        </div>
    );
}
