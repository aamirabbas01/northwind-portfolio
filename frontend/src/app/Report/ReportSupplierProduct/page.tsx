"use client";

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import '@mescius/activereportsjs/styles/ar-js-ui.css';
import '@mescius/activereportsjs/styles/ar-js-viewer.css';

// Proxied to the backend by the rewrite in next.config.ts
const REPORT_SERVICE_URL = '/api/report/supplier-product';
const REPORT_PATH = '/ReportFiles/SupplierProductReport.rdlx-json';

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

type SupplierProductRow = {
    CompanyName: string;
    ProductName: string;
    UnitPrice: number;
    UnitsInStock: number;
};

export default function SupplierProductReportPage() {
    const [loadError, setLoadError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [viewerReady, setViewerReady] = useState(false);
    const [rowCount, setRowCount] = useState<number | null>(null);

    const viewerInstance = useRef<any>(null);

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
                const token = localStorage.getItem("token");

                // Fetch the data and the report definition in parallel.
                const [dataResponse, reportResponse] = await Promise.all([
                    fetch(REPORT_SERVICE_URL, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    fetch(REPORT_PATH)
                ]);

                if (dataResponse.status === 401) {
                    throw new Error('Your session has expired. Please log in again.');
                }
                if (!dataResponse.ok) {
                    throw new Error(`Data request failed (${dataResponse.status})`);
                }
                if (!reportResponse.ok) {
                    throw new Error(`Report definition not found (${reportResponse.status})`);
                }

                const payload = await dataResponse.json();
                const rows: SupplierProductRow[] = Array.isArray(payload) ? payload : payload.rows ?? [];
                const definition = await reportResponse.json();

                // Embed the fetched data directly into the report's JSON data source.
                definition.DataSources[0].ConnectionProperties = {
                    DataProvider: 'JSON',
                    ConnectString: `jsondata=${JSON.stringify({ rows })}`
                };
                definition.DataSets[0].Query.CommandText = '$.rows[*]';

                if (cancelled) return;
                setRowCount(rows.length);

                // This is the step that actually shows the report.
                await viewerInstance.current.Viewer.open(definition);
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
    }, [viewerReady]);

    return (
        <div style={{ padding: 16 }}>
            <h2 style={{ marginBottom: 12 }}>Northwind - Supplier Product Report</h2>

            {loading && <p style={{ marginBottom: 8 }}>Loading...</p>}

            {loadError && (
                <p role="alert" style={{ color: 'crimson' }}>{loadError}</p>
            )}

            <div style={{ height: '700px', width: '100%' }}>
                <Viewer viewerRef={setViewerRef} />
            </div>
        </div>
    );
}
