// OrphelinsMatchesGrid.jsx
import React, { useState, useMemo, useRef, useCallback } from "react";
import { Stack, Button } from "react-bootstrap";
import { XOctagonFill, InfoCircleFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

import "./OrphelinsMatches.scss";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { ModuleRegistry } from "ag-grid-community";
import {
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
} from "ag-grid-community";

// import HistoryModal from "../../modals/OrphelinsHistoryModal";

ModuleRegistry.registerModules([ClientSideRowModelModule, ColumnAutoSizeModule]);

const OrphelinsMatchesGrid = ({ rowData }) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDealHistory, setSelectedDealHistory] = useState([]);
  const [selectedDealReference, setSelectedDealReference] = useState("");

  const handleShowHistoryModal = useCallback((deal) => {
    // Placeholder: fetch the deal history using deal.reference
    const history = []; // Replace with actual logic

    setSelectedDealHistory(history);
    setSelectedDealReference(deal.reference);
    setShowHistoryModal(true);
  }, []);

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
  };

  const gridOptions = {
    getRowStyle: (params) => {
      const rowIndex = params.node.rowIndex;
      if (Math.floor(rowIndex / 5) % 2 === 0) {
        return { background: "#f2f2f2" }; // Light grey for every 5 rows
      } else {
        return { background: "#ffffff" }; // White for next 5 rows
      }
    },
  };



  const defaultColDef = {
    sortable: false,
    filter: false,
    resizable: true,
    suppressSizeToFit: false,
    autoSize: true,
  };


  // const columnDefs = useMemo(
  //   () => [
  //     {
  //       headerName: "Type",
  //       field: "type",
  //       minWidth: 100,
  //       flex: 1,
  //       cellRenderer: (params) => {
  //         if (params.data.isJustificatifRow) {
  //           return (
  //             <span style={{ fontWeight: 600, color: "#555" }}>
  //               {params.data.justificatif}
  //             </span>
  //           );
  //         }
  //         if (params.data.isCommentRow) return null;

  //         const parts = (params.data.type || "").split(" ");
  //         return (
  //           <Stack direction="horizontal" gap={1}>
  //             <span>{parts[0] || ""}</span>
  //             <Button
  //               variant="link"
  //               size="sm"
  //               className="p-0 pb-1 mx-1 text-primary"
  //               onClick={() => handleShowHistoryModal(params.data)}
  //               title={`Show history for ${params.data.reference}`}
  //               aria-label={`Show history for ${params.data.reference}`}
  //             >
  //               <InfoCircleFill size={14} />
  //             </Button>
  //             <span>{parts[1] || ""}</span>
  //             <span>{parts[2] || ""}</span>
  //           </Stack>
  //         );
  //       },
  //     },
  //     {
  //       headerName: "Office",
  //       field: "office",
  //       minWidth: 100,
  //       flex: 1,
  //     },
  //     {
  //       headerName: "Reference",
  //       field: "reference",
  //       minWidth: 100,
  //       flex: 1,
  //     },
  //     {
  //       headerName: "Contrepartie",
  //       field: "contrepartie",
  //       minWidth: 100,
  //       flex: 1,
  //     },
  //     {
  //       headerName: "Date de Valeur",
  //       field: "dateValeur",
  //       minWidth: 100,
  //       flex: 1,
  //     },
  //     {
  //       headerName: "Montant Achat",
  //       field: "montantAchat",
  //       minWidth: 100,
  //       flex: 1,
  //       cellClass: "cell-text-right",
  //     },
  //     {
  //       headerName: "Montant Vendu",
  //       field: "montantVendu",
  //       minWidth: 100,
  //       flex: 1,
  //       cellClass: "cell-text-right",
  //     },
  //     {
  //       headerName: "Cours Client",
  //       field: "coursClient",
  //       minWidth: 100,
  //       flex: 1,
  //       cellClass: "cell-text-right",
  //     },
  //     {
  //       headerName: "Montant de base Achat",
  //       field: "montantBaseAchat",
  //       minWidth: 100,
  //       flex: 1,
  //       cellClass: "cell-text-right",
  //     },
  //     {
  //       headerName: "Montant de base Vendu",
  //       field: "montantBaseVendu",
  //       minWidth: 100,
  //       flex: 1,
  //       cellClass: "cell-text-right",
  //     },
  //     {
  //       headerName: "Cours Base",
  //       field: "coursBase",
  //       minWidth: 100,
  //       flex: 1,
  //       cellClass: "cell-text-right",
  //     },
  //     {
  //       headerName: "Etat et Date d'import",
  //       field: "etatDateImport",
  //       minWidth: 100,
  //       flex: 1,
  //     },
  //     {
  //       headerName: "Actions",
  //       field: "id",
  //       minWidth: 100,
  //       flex: 1,
  //       cellRenderer: (params) => {
  //         if (params.node.rowIndex % 5 === 2) {
  //           return (
  //             <Button
  //               onClick={() =>
  //                 alert(
  //                   `Suppression for group starting at ID: ${params.data.id}`
  //                 )
  //               }
  //               title="Suppression de l'orphelin"
  //               aria-label="Suppression de l'orphelin"
  //             >
  //               <XOctagonFill
  //                 className="action-icon action-icon-red"
  //                 size={16}
  //               />
  //             </Button>
  //           );
  //         }
  //         return null;
  //       },
  //     },
  //   ],
  //   [handleShowHistoryModal]
  // );

  const columnDefs = useMemo(() => [
    {
        headerName: 'Type',
        field: 'type',
        minWidth: 100,
        flex: 1,
        cellClass: (params) =>
          params.data.isCommentRow ? 'comment-row' : params.data.isJustificatifRow ? 'justificatif-row' : 'ag-master-cell',
        colSpan: (params) =>
          params.data.isJustificatifRow ? 4 : 1,
        cellRenderer: (params) => {
          if (params.data.isJustificatifRow) {
            return (
              <span>
                <span style={{ fontWeight: 600 }}>Justificatif :</span>{' '}
                <span style={{ fontStyle: 'italic', color: '#555' }}>{params.data.justificatif}</span>
              </span>
            );
          }
          if (params.data.isCommentRow) return null;
          const parts = (params.data.type || '').split(' ');
          return <span>{parts[0] || ''}</span>;
        },
      },
    {
        headerName: 'Office',
        field: 'office',
        minWidth: 100,
        flex: 1,
        cellClass: (params) => params.data.isCommentRow ? 'comment-row' : params.data.isJustificatifRow ? 'justificatif-row' : '',
        colSpan: (params) => params.data.isCommentRow || params.data.isJustificatifRow ? 1 : 1,
        cellRenderer: (params) => {
            if (params.data.isCommentRow || params.data.isJustificatifRow) return null;
            const parts = (params.data.type || '').split(' ');
            return (
                <span>
                    {parts[1] ? parts[1] : ''}{parts[2] ? ' ' + parts[2] : ''}
                    {parts.length === 3 && (
                        <Button
                            variant="link"
                            size="sm"
                            className="p-0 pb-1 mx-1 text-primary"
                            onClick={() => handleShowHistoryModal(params.data)}
                            title={`Show history for ${params.data.reference}`}
                            aria-label={`Show history for ${params.data.reference}`}
                        >
                            <InfoCircleFill size={14} />
                        </Button>
                    )}
                </span>
            );
        },
    },
    {
        headerName: 'Reference',
        field: 'reference',
        minWidth: 100,
        flex: 1,
        cellClass: (params) => params.data.isCommentRow ? 'comment-row' : params.data.isJustificatifRow ? 'justificatif-row' : 'cell-pre-line',
        colSpan: (params) => params.data.isCommentRow || params.data.isJustificatifRow ? 1 : 1,
        cellRenderer: (params) => (params.data.isCommentRow || params.data.isJustificatifRow) ? null : params.value,
    },
    {
        headerName: 'Contrepartie',
        field: 'contrepartie',
        minWidth: 100,
        flex: 1,
        colSpan: (params) => params.data.isCommentRow || params.data.isJustificatifRow ? 1 : 1,
        cellRenderer: (params) => (params.data.isCommentRow || params.data.isJustificatifRow) ? null : params.value,
    },
    {
        headerName: 'Date de Valeur',
        field: 'dateValeur',
        minWidth: 100,
        flex: 1,
        colSpan: (params) => params.data.isCommentRow || params.data.isJustificatifRow ? 1 : 1,
        cellRenderer: (params) => (params.data.isCommentRow || params.data.isJustificatifRow) ? null : params.value,
    },
    {
        headerName: 'Montant Achat',
        field: 'montantAchat',
        cellClass: (params) =>
          params.data.isCommentRow
            ? 'cell-text-right'
            : params.data.isJustificatifRow
            ? 'justificatif-row'
            : 'cell-text-right',
        minWidth: 100,
        flex: 1,
        colSpan: (params) =>
          params.data.isJustificatifRow ? 4 : params.data.isCommentRow ? 8 : 1,
        cellRenderer: (params) => {
          if (params.data.isJustificatifRow) {
            return (
              <span>
                <span style={{ fontWeight: 600  }}><strong>Commentaire:</strong>  </span>    {' '}
             
                <span style={{ fontStyle: 'italic', color: '#555' }}>{params.data.justificatifComment}</span>
              </span>
            );
          }
          if (params.data.isCommentRow) {
            return (
              <span className="comment-text">
                <strong>Commentaire:</strong> {params.data.commentaire || <span className="text-muted">Aucun commentaire</span>}
              </span>
            );
          }
          return params.value;
        },
      },
    {
        headerName: 'Montant Vendu',
        field: 'montantVendu',
        cellClass: 'cell-text-right',
        minWidth: 100,
        flex: 1,
        colSpan: (params) => params.data.isCommentRow ? 1 : 1,
        cellRenderer: (params) => params.data.isCommentRow ? null : params.value,
    },
    {
        headerName: 'Cours client',
        field: 'coursClient',
        cellClass: 'cell-text-right',
        minWidth: 100,
        flex: 1,
        colSpan: (params) => params.data.isCommentRow ? 1 : 1,
        cellRenderer: (params) => params.data.isCommentRow ? null : params.value,
    },
    {
        headerName: 'Montant de base Achat',
        field: 'montantBaseAchat',
        cellClass: 'cell-text-right',
        minWidth: 100,
        flex: 1,
        colSpan: (params) => params.data.isCommentRow ? 1 : 1,
        cellRenderer: (params) => params.data.isCommentRow ? null : params.value,
    },
    {
        headerName: 'Montant de base Vendu',
        field: 'montantBaseVendu',
        cellClass: 'cell-text-right',
        minWidth: 100,
        flex: 1,
        colSpan: (params) => params.data.isCommentRow ? 1 : 1,
        cellRenderer: (params) => params.data.isCommentRow ? null : params.value,
    },
    {
        headerName: 'Cours base',
        field: 'coursBase',
        cellClass: 'cell-text-right',
        minWidth: 100,
        flex: 1,
        colSpan: (params) => params.data.isCommentRow ? 1 : 1,
        cellRenderer: (params) => params.data.isCommentRow ? null : params.value,
    },
    {
        headerName: 'Etat et Date d\'import',
        field: 'etatDateImport',
        cellClass: 'cell-pre-line',
        minWidth: 100,
        flex: 1,
        colSpan: (params) => params.data.isJustificatifRow ? 2 : 1,
        cellRenderer: (params) =>
            params.data.isJustificatifRow
                ? <span style={{ fontWeight: 600 }}>{params.data.justificatifUser} - {params.data.justificatifDate}</span>
                : params.value,
    },

    // this is changes made to the table to add the suppression button
    {
        headerName: 'Actions',
        field: 'id',
        minWidth: 100,
        flex: 1,
        cellClass: 'action-cell',
        rowSpan: (params) => {
            // If it's a justificatif row, don't span
            if (params.data.isJustificatifRow) return 1;
            // For the first row in each group of 5, span 5 rows
            if (params.node.rowIndex % 5 === 0) return 5;
            // For all other rows, don't show the cell
            return 0;
        },
        cellRenderer: (params) => {
            // Only show for main data rows (not comment or justification rows)
            if (params.data.isCommentRow || params.data.isJustificatifRow) return null;
            
            // Only show the suppress button for the first row in each group of 5
            if (params.node.rowIndex % 5 === 0) {
                return (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <Button
                            variant="link"
                            className="p-0"
                            onClick={() => {
                                // Your suppression logic here
                                alert(`Suppression for group starting at ID: ${params.data.id}`);
                            }}
                            title="Suppression de l'orphelin"
                            aria-label="Suppression de l'orphelin"
                        >
                            <XOctagonFill className="action-icon action-icon-red" size={16} />
                        </Button>
                    </div>
                );
            }
            return null;
        },
        sortable: false,
        filter: false,
    }
], [handleShowHistoryModal]);

const gridRef = useRef();

  const expandedDealsData = useMemo(() => {
    if (!rowData || rowData.length === 0) return [];
    const rows = [];

    for (let i = 0; i < rowData.length; i++) {
      rows.push({ ...rowData[i], isCommentRow: false });

      // Add comment row
      rows.push({
        id: `${rowData[i].id}-comment`,
        isCommentRow: true,
        commentaire: rowData[i].commentaire,
        reference: rowData[i].reference,
      });

      // Add justificatif row every 2 rows
      if ((i + 1) % 2 === 0) {
        const justificatif = rowData[i].justificatif;
        rows.push({
          id: `justificatif-${Math.floor(i / 2)}`,
          isJustificatifRow: true,
          justificatif: justificatif?.text,
          justificatifComment: justificatif?.comment,
          justificatifUser: justificatif?.user,
          justificatifDate: justificatif?.date,
        });
      }
    }

    return rows;
  }, [rowData]);

  return (
    <div
      className="orphelins-matches ag-theme-alpine"
      style={{ width: "100%", height: "100%" }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={expandedDealsData}
        columnDefs={columnDefs}
        domLayout="autoHeight"
        pagination={true}
        paginationPageSize={10}
        defaultColDef={defaultColDef}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        enableBrowserTooltips={true}
        rowSelection="single"
        theme={'legacy'} // ------------------------------------------------------------
        rowHeight={50}
        gridOptions={gridOptions}
      />

      {/* History Modal */}
      {/* <HistoryModal
        show={showHistoryModal}
        onHide={handleCloseHistoryModal}
        dealReference={selectedDealReference}
        dealHistory={selectedDealHistory}
      /> */}
    </div>
  );
};

export default OrphelinsMatchesGrid;
