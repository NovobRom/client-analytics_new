// --- File Processor: CSV/Excel upload, header detection, column mapping ---
// Papa and XLSX are global CDN objects (window.Papa / window.XLSX)

import { state } from './config.js';
import { setupGlobalFilters } from './filters.js';
import { recalculateDashboard } from './analysis.js';
import { updateRateBadge } from './currency.js';

export function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('hidden');
    loadingOverlay.classList.add('flex');
    setTimeout(() => {
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith('.csv')) processCSV(file);
        else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) processExcel(file);
        else { alert("Unsupported file type"); hideLoading(); }
    }, 100);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('hidden');
    loadingOverlay.classList.remove('flex');
    document.getElementById('csvInput').value = '';
}

function processCSV(file) {
    Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: function(results) { findHeaderAndProcess(results.data); },
        error: function(err) { alert("Error parsing CSV: " + err.message); hideLoading(); }
    });
}

function processExcel(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
            findHeaderAndProcess(jsonData);
        } catch (error) { alert("Error processing Excel"); hideLoading(); }
    };
    reader.readAsArrayBuffer(file);
}

function findHeaderAndProcess(rows) {
    let headerRowIndex = -1;
    for (let i = 0; i < Math.min(rows.length, 30); i++) {
        const rowStr = rows[i].join(" ");
        if (rowStr.includes("Контрагент відправник по МЕН") && rowStr.includes("Shipment вартість послуг")) {
            headerRowIndex = i; break;
        }
    }
    if (headerRowIndex === -1) { alert("Header not found"); hideLoading(); return; }

    state.rawHeaders = rows[headerRowIndex];
    state.rawRows = rows.slice(headerRowIndex + 1);
    mapColumnIndices(state.rawHeaders);
    setupGlobalFilters();
    recalculateDashboard();
    updateRateBadge();
    hideLoading();
}

function mapColumnIndices(headers) {
    const colMap = {};
    headers.forEach((h, i) => { if (typeof h === 'string') colMap[h.trim()] = i; });
    const getIdx = (name) => {
        if (colMap[name] !== undefined) return colMap[name];
        const key = Object.keys(colMap).find(k => k.toLowerCase().includes(name.toLowerCase()));
        return key !== undefined ? colMap[key] : -1;
    };

    let dateIdx = getIdx("IWB дата створення");
    if (dateIdx === -1) dateIdx = getIdx("Дата оформлення");
    if (dateIdx === -1) dateIdx = getIdx("Shipment Date");
    if (dateIdx === -1) dateIdx = getIdx("Дата");

    let currIdx = getIdx("Shipment валюта вартості послуг");
    if (currIdx === -1) currIdx = getIdx("Валюта");
    if (currIdx === -1) currIdx = getIdx("Currency");

    state.rawColIndices = {
        idxName: getIdx("Контрагент відправник по МЕН"),
        idxRev: getIdx("Shipment вартість послуг"),
        idxCountry: getIdx("Країна-відправник"),
        idxDestCountry: getIdx("Країна отримувач"),
        idxType: getIdx("Тип відправника по МЕН"),
        idxDesc: getIdx("Опис відправлення"),
        idxSegment: getIdx("Сегмент відправника_"),
        idxPhone: getIdx("тел отправитель") !== -1 ? getIdx("тел отправитель") : getIdx("Телефон відправника"),
        idxDate: dateIdx,
        idxCurr: currIdx
    };
}
