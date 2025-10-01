// OrphelinsMatches.jsx

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Container, Badge, Stack, Button } from "react-bootstrap";
import { ExclamationTriangleFill, XOctagonFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

// import { SgDatePicker } from "@sg-bootstrap/components/dist/react-library/src/components";

import OrphelinsMatchesGrid from "../../components/AgGrid/OrphelinsMatches/OrphelinsMatchesGrid";
import GenericPopover from "../../components/popovers/GenericPopover";
import { getOrphelinsMatches } from "../../components/common/http-api-service";

const OrphelinsMatches = () => {
  // Legend content for the popover
  const legendContent = `
    CC: Change comptant
    TC: Change à terme - spot de couverture
    TT: Change à terme - partie terme
    SW: Swap de change - spot de couverture
    GC: Ordre groupe change comptant
    GT: Ordre groupe change terme
    TF: Transfert
    N: Nominal saisie
  `;

  // State
  const [rowData, setRowData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDealHistory, setSelectedDealHistory] = useState([]);
  const [selectedDealReference, setSelectedDealReference] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrphelinsMatches();
        if (response) {
          console.log("Fetched data:", response);
          setRowData(response);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Expand deals with extra rows (comments/justificatifs)
  // const expandedDealsData = useMemo(() => {
  //   if (!rowData || rowData.length === 0) return [];

  //   return rowData.flatMap((deal) => [
  //     { ...deal, isCommentRow: false },
  //     {
  //       id: `${deal.id}-comment`,
  //       isCommentRow: true,
  //       commentaire: deal.commentaire,
  //       reference: deal.reference,
  //     },
  //   ]);
  // }, [rowData]);

  // Handle showing history modal
  const handleShowHistoryModal = useCallback((deal) => {
    setSelectedDealHistory(deal.history || []);
    setSelectedDealReference(deal.reference.replace(/\n/g, " "));
    setShowHistoryModal(true);
  }, []);

  // Handle closing history modal
  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
  };

  return (
    <Container fluid className="mt-3">
      {/* Header */}
      <Stack
        direction="horizontal"
        className="mb-2 pb-2 border-bottom align-items-center flex-wrap justify-content-between"
      >
        {/* Date Picker + Record Count */}
        <div className="d-flex gap-5 align-items-center">
          <div className="col mb-2" style={{ paddingTop: 10, maxWidth: 248 }}>
            {/* <SgDatePicker
              defaultValue={selectedDate}
              size="md"
              selectionColor="primary"
              dropdownAlignment="left"
              onChange={(date) => setSelectedDate(date)}
            /> */}
          </div>

          <div className="d-flex align-items-center gap-2 mb-1 mb-md-0">
            <p className="record-count mb-0">
              Nombre de deals: {rowData ? rowData.length : 0}
            </p>
            <GenericPopover title="Légende" content={legendContent} />
          </div>
        </div>

        {/* Warnings + Actions */}
        <div className="d-flex">
          <div
            className="d-flex align-items-center gap-2 mb-1 mb-md-0"
            style={{ paddingRight: 15 }}
          >
            <ExclamationTriangleFill color="orange" />
            <span>
              Données en visualisation uniquement{" "}
              <Badge bg="danger">X</Badge>
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap justify-content-center justify-content-md-end">
            <Button
              variant="link"
              className="text-decoration-none text-secondary p-0 d-flex align-items-center gap-1"
            >
              <XOctagonFill />
              <span>Suppression du matching</span>
            </Button>
          </div>
        </div>
      </Stack>

      {/* Grid */}
      {rowData ? (
        <OrphelinsMatchesGrid
          rowData={rowData}
          onShowHistory={handleShowHistoryModal}
          showHistoryModal={showHistoryModal}
          onCloseHistoryModal={handleCloseHistoryModal}
          selectedDealReference={selectedDealReference}
          selectedDealHistory={selectedDealHistory}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </Container>
  );
};

export default OrphelinsMatches;
