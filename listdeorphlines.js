// line 364
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Container, Badge, Stack, Button, Modal, Form, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import {
    QuestionCircleFill,
    ExclamationTriangleFill,
    PencilSquare,
    XOctagonFill,
    ArrowRepeat,
    ArrowLeftRight,
    InfoCircleFill
} from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// --- AgGrid Imports ---
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from 'ag-grid-community';
import { 
    ClientSideRowModelModule,
    // ColumnApiModule,
    ColumnAutoSizeModule,
    // ValidationModule
} from 'ag-grid-community';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    // ColumnApiModule,
    ColumnAutoSizeModule,
    // ValidationModule
]);


const gridOptions = {
    getRowStyle: params => {
        if (params.node.rowIndex % 4 < 2) {
            return { 'background': '#f2f2f2' }; // Light grey for even rows
        } else {
            return { 'background': '#ffffff' }; // White for odd rows
        }
    },
}
/**
* Custom cell renderer for the 'Type' column.
* Shows the Info icon and handles the history modal.
*/
const TypeCellRenderer = ({ data, context }) => {
    const parts = data.type.split(' ');
    if (parts.length === 3) {
        return (
            <Stack direction="horizontal" gap={1} className="align-items-center h-100">
                <span>{parts[0]}</span>
                <span>{parts[1]}</span>
                <Button
                    variant="link"
                    size="sm"
                    className="p-0 mx-1 text-primary"
                    onClick={() => context.handleShowHistoryModal(data)}
                    title={`Show history for ${data.reference}`}
                    aria-label={`Show history for ${data.reference}`}
                >
                    <InfoCircleFill size={14} />
                </Button>
                <span>{parts[2]}</span>
            </Stack>
        );
    }
    return <span className="cell-pre-line">{data.type}</span>;
};
/**
 * Main DealsTable component.
 * Handles AgGrid setup, modals, and comment logic.
 */
const DealsTable = () => {
    // --- Constants ---
    const totalDeals = 28;
    const orphansToComment = 6;
    const maxCommentLength = 254;

    // --- State for deals data ---
    const [dealsData, setDealsData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch(process.env.PUBLIC_URL + '/dealsData.json')
            .then((res) => res.json())
            .then((data) => {
                setDealsData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // --- State for modals and comment input ---
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedDealHistory, setSelectedDealHistory] = useState([]);
    const [selectedDealReference, setSelectedDealReference] = useState('');
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [commentingDealId, setCommentingDealId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [showPopover, setShowPopover] = useState(false);

    // --- Modal Handlers ---
    // Show history modal for a deal
    const handleShowHistoryModal = useCallback((deal) => {
        setSelectedDealHistory(deal.history || []);
        setSelectedDealReference(deal.reference.replace(/\n/g, ' '));
        setShowHistoryModal(true);
    }, []);
    // Show comment modal for a deal
    const handleShowCommentModal = useCallback((dealId) => {
        setCommentingDealId(dealId);
        setShowCommentModal(true);
    }, []);
    // Close comment modal and reset input
    const handleCloseCommentModal = () => {
        setShowCommentModal(false);
        setCommentText('');
        setCommentingDealId(null);
    };
    // Handle comment textarea change
    const handleCommentChange = (event) => {
        if (event.target.value.length <= maxCommentLength) {
            setCommentText(event.target.value);
        }
    };
    // Save comment (stub: implement actual save logic as needed)
    const handleSaveComment = () => {
        if (commentingDealId) {
            console.log(`Saving comment for deal ${commentingDealId}: "${commentText}"`);
            handleCloseCommentModal();
        } else {
            console.error("No deal selected for commenting.");
            handleCloseCommentModal();
        }
    };

    /**
     * Expand dealsData so each deal is followed by a comment row.
     * The comment row starts from 'Montant Achat' column and spans to the end.
     * After every 2 deals, insert a 'justificatif' row using the justificatif data from the deal.
     */
    const expandedDealsData = useMemo(() => {
        if (!dealsData || dealsData.length === 0) return [];
        const rows = [];
        for (let i = 0; i < dealsData.length; i++) {
            rows.push({ ...dealsData[i], isCommentRow: false });
            rows.push({
                id: `${dealsData[i].id}-comment`,
                isCommentRow: true,
                commentaire: dealsData[i].commentaire,
                reference: dealsData[i].reference,
            });
            if ((i + 1) % 2 === 0) {
                const justificatif = dealsData[i].justificatif;
                rows.push({
                    id: `justificatif-${Math.floor(i / 2)}`,
                    isJustificatifRow: true,
                    justificatif: justificatif.text,
                    justificatifComment: justificatif.comment,
                    justificatifUser: justificatif.user,
                    justificatifDate: justificatif.date,
                });
            }
        }
        return rows;
    }, [dealsData]);

    /**
     * AgGrid column definitions.
     * For comment rows, only the 'Montant Achat' column renders the comment (with colSpan), others are empty.
     * For justificatif rows, only the 'Montant Achat' column renders the justificatif (with colSpan), others are empty.
     */
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

    // --- AgGrid Default Column Definition ---
    const defaultColDef = useMemo(() => ({
        sortable: false,
        filter: false,
        resizable: true,
        suppressSizeToFit: false,
        autoSize: true
    }), []);

    const autoGroupColumnDef = useMemo(() => ({
        minWidth: 100,
        flex: 1,
        suppressSizeToFit: false
    }), []);

    // const onFirstDataRendered = useCallback((params) => {
    //     params.api.sizeColumnsToFit();
    // }, []);

    // --- AgGrid context for cell renderers ---
    const gridContext = useMemo(() => ({
        handleShowHistoryModal,
        handleShowCommentModal
    }), [handleShowHistoryModal, handleShowCommentModal]);

    const gridRef = useRef();


    const popover = (
        <Popover id="popover" className="legend-popover">
            <Popover.Body className="px-3 pt-0">
                <ul>
                    <li>CC: Change comptant</li>
                    <li>TC: Change à terme - spot de couverture</li>
                    <li>TT: Change à terme - partie terme</li>
                    <li>SW: Swap de change - spot de couverture</li>
                    <li>GC: Ordre groupe - change comptant</li>
                    <li>GT: Ordre groupe - change à terme</li>
                    <li>TF: Transfert</li>
                    <li>N: Nominal saisie</li>
                </ul>
            </Popover.Body>
        </Popover>
    );


    // const gridStyle = useMemo(() => ({ height: "100%", width: "100%"}), []);

    // --- Render ---
    return (
        <Container fluid className="mt-3">
            {/* Toolbar and legend */}
            <Stack direction="horizontal" gap={3} className="mb-2 pb-2 border-bottom align-items-center justify-content-between flex-wrap">
                <div className="d-flex align-items-center gap-2 mb-1 mb-md-0">
                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="bottom"
                        overlay={popover}
                    >
                        <QuestionCircleFill className="help-cursor" />
                    </OverlayTrigger>
                    <span>Légende</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-1 mb-md-0"><ExclamationTriangleFill color="orange" /> <span>Nombre d'orphelins restants à commenter : <Badge bg="danger">{orphansToComment}</Badge></span></div>
                <div className="d-flex align-items-center gap-3 flex-wrap justify-content-center justify-content-md-end">
                    <Button variant="link" className="text-decoration-none text-secondary p-0 d-flex align-items-center gap-1"><PencilSquare /> <span>Saisie d'un commentaire</span></Button>
                    <Button variant="link" className="text-decoration-none text-secondary p-0 d-flex align-items-center gap-1"><XOctagonFill /> <span>Suppression de l'orphelin</span></Button>
                    <Button variant="link" className="text-decoration-none text-secondary p-0 d-flex align-items-center gap-1"><ArrowRepeat /> <span>Annulation de la suppression</span></Button>
                    <Button variant="link" className="text-decoration-none text-secondary p-0 d-flex align-items-center gap-1"><ArrowLeftRight /> <span>Inversion du sens des CC</span></Button>
                </div>
            </Stack>

            {/* Info Line */}
            <p className="text-muted mb-2">Nombre de deals: {totalDeals}</p>

            {/* AgGrid Table */}
            {loading ? (
                <div className="text-center my-5">Chargement des données...</div>
            ) : (
            <div className="ag-theme-alpine grid-container" style={{ width: '100%', height: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={expandedDealsData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    domLayout="autoHeight"
                    pagination={true}
                    paginationPageSize={10}
                    enableBrowserTooltips={true}
                    rowSelection="single"
                    context={gridContext}
                    rowHeight={50}
                    theme={'legacy'}
                    gridOptions={gridOptions}
                    suppressHorizontalScroll={true}
                    suppressColumnVirtualisation={true}
                    suppressRowVirtualisation={true}
                />
            </div>
            )}


            {/* History Modal */}
            <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Historique - Ref: <span className="cell-pre-line">{selectedDealReference}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-history-content">
                    {selectedDealHistory.length > 0 ? (
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Commentaire</th>
                                    <th>Utilisateur</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedDealHistory.map((entry, idx) => (
                                    <tr key={idx}>
                                        <td>{entry.action}</td>
                                        <td className="table-cell-wrap">{entry.commentaire}</td>
                                        <td>{entry.utilisateur}</td>
                                        <td>{entry.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Aucun historique disponible pour cette référence.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Comment Modal */}
            <Modal show={showCommentModal} onHide={handleCloseCommentModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Commenter l'orphelin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Merci de saisir un commentaire pour l'action sélectionnée</p>
                    <Form.Group controlId="commentTextArea">
                        <Form.Label className="fw-bold">Commentaire :</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={commentText}
                            onChange={handleCommentChange}
                            maxLength={maxCommentLength}
                            className="comment-textarea"
                        />
                        <Form.Text muted className="d-block text-end">
                            {maxCommentLength - commentText.length} restant(s)
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCommentModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSaveComment}>
                        Sauvegarder
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default DealsTable;