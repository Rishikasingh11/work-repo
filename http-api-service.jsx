// http-api-service.jsx
import axios from "axios";
// import environment from "../../environments/environment-local";
import { format } from "date-fns";

const BASE_URL = "http://localhost:8080";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------- Operations -------------------
export const getOperationIdentiques = async () => {
  const response = await apiClient.get("/api/v1/operationsIdentiques");
  return response.data;
};

export const getOperationHistoriques = async (params) => {
  const response = await apiClient.get(
    `/api/v1/operationsHistoriques?lotDateReference=${format(
      new Date(params),
      "yyyy-MM-dd"
    )}`
  );
  return response.data;
};

// ------------------- Orphelins -------------------
export const getOrphelins = async () => {
  const response = await axios.get("/testData/orphelins.json");
  return response.data;
};

export const getOrphelinsMatches = async () => {
  const response = await axios.get("/testData/orphelinsMatches.json");
  return response.data;
};

export const getAllOrphelins = async () => {
  const response = await apiClient.get("/api/v1/orphelins");
  return response.data;
};

export const getOrphelinsHistoriques = async (params) => {
  const response = await apiClient.get(
    `/api/v1/orphelinsHistoriques?lotDateReference=${format(
      new Date(params),
      "yyyy-MM-dd"
    )}`
  );
  return response.data;
};

// ------------------- Position Synthétique -------------------
export const getPositionSynthetique = async () => {
  const response = await apiClient.get("/api/v1/positionSynthetiques");
  return response.data;
};

export const getPositionStatus = async (params) => {
  const url = `/api/v1/positionStatusLatests${
    params
      ? `?lotDateReference=${format(new Date(params), "yyyy-MM-dd")}`
      : ""
  }`;
  const response = await apiClient.get(url);
  return response.data;
};

export const getPositionSynthetiqueHistoriques = async (params) => {
  const response = await apiClient.get(
    `/api/v1/positionSynthetiqueHistoriques?lotDateReference=${format(
      new Date(params),
      "yyyy-MM-dd"
    )}`
  );
  return response.data;
};

export const getPositionSynthetiqueReport = async (params) => {
  const response = await apiClient.get(
    `/api/v1/positionSynthetiqueReports${
      params
        ? `?lotDateReference=${format(new Date(params), "yyyy-MM-dd")}`
        : ""
    }`,
    { responseType: "blob" }
  );

  // Extract file name from Content-Disposition header
  const contentDisposition =
    response.headers["content-disposition"] ||
    response.headers["Content-Disposition"];
  let fileName = "RISQ_POS_QUITUS.xlsx";

  if (contentDisposition) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i.exec(
      contentDisposition
    );
    if (matches && matches[1]) {
      fileName = matches[1].replace(/["]/g, "");
    }
  }

  return { blob: response.data, fileName };
};

export const postPositionSynthetiqueAnnulValiderPositions = async (lotId) => {
  const response = await apiClient.post(
    `/api/v1/positionSynthetiqueAnnulValiderPositions/${lotId}`
  );
  return response.data;
};

export const postPositionSynthetiqueValiderPositions = async (lotId) => {
  const response = await apiClient.post(
    `/api/v1/positionSynthetiqueValiderPositions/${lotId}`
  );
  return response.data;
};

// ------------------- Deals -------------------
export const getAllDealsData = async () => {
  const response = await axios.get("/testData/dealsData.json");
  return response.data;
};

// Manual Matching avec Écart
export const getManualMatchingAvecEcartData = async () => {
  const response = await axios.get(
    "/testData/ManuelMatchingAvecEcartData.json"
  );
  return response.data;
};

// ------------------- Position par Devise -------------------
export const fetchCurrencies = async () => {
  try {
    const response = await axios.get("/testData/positionParDevise/currencies.json");
    return response.data.currencies;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw new Error("Failed to fetch currencies");
  }
};

export const fetchFinancialData = async (currency) => {
  try {
    const response = await axios.get(
      `/testData/positionParDevise/financialData.json?currency=${currency}`
    );
    return response.data.positions;
  } catch (error) {
    console.error("Error fetching financial data:", error);
    throw new Error("Failed to fetch financial data");
  }
};

export const fetchDetails = async (key) => {
  try {
    const response = await axios.get("/testData/positionParDevise/details.json");
    return response.data[key] || [];
  } catch (error) {
    console.error("Error fetching details:", error);
    return [];
  }
};

// ------------------- Corrections -------------------
export const postAjoutCorrection = async (form) => {
  console.log("postAjoutCorrection", form);
  const response = await apiClient.post("/api/ajout-correction", form);
  return { success: true, ...response.data };
};
