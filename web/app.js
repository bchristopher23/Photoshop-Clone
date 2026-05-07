const canvas = document.querySelector("#viewport");
const ctx = canvas.getContext("2d");

const stage = document.querySelector("#stage");
const fileInput = document.querySelector("#file-input");
const projectInput = document.querySelector("#project-input");
const layerList = document.querySelector("#layers");
const toolButtons = [...document.querySelectorAll("[data-tool]")];
const toolOptionSections = [...document.querySelectorAll("[data-tool-options]")];
const menuRoots = [...document.querySelectorAll("[data-menu-root]")];
const menuButtons = [...document.querySelectorAll("[data-menu-button]")];
const menuPanels = [...document.querySelectorAll("[data-menu-panel]")];
const windowPanelToggleButtons = [...document.querySelectorAll("[data-window-panel-toggle]")];
const inspectorPanels = [...document.querySelectorAll("[data-inspector-panel]")];
const inspectorSections = [...document.querySelectorAll("[data-inspector-section]")];
const inspectorSectionToggles = [...document.querySelectorAll("[data-inspector-toggle]")];
const panelToggleButtons = [...document.querySelectorAll("[data-panel-toggle]")];
const layerFilterButtons = [...document.querySelectorAll("[data-layer-filter]")];
const layerLockButtons = [...document.querySelectorAll("[data-layer-lock]")];
const contextualBarSections = [...document.querySelectorAll("[data-contextual-section]")];
const adjustmentInputs = [...document.querySelectorAll("[data-adjustment-setting]")];
const inspectorSectionDefaultModes = {
  document: "pinned",
  rulers: "pinned",
  guides: "pinned",
  "quick-actions": "pinned",
  transform: "auto",
  brush: "auto",
  adjustment: "auto",
  vector: "auto",
  text: "auto",
  shape: "auto"
};
const inspectorSectionModeOrder = ["auto", "pinned", "hidden"];

const ui = {
  newDoc: document.querySelector("#new-doc"),
  openImage: document.querySelector("#open-image"),
  openProject: document.querySelector("#open-project"),
  saveProject: document.querySelector("#save-project"),
  saveProjectAs: document.querySelector("#save-project-as"),
  exportImage: document.querySelector("#export-image"),
  appMain: document.querySelector("#app-main"),
  inspectorResizeHandle: document.querySelector("#inspector-resize-handle"),
  projectTabs: document.querySelector("#project-tabs"),
  homeScreen: document.querySelector("#home-screen"),
  homeNewDoc: document.querySelector("#home-new-doc"),
  homeOpenImage: document.querySelector("#home-open-image"),
  homeOpenProject: document.querySelector("#home-open-project"),
  homePrimaryNew: document.querySelector("#home-primary-new"),
  homePrimaryOpenImage: document.querySelector("#home-primary-open-image"),
  homePrimaryOpenProject: document.querySelector("#home-primary-open-project"),
  homePresets: document.querySelector("#home-presets"),
  homePresetsStatus: document.querySelector("#home-presets-status"),
  canvasSize: document.querySelector("#canvas-size"),
  propertiesImageSize: document.querySelector("#properties-image-size"),
  propertiesCrop: document.querySelector("#properties-crop"),
  fitCanvasLayer: document.querySelector("#fit-canvas-layer"),
  fitCanvasArtboard: document.querySelector("#fit-canvas-artboard"),
  exportFormat: document.querySelector("#export-format"),
  menuUndo: document.querySelector("#menu-undo"),
  menuRedo: document.querySelector("#menu-redo"),
  menuDuplicateLayer: document.querySelector("#menu-duplicate-layer"),
  menuDeleteLayer: document.querySelector("#menu-delete-layer"),
  grayscaleMenu: document.querySelector("#grayscale-menu"),
  invertMenu: document.querySelector("#invert-menu"),
  menuZoomIn: document.querySelector("#menu-zoom-in"),
  menuZoomOut: document.querySelector("#menu-zoom-out"),
  menuFitView: document.querySelector("#menu-fit-view"),
  menuResetView: document.querySelector("#menu-reset-view"),
  windowContextualBarToggle: document.querySelector("#window-contextual-bar-toggle"),
  windowContextualBarReset: document.querySelector("#window-contextual-bar-reset"),
  windowPanelsReset: document.querySelector("#window-panels-reset"),
  menuLayerNew: document.querySelector("#menu-layer-new"),
  menuLayerGroup: document.querySelector("#menu-layer-group"),
  menuLayerUngroup: document.querySelector("#menu-layer-ungroup"),
  menuLayerMaskAdd: document.querySelector("#menu-layer-mask-add"),
  menuLayerMaskEdit: document.querySelector("#menu-layer-mask-edit"),
  menuLayerMaskDelete: document.querySelector("#menu-layer-mask-delete"),
  menuLayerMaskApply: document.querySelector("#menu-layer-mask-apply"),
  menuLayerClippingMask: document.querySelector("#menu-layer-clipping-mask"),
  menuLayerAdjustmentGrayscale: document.querySelector("#menu-layer-adjustment-grayscale"),
  menuLayerAdjustmentInvert: document.querySelector("#menu-layer-adjustment-invert"),
  menuLayerAdjustmentBrightnessContrast: document.querySelector("#menu-layer-adjustment-brightness-contrast"),
  menuLayerAdjustmentHueSaturation: document.querySelector("#menu-layer-adjustment-hue-saturation"),
  menuLayerDuplicate: document.querySelector("#menu-layer-duplicate"),
  menuLayerDelete: document.querySelector("#menu-layer-delete"),
  menuLayerUp: document.querySelector("#menu-layer-up"),
  menuLayerDown: document.querySelector("#menu-layer-down"),
  menuLayerFlipHorizontal: document.querySelector("#menu-layer-flip-horizontal"),
  menuLayerFlipVertical: document.querySelector("#menu-layer-flip-vertical"),
  menuTypeNew: document.querySelector("#menu-type-new"),
  menuTypeEdit: document.querySelector("#menu-type-edit"),
  menuTypeAlignLeft: document.querySelector("#menu-type-align-left"),
  menuTypeAlignCenter: document.querySelector("#menu-type-align-center"),
  menuTypeAlignRight: document.querySelector("#menu-type-align-right"),
  menuSelectAll: document.querySelector("#menu-select-all"),
  menuSelectNone: document.querySelector("#menu-select-none"),
  menuSelectFill: document.querySelector("#menu-select-fill"),
  menuSelectClear: document.querySelector("#menu-select-clear"),
  menuSelectCrop: document.querySelector("#menu-select-crop"),
  menuHelpShortcuts: document.querySelector("#menu-help-shortcuts"),
  menuHelpAbout: document.querySelector("#menu-help-about"),
  toolbarHelpShortcuts: document.querySelector("#toolbar-help-shortcuts"),
  undo: document.querySelector("#undo"),
  redo: document.querySelector("#redo"),
  zoomIn: document.querySelector("#zoom-in"),
  zoomOut: document.querySelector("#zoom-out"),
  fitView: document.querySelector("#fit-view"),
  toolOptionsLabel: document.querySelector("#tool-options-label"),
  optionsTransformX: document.querySelector("#options-transform-x"),
  optionsTransformY: document.querySelector("#options-transform-y"),
  optionsTransformWidth: document.querySelector("#options-transform-width"),
  optionsTransformHeight: document.querySelector("#options-transform-height"),
  optionsTransformRotation: document.querySelector("#options-transform-rotation"),
  optionsBrushSize: document.querySelector("#options-brush-size"),
  optionsBrushSizeValue: document.querySelector("#options-brush-size-value"),
  optionsBrushOpacity: document.querySelector("#options-brush-opacity"),
  optionsBrushOpacityValue: document.querySelector("#options-brush-opacity-value"),
  optionsRegionTolerance: document.querySelector("#options-region-tolerance"),
  optionsRegionToleranceValue: document.querySelector("#options-region-tolerance-value"),
  optionsRegionContiguous: document.querySelector("#options-region-contiguous"),
  optionsGradientType: document.querySelector("#options-gradient-type"),
  optionsTextFontFamily: document.querySelector("#options-text-font-family"),
  optionsTextFontSize: document.querySelector("#options-text-font-size"),
  optionsTextAlign: document.querySelector("#options-text-align"),
  optionsPenFinish: document.querySelector("#options-pen-finish"),
  optionsPenClose: document.querySelector("#options-pen-close"),
  optionsShapeType: document.querySelector("#options-shape-type"),
  optionsShapeStrokeWidth: document.querySelector("#options-shape-stroke-width"),
  optionsShapeOpacity: document.querySelector("#options-shape-opacity"),
  optionsShapeOpacityValue: document.querySelector("#options-shape-opacity-value"),
  optionsFillSelection: document.querySelector("#options-fill-selection"),
  optionsClearSelection: document.querySelector("#options-clear-selection"),
  optionsApplyCrop: document.querySelector("#options-apply-crop"),
  optionsCancelCrop: document.querySelector("#options-cancel-crop"),
  optionsSelectionShapeField: document.querySelector("#options-selection-shape-field"),
  optionsSelectionShape: document.querySelector("#options-selection-shape"),
  optionsFitCanvasLayer: document.querySelector("#options-fit-canvas-layer"),
  optionsFitCanvasArtboard: document.querySelector("#options-fit-canvas-artboard"),
  optionsDeleteArtboard: document.querySelector("#options-delete-artboard"),
  optionsRulerClear: document.querySelector("#options-ruler-clear"),
  optionsRulerValue: document.querySelector("#options-ruler-value"),
  cropSelection: document.querySelector("#crop-selection"),
  clearSelection: document.querySelector("#clear-selection"),
  grayscale: document.querySelector("#grayscale"),
  invert: document.querySelector("#invert"),
  resetView: document.querySelector("#reset-view"),
  rotateLeft: document.querySelector("#rotate-left"),
  rotateRight: document.querySelector("#rotate-right"),
  flipHorizontal: document.querySelector("#flip-horizontal"),
  flipVertical: document.querySelector("#flip-vertical"),
  alignLeft: document.querySelector("#align-left"),
  alignCenterX: document.querySelector("#align-center-x"),
  alignRight: document.querySelector("#align-right"),
  alignTop: document.querySelector("#align-top"),
  alignCenterY: document.querySelector("#align-center-y"),
  alignBottom: document.querySelector("#align-bottom"),
  addLayer: document.querySelector("#add-layer"),
  linkLayer: document.querySelector("#link-layer"),
  layerStyle: document.querySelector("#layer-style"),
  layerMask: document.querySelector("#layer-mask"),
  layerAdjustment: document.querySelector("#layer-adjustment"),
  groupLayer: document.querySelector("#group-layer"),
  ungroupLayer: document.querySelector("#ungroup-layer"),
  duplicateLayer: document.querySelector("#duplicate-layer"),
  moveLayerUp: document.querySelector("#move-layer-up"),
  moveLayerDown: document.querySelector("#move-layer-down"),
  deleteLayer: document.querySelector("#delete-layer"),
  textFontFamily: document.querySelector("#text-font-family"),
  textFontWeight: document.querySelector("#text-font-weight"),
  textFontSize: document.querySelector("#text-font-size"),
  textLineHeight: document.querySelector("#text-line-height"),
  textColorValue: document.querySelector("#text-color-value"),
  textStrokeValue: document.querySelector("#text-stroke-value"),
  textStrokeWidth: document.querySelector("#text-stroke-width"),
  textBackgroundValue: document.querySelector("#text-background-value"),
  textAlign: document.querySelector("#text-align"),
  layerBlendMode: document.querySelector("#layer-blend-mode"),
  layerSearch: document.querySelector("#layer-search"),
  layersMore: document.querySelector("#layers-more"),
  layerOpacity: document.querySelector("#layer-opacity"),
  layerOpacitySlider: document.querySelector("#layer-opacity-slider"),
  layerOpacityPopover: document.querySelector("#layer-opacity-popover"),
  layerOpacityValue: document.querySelector("#layer-opacity-value"),
  historyList: document.querySelector("#history-list"),
  historyCount: document.querySelector("#history-count"),
  adjustmentTypeLabel: document.querySelector("#adjustment-type-label"),
  adjustmentBrightness: document.querySelector("#adjustment-brightness"),
  adjustmentBrightnessValue: document.querySelector("#adjustment-brightness-value"),
  adjustmentContrast: document.querySelector("#adjustment-contrast"),
  adjustmentContrastValue: document.querySelector("#adjustment-contrast-value"),
  adjustmentHue: document.querySelector("#adjustment-hue"),
  adjustmentHueValue: document.querySelector("#adjustment-hue-value"),
  adjustmentSaturation: document.querySelector("#adjustment-saturation"),
  adjustmentSaturationValue: document.querySelector("#adjustment-saturation-value"),
  shapeType: document.querySelector("#shape-type"),
  shapeStrokeWidth: document.querySelector("#shape-stroke-width"),
  brushSize: document.querySelector("#brush-size"),
  brushOpacity: document.querySelector("#brush-opacity"),
  brushColor: document.querySelector("#brush-color"),
  backgroundColor: document.querySelector("#background-color"),
  toolColorStack: document.querySelector(".tool-color-stack"),
  swapColors: document.querySelector("#swap-colors"),
  resetColors: document.querySelector("#reset-colors"),
  brushColorValue: document.querySelector("#brush-color-value"),
  vectorFillValue: document.querySelector("#vector-fill-value"),
  vectorFillTransparent: document.querySelector("#vector-fill-transparent"),
  vectorFillState: document.querySelector("#vector-fill-state"),
  vectorStrokeValue: document.querySelector("#vector-stroke-value"),
  vectorStrokeTransparent: document.querySelector("#vector-stroke-transparent"),
  vectorStrokeState: document.querySelector("#vector-stroke-state"),
  vectorStrokeWidth: document.querySelector("#vector-stroke-width"),
  vectorStrokeWidthState: document.querySelector("#vector-stroke-width-state"),
  brushSizeValue: document.querySelector("#brush-size-value"),
  brushOpacityValue: document.querySelector("#brush-opacity-value"),
  transformLayerName: document.querySelector("#transform-layer-name"),
  transformX: document.querySelector("#transform-x"),
  transformY: document.querySelector("#transform-y"),
  transformWidth: document.querySelector("#transform-width"),
  transformHeight: document.querySelector("#transform-height"),
  transformRotation: document.querySelector("#transform-rotation"),
  statusFile: document.querySelector("#status-file"),
  statusTool: document.querySelector("#status-tool"),
  statusZoom: document.querySelector("#status-zoom"),
  statusPointer: document.querySelector("#status-pointer"),
  statWidth: document.querySelector("#stat-width"),
  statHeight: document.querySelector("#stat-height"),
  statZoom: document.querySelector("#stat-zoom"),
  statSelection: document.querySelector("#stat-selection"),
  activeLayerName: document.querySelector("#active-layer-name"),
  selectionMenu: document.querySelector("#selection-menu"),
  fillSelection: document.querySelector("#fill-selection"),
  layerContextMenu: document.querySelector("#layer-context-menu"),
  layerBringToFront: document.querySelector("#layer-bring-to-front"),
  layerBringForward: document.querySelector("#layer-bring-forward"),
  layerSendBackward: document.querySelector("#layer-send-backward"),
  layerSendToBack: document.querySelector("#layer-send-to-back"),
  contextualBar: document.querySelector("#contextual-bar"),
  contextualBarHandle: document.querySelector("#contextual-bar-handle"),
  contextualBarTitle: document.querySelector("#contextual-bar-title"),
  contextualBarSubtitle: document.querySelector("#contextual-bar-subtitle"),
  contextualBarPin: document.querySelector("#contextual-bar-pin"),
  contextualBarClose: document.querySelector("#contextual-bar-close"),
  contextualRasterWidth: document.querySelector("#contextual-raster-width"),
  contextualRasterHeight: document.querySelector("#contextual-raster-height"),
  contextualRasterOpacity: document.querySelector("#contextual-raster-opacity"),
  contextualRasterOpacityValue: document.querySelector("#contextual-raster-opacity-value"),
  contextualRasterRotateLeft: document.querySelector("#contextual-raster-rotate-left"),
  contextualRasterRotateRight: document.querySelector("#contextual-raster-rotate-right"),
  contextualRasterDuplicate: document.querySelector("#contextual-raster-duplicate"),
  contextualRasterFitCanvas: document.querySelector("#contextual-raster-fit-canvas"),
  contextualTextFontFamily: document.querySelector("#contextual-text-font-family"),
  contextualTextFontSize: document.querySelector("#contextual-text-font-size"),
  contextualTextAlign: document.querySelector("#contextual-text-align"),
  contextualTextColor: document.querySelector("#contextual-text-color"),
  contextualTextEdit: document.querySelector("#contextual-text-edit"),
  contextualTextDuplicate: document.querySelector("#contextual-text-duplicate"),
  contextualVectorFill: document.querySelector("#contextual-vector-fill"),
  contextualVectorStroke: document.querySelector("#contextual-vector-stroke"),
  contextualVectorStrokeWidth: document.querySelector("#contextual-vector-stroke-width"),
  contextualVectorEditPath: document.querySelector("#contextual-vector-edit-path"),
  contextualVectorDuplicate: document.querySelector("#contextual-vector-duplicate"),
  contextualSelectionFill: document.querySelector("#contextual-selection-fill"),
  contextualSelectionClear: document.querySelector("#contextual-selection-clear"),
  contextualSelectionCrop: document.querySelector("#contextual-selection-crop"),
  contextualSelectionDeselect: document.querySelector("#contextual-selection-deselect"),
  contextualCropSize: document.querySelector("#contextual-crop-size"),
  contextualCropApply: document.querySelector("#contextual-crop-apply"),
  contextualCropCancel: document.querySelector("#contextual-crop-cancel"),
  textEditor: document.querySelector("#text-editor"),
  dialog: document.querySelector("#app-dialog"),
  dialogPanel: document.querySelector("#app-dialog-panel"),
  dialogForm: document.querySelector("#app-dialog-form"),
  dialogTitle: document.querySelector("#app-dialog-title"),
  dialogMessage: document.querySelector("#app-dialog-message"),
  dialogFields: document.querySelector("#app-dialog-fields"),
  dialogError: document.querySelector("#app-dialog-error"),
  dialogExtra: document.querySelector("#app-dialog-extra"),
  dialogCancel: document.querySelector("#app-dialog-cancel"),
  dialogConfirm: document.querySelector("#app-dialog-confirm"),
  dialogClose: document.querySelector("#app-dialog-close")
};

const limits = {
  history: 30,
  maxZoom: 16,
  minZoom: 0.05,
  inspectorMinWidth: 288,
  inspectorMaxWidth: 560
};

const state = {
  documents: [],
  activeDocumentId: null,
  projectTabsSignature: "",
  homePresetSignature: "",
  historyPanelSignature: "",
  activeInspectorPanel: "properties",
  inspectorWidth: 288,
  inspectorResize: null,
  layerPanelFilter: "all",
  layerSearchQuery: "",
  panelToggles: {
    rulers: false,
    grid: false,
    snap: true,
    guideColumns: false,
    guideRows: false,
    guideFrame: false
  },
  inspectorSectionModes: Object.fromEntries(
    inspectorSections.map((section) => [
      section.dataset.inspectorSection,
      inspectorSectionDefaultModes[section.dataset.inspectorSection] ?? "auto"
    ])
  ),
  collapsedInspectorSections: Object.fromEntries(
    inspectorSections.map((section) => [section.dataset.inspectorSection, false])
  ),
  doc: null,
  collapsedLayerGroups: {},
  activeLayerId: null,
  selectedLayerIds: [],
  layerSelectionAnchorId: null,
  layerPanelDrag: null,
  projectName: "Untitled",
  projectPath: null,
  tool: "transform",
  transientTool: null,
  textFontFamily: 'Inter, "Segoe UI", sans-serif',
  textFontWeight: "400",
  textFontSize: 48,
  textLineHeight: 1.2,
  textColor: "#ff6b3d",
  textOpacity: 1,
  textStrokeColor: "transparent",
  textStrokeWidth: 0,
  textBackgroundColor: "transparent",
  textAlign: "left",
  shapeType: "rectangle",
  shapeStrokeWidth: 6,
  brushSize: 24,
  brushOpacity: 1,
  brushColor: "#ff6b3d",
  regionTolerance: 32,
  regionContiguous: true,
  selectionShape: "rectangle",
  gradientType: "linear",
  backgroundColor: "#ffffff",
  zoom: 1,
  panX: 0,
  panY: 0,
  hoverCanvasPoint: null,
  hoverDocPoint: null,
  selection: null,
  selectionMaskCanvas: null,
  selectionMaskBounds: null,
  cropRect: null,
  contextualBarVisible: true,
  contextualBarPinned: false,
  contextualBarPosition: null,
  contextualBarDrag: null,
  artboards: [],
  activeArtboardId: null,
  shapeDraft: null,
  lassoDraft: null,
  gradientDraft: null,
  rulerDraft: null,
  penDraft: null,
  textEditorLayerId: null,
  textEditorIsNewLayer: false,
  textEditorOriginalText: "",
  lastPaintStroke: null,
  activeLayerMaskId: null,
  clipToDocument: false,
  thumbnailCacheVersion: 0,
  pointer: {
    id: null,
    mode: null,
    startCanvas: null,
    startDoc: null,
    startPan: null,
    lastDoc: null,
    startLayerRect: null,
    startLayerRotation: null,
    vectorHandle: null,
    vectorEditSnapshot: null,
    resizeHandle: null,
    combineMode: null,
    mutated: false
  },
  guides: {
    vertical: null,
    horizontal: null,
    rotation: null
  },
  history: [],
  historyIndex: -1,
  savedRevision: null,
  nextHistoryRevision: 0,
  exportPreferences: {
    format: "png",
    target: "canvas",
    lockAspectRatio: true,
    qualityByFormat: {
      jpg: 92,
      webp: 92,
      avif: 90
    }
  },
  openMenuId: null,
  openMenuSource: null,
  dialogSession: null
};

function normalizeZoom(value, fallback = 1) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0
    ? clamp(parsed, limits.minZoom, limits.maxZoom)
    : fallback;
}

const newDocumentPresets = [
  {
    id: "full-hd",
    label: "Full HD",
    description: "1920 x 1080 px",
    detail: "Screen",
    width: 1920,
    height: 1080,
    resolution: 72,
    backgroundContents: "transparent"
  },
  {
    id: "square-post",
    label: "Square Post",
    description: "1080 x 1080 px",
    detail: "Social",
    width: 1080,
    height: 1080,
    resolution: 72,
    backgroundContents: "transparent"
  },
  {
    id: "story",
    label: "Story",
    description: "1080 x 1920 px",
    detail: "Social",
    width: 1080,
    height: 1920,
    resolution: 72,
    backgroundContents: "transparent"
  },
  {
    id: "desktop-hd",
    label: "Desktop HD",
    description: "1366 x 768 px",
    detail: "Display",
    width: 1366,
    height: 768,
    resolution: 72,
    backgroundContents: "transparent"
  },
  {
    id: "a4-print",
    label: "A4 Print",
    description: "2480 x 3508 px",
    detail: "300 ppi",
    width: 2480,
    height: 3508,
    resolution: 300,
    backgroundContents: "white"
  },
  {
    id: "letter-print",
    label: "Letter Print",
    description: "2550 x 3300 px",
    detail: "300 ppi",
    width: 2550,
    height: 3300,
    resolution: 300,
    backgroundContents: "white"
  },
  {
    id: "web-banner",
    label: "Web Banner",
    description: "1600 x 900 px",
    detail: "Wide",
    width: 1600,
    height: 900,
    resolution: 72,
    backgroundContents: "transparent"
  }
];

const supportedImportExtensions = new Set(["png", "jpg", "jpeg", "webp", "avif", "svg"]);
const supportedImportMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/svg+xml"
]);
const exportFormats = {
  png: {
    label: "PNG",
    extension: "png",
    mimeType: "image/png",
    filters: [{ name: "PNG Image", extensions: ["png"] }]
  },
  jpg: {
    label: "JPEG",
    extension: "jpg",
    mimeType: "image/jpeg",
    quality: 0.92,
    background: "#ffffff",
    filters: [{ name: "JPEG Image", extensions: ["jpg", "jpeg"] }]
  },
  webp: {
    label: "WebP",
    extension: "webp",
    mimeType: "image/webp",
    quality: 0.92,
    filters: [{ name: "WebP Image", extensions: ["webp"] }]
  },
  avif: {
    label: "AVIF",
    extension: "avif",
    mimeType: "image/avif",
    quality: 0.9,
    filters: [{ name: "AVIF Image", extensions: ["avif"] }]
  },
  svg: {
    label: "SVG",
    extension: "svg",
    mimeType: "image/svg+xml",
    filters: [{ name: "SVG Image", extensions: ["svg"] }]
  }
};
const blendModes = {
  normal: { label: "Normal", canvas: "source-over", css: "normal" },
  multiply: { label: "Multiply", canvas: "multiply", css: "multiply" },
  screen: { label: "Screen", canvas: "screen", css: "screen" },
  overlay: { label: "Overlay", canvas: "overlay", css: "overlay" },
  darken: { label: "Darken", canvas: "darken", css: "darken" },
  lighten: { label: "Lighten", canvas: "lighten", css: "lighten" },
  "soft-light": { label: "Soft Light", canvas: "soft-light", css: "soft-light" }
};
const adjustmentLayerTypes = {
  grayscale: {
    label: "Grayscale Adjustment",
    shortLabel: "B/W",
    defaults: {}
  },
  invert: {
    label: "Invert Adjustment",
    shortLabel: "INV",
    defaults: {}
  },
  brightnessContrast: {
    label: "Brightness/Contrast Adjustment",
    shortLabel: "B/C",
    defaults: {
      brightness: 0,
      contrast: 0
    }
  },
  hueSaturation: {
    label: "Hue/Saturation Adjustment",
    shortLabel: "H/S",
    defaults: {
      hue: 0,
      saturation: 0
    }
  }
};
const adjustmentLayerControlMap = {
  grayscale: [],
  invert: [],
  brightnessContrast: ["brightness", "contrast"],
  hueSaturation: ["hue", "saturation"]
};
const toolLabels = {
  move: "Pan",
  transform: "Transform",
  direct: "Direct Select",
  select: "Marquee",
  crop: "Crop",
  zoom: "Zoom",
  text: "Text",
  pen: "Pen",
  shape: "Shape",
  line: "Line",
  eyedropper: "Eyedropper",
  bucket: "Paint Bucket",
  gradient: "Gradient",
  "color-range": "Color Range",
  "magic-wand": "Magic Wand",
  lasso: "Lasso",
  brush: "Brush",
  pencil: "Pencil",
  eraser: "Eraser",
  "magic-eraser": "Magic Eraser",
  ruler: "Ruler",
  artboard: "Artboard"
};
const lineBasedShapeTypes = new Set(["line", "arrow", "callout"]);
const outlineOnlyShapeTypes = new Set(["outline-rectangle", "line", "arrow", "callout"]);

const transparencyPattern = createTransparencyPattern();
let tauriBridge = detectTauriBridge();
let browserAvifExportSupport = null;

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function bindIfFunction(target, key) {
  return typeof target?.[key] === "function" ? target[key].bind(target) : null;
}

function detectTauriBridge() {
  const tauriGlobal = globalThis.__TAURI__ ?? {};
  const internals = globalThis.__TAURI_INTERNALS__ ?? {};

  return {
    invoke: bindIfFunction(tauriGlobal.core, "invoke")
      ?? bindIfFunction(tauriGlobal, "invoke")
      ?? bindIfFunction(internals, "invoke"),
    openDialog: bindIfFunction(tauriGlobal.dialog, "open")
      ?? bindIfFunction(tauriGlobal, "open"),
    saveDialog: bindIfFunction(tauriGlobal.dialog, "save")
      ?? bindIfFunction(tauriGlobal, "save"),
    messageDialog: bindIfFunction(tauriGlobal.dialog, "message")
      ?? bindIfFunction(tauriGlobal, "message")
  };
}

function getTauriBridge() {
  tauriBridge = detectTauriBridge();
  return tauriBridge;
}

function supportsBrowserAvifExport() {
  if (browserAvifExportSupport !== null) {
    return browserAvifExportSupport;
  }

  try {
    const testCanvas = document.createElement("canvas");
    testCanvas.width = 1;
    testCanvas.height = 1;

    const testContext = testCanvas.getContext("2d");
    if (!testContext) {
      browserAvifExportSupport = false;
      return browserAvifExportSupport;
    }

    testContext.fillStyle = "#000000";
    testContext.fillRect(0, 0, 1, 1);
    browserAvifExportSupport = testCanvas.toDataURL("image/avif").startsWith("data:image/avif");
  } catch (error) {
    browserAvifExportSupport = false;
  }

  return browserAvifExportSupport;
}

function supportsExportFormat(formatKey) {
  if (!exportFormats[formatKey]) {
    return false;
  }

  if (formatKey !== "avif") {
    return true;
  }

  return Boolean(getTauriBridge().invoke) || supportsBrowserAvifExport();
}

function getAvailableExportFormats() {
  return Object.entries(exportFormats).filter(([formatKey]) => supportsExportFormat(formatKey));
}

function getPreferredExportFormat(preferred) {
  if (supportsExportFormat(preferred)) {
    return preferred;
  }

  return getAvailableExportFormats()[0]?.[0] ?? "png";
}

function syncExportFormatControl() {
  if (!ui.exportFormat) {
    return;
  }

  const currentValue = state.exportPreferences.format || ui.exportFormat.value;
  const options = getAvailableExportFormats().map(([value, format]) => new Option(format.label, value));
  ui.exportFormat.replaceChildren(...options);

  const nextValue = getPreferredExportFormat(currentValue);
  state.exportPreferences.format = nextValue;
  ui.exportFormat.value = nextValue;
}

function uid(prefix = "layer") {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, digits = 0) {
  return Number(value.toFixed(digits));
}

function basename(path = "") {
  const segments = String(path).split(/[\\/]/).filter(Boolean);
  return segments.at(-1) ?? String(path);
}

function normalizeBlendMode(blendMode) {
  return blendModes[blendMode] ? blendMode : "normal";
}

function getCanvasBlendMode(blendMode) {
  return blendModes[normalizeBlendMode(blendMode)].canvas;
}

function getCssBlendMode(blendMode) {
  return blendModes[normalizeBlendMode(blendMode)].css;
}

function withoutExtension(name = "") {
  return String(name).replace(/\.[^.]+$/, "");
}

function sanitizeFileStem(name = "photoshop-project") {
  const trimmed = withoutExtension(String(name).trim()) || "photoshop-project";
  return trimmed
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "-")
    .replace(/\s+/g, " ")
    .trim() || "photoshop-project";
}

function utf8ToBase64(value = "") {
  const bytes = new TextEncoder().encode(String(value));
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

function createSvgDataUrl(source) {
  return `data:image/svg+xml;base64,${utf8ToBase64(source)}`;
}

function createFilledMaskCanvas(width, height, alpha = 255) {
  const maskCanvas = createCanvasElement(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
  if (alpha > 0) {
    const maskContext = maskCanvas.getContext("2d");
    maskContext.fillStyle = `rgba(255, 255, 255, ${clamp(alpha / 255, 0, 1)})`;
    maskContext.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
  }
  return maskCanvas;
}

function cloneCanvas(sourceCanvas) {
  const nextCanvas = createCanvasElement(sourceCanvas.width, sourceCanvas.height);
  const nextContext = nextCanvas.getContext("2d");
  nextContext.drawImage(sourceCanvas, 0, 0);
  return nextCanvas;
}

function createBackgroundLayer(width, height, fill = "#ffffff") {
  const background = createLayer("Background", width, height, {
    hasContent: true,
    isBackground: true
  });
  background.ctx.fillStyle = fill;
  background.ctx.fillRect(0, 0, width, height);
  return background;
}

function resizeBackgroundLayerCanvas(layer, width, height) {
  const previousCanvas = layer.canvas;
  const nextCanvas = document.createElement("canvas");
  nextCanvas.width = width;
  nextCanvas.height = height;
  const nextContext = nextCanvas.getContext("2d");

  if (previousCanvas) {
    nextContext.drawImage(previousCanvas, 0, 0);
  }

  replaceLayerBitmap(layer, nextCanvas);
  layer.isBackground = true;
  layer.x = 0;
  layer.y = 0;
  layer.width = width;
  layer.height = height;
  layer.rotation = 0;
  layer.hasContent = true;
}

function normalizeDocumentMetadata(doc) {
  doc.resolution = Number.isFinite(doc?.resolution) && doc.resolution > 0
    ? Math.round(doc.resolution)
    : 72;
  doc.backgroundContents = ["transparent", "white", "black"].includes(doc?.backgroundContents)
    ? doc.backgroundContents
    : "white";
}

function getBackgroundFillForContents(backgroundContents = "white") {
  if (backgroundContents === "black") {
    return "#000000";
  }

  return "#ffffff";
}

function parseCanvasSize(value) {
  const normalized = String(value || "").trim();
  const match = normalized.match(/^(\d{1,5})\s*(?:x|×|by|,)\s*(\d{1,5})$/i)
    ?? normalized.match(/^(\d{1,5})\s+(\d{1,5})$/);

  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    return null;
  }

  return {
    width: clamp(Math.round(width), 1, 20000),
    height: clamp(Math.round(height), 1, 20000)
  };
}

function isDialogOpen() {
  return Boolean(state.dialogSession) && !ui.dialog.hidden;
}

function setDialogError(message = "") {
  const nextMessage = String(message || "").trim();
  ui.dialogError.textContent = nextMessage;
  ui.dialogError.hidden = !nextMessage;
}

function applyDialogButtonClass(button, className = "") {
  button.classList.toggle("is-danger", className === "is-danger");
}

function buildDialogFields(fields = []) {
  ui.dialogFields.textContent = "";
  ui.dialogFields.hidden = fields.length === 0;
  ui.dialogFields.classList.toggle(
    "app-dialog-fields--split",
    fields.length === 2 && fields.every((field) => field.type === "number")
  );

  for (const field of fields) {
    const wrapper = document.createElement("label");
    wrapper.className = "app-dialog-field";
    wrapper.dataset.fieldName = field.name;
    if (field.className) {
      wrapper.classList.add(field.className);
    }

    const label = document.createElement("span");
    label.textContent = field.label || field.name;

    let input;

    if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = field.rows ?? 4;
    } else if (field.type === "select") {
      input = document.createElement("select");
      for (const option of field.options ?? []) {
        const optionElement = document.createElement("option");
        if (typeof option === "string") {
          optionElement.value = option;
          optionElement.textContent = option;
        } else {
          optionElement.value = String(option.value);
          optionElement.textContent = option.label;
        }
        input.append(optionElement);
      }
    } else {
      input = document.createElement("input");
      input.type = field.type || "text";
    }

    input.name = field.name;

    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      input.autocomplete = "off";
    }

    if ("value" in field && field.value !== undefined && field.value !== null) {
      if (input instanceof HTMLInputElement && input.type === "checkbox") {
        input.checked = Boolean(field.value);
      } else {
        input.value = String(field.value);
      }
    }

    if (field.placeholder && "placeholder" in input) {
      input.placeholder = field.placeholder;
    }

    if (field.min !== undefined && "min" in input) {
      input.min = String(field.min);
    }

    if (field.max !== undefined && "max" in input) {
      input.max = String(field.max);
    }

    if (field.step !== undefined && "step" in input) {
      input.step = String(field.step);
    }

    if (field.inputMode && input instanceof HTMLInputElement) {
      input.inputMode = field.inputMode;
    }

    if (field.spellcheck !== undefined && ("spellcheck" in input)) {
      input.spellcheck = field.spellcheck;
    }

    if (field.disabled) {
      input.disabled = true;
    }

    if (input instanceof HTMLInputElement && input.type === "checkbox") {
      wrapper.classList.add("app-dialog-field--checkbox");
      wrapper.append(input, label);
    } else {
      wrapper.append(label, input);
    }

    if (field.description) {
      const description = document.createElement("small");
      description.className = "app-dialog-field-hint";
      description.textContent = field.description;
      wrapper.append(description);
    }

    ui.dialogFields.append(wrapper);
  }
}

function getDialogValues() {
  const values = {};

  for (const field of ui.dialogFields.querySelectorAll("[name]")) {
    values[field.name] = field instanceof HTMLInputElement && field.type === "checkbox"
      ? field.checked
      : field.value;
  }

  return values;
}

function closeDialog(result) {
  const session = state.dialogSession;
  if (!session) {
    return;
  }

  state.dialogSession = null;
  ui.dialog.hidden = true;
  ui.dialogPanel.dataset.kind = "default";
  document.body.classList.remove("has-dialog");
  setDialogError("");
  ui.dialogFields.textContent = "";
  ui.dialogFields.hidden = false;
  ui.dialogMessage.hidden = true;
  ui.dialogExtra.hidden = true;
  ui.dialogExtra.textContent = "";
  ui.dialogExtra.dataset.actionValue = "";
  applyDialogButtonClass(ui.dialogExtra);
  applyDialogButtonClass(ui.dialogConfirm);

  if (session.previousFocus && typeof session.previousFocus.focus === "function") {
    session.previousFocus.focus({ preventScroll: true });
  }

  session.resolve(result);
}

function cancelDialog() {
  if (!state.dialogSession?.allowCancel) {
    return;
  }

  closeDialog({
    action: "cancel",
    confirmed: false,
    values: null
  });
}

async function submitDialog() {
  const session = state.dialogSession;
  if (!session) {
    return;
  }

  const values = getDialogValues();
  const validationMessage = typeof session.validate === "function"
    ? await session.validate(values)
    : null;

  if (validationMessage) {
    setDialogError(validationMessage);
    const firstField = ui.dialogFields.querySelector("[name]");
    if (firstField && typeof firstField.focus === "function") {
      firstField.focus({ preventScroll: true });
      if ("select" in firstField) {
        firstField.select();
      }
    }
    return;
  }

  closeDialog({
    action: "confirm",
    confirmed: true,
    values
  });
}

function showDialog(config = {}) {
  if (state.dialogSession) {
    closeDialog({
      confirmed: false,
      values: null
    });
  }

  closeMenus();
  closeContextMenus();

  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const fields = Array.isArray(config.fields) ? config.fields : [];
  const allowCancel = config.allowCancel !== false;

  ui.dialogTitle.textContent = config.title || "Dialog";
  ui.dialogMessage.textContent = config.message || "";
  ui.dialogMessage.hidden = !config.message;
  ui.dialogConfirm.textContent = config.confirmLabel || "OK";
  ui.dialogCancel.textContent = config.cancelLabel || "Cancel";
  ui.dialogCancel.hidden = !allowCancel;
  ui.dialogClose.hidden = !allowCancel;
  ui.dialogExtra.hidden = !config.extraAction;
  ui.dialogExtra.textContent = config.extraAction?.label || "";
  ui.dialogExtra.dataset.actionValue = config.extraAction?.value || "extra";
  applyDialogButtonClass(ui.dialogExtra, config.extraAction?.className || "");
  applyDialogButtonClass(ui.dialogConfirm, config.confirmClassName || "");
  ui.dialogPanel.dataset.kind = config.kind || "default";
  buildDialogFields(fields);
  setDialogError("");

  ui.dialog.hidden = false;
  document.body.classList.add("has-dialog");

  if (typeof window.renderIcons === "function") {
    window.renderIcons(ui.dialog);
  }

  return new Promise((resolve) => {
    state.dialogSession = {
      resolve,
      validate: config.validate,
      allowCancel,
      closeOnOverlay: config.closeOnOverlay !== false,
      previousFocus
    };

    requestAnimationFrame(() => {
      const firstField = ui.dialogFields.querySelector("[name]");
      const focusTarget = firstField ?? ui.dialogConfirm;
      if (focusTarget && typeof focusTarget.focus === "function") {
        focusTarget.focus({ preventScroll: true });
        if ("select" in focusTarget && config.selectText !== false) {
          focusTarget.select();
        }
      }
    });
  });
}

async function confirmDialog(config = {}) {
  const response = await showDialog({
    confirmLabel: "OK",
    cancelLabel: "Cancel",
    closeOnOverlay: false,
    ...config
  });

  return response.action === "confirm";
}

async function promptUnsavedChanges(session, actionLabel = "close") {
  const projectName = session?.projectName || "Untitled";
  return showDialog({
    title: "Unsaved Changes",
    message: `Save changes to ${projectName} before you ${actionLabel} it?`,
    confirmLabel: "Save",
    cancelLabel: "Cancel",
    extraAction: {
      label: "Discard",
      value: "discard",
      className: "is-danger"
    },
    closeOnOverlay: false
  });
}

async function promptForCanvasSize(title, defaultWidth, defaultHeight, confirmLabel = "Apply") {
  const response = await showDialog({
    title,
    message: "Enter the canvas width and height in pixels.",
    confirmLabel,
    cancelLabel: "Cancel",
    fields: [
      {
        name: "width",
        label: "Width",
        type: "number",
        value: defaultWidth,
        min: 1,
        max: 20000,
        step: 1,
        inputMode: "numeric",
        spellcheck: false
      },
      {
        name: "height",
        label: "Height",
        type: "number",
        value: defaultHeight,
        min: 1,
        max: 20000,
        step: 1,
        inputMode: "numeric",
        spellcheck: false
      }
    ],
    validate(values) {
      const size = parseCanvasSize(`${values.width} x ${values.height}`);
      return size ? null : "Enter width and height between 1 and 20000 pixels.";
    }
  });

  if (!response.confirmed) {
    return null;
  }

  return parseCanvasSize(`${response.values.width} x ${response.values.height}`);
}

function formatBackgroundContentsLabel(backgroundContents = "white") {
  switch (backgroundContents) {
    case "transparent":
      return "Transparent";
    case "black":
      return "Black";
    case "white":
    default:
      return "White";
  }
}

function buildClipboardPreset(width, height) {
  return {
    id: "clipboard",
    label: "Clipboard",
    description: `${width} x ${height} px`,
    detail: "Clipboard image",
    width,
    height,
    resolution: 72,
    backgroundContents: "transparent"
  };
}

async function readClipboardPreset() {
  if (typeof navigator === "undefined" || !navigator.clipboard?.read) {
    return null;
  }

  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const imageType = item.types.find((type) => type.startsWith("image/"));
      if (!imageType) {
        continue;
      }

      const blob = await item.getType(imageType);
      const objectUrl = URL.createObjectURL(blob);
      try {
        const image = await loadImage(objectUrl);
        const width = image.naturalWidth || image.width;
        const height = image.naturalHeight || image.height;
        if (width > 0 && height > 0) {
          return buildClipboardPreset(width, height);
        }
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    }
  } catch (error) {
    return null;
  }

  return null;
}

function getNewDocumentPresetOptions(clipboardPreset = null) {
  return clipboardPreset ? [clipboardPreset, ...newDocumentPresets] : [...newDocumentPresets];
}

function getNewDocumentPresetSignature(presets) {
  return JSON.stringify(
    presets.map((preset) => ({
      id: preset.id,
      width: preset.width,
      height: preset.height,
      resolution: preset.resolution,
      backgroundContents: preset.backgroundContents
    }))
  );
}

function getPresetFrameSize(preset) {
  const width = Math.max(1, Number(preset?.width) || 1);
  const height = Math.max(1, Number(preset?.height) || 1);
  const maxWidth = 110;
  const maxHeight = 64;
  const scale = Math.min(maxWidth / width, maxHeight / height);

  return {
    width: Math.max(12, Math.round(width * scale)),
    height: Math.max(12, Math.round(height * scale))
  };
}

function renderPresetGrid(container, presets, selectedPresetId = "", onSelect = null) {
  container.textContent = "";

  for (const preset of presets) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-card";
    if (preset.id === selectedPresetId) {
      button.classList.add("is-selected");
    }

    const preview = document.createElement("div");
    preview.className = "preset-card-preview";
    const frame = document.createElement("div");
    frame.className = "preset-card-frame";
    frame.classList.add(`is-${preset.backgroundContents || "white"}`);
    const frameSize = getPresetFrameSize(preset);
    frame.style.setProperty("--preset-frame-width", `${frameSize.width}px`);
    frame.style.setProperty("--preset-frame-height", `${frameSize.height}px`);
    preview.append(frame);

    const detail = document.createElement("div");
    detail.className = "preset-card-detail";

    const label = document.createElement("strong");
    label.textContent = preset.label;

    const description = document.createElement("span");
    description.textContent = preset.description;

    const meta = document.createElement("small");
    meta.textContent = `${preset.detail} · ${formatBackgroundContentsLabel(preset.backgroundContents)}`;

    detail.append(label, description, meta);
    button.append(preview, detail);

    if (typeof onSelect === "function") {
      button.addEventListener("click", () => onSelect(preset));
    } else {
      button.disabled = true;
    }

    container.append(button);
  }
}

function getMatchingNewDocumentPresetId(values, presets) {
  const width = Math.round(Number(values.width));
  const height = Math.round(Number(values.height));
  const resolution = Math.round(Number(values.resolution));
  const backgroundContents = values.backgroundContents;

  return presets.find((preset) => (
    preset.width === width
    && preset.height === height
    && preset.resolution === resolution
    && preset.backgroundContents === backgroundContents
  ))?.id ?? "";
}

function renameDocumentSession(documentId, nextName) {
  const session = state.documents.find((entry) => entry.id === documentId);
  if (!session) {
    return false;
  }

  const normalizedName = String(nextName || "").trim();
  if (!normalizedName || normalizedName === session.projectName) {
    return false;
  }

  session.projectName = normalizedName;
  session.savedRevision = null;

  if (documentId === state.activeDocumentId) {
    state.projectName = normalizedName;
    state.savedRevision = null;
    updateDocumentTitle();
  }

  renderProjectTabs(true);
  refresh();
  return true;
}

async function promptRenameDocumentSession(documentId) {
  syncActiveDocumentSession();
  const session = state.documents.find((entry) => entry.id === documentId);
  if (!session) {
    return false;
  }

  const response = await showDialog({
    title: "Rename Tab",
    message: "Change the document name shown in the tab bar.",
    confirmLabel: "Rename",
    cancelLabel: "Cancel",
    fields: [
      {
        name: "projectName",
        label: "Tab Name",
        type: "text",
        value: session.projectName || "Untitled",
        spellcheck: false
      }
    ],
    validate(values) {
      return String(values.projectName || "").trim() ? null : "Enter a tab name.";
    }
  });

  if (!response.confirmed) {
    return false;
  }

  return renameDocumentSession(documentId, response.values.projectName);
}

function createDocumentFromSettings(settings = {}) {
  const width = Math.max(1, Math.round(Number(settings.width) || 1280));
  const height = Math.max(1, Math.round(Number(settings.height) || 720));
  const resolution = Math.max(1, Math.round(Number(settings.resolution) || 72));
  const backgroundContents = ["transparent", "white", "black"].includes(settings.backgroundContents)
    ? settings.backgroundContents
    : "white";
  const projectName = String(settings.projectName || "").trim() || nextUntitledProjectName();

  setDocument(buildBlankDocument(width, height, {
    resolution,
    backgroundContents
  }), {
    projectName,
    projectPath: null,
    historyLabel: "New Document"
  });
}

function getDefaultExportQuality(formatKey) {
  const format = exportFormats[formatKey];
  if (!format || !Number.isFinite(format.quality)) {
    return 100;
  }

  return Math.round(clamp(format.quality, 0.01, 1) * 100);
}

function getSelectedExportFormat() {
  const preferred = state.exportPreferences.format || ui.exportFormat.value;
  return getPreferredExportFormat(preferred);
}

function getExportDialogMessage(formatKey) {
  switch (formatKey) {
    case "jpg":
      return "JPEG export flattens transparency onto a white background. Lower quality reduces file size.";
    case "webp":
      return "WebP keeps good quality at smaller file sizes. Lower quality increases compression.";
    case "avif":
      return "AVIF can compress more aggressively than JPEG or WebP. Lower quality increases compression.";
    case "svg":
      return "SVG export keeps vector layers as SVG markup and embeds raster layers as PNG images.";
    case "png":
    default:
      return "PNG export is lossless and preserves transparency.";
  }
}

function normalizeExportSettings(values) {
  const formatKey = supportsExportFormat(values?.format) ? values.format : getSelectedExportFormat();
  const targetOptions = new Set(getExportTargetOptions().map((option) => option.value));
  const targetKey = targetOptions.has(values?.target) ? values.target : getDefaultExportTargetKey(formatKey);
  const width = Math.round(Number(values?.width));
  const height = Math.round(Number(values?.height));

  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1 || width > 20000 || height > 20000) {
    return null;
  }

  const settings = {
    formatKey,
    targetKey,
    width,
    height,
    lockAspectRatio: Boolean(values?.lockAspectRatio)
  };

  if (Number.isFinite(exportFormats[formatKey].quality)) {
    const quality = Math.round(Number(values?.quality));
    if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
      return null;
    }
    settings.quality = quality;
  }

  return settings;
}

async function promptForExportSettings(initialFormatKey = getSelectedExportFormat()) {
  if (!state.doc) {
    return null;
  }

  syncExportFormatControl();
  const availableFormats = getAvailableExportFormats();
  const initialFormat = getPreferredExportFormat(initialFormatKey);
  const exportTargetOptions = getExportTargetOptions();
  const initialTargetKey = exportTargetOptions.some((option) => option.value === state.exportPreferences.target)
    ? state.exportPreferences.target
    : getDefaultExportTargetKey(initialFormat);
  const initialTarget = getExportTargetDefinition(initialTargetKey);
  const qualityByFormat = {
    jpg: state.exportPreferences.qualityByFormat.jpg ?? getDefaultExportQuality("jpg"),
    webp: state.exportPreferences.qualityByFormat.webp ?? getDefaultExportQuality("webp"),
    avif: state.exportPreferences.qualityByFormat.avif ?? getDefaultExportQuality("avif")
  };

  const responsePromise = showDialog({
    title: "Export",
    message: getExportDialogMessage(initialFormat),
    confirmLabel: `Export ${exportFormats[initialFormat].label}`,
    cancelLabel: "Cancel",
    closeOnOverlay: false,
    fields: [
      {
        name: "format",
        label: "File Type",
        type: "select",
        value: initialFormat,
        options: availableFormats.map(([value, format]) => ({
          value,
          label: format.label
        }))
      },
      {
        name: "target",
        label: "Export Area",
        type: "select",
        value: initialTargetKey,
        options: exportTargetOptions
      },
      {
        name: "width",
        label: "Width",
        type: "number",
        value: Math.max(1, Math.round(initialTarget.rect.width)),
        min: 1,
        max: 20000,
        step: 1,
        inputMode: "numeric",
        spellcheck: false
      },
      {
        name: "height",
        label: "Height",
        type: "number",
        value: Math.max(1, Math.round(initialTarget.rect.height)),
        min: 1,
        max: 20000,
        step: 1,
        inputMode: "numeric",
        spellcheck: false
      },
      {
        name: "lockAspectRatio",
        label: "Preserve aspect ratio",
        type: "checkbox",
        value: state.exportPreferences.lockAspectRatio !== false
      },
      {
        name: "quality",
        label: "Quality",
        type: "number",
        value: qualityByFormat[initialFormat] ?? getDefaultExportQuality(initialFormat),
        min: 1,
        max: 100,
        step: 1,
        inputMode: "numeric",
        spellcheck: false,
        description: "1 is the smallest file. 100 is the highest quality."
      }
    ],
    validate(values) {
      const formatKey = supportsExportFormat(values.format) ? values.format : initialFormat;
      const exportTarget = getExportTargetDefinition(values.target);
      const width = Math.round(Number(values.width));
      const height = Math.round(Number(values.height));

      if (!exportTarget.rect) {
        return "Choose a valid export area.";
      }

      if (!Number.isFinite(width) || width < 1 || width > 20000) {
        return "Enter an export width between 1 and 20000 pixels.";
      }

      if (!Number.isFinite(height) || height < 1 || height > 20000) {
        return "Enter an export height between 1 and 20000 pixels.";
      }

      if (Number.isFinite(exportFormats[formatKey].quality)) {
        const quality = Math.round(Number(values.quality));
        if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
          return "Enter a quality value between 1 and 100.";
        }
      }

      return null;
    }
  });

  const formatField = ui.dialogFields.querySelector("[name='format']");
  const targetField = ui.dialogFields.querySelector("[name='target']");
  const widthField = ui.dialogFields.querySelector("[name='width']");
  const heightField = ui.dialogFields.querySelector("[name='height']");
  const lockField = ui.dialogFields.querySelector("[name='lockAspectRatio']");
  const qualityField = ui.dialogFields.querySelector("[name='quality']");
  const qualityWrapper = ui.dialogFields.querySelector("[data-field-name='quality']");
  const qualityHint = qualityWrapper?.querySelector(".app-dialog-field-hint") ?? null;
  let syncingAspect = false;
  let syncingTarget = false;

  const getCurrentTarget = () => getExportTargetDefinition(targetField?.value || initialTargetKey);
  const getCurrentAspectRatio = () => {
    const currentTarget = getCurrentTarget();
    return currentTarget.rect.width / Math.max(currentTarget.rect.height, 0.0001);
  };

  const syncAspectFromWidth = () => {
    if (!lockField?.checked || syncingAspect) {
      return;
    }

    const nextWidth = Math.round(Number(widthField?.value));
    if (!Number.isFinite(nextWidth) || nextWidth < 1) {
      return;
    }

    const aspectRatio = getCurrentAspectRatio();
    syncingAspect = true;
    heightField.value = String(Math.max(1, Math.round(nextWidth / aspectRatio)));
    syncingAspect = false;
  };

  const syncAspectFromHeight = () => {
    if (!lockField?.checked || syncingAspect) {
      return;
    }

    const nextHeight = Math.round(Number(heightField?.value));
    if (!Number.isFinite(nextHeight) || nextHeight < 1) {
      return;
    }

    const aspectRatio = getCurrentAspectRatio();
    syncingAspect = true;
    widthField.value = String(Math.max(1, Math.round(nextHeight * aspectRatio)));
    syncingAspect = false;
  };

  const syncTargetDimensions = () => {
    if (!targetField || syncingTarget) {
      return;
    }

    const exportTarget = getCurrentTarget();
    syncingTarget = true;
    widthField.value = String(Math.max(1, Math.round(exportTarget.rect.width)));
    heightField.value = String(Math.max(1, Math.round(exportTarget.rect.height)));
    syncingTarget = false;
  };

  const syncFormatState = () => {
    const formatKey = supportsExportFormat(formatField?.value) ? formatField.value : initialFormat;
    const format = exportFormats[formatKey];
    const supportsQuality = Number.isFinite(format.quality);

    ui.dialogMessage.textContent = getExportDialogMessage(formatKey);
    ui.dialogMessage.hidden = false;
    ui.dialogConfirm.textContent = `Export ${format.label}`;

    if (qualityWrapper) {
      qualityWrapper.hidden = !supportsQuality;
    }

    if (qualityField) {
      qualityField.disabled = !supportsQuality;
      qualityField.value = String(qualityByFormat[formatKey] ?? getDefaultExportQuality(formatKey));
    }

    if (qualityHint) {
      qualityHint.textContent = formatKey === "avif"
        ? "AVIF favors compression efficiency. Higher values keep more detail."
        : "1 is the smallest file. 100 is the highest quality.";
    }
  };

  formatField?.addEventListener("change", syncFormatState);
  targetField?.addEventListener("change", () => {
    syncTargetDimensions();
    if (lockField?.checked) {
      syncAspectFromWidth();
    }
  });
  widthField?.addEventListener("input", syncAspectFromWidth);
  heightField?.addEventListener("input", syncAspectFromHeight);
  lockField?.addEventListener("change", () => {
    if (lockField.checked) {
      syncAspectFromWidth();
    }
  });
  qualityField?.addEventListener("input", () => {
    const formatKey = supportsExportFormat(formatField?.value) ? formatField.value : initialFormat;
    const nextQuality = Math.round(Number(qualityField.value));
    if (Number.isFinite(nextQuality)) {
      qualityByFormat[formatKey] = clamp(nextQuality, 1, 100);
    }
  });

  syncFormatState();
  syncTargetDimensions();

  const response = await responsePromise;
  if (!response.confirmed) {
    return null;
  }

  const settings = normalizeExportSettings(response.values);
  if (!settings) {
    return null;
  }

  state.exportPreferences.format = settings.formatKey;
  state.exportPreferences.target = settings.targetKey;
  state.exportPreferences.lockAspectRatio = settings.lockAspectRatio;
  state.exportPreferences.qualityByFormat = {
    ...state.exportPreferences.qualityByFormat,
    ...qualityByFormat
  };
  ui.exportFormat.value = settings.formatKey;

  return settings;
}

function updateDocumentTitle() {
  if (!state.doc) {
    document.title = "Photoshop MVP";
    return;
  }

  const dirtyMarker = isCurrentDocumentDirty() ? "* " : "";
  document.title = `${dirtyMarker}${state.projectName || "Untitled"} - Photoshop MVP`;
}

function downloadTextFile(fileName, contents, mimeType = "application/json") {
  const blob = new Blob([contents], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function reportError(error, fallbackMessage = "Something went wrong.") {
  console.error(error);
  const message = error instanceof Error ? error.message : String(error || fallbackMessage);
  const finalMessage = message || fallbackMessage;
  await showDialog({
    title: "Photoshop",
    message: finalMessage,
    confirmLabel: "OK",
    allowCancel: false,
    kind: "error"
  });
}

async function showKeyboardShortcutsDialog() {
  await showDialog({
    title: "Keyboard Shortcuts",
    message: [
      "V Transform",
      "A Direct Select",
      "M Marquee",
      "O Ellipse Marquee Mode",
      "Z Zoom",
      "T Text",
      "P Pen",
      "U Shape",
      "Y Line",
      "I Eyedropper",
      "G Paint Bucket",
      "L Gradient",
      "W Color Range",
      "K Magic Wand",
      "S Lasso",
      "C Crop",
      "H Pan",
      "B Brush",
      "N Pencil",
      "E Eraser",
      "J Magic Eraser",
      "Shift+Brush/Eraser Straight Line",
      "R Ruler",
      "Space Pan (hold)",
      "Ctrl/Cmd+S Save Project",
      "Ctrl/Cmd+Shift+S Export",
      "Delete Clear Selection or Delete Layer",
      "Enter Apply Crop"
    ].join("\n"),
    confirmLabel: "Close",
    allowCancel: false,
    kind: "shortcuts"
  });
}

async function showAboutDialog() {
  await showDialog({
    title: "About Photoshop",
    message: "Photoshop MVP is a desktop-first raster editor built with Tauri and a canvas-based workspace. It supports layered projects, text, vector shape layers, crop, marquee, and export to PNG, JPEG, WebP, AVIF, and SVG.",
    confirmLabel: "Close",
    allowCancel: false
  });
}

async function invokeTauri(command, payload) {
  const bridge = getTauriBridge();
  if (!bridge.invoke) {
    throw new Error("Tauri invoke API is not available in this runtime.");
  }

  return bridge.invoke(command, payload);
}

function createTransparencyPattern() {
  const patternCanvas = document.createElement("canvas");
  const size = Math.max(8, Math.round(10 * (window.devicePixelRatio || 1)));

  patternCanvas.width = size * 2;
  patternCanvas.height = size * 2;

  const patternContext = patternCanvas.getContext("2d");

  patternContext.fillStyle = "#1f2328";
  patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
  patternContext.fillStyle = "#171b1f";
  patternContext.fillRect(0, 0, size, size);
  patternContext.fillRect(size, size, size, size);

  return ctx.createPattern(patternCanvas, "repeat");
}

function createLayer(name, width, height, options = {}) {
  const layerCanvas = document.createElement("canvas");
  layerCanvas.width = options.pixelWidth ?? width;
  layerCanvas.height = options.pixelHeight ?? height;
  const layerKind = options.layerKind ?? "raster";
  const maskCanvas = options.maskCanvas instanceof HTMLCanvasElement
    ? cloneCanvas(options.maskCanvas)
    : null;

  return {
    id: uid("layer"),
    name,
    visible: options.visible ?? true,
    opacity: options.opacity ?? 1,
    blendMode: normalizeBlendMode(options.blendMode),
    locked: options.locked === true,
    lockTransparentPixels: options.lockTransparentPixels === true,
    lockImagePixels: options.lockImagePixels === true,
    lockPosition: options.lockPosition === true,
    lockGeneratedPixels: options.lockGeneratedPixels === true,
    linked: options.linked === true,
    layerEffects: options.layerEffects && typeof options.layerEffects === "object" ? { ...options.layerEffects } : {},
    groupId: typeof options.groupId === "string" && options.groupId.trim() ? options.groupId.trim() : null,
    hasContent: options.hasContent ?? false,
    x: options.x ?? 0,
    y: options.y ?? 0,
    width: options.width ?? layerCanvas.width,
    height: options.height ?? layerCanvas.height,
    rotation: options.rotation ?? 0,
    isBackground: options.isBackground === true,
    layerKind,
    vectorSource: options.vectorSource ?? "",
    vectorIntrinsicWidth: Number(options.vectorIntrinsicWidth) || 0,
    vectorIntrinsicHeight: Number(options.vectorIntrinsicHeight) || 0,
    vectorImage: options.vectorImage ?? null,
    vectorStyle: layerKind === "vector" ? ensureVectorStyle(options.vectorStyle) : null,
    vectorStyleSummary: layerKind === "vector" ? ensureVectorStyleSummary(options.vectorStyleSummary, options.vectorStyle) : null,
    textContent: options.textContent ?? "",
    textStyle: options.textStyle ? { ...options.textStyle } : null,
    adjustmentType: typeof options.adjustmentType === "string" ? options.adjustmentType : "",
    adjustmentSettings: options.adjustmentSettings && typeof options.adjustmentSettings === "object"
      ? { ...options.adjustmentSettings }
      : {},
    clippedToBelow: options.clippedToBelow === true,
    maskCanvas,
    maskCtx: maskCanvas ? maskCanvas.getContext("2d") : null,
    maskedCanvasCache: null,
    thumbnailCache: null,
    canvas: layerCanvas,
    ctx: layerCanvas.getContext("2d")
  };
}

function hasLayerMask(layer) {
  return Boolean(layer?.maskCanvas && layer?.maskCtx);
}

function isLayerClippedToBelow(layer) {
  return Boolean(layer?.clippedToBelow);
}

function getLayerImmediateBelow(layer, doc = state.doc) {
  if (!layer || !Array.isArray(doc?.layers)) {
    return null;
  }

  const layerIndex = doc.layers.findIndex((entry) => entry.id === layer.id);
  if (layerIndex <= 0) {
    return null;
  }

  return doc.layers[layerIndex - 1] ?? null;
}

function canLayerClipToBelow(layer, doc = state.doc) {
  if (!layer || isBackgroundLayer(layer) || isAdjustmentLayer(layer)) {
    return false;
  }

  const layerBelow = getLayerImmediateBelow(layer, doc);
  return Boolean(layerBelow && (layerBelow.groupId ?? null) === (layer.groupId ?? null));
}

function getLayerClippingBase(layer, doc = state.doc) {
  if (!isLayerClippedToBelow(layer) || !canLayerClipToBelow(layer, doc) || !Array.isArray(doc?.layers)) {
    return null;
  }

  const layerIndex = doc.layers.findIndex((entry) => entry.id === layer.id);
  if (layerIndex <= 0) {
    return null;
  }

  for (let index = layerIndex - 1; index >= 0; index -= 1) {
    const candidate = doc.layers[index];
    if ((candidate.groupId ?? null) !== (layer.groupId ?? null)) {
      return null;
    }
    if (!isLayerClippedToBelow(candidate)) {
      return candidate;
    }
  }

  return null;
}

function pruneInvalidLayerClipping(doc) {
  if (!Array.isArray(doc?.layers)) {
    return;
  }

  for (const layer of doc.layers) {
    layer.clippedToBelow = Boolean(layer.clippedToBelow) && canLayerClipToBelow(layer, doc);
    if (isBackgroundLayer(layer)) {
      layer.clippedToBelow = false;
    }
  }
}

function isEditingLayerMask(layer = getActiveLayer()) {
  return Boolean(layer && hasLayerMask(layer) && state.activeLayerMaskId === layer.id);
}

function invalidateLayerRenderCaches(layer) {
  if (!layer) {
    return;
  }

  layer.maskedCanvasCache = null;
  layer.thumbnailCache = null;
}

function setLayerMaskCanvas(layer, maskCanvas) {
  if (!layer) {
    return;
  }

  layer.maskCanvas = maskCanvas ?? null;
  layer.maskCtx = layer.maskCanvas ? layer.maskCanvas.getContext("2d") : null;
  invalidateLayerRenderCaches(layer);
}

function getLayerPixelAlphaAtDocPoint(layer, point, options = {}) {
  if (!layer || !isDocPointInsideLayer(layer, point)) {
    return 0;
  }

  const layerPoint = docPointToLayerPoint(layer, point);
  const pixelX = clamp(Math.floor(layerPoint.x), 0, Math.max(0, layer.canvas.width - 1));
  const pixelY = clamp(Math.floor(layerPoint.y), 0, Math.max(0, layer.canvas.height - 1));
  const sourceCanvas = options.applyMask === false
    ? layer.canvas
    : getLayerDrawableCanvas(layer, { applyMask: true });
  const sourceContext = sourceCanvas.getContext("2d");
  return sourceContext.getImageData(pixelX, pixelY, 1, 1).data[3];
}

function ensureLayerMaskGeometry(layer) {
  if (!layer?.maskCanvas) {
    layer.maskCanvas = null;
    layer.maskCtx = null;
    return;
  }

  if (layer.maskCanvas.width !== layer.canvas.width || layer.maskCanvas.height !== layer.canvas.height) {
    const nextMaskCanvas = createFilledMaskCanvas(layer.canvas.width, layer.canvas.height, 0);
    const nextMaskContext = nextMaskCanvas.getContext("2d");
    nextMaskContext.drawImage(
      layer.maskCanvas,
      0,
      0,
      layer.maskCanvas.width,
      layer.maskCanvas.height,
      0,
      0,
      nextMaskCanvas.width,
      nextMaskCanvas.height
    );
    layer.maskCanvas = nextMaskCanvas;
  }

  layer.maskCtx = layer.maskCanvas.getContext("2d");
}

function createDefaultLayerMaskCanvas(layer) {
  return createFilledMaskCanvas(layer.canvas.width, layer.canvas.height, 255);
}

function getMaskRenderableCanvas(maskCanvas, width, height) {
  const normalizedMaskCanvas = createFilledMaskCanvas(width, height, 0);
  const normalizedMaskContext = normalizedMaskCanvas.getContext("2d");
  normalizedMaskContext.drawImage(maskCanvas, 0, 0, width, height);
  return normalizedMaskCanvas;
}

function applyMaskToSourceCanvas(sourceCanvas, maskCanvas) {
  const maskedCanvas = createCanvasElement(sourceCanvas.width, sourceCanvas.height);
  const maskedContext = maskedCanvas.getContext("2d");
  maskedContext.drawImage(sourceCanvas, 0, 0);
  maskedContext.globalCompositeOperation = "destination-in";
  maskedContext.drawImage(getMaskRenderableCanvas(maskCanvas, sourceCanvas.width, sourceCanvas.height), 0, 0);
  maskedContext.globalCompositeOperation = "source-over";
  return maskedCanvas;
}

function getLayerDrawableCanvas(layer, options = {}) {
  const sourceCanvas = options.sourceCanvas ?? layer.canvas;
  if (options.applyMask === false || !hasLayerMask(layer) || sourceCanvas !== layer.canvas) {
    return sourceCanvas;
  }

  if (
    !layer.maskedCanvasCache
    || layer.maskedCanvasCache.width !== sourceCanvas.width
    || layer.maskedCanvasCache.height !== sourceCanvas.height
  ) {
    layer.maskedCanvasCache = applyMaskToSourceCanvas(sourceCanvas, layer.maskCanvas);
  }

  return layer.maskedCanvasCache;
}

function isBackgroundLayer(layer) {
  return layer?.isBackground === true;
}

function isLayerFullyLocked(layer) {
  return Boolean(layer && (isBackgroundLayer(layer) || layer.locked === true));
}

function isLayerPositionLocked(layer) {
  return Boolean(layer && (isLayerFullyLocked(layer) || layer.lockPosition === true));
}

function isLayerPixelsLocked(layer) {
  return Boolean(layer && (isLayerFullyLocked(layer) || layer.lockImagePixels === true));
}

function isLayerGeneratedPixelsLocked(layer) {
  return Boolean(layer && (isLayerFullyLocked(layer) || layer.lockGeneratedPixels === true));
}

function isLayerTransparencyLocked(layer) {
  return Boolean(layer && (isLayerFullyLocked(layer) || layer.lockTransparentPixels === true));
}

function canModifyLayerPixels(layer) {
  return Boolean(layer && !isLayerFullyLocked(layer) && !isLayerPixelsLocked(layer) && !isLayerGeneratedPixelsLocked(layer));
}

function getLayerLockState(layer, lockType) {
  if (!layer) {
    return false;
  }

  switch (lockType) {
    case "transparent":
      return isLayerTransparencyLocked(layer);
    case "pixels":
      return isLayerPixelsLocked(layer);
    case "position":
      return isLayerPositionLocked(layer);
    case "image":
      return isLayerGeneratedPixelsLocked(layer);
    case "all":
      return isLayerFullyLocked(layer);
    default:
      return false;
  }
}

function normalizeLayerGroup(group, fallbackName = "Group") {
  return {
    id: group?.id || uid("group"),
    name: String(group?.name || fallbackName).trim() || fallbackName,
    visible: group?.visible !== false
  };
}

function cloneLayerGroup(group) {
  return group ? { ...normalizeLayerGroup(group) } : null;
}

function cloneLayerGroups(groups) {
  return Array.isArray(groups)
    ? groups.map((group) => cloneLayerGroup(group)).filter(Boolean)
    : [];
}

function getDocumentLayerGroups(doc = state.doc) {
  return Array.isArray(doc?.layerGroups) ? doc.layerGroups : [];
}

function pruneDocumentLayerGroups(doc) {
  if (!doc) {
    return;
  }

  const groups = getDocumentLayerGroups(doc);
  const validGroupIds = new Set(groups.map((group) => group.id));
  const usedGroupIds = new Set();

  for (const layer of doc.layers) {
    layer.groupId = typeof layer.groupId === "string" && validGroupIds.has(layer.groupId)
      ? layer.groupId
      : null;
    if (layer.groupId) {
      usedGroupIds.add(layer.groupId);
    }
  }

  doc.layerGroups = groups.filter((group) => usedGroupIds.has(group.id));
}

function pruneCollapsedLayerGroupState(doc, collapsedState = {}) {
  if (!doc) {
    return {};
  }

  const validGroupIds = new Set(getDocumentLayerGroups(doc).map((group) => group.id));
  return Object.fromEntries(
    Object.entries(collapsedState || {}).filter(([groupId, isCollapsed]) => validGroupIds.has(groupId) && Boolean(isCollapsed))
  );
}

function getLayerGroup(groupId, doc = state.doc) {
  if (!groupId) {
    return null;
  }

  return getDocumentLayerGroups(doc).find((group) => group.id === groupId) ?? null;
}

function getLayerGroupForLayer(layer, doc = state.doc) {
  return layer?.groupId ? getLayerGroup(layer.groupId, doc) : null;
}

function isLayerGroupVisible(groupId, doc = state.doc) {
  const group = getLayerGroup(groupId, doc);
  return group ? group.visible !== false : true;
}

function isLayerEffectivelyVisible(layer, doc = state.doc) {
  if (!layer) {
    return false;
  }

  return layer.visible !== false && isLayerGroupVisible(layer.groupId, doc);
}

function isLayerGroupCollapsed(groupId) {
  return Boolean(state.collapsedLayerGroups?.[groupId]);
}

function ensureLayerGeometry(layer, docWidth, docHeight) {
  layer.visible = layer.visible !== false;
  layer.opacity = clamp(Number(layer.opacity ?? 1), 0, 1);
  layer.blendMode = normalizeBlendMode(layer.blendMode);
  layer.groupId = typeof layer.groupId === "string" && layer.groupId.trim() ? layer.groupId.trim() : null;
  layer.clippedToBelow = layer.clippedToBelow === true;
  layer.hasContent = Boolean(layer.hasContent);
  layer.isBackground = layer.isBackground === true;
  layer.locked = layer.locked === true;
  layer.lockTransparentPixels = layer.lockTransparentPixels === true;
  layer.lockImagePixels = layer.lockImagePixels === true;
  layer.lockPosition = layer.lockPosition === true;
  layer.lockGeneratedPixels = layer.lockGeneratedPixels === true;
  layer.linked = layer.linked === true;
  layer.layerEffects = layer.layerEffects && typeof layer.layerEffects === "object" ? { ...layer.layerEffects } : {};
  layer.x = Number.isFinite(layer.x) ? layer.x : 0;
  layer.y = Number.isFinite(layer.y) ? layer.y : 0;
  layer.width = Number.isFinite(layer.width) && layer.width > 0
    ? layer.width
    : (layer.canvas?.width || docWidth);
  layer.height = Number.isFinite(layer.height) && layer.height > 0
    ? layer.height
    : (layer.canvas?.height || docHeight);
  layer.rotation = Number.isFinite(layer.rotation) ? layer.rotation : 0;
  layer.layerKind = typeof layer.layerKind === "string" ? layer.layerKind : "raster";
  layer.vectorSource = typeof layer.vectorSource === "string" ? layer.vectorSource : "";
  layer.vectorIntrinsicWidth = Number.isFinite(layer.vectorIntrinsicWidth) && layer.vectorIntrinsicWidth > 0
    ? layer.vectorIntrinsicWidth
    : 0;
  layer.vectorIntrinsicHeight = Number.isFinite(layer.vectorIntrinsicHeight) && layer.vectorIntrinsicHeight > 0
    ? layer.vectorIntrinsicHeight
    : 0;
  layer.vectorImage = layer.vectorImage ?? null;
  layer.vectorStyle = layer.layerKind === "vector"
    ? ensureVectorStyle(layer.vectorStyle)
    : null;
  layer.vectorStyleSummary = layer.layerKind === "vector"
    ? ensureVectorStyleSummary(layer.vectorStyleSummary, layer.vectorStyle)
    : null;
  layer.textContent = typeof layer.textContent === "string" ? layer.textContent : "";
  layer.textStyle = layer.textStyle && typeof layer.textStyle === "object"
    ? { ...layer.textStyle }
    : null;
  layer.adjustmentSettings = layer.adjustmentSettings && typeof layer.adjustmentSettings === "object"
    ? { ...layer.adjustmentSettings }
    : {};
  layer.adjustmentType = typeof layer.adjustmentType === "string" && hasOwn(adjustmentLayerTypes, layer.adjustmentType)
    ? layer.adjustmentType
    : "";
  layer.adjustmentSettings = isAdjustmentLayer(layer)
    ? normalizeAdjustmentSettings(layer.adjustmentType, layer.adjustmentSettings)
    : {};
  ensureLayerMaskGeometry(layer);
  invalidateLayerRenderCaches(layer);

  if (isAdjustmentLayer(layer)) {
    layer.blendMode = "normal";
    layer.clippedToBelow = false;
    layer.x = 0;
    layer.y = 0;
    layer.width = docWidth;
    layer.height = docHeight;
    layer.rotation = 0;
  }

  if (layer.isBackground) {
    layer.x = 0;
    layer.y = 0;
    layer.width = docWidth;
    layer.height = docHeight;
    layer.rotation = 0;
  }
}

function normalizeDocument(doc) {
  normalizeDocumentMetadata(doc);
  doc.layerGroups = cloneLayerGroups(doc.layerGroups);
  for (const layer of doc.layers) {
    ensureLayerGeometry(layer, doc.width, doc.height);
  }
  pruneDocumentLayerGroups(doc);
  pruneInvalidLayerClipping(doc);
}

function cloneRect(rect) {
  return rect ? { ...rect } : null;
}

function cloneArtboard(artboard) {
  if (!artboard) {
    return null;
  }

  return {
    id: artboard.id,
    name: artboard.name,
    x: artboard.x,
    y: artboard.y,
    width: artboard.width,
    height: artboard.height,
    sourceLayerId: artboard.sourceLayerId ?? null
  };
}

function normalizeArtboardRect(rect) {
  if (!rect) {
    return null;
  }

  const x = Number(rect.x);
  const y = Number(rect.y);
  const width = Number(rect.width);
  const height = Number(rect.height);

  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
    return null;
  }

  if (width <= 0 || height <= 0) {
    return null;
  }

  return {
    x: round(x, 3),
    y: round(y, 3),
    width: round(width, 3),
    height: round(height, 3)
  };
}

function normalizeArtboard(artboard, fallbackName = "Artboard") {
  const rect = normalizeArtboardRect(artboard);
  if (!rect) {
    return null;
  }

  return {
    id: artboard?.id || uid("artboard"),
    name: String(artboard?.name || fallbackName).trim() || fallbackName,
    sourceLayerId: artboard?.sourceLayerId ?? null,
    ...rect
  };
}

function cloneArtboards(artboards) {
  return Array.isArray(artboards)
    ? artboards.map((artboard) => cloneArtboard(normalizeArtboard(artboard))).filter(Boolean)
    : [];
}

function nextGeneratedArtboardName() {
  const baseName = "Artboard";
  const usedNames = new Set(state.artboards.map((artboard) => artboard.name));

  if (!usedNames.has(baseName)) {
    return baseName;
  }

  let index = 2;
  while (usedNames.has(`${baseName} ${index}`)) {
    index += 1;
  }

  return `${baseName} ${index}`;
}

function getActiveArtboard() {
  return state.artboards.find((artboard) => artboard.id === state.activeArtboardId) ?? null;
}

function nextUntitledProjectName() {
  const baseName = "Untitled";
  const openNames = new Set(state.documents.map((session) => session.projectName));

  if (!openNames.has(baseName)) {
    return baseName;
  }

  let index = 2;
  while (openNames.has(`${baseName} ${index}`)) {
    index += 1;
  }

  return `${baseName} ${index}`;
}

function getActiveDocumentSession() {
  return state.documents.find((session) => session.id === state.activeDocumentId) ?? null;
}

function resetInteractionState() {
  if (state.pointer.id !== null) {
    try {
      if (stage.hasPointerCapture(state.pointer.id)) {
        stage.releasePointerCapture(state.pointer.id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  state.pointer.id = null;
  state.pointer.mode = null;
  state.pointer.startCanvas = null;
  state.pointer.startDoc = null;
  state.pointer.startPan = null;
  state.pointer.lastDoc = null;
  state.pointer.startLayerRect = null;
  state.pointer.startLayerRotation = null;
  state.pointer.resizeHandle = null;
  state.pointer.combineMode = null;
  state.pointer.mutated = false;
  state.shapeDraft = null;
  state.gradientDraft = null;
  state.rulerDraft = null;
  state.penDraft = null;
  state.hoverCanvasPoint = null;
  state.hoverDocPoint = null;
  state.layerPanelDrag = null;
  state.contextualBarDrag = null;
  state.textEditorOriginalText = "";
  state.lastPaintStroke = null;
  state.activeLayerMaskId = null;
  document.body.classList.remove("is-contextual-bar-dragging", "is-layer-panel-dragging");
  clearGuides();
  closeMenus();
  closeContextMenus();
}

function createDocumentSession(doc, options = {}) {
  normalizeDocument(doc);
  const artboards = cloneArtboards(options.artboards);
  const activeArtboardId = artboards.some((artboard) => artboard.id === options.activeArtboardId)
    ? options.activeArtboardId
    : (artboards[0]?.id ?? null);
  const activeLayerId = options.activeLayerId ?? doc.layers.at(-1)?.id ?? null;
  const validLayerIds = new Set(doc.layers.map((layer) => layer.id));
  const selectedLayerIds = Array.isArray(options.selectedLayerIds)
    ? options.selectedLayerIds.filter((layerId, index, list) => validLayerIds.has(layerId) && list.indexOf(layerId) === index)
    : (activeLayerId ? [activeLayerId] : []);
  const layerSelectionAnchorId = validLayerIds.has(options.layerSelectionAnchorId)
    ? options.layerSelectionAnchorId
    : (selectedLayerIds[0] ?? activeLayerId ?? null);

  return {
    id: options.documentId ?? uid("document"),
    doc,
    activeLayerId,
    selectedLayerIds,
    layerSelectionAnchorId,
    projectName: options.projectName ?? nextUntitledProjectName(),
    projectPath: options.projectPath ?? null,
    selection: cloneRect(options.selection),
    selectionMaskCanvas: options.selectionMaskCanvas ?? null,
    selectionMaskBounds: cloneRect(options.selectionMaskBounds),
    cropRect: cloneRect(options.cropRect),
    artboards,
    activeArtboardId,
    collapsedLayerGroups: pruneCollapsedLayerGroupState(doc, options.collapsedLayerGroups),
    clipToDocument: options.clipToDocument ?? Boolean(doc.clipToDocument),
    zoom: normalizeZoom(options.zoom),
    panX: options.panX ?? 0,
    panY: options.panY ?? 0,
    history: options.history ? [...options.history] : [],
    historyIndex: options.historyIndex ?? -1,
    savedRevision: options.savedRevision ?? null
  };
}

function loadDocumentSession(session) {
  state.activeDocumentId = session.id;
  state.doc = session.doc;
  state.collapsedLayerGroups = pruneCollapsedLayerGroupState(session.doc, session.collapsedLayerGroups);
  state.activeLayerId = session.activeLayerId;
  state.selectedLayerIds = Array.isArray(session.selectedLayerIds) ? [...session.selectedLayerIds] : [];
  state.layerSelectionAnchorId = session.layerSelectionAnchorId ?? null;
  state.projectName = session.projectName;
  state.projectPath = session.projectPath;
  state.selection = cloneRect(session.selection);
  state.selectionMaskCanvas = session.selectionMaskCanvas ?? null;
  state.selectionMaskBounds = cloneRect(session.selectionMaskBounds);
  state.cropRect = cloneRect(session.cropRect);
  state.artboards = cloneArtboards(session.artboards);
  state.activeArtboardId = state.artboards.some((artboard) => artboard.id === session.activeArtboardId)
    ? session.activeArtboardId
    : (state.artboards[0]?.id ?? null);
  state.clipToDocument = Boolean(session.clipToDocument);
  state.zoom = normalizeZoom(session.zoom);
  state.panX = Number.isFinite(session.panX) ? session.panX : 0;
  state.panY = Number.isFinite(session.panY) ? session.panY : 0;
  state.history = session.history ?? [];
  state.historyIndex = session.historyIndex ?? -1;
  state.savedRevision = session.savedRevision ?? null;
  resetInteractionState();
  updateDocumentTitle();
}

function syncActiveDocumentSession() {
  const session = getActiveDocumentSession();
  if (!session) {
    return;
  }

  session.doc = state.doc;
  state.collapsedLayerGroups = pruneCollapsedLayerGroupState(state.doc, state.collapsedLayerGroups);
  session.activeLayerId = state.activeLayerId;
  session.selectedLayerIds = [...state.selectedLayerIds];
  session.layerSelectionAnchorId = state.layerSelectionAnchorId;
  session.projectName = state.projectName;
  session.projectPath = state.projectPath;
  session.selection = cloneRect(state.selection);
  session.selectionMaskCanvas = state.selectionMaskCanvas ?? null;
  session.selectionMaskBounds = cloneRect(state.selectionMaskBounds);
  session.cropRect = cloneRect(state.cropRect);
  session.artboards = cloneArtboards(state.artboards);
  session.activeArtboardId = state.activeArtboardId;
  session.collapsedLayerGroups = { ...state.collapsedLayerGroups };
  session.clipToDocument = Boolean(state.clipToDocument);
  session.zoom = state.zoom;
  session.panX = state.panX;
  session.panY = state.panY;
  session.history = state.history;
  session.historyIndex = state.historyIndex;
  session.savedRevision = state.savedRevision;
}

function getCurrentHistoryRevision() {
  return state.history[state.historyIndex]?.revision ?? null;
}

function getSessionHistoryRevision(session) {
  return session?.history?.[session.historyIndex]?.revision ?? null;
}

function isDocumentSessionDirty(session) {
  if (!session) {
    return false;
  }

  return getSessionHistoryRevision(session) !== session.savedRevision;
}

function isCurrentDocumentDirty() {
  return isDocumentSessionDirty(getActiveDocumentSession());
}

function hasDirtyDocuments() {
  return state.documents.some((session) => isDocumentSessionDirty(session));
}

function markCurrentDocumentSaved() {
  state.savedRevision = getCurrentHistoryRevision();
  syncActiveDocumentSession();
  renderProjectTabs(true);
  updateDocumentTitle();
}

function getProjectTabsSignature() {
  return JSON.stringify({
    activeDocumentId: state.activeDocumentId,
    documents: state.documents.map((session) => ({
      id: session.id,
      name: session.projectName,
      path: session.projectPath,
      dirty: isDocumentSessionDirty(session)
    }))
  });
}

function renderProjectTabs(force = false) {
  const signature = getProjectTabsSignature();
  if (!force && signature === state.projectTabsSignature) {
    return;
  }

  state.projectTabsSignature = signature;
  ui.projectTabs.textContent = "";

  if (!state.documents.length) {
    return;
  }

  for (const session of state.documents) {
    const tab = document.createElement("div");
    tab.className = "project-tab";
    if (session.id === state.activeDocumentId) {
      tab.classList.add("is-active");
    }

    const activateButton = document.createElement("button");
    activateButton.type = "button";
    activateButton.className = "project-tab-button";
    activateButton.dataset.documentAction = "activate";
    activateButton.dataset.documentId = session.id;
    activateButton.title = `${session.projectPath || session.projectName || "Untitled"}\nDouble-click to rename`;
    activateButton.addEventListener("click", () => {
      activateDocumentSession(session.id);
    });
    activateButton.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void promptRenameDocumentSession(session.id);
    });

    const label = document.createElement("span");
    label.className = "project-tab-title";

    const name = document.createElement("span");
    name.textContent = session.projectName || "Untitled";
    label.append(name);

    if (isDocumentSessionDirty(session)) {
      const indicator = document.createElement("span");
      indicator.className = "project-tab-dot";
      indicator.setAttribute("aria-label", "Unsaved changes");
      indicator.title = "Unsaved changes";
      label.append(indicator);
      activateButton.title = `${session.projectPath || session.projectName || "Untitled"} • Unsaved changes\nDouble-click to rename`;
    }

    activateButton.append(label);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "project-tab-close";
    closeButton.dataset.documentAction = "close";
    closeButton.dataset.documentId = session.id;
    closeButton.setAttribute("aria-label", `Close ${session.projectName || "Untitled"}`);
    closeButton.innerHTML = '<i data-lucide="x" class="icon icon-sm"></i>';
    closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      void closeDocumentSession(session.id);
    });

    tab.append(activateButton, closeButton);
    ui.projectTabs.append(tab);
  }

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "project-tab-new";
  addButton.setAttribute("aria-label", "Create a new document tab");
  addButton.title = "New document";
  addButton.innerHTML = '<i data-lucide="plus" class="icon icon-sm"></i>';
  addButton.addEventListener("click", () => {
    void createNewDocument();
  });
  ui.projectTabs.append(addButton);

  if (typeof window.renderIcons === "function") {
    window.renderIcons(ui.projectTabs);
  }
}

function syncShellState() {
  const hasDocument = Boolean(state.doc);
  ui.homeScreen.hidden = hasDocument;
  ui.appMain.hidden = !hasDocument;
  ui.projectTabs.hidden = state.documents.length === 0;
}

function isInspectorSectionApplicable(sectionId, context) {
  switch (sectionId) {
    case "document":
      return true;
    case "transform":
      return canTransformLayer(context.activeLayer);
    case "brush":
      return context.effectiveTool === "brush" || context.effectiveTool === "eraser";
    case "adjustment":
      return isAdjustmentLayer(context.activeLayer);
    case "vector":
      return isVectorLayer(context.activeLayer);
    case "text":
      return context.effectiveTool === "text" || isTextLayer(context.activeLayer);
    case "shape":
      return context.effectiveTool === "shape";
    default:
      return true;
  }
}

function getInspectorSectionMode(sectionId) {
  return state.inspectorSectionModes[sectionId] ?? inspectorSectionDefaultModes[sectionId] ?? "auto";
}

function isInspectorSectionVisible(sectionId, context) {
  if (!state.doc) {
    return false;
  }

  const mode = getInspectorSectionMode(sectionId);
  if (mode === "hidden") {
    return false;
  }

  if (mode === "pinned") {
    return true;
  }

  return isInspectorSectionApplicable(sectionId, context);
}

function syncWindowMenuState() {
  const modeLabels = {
    auto: "Auto",
    pinned: "Pinned",
    hidden: "Hidden"
  };

  for (const button of windowPanelToggleButtons) {
    const sectionId = button.dataset.windowPanelToggle;
    const mode = getInspectorSectionMode(sectionId);
    const modeLabel = modeLabels[mode] ?? "Auto";
    button.dataset.mode = mode;
    button.setAttribute("aria-label", `${sectionId[0].toUpperCase()}${sectionId.slice(1)} panel: ${modeLabel}. Click to cycle.`);
    button.title = `Click to cycle panel mode. Current: ${modeLabel}.`;
    const modeElement = button.querySelector(".menu-toggle-mode");
    if (modeElement) {
      modeElement.textContent = modeLabel;
    }
  }
}

function syncInspectorPanels(context = {}) {
  const nextContext = {
    activeLayer: context.activeLayer ?? getActiveLayer(),
    effectiveTool: context.effectiveTool ?? (state.transientTool || state.tool)
  };

  for (const section of inspectorSections) {
    const sectionId = section.dataset.inspectorSection;
    const isVisible = isInspectorSectionVisible(sectionId, nextContext);
    const isCollapsed = Boolean(state.collapsedInspectorSections[sectionId]);
    section.hidden = !isVisible;
    section.classList.toggle("is-collapsed", isCollapsed);
    section.setAttribute("aria-collapsed", String(isCollapsed));

    const toggle = section.querySelector("[data-inspector-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(!isCollapsed));
    }
  }

  for (const panel of inspectorPanels) {
    const visibleSections = [...panel.querySelectorAll("[data-inspector-section]")].some((section) => !section.hidden);
    panel.hidden = panel.dataset.inspectorPanel !== state.activeInspectorPanel || !visibleSections;
  }

  syncWindowMenuState();
}

function toggleInspectorSection(sectionId) {
  if (!(sectionId in state.collapsedInspectorSections)) {
    return;
  }

  state.collapsedInspectorSections[sectionId] = !state.collapsedInspectorSections[sectionId];
  syncInspectorPanels();
}

function cycleInspectorSectionMode(sectionId) {
  if (!(sectionId in state.inspectorSectionModes)) {
    return;
  }

  const currentMode = getInspectorSectionMode(sectionId);
  const currentIndex = inspectorSectionModeOrder.indexOf(currentMode);
  const nextMode = inspectorSectionModeOrder[(currentIndex + 1) % inspectorSectionModeOrder.length];
  state.inspectorSectionModes[sectionId] = nextMode;
  syncInspectorPanels();
}

function resetInspectorSectionModes() {
  for (const sectionId of Object.keys(state.inspectorSectionModes)) {
    state.inspectorSectionModes[sectionId] = inspectorSectionDefaultModes[sectionId] ?? "auto";
  }

  syncInspectorPanels();
}

async function renderHomePresets(force = false) {
  if (!ui.homePresets || state.doc) {
    return;
  }

  const clipboardPreset = await readClipboardPreset();
  const presets = getNewDocumentPresetOptions(clipboardPreset);
  const signature = getNewDocumentPresetSignature(presets);

  if (!force && signature === state.homePresetSignature) {
    return;
  }

  state.homePresetSignature = signature;
  renderPresetGrid(ui.homePresets, presets, "", (preset) => {
    createDocumentFromSettings({
      ...preset,
      projectName: nextUntitledProjectName()
    });
  });
  ui.homePresetsStatus.textContent = clipboardPreset
    ? "Clipboard image dimensions are ready to use."
    : "Clipboard sizing appears when the browser exposes an image item.";
}

function activateDocumentSession(documentId) {
  if (documentId === state.activeDocumentId) {
    return;
  }

  closeInlineTextEditor();
  syncActiveDocumentSession();
  const session = state.documents.find((entry) => entry.id === documentId);
  if (!session) {
    return;
  }

  loadDocumentSession(session);
  refresh({ rebuildLayers: true });
}

async function closeDocumentSession(documentId) {
  closeInlineTextEditor();
  syncActiveDocumentSession();
  const sessionIndex = state.documents.findIndex((entry) => entry.id === documentId);
  if (sessionIndex === -1) {
    return false;
  }

  const session = state.documents[sessionIndex];
  if (isDocumentSessionDirty(session)) {
    const action = await promptUnsavedChanges(session, "close");
    if (action.action === "cancel") {
      return false;
    }

    if (action.action === "confirm") {
      const saved = await saveDocumentSession(documentId);
      if (!saved) {
        return false;
      }
    }
  }

  const isActive = state.activeDocumentId === documentId;
  state.documents.splice(sessionIndex, 1);

  if (!state.documents.length) {
    state.activeDocumentId = null;
    state.doc = null;
    state.collapsedLayerGroups = {};
    state.activeLayerId = null;
    state.selectedLayerIds = [];
    state.layerSelectionAnchorId = null;
    state.layerPanelDrag = null;
    state.projectName = "Untitled";
    state.projectPath = null;
    clearSelectionState();
    state.cropRect = null;
    state.artboards = [];
    state.activeArtboardId = null;
    state.history = [];
    state.historyIndex = -1;
    state.savedRevision = null;
    resetInteractionState();
    refresh({ rebuildLayers: true });
    void renderHomePresets(true);
    return true;
  }

  if (!isActive) {
    renderProjectTabs(true);
    return true;
  }

  const nextSession = state.documents[sessionIndex] ?? state.documents[sessionIndex - 1];
  if (!nextSession) {
    return;
  }

  loadDocumentSession(nextSession);
  refresh({ rebuildLayers: true });
  return true;
}

function openDocumentSession(session, options = {}) {
  closeInlineTextEditor();
  syncActiveDocumentSession();
  state.documents.push(session);
  loadDocumentSession(session);
  syncShellState();
  resizeCanvas();

  if (options.fit !== false) {
    fitToStage();
  }

  if (options.resetHistory !== false) {
    state.history = [];
    state.historyIndex = -1;
    pushHistory(options.historyLabel || "Open Document");
    state.savedRevision = getCurrentHistoryRevision();
  }

  syncActiveDocumentSession();
  renderProjectTabs(true);
  refresh({ rebuildLayers: true });
}

async function saveDocumentSession(documentId) {
  const session = state.documents.find((entry) => entry.id === documentId);
  if (!session) {
    return false;
  }

  if (documentId === state.activeDocumentId) {
    return saveProject();
  }

  const previousDocumentId = state.activeDocumentId;
  activateDocumentSession(documentId);
  const saved = await saveProject();

  if (previousDocumentId && previousDocumentId !== documentId) {
    const previousSession = state.documents.find((entry) => entry.id === previousDocumentId);
    if (previousSession) {
      activateDocumentSession(previousDocumentId);
    }
  }

  return saved;
}

function paintDemoScene(layer) {
  const { ctx: layerContext, canvas: layerCanvas } = layer;
  const { width, height } = layerCanvas;

  const sky = layerContext.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#133046");
  sky.addColorStop(0.34, "#2f6581");
  sky.addColorStop(0.62, "#f0b168");
  sky.addColorStop(1, "#f5d8a8");
  layerContext.fillStyle = sky;
  layerContext.fillRect(0, 0, width, height);

  const sunGlow = layerContext.createRadialGradient(width * 0.68, height * 0.3, 16, width * 0.68, height * 0.3, width * 0.18);
  sunGlow.addColorStop(0, "rgba(255, 246, 200, 0.92)");
  sunGlow.addColorStop(1, "rgba(255, 246, 200, 0)");
  layerContext.fillStyle = sunGlow;
  layerContext.fillRect(0, 0, width, height);

  drawMountainRange(layerContext, width, height, [
    [0, height * 0.52],
    [width * 0.18, height * 0.3],
    [width * 0.34, height * 0.48],
    [width * 0.52, height * 0.22],
    [width * 0.78, height * 0.5],
    [width, height * 0.36],
    [width, height],
    [0, height]
  ], "#375364");

  drawMountainRange(layerContext, width, height, [
    [0, height * 0.6],
    [width * 0.2, height * 0.42],
    [width * 0.38, height * 0.58],
    [width * 0.62, height * 0.38],
    [width * 0.8, height * 0.62],
    [width, height * 0.46],
    [width, height],
    [0, height]
  ], "#27404f");

  const water = layerContext.createLinearGradient(0, height * 0.5, 0, height);
  water.addColorStop(0, "#4f97a3");
  water.addColorStop(0.54, "#2c6165");
  water.addColorStop(1, "#15353a");
  layerContext.fillStyle = water;
  layerContext.fillRect(0, height * 0.54, width, height * 0.46);

  layerContext.globalAlpha = 0.28;
  for (let index = 0; index < 16; index += 1) {
    const y = height * (0.58 + index * 0.022);
    layerContext.fillStyle = index % 2 === 0 ? "#f4cf9e" : "#91d5dc";
    layerContext.fillRect(width * 0.16, y, width * 0.52, 3);
  }
  layerContext.globalAlpha = 1;

  layerContext.fillStyle = "#232118";
  layerContext.beginPath();
  layerContext.moveTo(0, height * 0.82);
  layerContext.lineTo(width * 0.14, height * 0.74);
  layerContext.lineTo(width * 0.3, height * 0.86);
  layerContext.lineTo(width * 0.48, height * 0.72);
  layerContext.lineTo(width * 0.64, height * 0.88);
  layerContext.lineTo(width * 0.82, height * 0.7);
  layerContext.lineTo(width, height * 0.82);
  layerContext.lineTo(width, height);
  layerContext.lineTo(0, height);
  layerContext.closePath();
  layerContext.fill();

  layerContext.fillStyle = "#ff8a3d";
  layerContext.beginPath();
  layerContext.moveTo(width * 0.54, height * 0.72);
  layerContext.lineTo(width * 0.61, height * 0.6);
  layerContext.lineTo(width * 0.68, height * 0.72);
  layerContext.closePath();
  layerContext.fill();
  layerContext.fillRect(width * 0.57, height * 0.72, width * 0.08, height * 0.1);

  layerContext.strokeStyle = "rgba(255, 233, 177, 0.45)";
  layerContext.lineWidth = 6;
  layerContext.beginPath();
  layerContext.moveTo(width * 0.61, height * 0.77);
  layerContext.lineTo(width * 0.53, height * 0.96);
  layerContext.stroke();

  for (let index = 0; index < 45; index += 1) {
    const x = (index / 44) * width;
    const noise = (Math.sin(index * 18.7) + 1) * 0.5;
    layerContext.strokeStyle = `rgba(255,255,255,${0.03 + noise * 0.04})`;
    layerContext.lineWidth = 1;
    layerContext.beginPath();
    layerContext.moveTo(x, 0);
    layerContext.lineTo(x + width * 0.06, height);
    layerContext.stroke();
  }
}

function drawMountainRange(layerContext, width, height, points, fill) {
  layerContext.fillStyle = fill;
  layerContext.beginPath();
  layerContext.moveTo(points[0][0], points[0][1]);

  for (const [x, y] of points.slice(1)) {
    layerContext.lineTo(x, y);
  }

  layerContext.lineTo(width, height);
  layerContext.lineTo(0, height);
  layerContext.closePath();
  layerContext.fill();
}

function paintDemoRetouch(layer) {
  const { ctx: layerContext, canvas: layerCanvas } = layer;
  const { width, height } = layerCanvas;

  layerContext.lineCap = "round";
  layerContext.lineJoin = "round";

  layerContext.strokeStyle = "rgba(255, 123, 76, 0.88)";
  layerContext.lineWidth = 26;
  layerContext.beginPath();
  layerContext.moveTo(width * 0.24, height * 0.28);
  layerContext.bezierCurveTo(width * 0.3, height * 0.22, width * 0.38, height * 0.2, width * 0.46, height * 0.24);
  layerContext.stroke();

  layerContext.strokeStyle = "rgba(33, 184, 157, 0.82)";
  layerContext.lineWidth = 18;
  layerContext.beginPath();
  layerContext.moveTo(width * 0.73, height * 0.2);
  layerContext.bezierCurveTo(width * 0.79, height * 0.32, width * 0.76, height * 0.44, width * 0.69, height * 0.55);
  layerContext.stroke();

  layerContext.fillStyle = "rgba(255, 255, 255, 0.24)";
  layerContext.beginPath();
  layerContext.arc(width * 0.67, height * 0.63, width * 0.06, 0, Math.PI * 2);
  layerContext.fill();
}

function buildBlankDocument(width = 1280, height = 720, options = {}) {
  const backgroundContents = options.backgroundContents ?? "white";
  const layers = backgroundContents === "transparent"
    ? [createLayer("Layer 1", width, height)]
    : [createBackgroundLayer(width, height, getBackgroundFillForContents(backgroundContents))];

  return {
    width,
    height,
    resolution: options.resolution ?? 72,
    backgroundContents,
    layerGroups: [],
    layers
  };
}

function createLayerFromImage(image, name = "Image", options = {}) {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const layer = createLayer(name, width, height, {
    hasContent: true,
    groupId: options.groupId ?? null,
    x: options.x ?? 0,
    y: options.y ?? 0,
    width: options.width ?? width,
    height: options.height ?? height
  });

  layer.ctx.drawImage(image, 0, 0, width, height);
  return layer;
}

function isVectorLayer(layer) {
  return layer?.layerKind === "vector" && typeof layer.vectorSource === "string" && layer.vectorSource.length > 0;
}

function isAdjustmentLayer(layer) {
  return layer?.layerKind === "adjustment" && hasOwn(adjustmentLayerTypes, layer.adjustmentType);
}

function getDefaultAdjustmentSettings(adjustmentType) {
  return adjustmentLayerTypes[adjustmentType]?.defaults
    ? { ...adjustmentLayerTypes[adjustmentType].defaults }
    : {};
}

function normalizeAdjustmentSettingValue(field, value) {
  const parsed = Number(value);

  switch (field) {
    case "brightness":
    case "contrast":
    case "saturation":
      return Math.round(clamp(Number.isFinite(parsed) ? parsed : 0, -100, 100));
    case "hue":
      return Math.round(clamp(Number.isFinite(parsed) ? parsed : 0, -180, 180));
    default:
      return Number.isFinite(parsed) ? parsed : 0;
  }
}

function normalizeAdjustmentSettings(adjustmentType, settings = {}) {
  const defaults = getDefaultAdjustmentSettings(adjustmentType);
  const normalized = {};

  for (const [field, defaultValue] of Object.entries(defaults)) {
    normalized[field] = normalizeAdjustmentSettingValue(field, settings[field] ?? defaultValue);
  }

  return normalized;
}

function getAdjustmentSettings(layer) {
  return isAdjustmentLayer(layer)
    ? normalizeAdjustmentSettings(layer.adjustmentType, layer.adjustmentSettings)
    : {};
}

function getAdjustmentLayerLabel(adjustmentType) {
  return adjustmentLayerTypes[adjustmentType]?.label ?? "Adjustment Layer";
}

function getAdjustmentLayerShortLabel(adjustmentType) {
  return adjustmentLayerTypes[adjustmentType]?.shortLabel ?? "ADJ";
}

function canTransformLayer(layer) {
  return Boolean(layer) && !isBackgroundLayer(layer) && !isAdjustmentLayer(layer) && !isLayerPositionLocked(layer);
}

function createAdjustmentLayer(adjustmentType) {
  if (!state.doc || !hasOwn(adjustmentLayerTypes, adjustmentType)) {
    return null;
  }

  return createLayer(getAdjustmentLayerLabel(adjustmentType), state.doc.width, state.doc.height, {
    groupId: getDefaultLayerGroupIdForNewLayer(),
    hasContent: true,
    layerKind: "adjustment",
    adjustmentType,
    adjustmentSettings: getDefaultAdjustmentSettings(adjustmentType),
    x: 0,
    y: 0,
    width: state.doc.width,
    height: state.doc.height
  });
}

function addAdjustmentLayer(adjustmentType) {
  const layer = createAdjustmentLayer(adjustmentType);
  if (!layer) {
    return false;
  }

  insertLayersAfterActiveLayer([layer]);
  selectSingleLayer(layer.id);
  pushHistory();
  refresh({ rebuildLayers: true });
  return true;
}

async function loadSvgImageFromSource(source) {
  const svgBlob = new Blob([source], { type: "image/svg+xml" });
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    return await loadImage(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function renderVectorLayerBitmap(layer, width = layer.width, height = layer.height) {
  if (!isVectorLayer(layer) || !layer.vectorImage) {
    return;
  }

  const nextWidth = Math.max(1, Math.round(width));
  const nextHeight = Math.max(1, Math.round(height));
  const nextCanvas = createCanvasElement(nextWidth, nextHeight);
  const nextContext = nextCanvas.getContext("2d");
  nextContext.clearRect(0, 0, nextWidth, nextHeight);
  nextContext.drawImage(layer.vectorImage, 0, 0, nextWidth, nextHeight);
  replaceLayerBitmap(layer, nextCanvas);
  layer.width = width;
  layer.height = height;
  layer.hasContent = true;
}

async function createVectorLayerFromSvgSource(source, name = "SVG", options = {}) {
  const image = await loadSvgImageFromSource(source);
  const intrinsicWidth = Math.max(1, Math.round(
    options.vectorIntrinsicWidth
    || image.naturalWidth
    || image.width
    || options.width
    || 300
  ));
  const intrinsicHeight = Math.max(1, Math.round(
    options.vectorIntrinsicHeight
    || image.naturalHeight
    || image.height
    || options.height
    || 150
  ));
  const vectorStyleSummary = getVectorStyleSummaryFromSvgSource(source, options.vectorStyle ?? getVectorStyleDefaults());
  const width = options.width ?? intrinsicWidth;
  const height = options.height ?? intrinsicHeight;
  const layer = createLayer(name, width, height, {
    visible: options.visible,
    opacity: options.opacity,
    hasContent: options.hasContent ?? true,
    groupId: options.groupId ?? null,
    x: options.x ?? 0,
    y: options.y ?? 0,
    width,
    height,
    rotation: options.rotation ?? 0,
    layerKind: "vector",
    vectorSource: source,
    vectorIntrinsicWidth: intrinsicWidth,
    vectorIntrinsicHeight: intrinsicHeight,
    vectorImage: image,
    vectorStyle: ensureVectorStyle(vectorStyleSummary),
    vectorStyleSummary
  });

  renderVectorLayerBitmap(layer, width, height);
  return layer;
}

function rasterizeVectorLayer(layer) {
  if (!isVectorLayer(layer)) {
    return false;
  }

  layer.layerKind = "raster";
  layer.vectorSource = "";
  layer.vectorIntrinsicWidth = 0;
  layer.vectorIntrinsicHeight = 0;
  layer.vectorImage = null;
  layer.vectorStyle = null;
  layer.vectorStyleSummary = null;
  invalidateLayerRenderCaches(layer);
  return true;
}

function flattenLayerKindsToRaster(layer) {
  rasterizeVectorLayer(layer);
  if (isTextLayer(layer)) {
    if (state.textEditorLayerId === layer.id) {
      closeInlineTextEditor();
    }
    layer.layerKind = "raster";
    layer.textContent = "";
    layer.textStyle = null;
    invalidateLayerRenderCaches(layer);
  }
}

function getLayerPaintTarget(layer) {
  if (!layer) {
    return null;
  }

  if (isAdjustmentLayer(layer)) {
    return null;
  }

  if (isEditingLayerMask(layer)) {
    return {
      canvas: layer.maskCanvas,
      ctx: layer.maskCtx,
      isMask: true
    };
  }

  flattenLayerKindsToRaster(layer);
  return {
    canvas: layer.canvas,
    ctx: layer.ctx,
    isMask: false
  };
}

function toggleLayerMaskEditing(layerId) {
  const layer = state.doc?.layers.find((entry) => entry.id === layerId) ?? null;
  if (!layer || !hasLayerMask(layer)) {
    return false;
  }

  selectSingleLayer(layer.id);
  state.activeLayerMaskId = state.activeLayerMaskId === layer.id ? null : layer.id;
  refresh({ rebuildLayers: true });
  return true;
}

function addLayerMask(layerId, options = {}) {
  const layer = state.doc?.layers.find((entry) => entry.id === layerId) ?? null;
  if (!layer || isBackgroundLayer(layer) || isAdjustmentLayer(layer) || hasLayerMask(layer)) {
    return false;
  }

  setLayerMaskCanvas(layer, createDefaultLayerMaskCanvas(layer));
  selectSingleLayer(layer.id);
  state.activeLayerMaskId = options.enterEdit === false ? null : layer.id;
  pushHistory();
  refresh({ rebuildLayers: true });
  return true;
}

function deleteLayerMask(layerId) {
  const layer = state.doc?.layers.find((entry) => entry.id === layerId) ?? null;
  if (!layer || !hasLayerMask(layer)) {
    return false;
  }

  setLayerMaskCanvas(layer, null);
  if (state.activeLayerMaskId === layer.id) {
    state.activeLayerMaskId = null;
  }
  pushHistory();
  refresh({ rebuildLayers: true });
  return true;
}

async function applyLayerMask(layerId) {
  const layer = state.doc?.layers.find((entry) => entry.id === layerId) ?? null;
  if (!layer || !hasLayerMask(layer)) {
    return false;
  }

  const confirmed = await confirmDialog({
    title: "Apply Layer Mask",
    message: `Apply the mask on ${layer.name}? This bakes the current mask into the layer pixels.`,
    confirmLabel: "Apply",
    cancelLabel: "Cancel",
    closeOnOverlay: false
  });

  if (!confirmed) {
    return false;
  }

  flattenLayerKindsToRaster(layer);
  replaceLayerBitmap(layer, applyMaskToSourceCanvas(layer.canvas, layer.maskCanvas));
  setLayerMaskCanvas(layer, null);
  if (state.activeLayerMaskId === layer.id) {
    state.activeLayerMaskId = null;
  }
  pushHistory();
  refresh({ rebuildLayers: true });
  return true;
}

function toggleLayerClippingMask(layerId) {
  const layer = state.doc?.layers.find((entry) => entry.id === layerId) ?? null;
  if (!layer || isBackgroundLayer(layer)) {
    return false;
  }

  if (!layer.clippedToBelow && !canLayerClipToBelow(layer)) {
    return false;
  }

  layer.clippedToBelow = !layer.clippedToBelow;
  pruneInvalidLayerClipping(state.doc);
  pushHistory();
  refresh({ rebuildLayers: true });
  return true;
}

function getVectorStyleDefaults() {
  return {
    fill: "#000000",
    stroke: "transparent",
    strokeWidth: 0
  };
}

function normalizeVectorColor(value) {
  if (typeof value !== "string") {
    return "transparent";
  }

  const normalized = value.trim();
  if (!normalized || normalized === "none") {
    return "transparent";
  }

  const parsed = parseColorValue(normalized, { allowTransparent: true });
  if (parsed && (parsed.color === "transparent" || parsed.opacity === 0)) {
    return "transparent";
  }

  return normalized;
}

function isTransparentVectorPaint(value) {
  return normalizeVectorColor(value) === "transparent";
}

function colorInputValueFromPaint(value, fallback = "#000000") {
  const parsed = parseColorValue(value, { allowTransparent: true });
  if (parsed && parsed.color !== "transparent") {
    return parsed.color;
  }

  return /^#[0-9a-f]{6}$/i.test(fallback) ? fallback.toLowerCase() : "#000000";
}

function getNormalizedSvgPaintForUi(colorValue, opacityValue = null) {
  const normalized = normalizeVectorColor(colorValue);
  if (normalized === "transparent") {
    return "transparent";
  }

  const parsed = parseColorValue(normalized, { allowTransparent: true });
  if (!parsed || parsed.color === "transparent") {
    return normalized;
  }

  const explicitOpacity = opacityValue !== null
    && opacityValue !== ""
    && Number.isFinite(Number(opacityValue))
    ? clamp(Number(opacityValue), 0, 1)
    : null;
  const parsedOpacity = explicitOpacity === null
    ? parsed.opacity
    : (parsed.opacity === null ? explicitOpacity : clamp(parsed.opacity * explicitOpacity, 0, 1));

  if (parsedOpacity !== null && parsedOpacity < 0.999) {
    return rgbaStringFromParts(parsed.color, parsedOpacity);
  }

  return parsed.color;
}

function getVectorBrushFill() {
  return state.brushOpacity < 0.999
    ? rgbaStringFromParts(state.brushColor, state.brushOpacity)
    : state.brushColor;
}

function getVectorClearMaskId(layer) {
  return `bc-clear-mask-${layer?.id ?? "layer"}`;
}

function getVectorFillChanges(layer, fill) {
  const nextFill = normalizeVectorColor(fill);
  const style = ensureVectorStyleSummary(layer?.vectorStyleSummary, layer?.vectorStyle);
  const hasVisibleStroke = style.strokeWidth > 0 && !style.strokeTransparent && !style.mixedStrokeTransparency;

  if (style.fillTransparent && !style.mixedFillTransparency && hasVisibleStroke) {
    return {
      fill: nextFill,
      stroke: nextFill
    };
  }

  return { fill: nextFill };
}

function getEditableVectorTargets(container) {
  if (!container) {
    return [];
  }

  const explicitRoot = container.querySelector("[data-bc-vector-root='true']");
  if (explicitRoot) {
    return [explicitRoot];
  }

  return [...container.querySelectorAll("path, rect, circle, ellipse, line, polyline, polygon")]
    .filter((element) => !element.closest("defs, clipPath, mask, marker, pattern, symbol"));
}

function getVectorFlipTargets(svgRoot) {
  if (!svgRoot) {
    return [];
  }

  const explicitRoot = svgRoot.querySelector("[data-bc-vector-root='true']");
  if (explicitRoot) {
    return [explicitRoot];
  }

  return [...svgRoot.children].filter((element) => {
    const tagName = element.tagName.toLowerCase();
    return !["defs", "title", "desc", "metadata", "style", "script", "clipPath", "mask", "marker", "pattern", "symbol"].includes(tagName);
  });
}

function applySvgPaintAttribute(element, name, value) {
  const normalized = normalizeVectorColor(value);
  const opacityName = `${name}-opacity`;

  if (normalized === "transparent") {
    element.setAttribute(name, "none");
    element.removeAttribute(opacityName);
    element.style.setProperty(name, "none");
    element.style.removeProperty(opacityName);
    return;
  }

  const parsed = parseColorValue(normalized, { allowTransparent: true });
  if (!parsed || parsed.color === "transparent") {
    element.setAttribute(name, normalized);
    element.removeAttribute(opacityName);
    element.style.setProperty(name, normalized);
    element.style.removeProperty(opacityName);
    return;
  }

  element.setAttribute(name, parsed.color);
  element.style.setProperty(name, parsed.color);

  if (parsed.opacity !== null && parsed.opacity < 0.999) {
    element.setAttribute(opacityName, String(round(parsed.opacity, 3)));
    element.style.setProperty(opacityName, String(round(parsed.opacity, 3)));
  } else {
    element.removeAttribute(opacityName);
    element.style.removeProperty(opacityName);
  }
}

function applySvgNumericAttribute(element, name, value) {
  const numericValue = String(round(Number(value) || 0, 3));
  element.setAttribute(name, numericValue);
  element.style.setProperty(name, numericValue);
}

function ensureVectorStyle(style = {}) {
  const source = style && typeof style === "object" ? style : {};
  return {
    fill: normalizeVectorColor(source.fill ?? getVectorStyleDefaults().fill),
    stroke: normalizeVectorColor(source.stroke ?? getVectorStyleDefaults().stroke),
    strokeWidth: clamp(Number(source.strokeWidth) || 0, 0, 24)
  };
}

function ensureVectorStyleSummary(summary = {}, fallbackStyle = getVectorStyleDefaults()) {
  const fallback = ensureVectorStyle(fallbackStyle);
  const source = summary && typeof summary === "object" ? summary : {};
  const fill = normalizeVectorColor(source.fill ?? fallback.fill);
  const stroke = normalizeVectorColor(source.stroke ?? fallback.stroke);
  const strokeWidth = clamp(Number(source.strokeWidth ?? fallback.strokeWidth) || 0, 0, 24);

  return {
    fill,
    stroke,
    strokeWidth,
    mixedFill: Boolean(source.mixedFill),
    mixedStroke: Boolean(source.mixedStroke),
    mixedStrokeWidth: Boolean(source.mixedStrokeWidth),
    fillTransparent: source.fillTransparent ?? isTransparentVectorPaint(fill),
    strokeTransparent: source.strokeTransparent ?? isTransparentVectorPaint(stroke),
    mixedFillTransparency: Boolean(source.mixedFillTransparency),
    mixedStrokeTransparency: Boolean(source.mixedStrokeTransparency)
  };
}

function getVectorStyleSummaryForUi() {
  const activeLayer = getActiveLayer();
  if (!isVectorLayer(activeLayer)) {
    return ensureVectorStyleSummary(getVectorStyleDefaults());
  }

  return ensureVectorStyleSummary(activeLayer.vectorStyleSummary, activeLayer.vectorStyle);
}

function getSvgParserError(parsed) {
  return parsed.querySelector("parsererror");
}

function queryEditableVectorRoot(container) {
  return container?.querySelector("[data-bc-vector-root='true']")
    ?? container?.querySelector("path, rect, circle, ellipse, line, polyline, polygon")
    ?? null;
}

function svgMatrixToString(matrix) {
  return `matrix(${[matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f].map((value) => round(value, 6)).join(" ")})`;
}

function createIdentitySvgMatrix() {
  return {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  };
}

function isIdentitySvgMatrix(matrix) {
  return (
    Math.abs(matrix.a - 1) <= 0.000001
    && Math.abs(matrix.b) <= 0.000001
    && Math.abs(matrix.c) <= 0.000001
    && Math.abs(matrix.d - 1) <= 0.000001
    && Math.abs(matrix.e) <= 0.000001
    && Math.abs(matrix.f) <= 0.000001
  );
}

function multiplySvgMatrices(left, right) {
  return {
    a: left.a * right.a + left.c * right.b,
    b: left.b * right.a + left.d * right.b,
    c: left.a * right.c + left.c * right.d,
    d: left.b * right.c + left.d * right.d,
    e: left.a * right.e + left.c * right.f + left.e,
    f: left.b * right.e + left.d * right.f + left.f
  };
}

function parseSvgTransformMatrix(transformValue) {
  if (typeof transformValue !== "string") {
    return createIdentitySvgMatrix();
  }

  const match = transformValue.match(/matrix\(([^)]+)\)/i);
  if (!match) {
    return createIdentitySvgMatrix();
  }

  const values = match[1]
    .split(/[,\s]+/)
    .map((part) => Number(part))
    .filter((value) => Number.isFinite(value));

  if (values.length !== 6) {
    return createIdentitySvgMatrix();
  }

  const [a, b, c, d, e, f] = values;
  return { a, b, c, d, e, f };
}

function invertSvgMatrix(matrix) {
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  if (Math.abs(determinant) <= 0.000001) {
    return createIdentitySvgMatrix();
  }

  return {
    a: matrix.d / determinant,
    b: -matrix.b / determinant,
    c: -matrix.c / determinant,
    d: matrix.a / determinant,
    e: (matrix.c * matrix.f - matrix.d * matrix.e) / determinant,
    f: (matrix.b * matrix.e - matrix.a * matrix.f) / determinant
  };
}

function transformPointWithMatrix(matrix, x, y) {
  return {
    x: matrix.a * x + matrix.c * y + matrix.e,
    y: matrix.b * x + matrix.d * y + matrix.f
  };
}

function getTransformedSvgBounds(element, bbox, strokeWidth = 0) {
  let matrix = null;
  try {
    matrix = element.getCTM();
  } catch {
    matrix = null;
  }
  if (!matrix) {
    return null;
  }

  const halfStroke = Math.max(0, strokeWidth) / 2;
  const corners = [
    transformPointWithMatrix(matrix, bbox.x - halfStroke, bbox.y - halfStroke),
    transformPointWithMatrix(matrix, bbox.x + bbox.width + halfStroke, bbox.y - halfStroke),
    transformPointWithMatrix(matrix, bbox.x + bbox.width + halfStroke, bbox.y + bbox.height + halfStroke),
    transformPointWithMatrix(matrix, bbox.x - halfStroke, bbox.y + bbox.height + halfStroke)
  ];
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);

  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
    matrix
  };
}

function applyComputedSvgStylesToClone(sourceElement, cloneElement) {
  const computed = getComputedStyle(sourceElement);
  const attributeMap = [
    ["fill", normalizeVectorColor(computed.fill)],
    ["fill-opacity", computed.fillOpacity],
    ["stroke", normalizeVectorColor(computed.stroke)],
    ["stroke-opacity", computed.strokeOpacity],
    ["stroke-width", computed.strokeWidth],
    ["stroke-linecap", computed.strokeLinecap],
    ["stroke-linejoin", computed.strokeLinejoin],
    ["stroke-miterlimit", computed.strokeMiterlimit],
    ["stroke-dasharray", computed.strokeDasharray],
    ["stroke-dashoffset", computed.strokeDashoffset],
    ["opacity", computed.opacity],
    ["fill-rule", computed.fillRule]
  ];

  for (const [name, value] of attributeMap) {
    if (typeof value === "string" && value && value !== "normal") {
      cloneElement.setAttribute(name, value);
    }
  }
}

function collectSvgDefsMarkup(svgRoot) {
  return [...svgRoot.querySelectorAll("defs")].map((node) => node.outerHTML).join("\n");
}

function ensureSvgDefsElement(svgRoot) {
  if (!svgRoot) {
    return null;
  }

  const existing = [...svgRoot.children].find((child) => child.tagName?.toLowerCase() === "defs");
  if (existing) {
    return existing;
  }

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svgRoot.prepend(defs);
  return defs;
}

function getSvgDocumentBounds(svgRoot, fallbackWidth = 300, fallbackHeight = 150) {
  const viewBox = svgRoot.viewBox?.baseVal;
  if (viewBox && Number.isFinite(viewBox.width) && Number.isFinite(viewBox.height) && viewBox.width > 0 && viewBox.height > 0) {
    return {
      x: viewBox.x,
      y: viewBox.y,
      width: viewBox.width,
      height: viewBox.height
    };
  }

  const viewBoxAttribute = typeof svgRoot.getAttribute === "function" ? svgRoot.getAttribute("viewBox") : "";
  if (typeof viewBoxAttribute === "string" && viewBoxAttribute.trim()) {
    const values = viewBoxAttribute
      .trim()
      .split(/[,\s]+/)
      .map((part) => Number(part))
      .filter((value) => Number.isFinite(value));
    if (values.length === 4 && values[2] > 0 && values[3] > 0) {
      return {
        x: values[0],
        y: values[1],
        width: values[2],
        height: values[3]
      };
    }
  }

  const widthAttr = Number.parseFloat(svgRoot.getAttribute("width"));
  const heightAttr = Number.parseFloat(svgRoot.getAttribute("height"));
  return {
    x: 0,
    y: 0,
    width: Number.isFinite(widthAttr) && widthAttr > 0 ? widthAttr : fallbackWidth,
    height: Number.isFinite(heightAttr) && heightAttr > 0 ? heightAttr : fallbackHeight
  };
}

function getVectorLayerStyleFromElement(element) {
  const computed = getComputedStyle(element);
  return ensureVectorStyle({
    fill: getNormalizedSvgPaintForUi(computed.fill, computed.fillOpacity),
    stroke: getNormalizedSvgPaintForUi(computed.stroke, computed.strokeOpacity),
    strokeWidth: Number.parseFloat(computed.strokeWidth) || 0
  });
}

function getVectorStyleSummaryFromTargets(targets, fallbackStyle = getVectorStyleDefaults()) {
  if (!targets.length) {
    return ensureVectorStyleSummary(fallbackStyle, fallbackStyle);
  }

  const targetStyles = targets.map((target) => getVectorLayerStyleFromElement(target));
  const firstStyle = targetStyles[0];
  const fillTransparency = targetStyles.map((style) => isTransparentVectorPaint(style.fill));
  const strokeTransparency = targetStyles.map((style) => isTransparentVectorPaint(style.stroke));

  return ensureVectorStyleSummary({
    fill: firstStyle.fill,
    stroke: firstStyle.stroke,
    strokeWidth: firstStyle.strokeWidth,
    mixedFill: targetStyles.some((style) => style.fill !== firstStyle.fill),
    mixedStroke: targetStyles.some((style) => style.stroke !== firstStyle.stroke),
    mixedStrokeWidth: targetStyles.some((style) => style.strokeWidth !== firstStyle.strokeWidth),
    fillTransparent: fillTransparency.every(Boolean),
    strokeTransparent: strokeTransparency.every(Boolean),
    mixedFillTransparency: fillTransparency.some((value) => value !== fillTransparency[0]),
    mixedStrokeTransparency: strokeTransparency.some((value) => value !== strokeTransparency[0])
  }, fallbackStyle);
}

function getVectorLayerStyleFromTargets(targets, fallbackStyle = getVectorStyleDefaults()) {
  return ensureVectorStyle(getVectorStyleSummaryFromTargets(targets, fallbackStyle));
}

function getVectorStyleFromSvgSource(source, fallbackStyle = getVectorStyleDefaults()) {
  return ensureVectorStyle(getVectorStyleSummaryFromSvgSource(source, fallbackStyle));
}

function getVectorStyleSummaryFromSvgSource(source, fallbackStyle = getVectorStyleDefaults()) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(source, "image/svg+xml");
  if (getSvgParserError(parsed)) {
    return ensureVectorStyleSummary(fallbackStyle, fallbackStyle);
  }

  const svgRoot = parsed.documentElement;
  if (!svgRoot) {
    return ensureVectorStyleSummary(fallbackStyle, fallbackStyle);
  }

  const tempHost = document.createElement("div");
  tempHost.style.position = "absolute";
  tempHost.style.left = "-100000px";
  tempHost.style.top = "-100000px";
  tempHost.style.visibility = "hidden";
  tempHost.style.pointerEvents = "none";
  const measuringRoot = svgRoot.cloneNode(true);
  tempHost.append(measuringRoot);
  document.body.append(tempHost);

  try {
    return getVectorStyleSummaryFromTargets(getEditableVectorTargets(measuringRoot), fallbackStyle);
  } finally {
    tempHost.remove();
  }
}

function createStandaloneSvgForElement(cloneMarkup, defsMarkup, bounds) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${round(bounds.width, 3)}" height="${round(bounds.height, 3)}" viewBox="0 0 ${round(bounds.width, 3)} ${round(bounds.height, 3)}" overflow="visible">`,
    defsMarkup || "",
    cloneMarkup,
    "</svg>"
  ].filter(Boolean).join("\n");
}

function parseSvgPointList(pointsValue) {
  const values = String(pointsValue || "")
    .trim()
    .split(/[,\s]+/)
    .map((part) => Number(part))
    .filter((value) => Number.isFinite(value));
  const points = [];

  for (let index = 0; index < values.length - 1; index += 2) {
    points.push({
      x: values[index],
      y: values[index + 1]
    });
  }

  return points;
}

function serializeSvgPointList(points) {
  return points
    .map((point) => `${round(point.x, 3)} ${round(point.y, 3)}`)
    .join(" ");
}

function buildPathDataFromSvgElement(element) {
  const tagName = element.tagName.toLowerCase();

  if (tagName === "path") {
    return element.getAttribute("d") || "";
  }

  if (tagName === "rect") {
    const x = Number.parseFloat(element.getAttribute("x")) || 0;
    const y = Number.parseFloat(element.getAttribute("y")) || 0;
    const width = Math.max(0, Number.parseFloat(element.getAttribute("width")) || 0);
    const height = Math.max(0, Number.parseFloat(element.getAttribute("height")) || 0);
    const rx = Math.max(0, Number.parseFloat(element.getAttribute("rx")) || 0);
    const ry = Math.max(0, Number.parseFloat(element.getAttribute("ry")) || 0);

    if (width <= 0 || height <= 0) {
      return "";
    }

    if (rx <= 0 && ry <= 0) {
      return `M ${x} ${y} H ${x + width} V ${y + height} H ${x} Z`;
    }

    const radiusX = clamp(rx || ry, 0, width / 2);
    const radiusY = clamp(ry || rx, 0, height / 2);
    return [
      `M ${x + radiusX} ${y}`,
      `H ${x + width - radiusX}`,
      `A ${radiusX} ${radiusY} 0 0 1 ${x + width} ${y + radiusY}`,
      `V ${y + height - radiusY}`,
      `A ${radiusX} ${radiusY} 0 0 1 ${x + width - radiusX} ${y + height}`,
      `H ${x + radiusX}`,
      `A ${radiusX} ${radiusY} 0 0 1 ${x} ${y + height - radiusY}`,
      `V ${y + radiusY}`,
      `A ${radiusX} ${radiusY} 0 0 1 ${x + radiusX} ${y}`,
      "Z"
    ].join(" ");
  }

  if (tagName === "circle" || tagName === "ellipse") {
    const cx = Number.parseFloat(element.getAttribute("cx")) || 0;
    const cy = Number.parseFloat(element.getAttribute("cy")) || 0;
    const rx = tagName === "circle"
      ? Math.max(0, Number.parseFloat(element.getAttribute("r")) || 0)
      : Math.max(0, Number.parseFloat(element.getAttribute("rx")) || 0);
    const ry = tagName === "circle"
      ? rx
      : Math.max(0, Number.parseFloat(element.getAttribute("ry")) || 0);

    if (rx <= 0 || ry <= 0) {
      return "";
    }

    return [
      `M ${cx + rx} ${cy}`,
      `A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`,
      `A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}`,
      "Z"
    ].join(" ");
  }

  if (tagName === "line") {
    const x1 = Number.parseFloat(element.getAttribute("x1")) || 0;
    const y1 = Number.parseFloat(element.getAttribute("y1")) || 0;
    const x2 = Number.parseFloat(element.getAttribute("x2")) || 0;
    const y2 = Number.parseFloat(element.getAttribute("y2")) || 0;
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  if (tagName === "polyline" || tagName === "polygon") {
    const points = parseSvgPointList(element.getAttribute("points"));
    if (!points.length) {
      return "";
    }

    const commands = [`M ${points[0].x} ${points[0].y}`];
    for (const point of points.slice(1)) {
      commands.push(`L ${point.x} ${point.y}`);
    }
    if (tagName === "polygon") {
      commands.push("Z");
    }
    return commands.join(" ");
  }

  return "";
}

function createEditablePathCloneFromElement(element) {
  const pathData = buildPathDataFromSvgElement(element);
  if (!pathData) {
    return null;
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  path.setAttribute("data-bc-vector-root", "true");
  applyComputedSvgStylesToClone(element, path);

  try {
    const matrix = element.getCTM();
    if (matrix && !isIdentitySvgMatrix(matrix)) {
      path.setAttribute("transform", svgMatrixToString(matrix));
    }
  } catch {
    path.removeAttribute("transform");
  }

  return path;
}

function tokenizeSvgPathData(pathData) {
  const tokens = [];
  const pattern = /([AaCcHhLlMmQqSsTtVvZz])|([-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?)/g;
  let match = pattern.exec(pathData);

  while (match) {
    if (match[1]) {
      tokens.push(match[1]);
    } else {
      tokens.push(Number(match[2]));
    }
    match = pattern.exec(pathData);
  }

  return tokens;
}

function parseSvgPathData(pathData) {
  const tokens = tokenizeSvgPathData(pathData);
  const commands = [];
  const parameterCounts = {
    M: 2,
    L: 2,
    H: 1,
    V: 1,
    C: 6,
    S: 4,
    Q: 4,
    T: 2,
    A: 7,
    Z: 0
  };
  let index = 0;
  let currentCommand = null;
  let currentPoint = { x: 0, y: 0 };
  let subpathStart = { x: 0, y: 0 };
  let previousCubicControl = null;
  let previousQuadControl = null;
  let previousType = null;

  while (index < tokens.length) {
    if (typeof tokens[index] === "string") {
      currentCommand = tokens[index];
      index += 1;
    } else if (!currentCommand) {
      throw new Error("SVG path data is invalid.");
    }

    const commandType = currentCommand.toUpperCase();
    const isRelative = currentCommand !== commandType;
    const parameterCount = parameterCounts[commandType];
    if (parameterCount === undefined) {
      throw new Error(`Unsupported SVG path command: ${currentCommand}`);
    }

    if (commandType === "Z") {
      commands.push({ type: "Z" });
      currentPoint = { ...subpathStart };
      previousCubicControl = null;
      previousQuadControl = null;
      previousType = "Z";
      currentCommand = null;
      continue;
    }

    let isFirstMove = commandType === "M";
    while (index + parameterCount <= tokens.length) {
      if (typeof tokens[index] === "string") {
        break;
      }

      const parameters = tokens.slice(index, index + parameterCount);
      index += parameterCount;

      if (commandType === "M") {
        const nextPoint = {
          x: (isRelative ? currentPoint.x : 0) + parameters[0],
          y: (isRelative ? currentPoint.y : 0) + parameters[1]
        };
        commands.push({
          type: isFirstMove ? "M" : "L",
          x: nextPoint.x,
          y: nextPoint.y
        });
        currentPoint = nextPoint;
        subpathStart = { ...nextPoint };
        previousCubicControl = null;
        previousQuadControl = null;
        previousType = isFirstMove ? "M" : "L";
        isFirstMove = false;
        continue;
      }

      if (commandType === "L") {
        currentPoint = {
          x: (isRelative ? currentPoint.x : 0) + parameters[0],
          y: (isRelative ? currentPoint.y : 0) + parameters[1]
        };
        commands.push({ type: "L", x: currentPoint.x, y: currentPoint.y });
        previousCubicControl = null;
        previousQuadControl = null;
        previousType = "L";
        continue;
      }

      if (commandType === "H") {
        currentPoint = {
          x: (isRelative ? currentPoint.x : 0) + parameters[0],
          y: currentPoint.y
        };
        commands.push({ type: "L", x: currentPoint.x, y: currentPoint.y });
        previousCubicControl = null;
        previousQuadControl = null;
        previousType = "L";
        continue;
      }

      if (commandType === "V") {
        currentPoint = {
          x: currentPoint.x,
          y: (isRelative ? currentPoint.y : 0) + parameters[0]
        };
        commands.push({ type: "L", x: currentPoint.x, y: currentPoint.y });
        previousCubicControl = null;
        previousQuadControl = null;
        previousType = "L";
        continue;
      }

      if (commandType === "C") {
        const command = {
          type: "C",
          x1: (isRelative ? currentPoint.x : 0) + parameters[0],
          y1: (isRelative ? currentPoint.y : 0) + parameters[1],
          x2: (isRelative ? currentPoint.x : 0) + parameters[2],
          y2: (isRelative ? currentPoint.y : 0) + parameters[3],
          x: (isRelative ? currentPoint.x : 0) + parameters[4],
          y: (isRelative ? currentPoint.y : 0) + parameters[5]
        };
        commands.push(command);
        currentPoint = { x: command.x, y: command.y };
        previousCubicControl = { x: command.x2, y: command.y2 };
        previousQuadControl = null;
        previousType = "C";
        continue;
      }

      if (commandType === "S") {
        const reflected = previousType === "C"
          ? {
            x: currentPoint.x * 2 - previousCubicControl.x,
            y: currentPoint.y * 2 - previousCubicControl.y
          }
          : { ...currentPoint };
        const command = {
          type: "C",
          x1: reflected.x,
          y1: reflected.y,
          x2: (isRelative ? currentPoint.x : 0) + parameters[0],
          y2: (isRelative ? currentPoint.y : 0) + parameters[1],
          x: (isRelative ? currentPoint.x : 0) + parameters[2],
          y: (isRelative ? currentPoint.y : 0) + parameters[3]
        };
        commands.push(command);
        currentPoint = { x: command.x, y: command.y };
        previousCubicControl = { x: command.x2, y: command.y2 };
        previousQuadControl = null;
        previousType = "C";
        continue;
      }

      if (commandType === "Q") {
        const command = {
          type: "Q",
          x1: (isRelative ? currentPoint.x : 0) + parameters[0],
          y1: (isRelative ? currentPoint.y : 0) + parameters[1],
          x: (isRelative ? currentPoint.x : 0) + parameters[2],
          y: (isRelative ? currentPoint.y : 0) + parameters[3]
        };
        commands.push(command);
        currentPoint = { x: command.x, y: command.y };
        previousCubicControl = null;
        previousQuadControl = { x: command.x1, y: command.y1 };
        previousType = "Q";
        continue;
      }

      if (commandType === "T") {
        const reflected = previousType === "Q"
          ? {
            x: currentPoint.x * 2 - previousQuadControl.x,
            y: currentPoint.y * 2 - previousQuadControl.y
          }
          : { ...currentPoint };
        const command = {
          type: "Q",
          x1: reflected.x,
          y1: reflected.y,
          x: (isRelative ? currentPoint.x : 0) + parameters[0],
          y: (isRelative ? currentPoint.y : 0) + parameters[1]
        };
        commands.push(command);
        currentPoint = { x: command.x, y: command.y };
        previousCubicControl = null;
        previousQuadControl = { x: command.x1, y: command.y1 };
        previousType = "Q";
        continue;
      }

      if (commandType === "A") {
        const command = {
          type: "A",
          rx: Math.abs(parameters[0]),
          ry: Math.abs(parameters[1]),
          rotation: parameters[2],
          largeArc: parameters[3] ? 1 : 0,
          sweep: parameters[4] ? 1 : 0,
          x: (isRelative ? currentPoint.x : 0) + parameters[5],
          y: (isRelative ? currentPoint.y : 0) + parameters[6]
        };
        commands.push(command);
        currentPoint = { x: command.x, y: command.y };
        previousCubicControl = null;
        previousQuadControl = null;
        previousType = "A";
      }
    }
  }

  return commands;
}

function serializeSvgPathData(commands) {
  return commands.map((command) => {
    if (command.type === "M" || command.type === "L") {
      return `${command.type} ${round(command.x, 3)} ${round(command.y, 3)}`;
    }

    if (command.type === "C") {
      return `C ${round(command.x1, 3)} ${round(command.y1, 3)} ${round(command.x2, 3)} ${round(command.y2, 3)} ${round(command.x, 3)} ${round(command.y, 3)}`;
    }

    if (command.type === "Q") {
      return `Q ${round(command.x1, 3)} ${round(command.y1, 3)} ${round(command.x, 3)} ${round(command.y, 3)}`;
    }

    if (command.type === "A") {
      return `A ${round(command.rx, 3)} ${round(command.ry, 3)} ${round(command.rotation, 3)} ${command.largeArc ? 1 : 0} ${command.sweep ? 1 : 0} ${round(command.x, 3)} ${round(command.y, 3)}`;
    }

    return "Z";
  }).join(" ");
}

async function extractSvgVectorObjects(svgSource, baseName = "SVG") {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(svgSource, "image/svg+xml");
  if (getSvgParserError(parsed)) {
    throw new Error("SVG file could not be parsed.");
  }
  const svgRoot = parsed.documentElement;
  if (!svgRoot || svgRoot.tagName.toLowerCase() !== "svg") {
    throw new Error("SVG file could not be parsed.");
  }

  const docBounds = getSvgDocumentBounds(svgRoot);
  const tempHost = document.createElement("div");
  tempHost.style.position = "absolute";
  tempHost.style.left = "-100000px";
  tempHost.style.top = "-100000px";
  tempHost.style.visibility = "hidden";
  tempHost.style.pointerEvents = "none";
  const measuringRoot = svgRoot.cloneNode(true);
  tempHost.append(measuringRoot);
  document.body.append(tempHost);

  try {
    const drawableElements = [...measuringRoot.querySelectorAll("path, rect, circle, ellipse, line, polyline, polygon")];
    const defsMarkup = collectSvgDefsMarkup(measuringRoot);
    const objects = [];

    for (const [index, element] of drawableElements.entries()) {
      try {
        const computed = getComputedStyle(element);
        if (computed.display === "none" || computed.visibility === "hidden" || Number(computed.opacity) === 0) {
          continue;
        }

        const bbox = element.getBBox();
        if (!Number.isFinite(bbox.width) || !Number.isFinite(bbox.height) || (bbox.width <= 0 && bbox.height <= 0)) {
          continue;
        }

        const vectorStyle = getVectorLayerStyleFromElement(element);
        const transformedBounds = getTransformedSvgBounds(element, bbox, vectorStyle.strokeWidth);
        if (!transformedBounds || transformedBounds.width <= 0 || transformedBounds.height <= 0) {
          continue;
        }

        const editablePath = createEditablePathCloneFromElement(element);
        if (!editablePath) {
          continue;
        }

        const padding = 16;
        const paddedBounds = {
          x: transformedBounds.x - padding,
          y: transformedBounds.y - padding,
          width: transformedBounds.width + padding * 2,
          height: transformedBounds.height + padding * 2
        };
        const markup = `<g transform="translate(${-round(paddedBounds.x, 6)} ${-round(paddedBounds.y, 6)})">${editablePath.outerHTML}</g>`;
        const source = createStandaloneSvgForElement(markup, defsMarkup, paddedBounds);
        const layerName = element.getAttribute("id")
          || `${baseName} ${element.tagName.toLowerCase()} ${index + 1}`;

        objects.push({
          name: layerName,
          source,
          x: paddedBounds.x - docBounds.x,
          y: paddedBounds.y - docBounds.y,
          width: paddedBounds.width,
          height: paddedBounds.height,
          vectorStyle
        });
      } catch {
        continue;
      }
    }

    return {
      width: docBounds.width,
      height: docBounds.height,
      objects
    };
  } finally {
    tempHost.remove();
  }
}

async function reloadVectorLayerImage(layer) {
  if (!isVectorLayer(layer)) {
    return;
  }

  layer.vectorImage = await loadSvgImageFromSource(layer.vectorSource);
}

function createSvgFlipMatrix(bounds, axis) {
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;

  if (axis === "horizontal") {
    return {
      a: -1,
      b: 0,
      c: 0,
      d: 1,
      e: round(centerX * 2, 6),
      f: 0
    };
  }

  return {
    a: 1,
    b: 0,
    c: 0,
    d: -1,
    e: 0,
    f: round(centerY * 2, 6)
  };
}

async function flipVectorLayer(layer, axis) {
  if (!isVectorLayer(layer) || (axis !== "horizontal" && axis !== "vertical")) {
    return false;
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(layer.vectorSource, "image/svg+xml");
  if (getSvgParserError(parsed)) {
    return false;
  }

  const svgRoot = parsed.documentElement;
  if (!svgRoot) {
    return false;
  }

  const explicitRoot = svgRoot.querySelector("[data-bc-vector-root='true']");
  const targets = explicitRoot ? [explicitRoot] : getVectorFlipTargets(svgRoot);
  if (!targets.length) {
    return false;
  }

  const flipMatrix = createSvgFlipMatrix(
    getSvgDocumentBounds(svgRoot, layer.vectorIntrinsicWidth, layer.vectorIntrinsicHeight),
    axis
  );
  let sourceMatrices = targets.map((target) => parseSvgTransformMatrix(target.getAttribute("transform")));

  if (!explicitRoot) {
    const tempHost = document.createElement("div");
    tempHost.style.position = "absolute";
    tempHost.style.left = "-100000px";
    tempHost.style.top = "-100000px";
    tempHost.style.visibility = "hidden";
    tempHost.style.pointerEvents = "none";
    const measuringRoot = svgRoot.cloneNode(true);
    tempHost.append(measuringRoot);
    document.body.append(tempHost);

    try {
      const measuringTargets = getVectorFlipTargets(measuringRoot);
      let rootMatrix = null;
      try {
        rootMatrix = measuringRoot.getCTM?.() ?? null;
      } catch {
        rootMatrix = null;
      }
      const rootTransform = rootMatrix
        ? {
          a: rootMatrix.a,
          b: rootMatrix.b,
          c: rootMatrix.c,
          d: rootMatrix.d,
          e: rootMatrix.e,
          f: rootMatrix.f
        }
        : createIdentitySvgMatrix();
      const inverseRootTransform = invertSvgMatrix(rootTransform);

      sourceMatrices = targets.map((target, index) => {
        const measuringTarget = measuringTargets[index];
        let matrix = null;
        try {
          matrix = measuringTarget?.getCTM?.() ?? null;
        } catch {
          matrix = null;
        }

        if (!matrix) {
          return parseSvgTransformMatrix(target.getAttribute("transform"));
        }

        return multiplySvgMatrices(inverseRootTransform, {
          a: matrix.a,
          b: matrix.b,
          c: matrix.c,
          d: matrix.d,
          e: matrix.e,
          f: matrix.f
        });
      });
    } finally {
      tempHost.remove();
    }
  }

  for (const [index, target] of targets.entries()) {
    const nextMatrix = multiplySvgMatrices(
      flipMatrix,
      sourceMatrices[index] ?? createIdentitySvgMatrix()
    );

    if (isIdentitySvgMatrix(nextMatrix)) {
      target.removeAttribute("transform");
    } else {
      target.setAttribute("transform", svgMatrixToString(nextMatrix));
    }
  }

  layer.vectorSource = new XMLSerializer().serializeToString(svgRoot);
  layer.vectorStyleSummary = getVectorStyleSummaryFromSvgSource(layer.vectorSource, layer.vectorStyle);
  layer.vectorStyle = ensureVectorStyle(layer.vectorStyleSummary);
  await reloadVectorLayerImage(layer);
  renderVectorLayerBitmap(layer, layer.width, layer.height);
  return true;
}

function getOrCreateVectorClearTarget(svgRoot) {
  if (!svgRoot) {
    return null;
  }

  const explicitRoot = svgRoot.querySelector("[data-bc-vector-root='true']");
  if (explicitRoot) {
    return explicitRoot;
  }

  const existingRoot = svgRoot.querySelector("[data-bc-clear-root='true']");
  if (existingRoot) {
    return existingRoot;
  }

  const movableChildren = [...svgRoot.children].filter((child) => {
    const tagName = child.tagName?.toLowerCase?.() || "";
    return !["defs", "title", "desc", "metadata", "style", "script"].includes(tagName);
  });

  if (!movableChildren.length) {
    return null;
  }

  if (movableChildren.length === 1) {
    movableChildren[0].setAttribute("data-bc-clear-root", "true");
    return movableChildren[0];
  }

  const clearRoot = document.createElementNS("http://www.w3.org/2000/svg", "g");
  clearRoot.setAttribute("data-bc-clear-root", "true");
  svgRoot.insertBefore(clearRoot, movableChildren[0]);
  for (const child of movableChildren) {
    clearRoot.append(child);
  }
  return clearRoot;
}

function createVectorClearPolygonElement(layer, selectionRect) {
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  const points = [
    { x: selectionRect.x, y: selectionRect.y },
    { x: selectionRect.x + selectionRect.width, y: selectionRect.y },
    { x: selectionRect.x + selectionRect.width, y: selectionRect.y + selectionRect.height },
    { x: selectionRect.x, y: selectionRect.y + selectionRect.height }
  ].map((point) => docPointToVectorSourcePoint(layer, point));

  polygon.setAttribute("points", serializeSvgPointList(points));
  polygon.setAttribute("fill", "#000000");
  polygon.setAttribute("stroke", "none");
  polygon.setAttribute("data-bc-clear-cut", "true");
  return polygon;
}

function ensureVectorClearMask(svgRoot, layer) {
  const defs = ensureSvgDefsElement(svgRoot);
  if (!defs) {
    return null;
  }

  const maskId = getVectorClearMaskId(layer);
  let mask = defs.querySelector(`[id="${maskId}"]`);
  const bounds = getSvgDocumentBounds(svgRoot, layer.vectorIntrinsicWidth, layer.vectorIntrinsicHeight);

  if (!mask) {
    mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    mask.setAttribute("id", maskId);
    defs.append(mask);
  }

  mask.setAttribute("maskUnits", "userSpaceOnUse");
  mask.setAttribute("maskContentUnits", "userSpaceOnUse");
  mask.setAttribute("x", String(round(bounds.x, 6)));
  mask.setAttribute("y", String(round(bounds.y, 6)));
  mask.setAttribute("width", String(round(bounds.width, 6)));
  mask.setAttribute("height", String(round(bounds.height, 6)));

  let baseRect = mask.querySelector("[data-bc-clear-base='true']");
  if (!baseRect) {
    baseRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    baseRect.setAttribute("data-bc-clear-base", "true");
    mask.prepend(baseRect);
  }

  baseRect.setAttribute("x", String(round(bounds.x, 6)));
  baseRect.setAttribute("y", String(round(bounds.y, 6)));
  baseRect.setAttribute("width", String(round(bounds.width, 6)));
  baseRect.setAttribute("height", String(round(bounds.height, 6)));
  baseRect.setAttribute("fill", "#ffffff");
  baseRect.setAttribute("stroke", "none");

  return mask;
}

function remapVectorClearMaskIds(source, previousLayerId, nextLayerId) {
  if (typeof source !== "string" || !previousLayerId || !nextLayerId || previousLayerId === nextLayerId) {
    return source;
  }

  const previousMaskId = getVectorClearMaskId({ id: previousLayerId });
  const nextMaskId = getVectorClearMaskId({ id: nextLayerId });
  return source.split(previousMaskId).join(nextMaskId);
}

async function clearVectorLayerSelection(layer, selectionRect) {
  if (!isVectorLayer(layer) || !selectionRect) {
    return false;
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(layer.vectorSource, "image/svg+xml");
  if (getSvgParserError(parsed)) {
    return false;
  }

  const svgRoot = parsed.documentElement;
  if (!svgRoot) {
    return false;
  }

  const clearTarget = getOrCreateVectorClearTarget(svgRoot);
  const clearMask = ensureVectorClearMask(svgRoot, layer);
  if (!clearTarget || !clearMask) {
    return false;
  }

  clearMask.append(createVectorClearPolygonElement(layer, selectionRect));
  clearTarget.setAttribute("mask", `url(#${getVectorClearMaskId(layer)})`);

  layer.vectorSource = new XMLSerializer().serializeToString(svgRoot);
  layer.vectorStyleSummary = getVectorStyleSummaryFromSvgSource(layer.vectorSource, layer.vectorStyle);
  layer.vectorStyle = ensureVectorStyle(layer.vectorStyleSummary);
  await reloadVectorLayerImage(layer);
  renderVectorLayerBitmap(layer, layer.width, layer.height);
  return true;
}

async function updateVectorLayerStyle(layer, changes = {}) {
  if (!isVectorLayer(layer)) {
    return false;
  }

  const changeKeys = new Set(Object.keys(changes));
  if (!changeKeys.size) {
    return false;
  }

  const currentStyle = getVectorStyleFromSvgSource(layer.vectorSource, layer.vectorStyle);
  const nextStyle = ensureVectorStyle({
    ...currentStyle,
    ...changes
  });
  const parser = new DOMParser();
  const parsed = parser.parseFromString(layer.vectorSource, "image/svg+xml");
  if (getSvgParserError(parsed)) {
    return false;
  }
  const targets = getEditableVectorTargets(parsed);
  if (!targets.length) {
    return false;
  }

  for (const target of targets) {
    if (changeKeys.has("fill")) {
      applySvgPaintAttribute(target, "fill", nextStyle.fill);
    }
    if (changeKeys.has("stroke")) {
      applySvgPaintAttribute(target, "stroke", nextStyle.stroke);
    }
    if (changeKeys.has("strokeWidth")) {
      applySvgNumericAttribute(target, "stroke-width", nextStyle.strokeWidth);
    }
  }

  layer.vectorSource = new XMLSerializer().serializeToString(parsed.documentElement);
  layer.vectorStyleSummary = getVectorStyleSummaryFromSvgSource(layer.vectorSource, nextStyle);
  layer.vectorStyle = ensureVectorStyle(layer.vectorStyleSummary);
  await reloadVectorLayerImage(layer);
  renderVectorLayerBitmap(layer, layer.width, layer.height);
  return true;
}

function applyActiveVectorLayerStyle(changes, errorMessage) {
  const activeLayer = getActiveLayer();
  if (!isVectorLayer(activeLayer)) {
    refresh();
    return;
  }

  void updateVectorLayerStyle(activeLayer, changes).then((updated) => {
    if (!updated) {
      refresh();
      return;
    }

    pushHistory();
    refresh({ rebuildLayers: true });
  }).catch((error) => reportError(error, errorMessage));
}

function getVectorIntrinsicSize(layer) {
  return {
    width: Math.max(1, Number(layer?.vectorIntrinsicWidth) || Number(layer?.canvas?.width) || Number(layer?.width) || 1),
    height: Math.max(1, Number(layer?.vectorIntrinsicHeight) || Number(layer?.canvas?.height) || Number(layer?.height) || 1)
  };
}

function vectorSourcePointToLayerDisplayPoint(layer, point) {
  const intrinsic = getVectorIntrinsicSize(layer);
  return {
    x: (point.x / intrinsic.width) * layer.width,
    y: (point.y / intrinsic.height) * layer.height
  };
}

function vectorSourcePointToDocPoint(layer, point) {
  return layerDisplayPointToDocPoint(layer, vectorSourcePointToLayerDisplayPoint(layer, point));
}

function docPointToVectorSourcePoint(layer, point) {
  const intrinsic = getVectorIntrinsicSize(layer);
  const displayPoint = getLayerDisplayPoint(layer, point);
  return {
    x: (displayPoint.x / Math.max(layer.width, 0.0001)) * intrinsic.width,
    y: (displayPoint.y / Math.max(layer.height, 0.0001)) * intrinsic.height
  };
}

function docPointToVectorPathLocalPoint(layer, matrix, point) {
  const sourcePoint = docPointToVectorSourcePoint(layer, point);
  const inverse = invertSvgMatrix(matrix);
  return transformPointWithMatrix(inverse, sourcePoint.x, sourcePoint.y);
}

function createVectorPathModelFromSource(source) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(source, "image/svg+xml");
  if (getSvgParserError(parsed)) {
    return null;
  }

  const target = queryEditableVectorRoot(parsed);
  if (!target || target.tagName.toLowerCase() !== "path") {
    return null;
  }

  const pathData = target.getAttribute("d") || "";
  if (!pathData.trim()) {
    return null;
  }

  try {
    return {
      parsed,
      target,
      commands: parseSvgPathData(pathData),
      matrix: parseSvgTransformMatrix(target.getAttribute("transform"))
    };
  } catch {
    return null;
  }
}

function getVectorPathModel(layer) {
  if (!isVectorLayer(layer)) {
    return null;
  }

  return createVectorPathModelFromSource(layer.vectorSource);
}

function getVectorPathHandleDescriptors(layer) {
  const model = getVectorPathModel(layer);
  if (!model) {
    return [];
  }

  const handles = [];
  let currentPoint = { x: 0, y: 0 };
  let subpathStart = { x: 0, y: 0 };

  const addHandle = (commandIndex, role, point, options = {}) => {
    const sourcePoint = transformPointWithMatrix(model.matrix, point.x, point.y);
    const docPoint = vectorSourcePointToDocPoint(layer, sourcePoint);
    const canvasPoint = docToCanvasPoint(docPoint.x, docPoint.y);
    handles.push({
      commandIndex,
      role,
      point: { ...point },
      docPoint,
      canvasPoint,
      guidePoints: options.guidePoints ?? []
    });
  };

  model.commands.forEach((command, commandIndex) => {
    if (command.type === "M") {
      currentPoint = { x: command.x, y: command.y };
      subpathStart = { ...currentPoint };
      addHandle(commandIndex, "anchor", currentPoint);
      return;
    }

    if (command.type === "L" || command.type === "A") {
      currentPoint = { x: command.x, y: command.y };
      addHandle(commandIndex, "anchor", currentPoint);
      return;
    }

    if (command.type === "Q") {
      const startPoint = { ...currentPoint };
      addHandle(commandIndex, "control1", { x: command.x1, y: command.y1 }, {
        guidePoints: [startPoint, { x: command.x, y: command.y }]
      });
      currentPoint = { x: command.x, y: command.y };
      addHandle(commandIndex, "anchor", currentPoint);
      return;
    }

    if (command.type === "C") {
      const startPoint = { ...currentPoint };
      addHandle(commandIndex, "control1", { x: command.x1, y: command.y1 }, {
        guidePoints: [startPoint]
      });
      addHandle(commandIndex, "control2", { x: command.x2, y: command.y2 }, {
        guidePoints: [{ x: command.x, y: command.y }]
      });
      currentPoint = { x: command.x, y: command.y };
      addHandle(commandIndex, "anchor", currentPoint);
      return;
    }

    if (command.type === "Z") {
      currentPoint = { ...subpathStart };
    }
  });

  return handles;
}

function getVectorHandleTarget(canvasPoint, layer = getActiveLayer()) {
  if (!isVectorLayer(layer)) {
    return null;
  }

  const handles = getVectorPathHandleDescriptors(layer);
  const hitRadius = Math.max(8, getHandleSize() / 2.2);

  for (const handle of handles.slice().reverse()) {
    const distance = Math.hypot(canvasPoint.x - handle.canvasPoint.x, canvasPoint.y - handle.canvasPoint.y);
    if (distance <= hitRadius) {
      return handle;
    }
  }

  return null;
}

function renderVectorPathOverlay(layer) {
  const model = getVectorPathModel(layer);
  if (!model) {
    return;
  }

  const pathData = model.target.getAttribute("d") || "";
  if (!pathData) {
    return;
  }

  const docBounds = getDocBounds();
  const intrinsic = getVectorIntrinsicSize(layer);
  const center = getLayerCenter(layer);
  const scaleX = state.zoom * (layer.width / intrinsic.width);
  const scaleY = state.zoom * (layer.height / intrinsic.height);
  const path = new Path2D(pathData);

  ctx.save();
  ctx.translate(docBounds.x, docBounds.y);
  ctx.translate(center.x * state.zoom, center.y * state.zoom);
  ctx.rotate(getLayerRotationRadians(layer));
  ctx.translate(-layer.width * state.zoom / 2, -layer.height * state.zoom / 2);
  ctx.scale(scaleX, scaleY);
  ctx.transform(model.matrix.a, model.matrix.b, model.matrix.c, model.matrix.d, model.matrix.e, model.matrix.f);
  ctx.strokeStyle = "rgba(59, 157, 255, 0.95)";
  ctx.lineWidth = Math.max(1, 2 / Math.max(scaleX, scaleY, 0.0001));
  ctx.setLineDash([8 / Math.max(state.zoom, 0.0001), 5 / Math.max(state.zoom, 0.0001)]);
  ctx.stroke(path);
  ctx.restore();

  const handles = getVectorPathHandleDescriptors(layer);
  if (!handles.length) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = "rgba(140, 192, 255, 0.9)";
  ctx.lineWidth = Math.max(1, (window.devicePixelRatio || 1) * 1.1);

  for (const handle of handles) {
    if (!handle.guidePoints.length) {
      continue;
    }
    for (const guidePoint of handle.guidePoints) {
      const sourcePoint = transformPointWithMatrix(model.matrix, guidePoint.x, guidePoint.y);
      const docPoint = vectorSourcePointToDocPoint(layer, sourcePoint);
      const canvasPoint = docToCanvasPoint(docPoint.x, docPoint.y);
      ctx.beginPath();
      ctx.moveTo(handle.canvasPoint.x, handle.canvasPoint.y);
      ctx.lineTo(canvasPoint.x, canvasPoint.y);
      ctx.stroke();
    }
  }

  const anchorSize = Math.max(8, getHandleSize() * 0.8);
  const halfAnchor = anchorSize / 2;
  const controlRadius = Math.max(5, anchorSize * 0.35);
  for (const handle of handles) {
    if (handle.role === "anchor") {
      ctx.fillStyle = "#3b9dff";
      ctx.strokeStyle = "#0f1318";
      ctx.fillRect(handle.canvasPoint.x - halfAnchor, handle.canvasPoint.y - halfAnchor, anchorSize, anchorSize);
      ctx.strokeRect(handle.canvasPoint.x - halfAnchor, handle.canvasPoint.y - halfAnchor, anchorSize, anchorSize);
      continue;
    }

    ctx.beginPath();
    ctx.fillStyle = "#ff7f41";
    ctx.arc(handle.canvasPoint.x, handle.canvasPoint.y, controlRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0f1318";
    ctx.stroke();
  }

  ctx.restore();
}

function updateVectorPathCommandHandle(commands, handle, point) {
  const command = commands[handle.commandIndex];
  if (!command) {
    return false;
  }

  if (handle.role === "anchor" && "x" in command && "y" in command) {
    command.x = point.x;
    command.y = point.y;
    return true;
  }

  if (handle.role === "control1" && "x1" in command && "y1" in command) {
    command.x1 = point.x;
    command.y1 = point.y;
    return true;
  }

  if (handle.role === "control2" && "x2" in command && "y2" in command) {
    command.x2 = point.x;
    command.y2 = point.y;
    return true;
  }

  return false;
}

function setLayerRectFromRotatedTopLeft(layer, topLeftDocPoint, width, height) {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const offset = rotatePoint({
    x: safeWidth / 2,
    y: safeHeight / 2
  }, getLayerRotationRadians(layer));
  const center = {
    x: topLeftDocPoint.x + offset.x,
    y: topLeftDocPoint.y + offset.y
  };

  layer.width = safeWidth;
  layer.height = safeHeight;
  layer.x = center.x - safeWidth / 2;
  layer.y = center.y - safeHeight / 2;
}

async function normalizeVectorLayerSource(layer) {
  if (!isVectorLayer(layer)) {
    return false;
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(layer.vectorSource, "image/svg+xml");
  if (getSvgParserError(parsed)) {
    return false;
  }

  const svgRoot = parsed.documentElement;
  const tempHost = document.createElement("div");
  tempHost.style.position = "absolute";
  tempHost.style.left = "-100000px";
  tempHost.style.top = "-100000px";
  tempHost.style.visibility = "hidden";
  tempHost.style.pointerEvents = "none";
  const measuringRoot = svgRoot.cloneNode(true);
  tempHost.append(measuringRoot);
  document.body.append(tempHost);

  try {
    const target = queryEditableVectorRoot(measuringRoot);
    if (!target) {
      return false;
    }

    const bbox = target.getBBox();
    if (!Number.isFinite(bbox.width) || !Number.isFinite(bbox.height)) {
      return false;
    }

    const vectorStyle = getVectorLayerStyleFromElement(target);
    const transformedBounds = getTransformedSvgBounds(target, bbox, vectorStyle.strokeWidth);
    if (!transformedBounds || transformedBounds.width <= 0 || transformedBounds.height <= 0) {
      return false;
    }

    const padding = 16;
    const paddedBounds = {
      x: transformedBounds.x - padding,
      y: transformedBounds.y - padding,
      width: transformedBounds.width + padding * 2,
      height: transformedBounds.height + padding * 2
    };
    const previousIntrinsic = getVectorIntrinsicSize(layer);
    const topLeftDocPoint = vectorSourcePointToDocPoint(layer, {
      x: paddedBounds.x,
      y: paddedBounds.y
    });
    const nextWidth = layer.width * (paddedBounds.width / previousIntrinsic.width);
    const nextHeight = layer.height * (paddedBounds.height / previousIntrinsic.height);
    const defsMarkup = collectSvgDefsMarkup(measuringRoot);
    layer.vectorSource = createStandaloneSvgForElement(
      `<g transform="translate(${-round(paddedBounds.x, 6)} ${-round(paddedBounds.y, 6)})">${target.outerHTML}</g>`,
      defsMarkup,
      paddedBounds
    );
    layer.vectorIntrinsicWidth = paddedBounds.width;
    layer.vectorIntrinsicHeight = paddedBounds.height;
    layer.vectorStyle = vectorStyle;
    layer.vectorStyleSummary = ensureVectorStyleSummary(vectorStyle);
    setLayerRectFromRotatedTopLeft(layer, topLeftDocPoint, nextWidth, nextHeight);
    await reloadVectorLayerImage(layer);
    renderVectorLayerBitmap(layer, layer.width, layer.height);
    return true;
  } finally {
    tempHost.remove();
  }
}

async function finalizeVectorLayerEditing(layer) {
  if (!isVectorLayer(layer)) {
    return;
  }

  await normalizeVectorLayerSource(layer);
  constrainLayerToCanvas(layer);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function buildStandaloneVectorSourceFromPathData(pathData, width, height, style = getVectorStyleDefaults(), options = {}) {
  const normalizedStyle = ensureVectorStyle(style);
  const fill = normalizedStyle.fill === "transparent" ? "none" : normalizedStyle.fill;
  const stroke = normalizedStyle.stroke === "transparent" ? "none" : normalizedStyle.stroke;
  const extraAttributes = [];
  if (options.strokeLinecap) {
    extraAttributes.push(`stroke-linecap="${options.strokeLinecap}"`);
  }
  if (options.strokeLinejoin) {
    extraAttributes.push(`stroke-linejoin="${options.strokeLinejoin}"`);
  }
  const markup = [
    '<path',
    'data-bc-vector-root="true"',
    `d="${pathData}"`,
    `fill="${fill}"`,
    `stroke="${stroke}"`,
    `stroke-width="${round(normalizedStyle.strokeWidth, 3)}"`,
    ...extraAttributes,
    '/>'
  ].join(" ");

  return createStandaloneSvgForElement(markup, "", {
    x: 0,
    y: 0,
    width,
    height
  });
}

function buildShapePathData(shapeType, width, height) {
  if (shapeType === "ellipse") {
    const rx = width / 2;
    const ry = height / 2;
    const cx = rx;
    const cy = ry;
    return [
      `M ${cx + rx} ${cy}`,
      `A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`,
      `A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}`,
      "Z"
    ].join(" ");
  }

  if (shapeType === "triangle") {
    return `M ${width / 2} 0 L ${width} ${height} L 0 ${height} Z`;
  }

  return `M 0 0 H ${width} V ${height} H 0 Z`;
}

function getShapeVectorStyle(shapeType) {
  if (isOutlineOnlyShapeType(shapeType)) {
    return ensureVectorStyle({
      fill: "transparent",
      stroke: state.brushColor,
      strokeWidth: getShapeCreationStrokeWidth()
    });
  }

  return ensureVectorStyle({
    fill: state.brushColor,
    stroke: "transparent",
    strokeWidth: 0
  });
}

async function createVectorLineLayerFromPoints(startPoint, endPoint, options = {}) {
  const strokeWidth = clamp(Number(options.strokeWidth) || getShapeCreationStrokeWidth(), 1, 48);
  const vectorStyle = ensureVectorStyle({
    fill: "transparent",
    stroke: options.stroke ?? state.brushColor,
    strokeWidth
  });
  const definition = buildLineShapePathData(startPoint, endPoint, strokeWidth, {
    arrowHead: options.arrowHead ?? null
  });
  const source = buildStandaloneVectorSourceFromPathData(
    definition.pathData,
    definition.geometry.width,
    definition.geometry.height,
    vectorStyle,
    {
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  );

  return createVectorLayerFromSvgSource(
    source,
    nextGeneratedLayerName(options.name || getShapeTypeLabel(state.shapeType)),
    {
      hasContent: true,
      groupId: options.groupId ?? getDefaultLayerGroupIdForNewLayer(),
      x: definition.geometry.x,
      y: definition.geometry.y,
      width: definition.geometry.width,
      height: definition.geometry.height,
      opacity: state.brushOpacity,
      vectorStyle
    }
  );
}

async function createVectorPenLayerFromPoints(points, options = {}) {
  const strokeWidth = clamp(Number(options.strokeWidth) || getShapeCreationStrokeWidth(), 1, 48);
  const definition = buildPenPathDefinition(points, strokeWidth, {
    closed: options.closed === true
  });
  if (!definition) {
    return null;
  }

  const vectorStyle = ensureVectorStyle({
    fill: "transparent",
    stroke: options.stroke ?? state.brushColor,
    strokeWidth
  });
  const source = buildStandaloneVectorSourceFromPathData(
    definition.pathData,
    definition.width,
    definition.height,
    vectorStyle,
    {
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  );

  return createVectorLayerFromSvgSource(
    source,
    nextGeneratedLayerName(options.name || "Pen Path"),
    {
      hasContent: true,
      groupId: options.groupId ?? getDefaultLayerGroupIdForNewLayer(),
      x: definition.x,
      y: definition.y,
      width: definition.width,
      height: definition.height,
      opacity: state.brushOpacity,
      vectorStyle
    }
  );
}

async function createVectorShapeLayerFromDraft(shapeDraft) {
  if (isLineBasedShapeType(state.shapeType)) {
    return createVectorLineLayerFromPoints(shapeDraft.startPoint, shapeDraft.endPoint, {
      arrowHead: state.shapeType === "arrow" ? "end" : null
    });
  }

  const vectorStyle = getShapeVectorStyle(state.shapeType);
  const baseShapeType = state.shapeType === "outline-rectangle" ? "rectangle" : state.shapeType;
  const source = buildStandaloneVectorSourceFromPathData(
    buildShapePathData(baseShapeType, shapeDraft.width, shapeDraft.height),
    shapeDraft.width,
    shapeDraft.height,
    vectorStyle,
    isOutlineOnlyShapeType(state.shapeType)
      ? {
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
      : {}
  );

  return createVectorLayerFromSvgSource(
    source,
    nextGeneratedLayerName(getShapeTypeLabel(state.shapeType)),
    {
      hasContent: true,
      groupId: getDefaultLayerGroupIdForNewLayer(),
      x: shapeDraft.x,
      y: shapeDraft.y,
      width: shapeDraft.width,
      height: shapeDraft.height,
      opacity: state.brushOpacity,
      vectorStyle
    }
  );
}

function buildDocumentFromImage(image, name = "Image") {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const base = createLayerFromImage(image, name);

  return {
    width,
    height,
    resolution: 72,
    backgroundContents: "transparent",
    layerGroups: [],
    layers: [base, createLayer("Retouch", width, height)]
  };
}

function buildDocumentFromLayer(layer) {
  return {
    width: Math.max(1, Math.round(layer.width)),
    height: Math.max(1, Math.round(layer.height)),
    resolution: 72,
    backgroundContents: "transparent",
    layerGroups: [],
    layers: [layer, createLayer("Retouch", Math.max(1, Math.round(layer.width)), Math.max(1, Math.round(layer.height)))]
  };
}

function resizeDocumentCanvas(width, height) {
  if (!state.doc) {
    return;
  }

  state.doc.width = width;
  state.doc.height = height;

  const backgroundLayer = getBackgroundLayer();
  if (backgroundLayer) {
    resizeBackgroundLayerCanvas(backgroundLayer, width, height);
  }

  for (const layer of state.doc.layers) {
    ensureLayerGeometry(layer, width, height);
  }

  clearSelectionState();
  state.cropRect = null;
  state.clipToDocument = false;
  fitToStage();
  pushHistory();
  refresh({ rebuildLayers: true });
}

function getPixelAlignedRect(rect) {
  const normalized = normalizeArtboardRect(rect);
  if (!normalized) {
    return null;
  }

  return {
    x: normalized.x,
    y: normalized.y,
    width: Math.max(1, Math.ceil(normalized.width)),
    height: Math.max(1, Math.ceil(normalized.height))
  };
}

function reframeBackgroundLayer(layer, targetRect) {
  const nextCanvas = createCanvasElement(targetRect.width, targetRect.height);
  const nextContext = nextCanvas.getContext("2d");
  nextContext.drawImage(layer.canvas, -targetRect.x, -targetRect.y);
  replaceLayerBitmap(layer, nextCanvas);
  layer.x = 0;
  layer.y = 0;
  layer.width = targetRect.width;
  layer.height = targetRect.height;
  layer.rotation = 0;
  layer.hasContent = true;
  layer.isBackground = true;
}

function fitCanvasToRect(rect) {
  if (!state.doc) {
    return;
  }

  const targetRect = getPixelAlignedRect(rect);
  if (!targetRect) {
    return;
  }

  if (
    targetRect.x === 0
    && targetRect.y === 0
    && targetRect.width === state.doc.width
    && targetRect.height === state.doc.height
  ) {
    refresh();
    return;
  }

  for (const layer of state.doc.layers) {
    if (isBackgroundLayer(layer)) {
      reframeBackgroundLayer(layer, targetRect);
      continue;
    }

    layer.x -= targetRect.x;
    layer.y -= targetRect.y;
  }

  shiftArtboards(-targetRect.x, -targetRect.y);
  state.doc.width = targetRect.width;
  state.doc.height = targetRect.height;
  normalizeDocument(state.doc);
  clearSelectionState();
  state.cropRect = null;
  state.clipToDocument = false;
  fitToStage();
  pushHistory();
  refresh({ rebuildLayers: true });
}

function fitCanvasToActiveLayer() {
  const activeLayer = getActiveLayer();
  if (!canTransformLayer(activeLayer)) {
    return;
  }

  fitCanvasToRect(getLayerAxisAlignedBounds(activeLayer));
}

function fitCanvasToActiveArtboard() {
  const activeArtboard = getActiveArtboard();
  if (!activeArtboard) {
    return;
  }

  fitCanvasToRect(activeArtboard);
}

function willResizeCanvasClip(width, height) {
  if (!state.doc) {
    return false;
  }

  return width < state.doc.width || height < state.doc.height;
}

async function promptForNewDocument(initialPresetId = "") {
  const clipboardPreset = await readClipboardPreset();
  const presets = getNewDocumentPresetOptions(clipboardPreset);
  const initialPreset = presets.find((preset) => preset.id === initialPresetId)
    ?? clipboardPreset
    ?? presets[0];

  const responsePromise = showDialog({
    title: "New Document",
    message: "Pick a preset or enter custom dimensions for a fresh canvas.",
    confirmLabel: "Create",
    cancelLabel: "Close",
    closeOnOverlay: false,
    kind: "new-document",
    fields: [
      {
        name: "projectName",
        label: "Name",
        type: "text",
        value: nextUntitledProjectName(),
        spellcheck: false
      },
      {
        name: "width",
        label: "Width",
        type: "number",
        value: initialPreset?.width ?? 1280,
        min: 1,
        max: 20000,
        step: 1,
        inputMode: "numeric",
        spellcheck: false
      },
      {
        name: "height",
        label: "Height",
        type: "number",
        value: initialPreset?.height ?? 720,
        min: 1,
        max: 20000,
        step: 1,
        inputMode: "numeric",
        spellcheck: false
      },
      {
        name: "resolution",
        label: "Resolution",
        type: "number",
        value: initialPreset?.resolution ?? 72,
        min: 1,
        max: 2400,
        step: 1,
        inputMode: "numeric",
        spellcheck: false,
        description: "Resolution is stored with the document for future export and print workflows."
      },
      {
        name: "backgroundContents",
        label: "Background Contents",
        type: "select",
        value: initialPreset?.backgroundContents ?? "white",
        options: [
          { value: "transparent", label: "Transparent" },
          { value: "white", label: "White" },
          { value: "black", label: "Black" }
        ]
      }
    ],
    validate(values) {
      const width = Math.round(Number(values.width));
      const height = Math.round(Number(values.height));
      const resolution = Math.round(Number(values.resolution));

      if (!Number.isFinite(width) || width < 1 || width > 20000) {
        return "Enter a document width between 1 and 20000 pixels.";
      }

      if (!Number.isFinite(height) || height < 1 || height > 20000) {
        return "Enter a document height between 1 and 20000 pixels.";
      }

      if (!Number.isFinite(resolution) || resolution < 1 || resolution > 2400) {
        return "Enter a resolution between 1 and 2400 pixels per inch.";
      }

      if (!["transparent", "white", "black"].includes(values.backgroundContents)) {
        return "Choose a valid background setting.";
      }

      return null;
    }
  });

  const browser = document.createElement("section");
  browser.className = "new-document-browser";

  const browserHeader = document.createElement("div");
  browserHeader.className = "new-document-browser-header";

  const browserTitle = document.createElement("h3");
  browserTitle.className = "new-document-browser-title";
  browserTitle.textContent = "Common presets";

  const browserHint = document.createElement("p");
  browserHint.className = "new-document-browser-hint";
  browserHint.textContent = clipboardPreset
    ? "Clipboard image dimensions are available in this list."
    : "Clipboard image dimensions appear here when the browser grants image access.";

  browserHeader.append(browserTitle, browserHint);

  const presetGrid = document.createElement("div");
  presetGrid.className = "preset-grid preset-grid--dialog";
  browser.append(browserHeader, presetGrid);
  ui.dialogFields.prepend(browser);

  const projectNameField = ui.dialogFields.querySelector("[name='projectName']");
  const widthField = ui.dialogFields.querySelector("[name='width']");
  const heightField = ui.dialogFields.querySelector("[name='height']");
  const resolutionField = ui.dialogFields.querySelector("[name='resolution']");
  const backgroundField = ui.dialogFields.querySelector("[name='backgroundContents']");

  let selectedPresetId = initialPreset?.id ?? "";

  const syncPresetSelection = () => {
    selectedPresetId = getMatchingNewDocumentPresetId({
      width: widthField?.value,
      height: heightField?.value,
      resolution: resolutionField?.value,
      backgroundContents: backgroundField?.value
    }, presets);
    renderPresetGrid(presetGrid, presets, selectedPresetId, applyPreset);
  };

  const applyPreset = (preset) => {
    if (!preset || !widthField || !heightField || !resolutionField || !backgroundField) {
      return;
    }

    widthField.value = String(preset.width);
    heightField.value = String(preset.height);
    resolutionField.value = String(preset.resolution);
    backgroundField.value = preset.backgroundContents;
    selectedPresetId = preset.id;
    renderPresetGrid(presetGrid, presets, selectedPresetId, applyPreset);
  };

  renderPresetGrid(presetGrid, presets, selectedPresetId, applyPreset);
  widthField?.addEventListener("input", syncPresetSelection);
  heightField?.addEventListener("input", syncPresetSelection);
  resolutionField?.addEventListener("input", syncPresetSelection);
  backgroundField?.addEventListener("change", syncPresetSelection);

  const response = await responsePromise;
  if (!response.confirmed) {
    return null;
  }

  return {
    projectName: projectNameField?.value || response.values.projectName,
    width: Math.round(Number(response.values.width)),
    height: Math.round(Number(response.values.height)),
    resolution: Math.round(Number(response.values.resolution)),
    backgroundContents: response.values.backgroundContents
  };
}

async function createNewDocument() {
  const settings = await promptForNewDocument();
  if (!settings) {
    return;
  }

  createDocumentFromSettings(settings);
}

async function openCanvasSizeDialog() {
  if (!state.doc) {
    return;
  }

  const size = await promptForCanvasSize("Canvas Size", state.doc.width, state.doc.height, "Apply");

  if (!size) {
    return;
  }

  if (willResizeCanvasClip(size.width, size.height)) {
    const confirmed = await confirmCanvasClipping(
      "Reduce Canvas Size",
      "Reducing the canvas will crop any pixels that fall outside the new document bounds. Continue?",
      "Apply Resize"
    );
    if (!confirmed) {
      return;
    }
  }

  resizeDocumentCanvas(size.width, size.height);
}

function setMenuOpen(menuId, isOpen, source = null) {
  for (const button of menuButtons) {
    const matches = isOpen && button.dataset.menuButton === menuId;
    button.setAttribute("aria-expanded", String(matches));
    button.classList.toggle("is-open", matches);
  }

  for (const panel of menuPanels) {
    panel.hidden = !(isOpen && panel.dataset.menuPanel === menuId);
  }

  state.openMenuId = isOpen ? menuId : null;
  state.openMenuSource = isOpen ? source : null;
}

function toggleMenu(menuId) {
  const isSameMenu = state.openMenuId === menuId;
  const shouldClose = isSameMenu && state.openMenuSource === "click";
  setMenuOpen(menuId, !shouldClose, shouldClose ? null : "click");
}

function closeMenus() {
  if (!state.openMenuId) {
    return;
  }

  setMenuOpen(state.openMenuId, false);
}

function setContextMenuOpen(menu, isOpen, clientX = 0, clientY = 0) {
  if (!menu) {
    return;
  }

  if (!isOpen) {
    menu.hidden = true;
    return;
  }

  menu.hidden = false;
  menu.style.left = `${clientX}px`;
  menu.style.top = `${clientY}px`;

  const menuRect = menu.getBoundingClientRect();
  const left = Math.max(8, Math.min(clientX, window.innerWidth - menuRect.width - 8));
  const top = Math.max(8, Math.min(clientY, window.innerHeight - menuRect.height - 8));

  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function closeContextMenus() {
  setContextMenuOpen(ui.selectionMenu, false);
  setContextMenuOpen(ui.layerContextMenu, false);
}

function setSelectionMenuOpen(isOpen, clientX = 0, clientY = 0) {
  if (!isOpen) {
    setContextMenuOpen(ui.selectionMenu, false);
    return;
  }

  setContextMenuOpen(ui.layerContextMenu, false);
  setContextMenuOpen(ui.selectionMenu, true, clientX, clientY);
}

function setLayerContextMenuOpen(isOpen, clientX = 0, clientY = 0) {
  if (!isOpen) {
    setContextMenuOpen(ui.layerContextMenu, false);
    return;
  }

  setContextMenuOpen(ui.selectionMenu, false);
  setContextMenuOpen(ui.layerContextMenu, true, clientX, clientY);
}

function addImageAsLayer(image, name = "Image") {
  if (!state.doc) {
    const nextDoc = buildDocumentFromImage(image, name);
    setDocument(nextDoc, {
      activeLayerId: nextDoc.layers[0]?.id,
      projectName: name,
      projectPath: null,
      historyLabel: "Open Image"
    });
    return;
  }

  const layerWidth = image.naturalWidth || image.width;
  const layerHeight = image.naturalHeight || image.height;
  const layer = createLayerFromImage(image, name, {
    groupId: getDefaultLayerGroupIdForNewLayer(),
    x: Math.round((state.doc.width - layerWidth) / 2),
    y: Math.round((state.doc.height - layerHeight) / 2)
  });
  constrainLayerToCanvas(layer);

  insertLayersAfterActiveLayer([layer]);
  selectSingleLayer(layer.id);
  clearSelectionState();
  pushHistory();
  refresh({ rebuildLayers: true });
}

async function addVectorLayer(svgSource, name = "SVG") {
  const imported = await extractSvgVectorObjects(svgSource, name);
  if (!imported.objects.length) {
    const fallbackLayer = await createVectorLayerFromSvgSource(svgSource, name, {
      groupId: getDefaultLayerGroupIdForNewLayer()
    });
    if (!state.doc) {
      const nextDoc = buildDocumentFromLayer(fallbackLayer);
      setDocument(nextDoc, {
        activeLayerId: fallbackLayer.id,
        projectName: name,
        projectPath: null,
        historyLabel: "Open SVG"
      });
      return;
    }

    fallbackLayer.x = Math.round((state.doc.width - fallbackLayer.width) / 2);
    fallbackLayer.y = Math.round((state.doc.height - fallbackLayer.height) / 2);
    constrainLayerToCanvas(fallbackLayer);
    insertLayersAfterActiveLayer([fallbackLayer]);
    selectSingleLayer(fallbackLayer.id);
    clearSelectionState();
    pushHistory();
    refresh({ rebuildLayers: true });
    return;
  }

  const layers = [];
  const groupId = getDefaultLayerGroupIdForNewLayer();
  for (const object of imported.objects) {
    layers.push(await createVectorLayerFromSvgSource(object.source, object.name, {
      groupId,
      x: object.x,
      y: object.y,
      width: object.width,
      height: object.height,
      vectorIntrinsicWidth: object.width,
      vectorIntrinsicHeight: object.height,
      vectorStyle: object.vectorStyle
    }));
  }

  if (!state.doc) {
    const nextDoc = {
      width: Math.max(1, Math.round(imported.width)),
      height: Math.max(1, Math.round(imported.height)),
      layerGroups: [],
      layers: [...layers, createLayer("Retouch", Math.max(1, Math.round(imported.width)), Math.max(1, Math.round(imported.height)))]
    };
    setDocument(nextDoc, {
      activeLayerId: layers.at(-1)?.id ?? nextDoc.layers[0]?.id ?? null,
      projectName: name,
      projectPath: null,
      historyLabel: "Open SVG"
    });
    return;
  }

  const union = layers.reduce((rect, layer) => unionRect(rect, getLayerDocRect(layer)), null);
  const offsetX = union ? Math.round((state.doc.width - union.width) / 2 - union.x) : 0;
  const offsetY = union ? Math.round((state.doc.height - union.height) / 2 - union.y) : 0;
  for (const layer of layers) {
    layer.x += offsetX;
    layer.y += offsetY;
    constrainLayerToCanvas(layer);
  }

  insertLayersAfterActiveLayer(layers);
  setLayerSelection(layers.map((layer) => layer.id), {
    activeLayerId: layers.at(-1)?.id ?? null,
    anchorId: layers[0]?.id ?? null
  });
  clearSelectionState();
  pushHistory();
  refresh({ rebuildLayers: true });
}

function getActiveLayer() {
  return state.doc?.layers.find((layer) => layer.id === state.activeLayerId) ?? null;
}

function getActiveLayerIndex() {
  return state.doc?.layers.findIndex((layer) => layer.id === state.activeLayerId) ?? -1;
}

function normalizeSelectedLayerIds(layerIds, doc = state.doc) {
  if (!doc) {
    return [];
  }

  const validLayerIds = new Set(doc.layers.map((layer) => layer.id));
  const normalized = [];
  for (const layerId of Array.isArray(layerIds) ? layerIds : []) {
    if (validLayerIds.has(layerId) && !normalized.includes(layerId)) {
      normalized.push(layerId);
    }
  }
  return normalized;
}

function syncLayerSelection(options = {}) {
  if (!state.doc) {
    state.activeLayerId = null;
    state.selectedLayerIds = [];
    state.layerSelectionAnchorId = null;
    state.activeLayerMaskId = null;
    return;
  }

  const validLayerIds = new Set(state.doc.layers.map((layer) => layer.id));
  let activeLayerId = validLayerIds.has(state.activeLayerId) ? state.activeLayerId : null;
  let selectedLayerIds = normalizeSelectedLayerIds(state.selectedLayerIds, state.doc);

  if (!activeLayerId && selectedLayerIds.length) {
    activeLayerId = selectedLayerIds.at(-1) ?? null;
  }

  if (!selectedLayerIds.length && activeLayerId) {
    selectedLayerIds = [activeLayerId];
  }

  if (!activeLayerId && state.doc.layers.length) {
    activeLayerId = state.doc.layers.at(-1)?.id ?? null;
    selectedLayerIds = activeLayerId ? [activeLayerId] : [];
  }

  if (activeLayerId && !selectedLayerIds.includes(activeLayerId)) {
    selectedLayerIds = options.replaceWithActive
      ? [activeLayerId]
      : [...selectedLayerIds, activeLayerId];
  }

  state.activeLayerId = activeLayerId;
  state.selectedLayerIds = selectedLayerIds;
  state.layerSelectionAnchorId = validLayerIds.has(state.layerSelectionAnchorId)
    ? state.layerSelectionAnchorId
    : (selectedLayerIds[0] ?? activeLayerId ?? null);
  if (state.activeLayerMaskId !== state.activeLayerId) {
    state.activeLayerMaskId = null;
  }
}

function setLayerSelection(layerIds, options = {}) {
  if (!state.doc) {
    state.activeLayerId = null;
    state.selectedLayerIds = [];
    state.layerSelectionAnchorId = null;
    state.activeLayerMaskId = null;
    return;
  }

  const selectedLayerIds = normalizeSelectedLayerIds(layerIds, state.doc);
  const validLayerIds = new Set(state.doc.layers.map((layer) => layer.id));
  const activeLayerId = validLayerIds.has(options.activeLayerId) && selectedLayerIds.includes(options.activeLayerId)
    ? options.activeLayerId
    : (selectedLayerIds.at(-1) ?? null);

  state.activeLayerId = activeLayerId;
  state.selectedLayerIds = selectedLayerIds;
  state.layerSelectionAnchorId = validLayerIds.has(options.anchorId)
    ? options.anchorId
    : (activeLayerId ?? selectedLayerIds[0] ?? null);
  if (state.activeLayerMaskId !== state.activeLayerId) {
    state.activeLayerMaskId = null;
  }
  syncLayerSelection();
}

function selectSingleLayer(layerId) {
  setLayerSelection(layerId ? [layerId] : [], {
    activeLayerId: layerId ?? null,
    anchorId: layerId ?? null
  });
}

function setActiveLayerId(layerId, options = {}) {
  state.activeLayerId = layerId ?? null;
  if (options.preserveSelection) {
    syncLayerSelection();
    return;
  }

  selectSingleLayer(state.activeLayerId);
}

function getSelectedLayerIds() {
  syncLayerSelection();
  return [...state.selectedLayerIds];
}

function getSelectedLayers() {
  const selectedLayerIdSet = new Set(getSelectedLayerIds());
  return state.doc?.layers.filter((layer) => selectedLayerIdSet.has(layer.id)) ?? [];
}

function isLayerSelected(layerId) {
  return getSelectedLayerIds().includes(layerId);
}

function getSelectedEditableLayers() {
  return getSelectedLayers().filter((layer) => !isLayerFullyLocked(layer));
}

function getLayerPanelBlocks(doc = state.doc) {
  if (!doc) {
    return [];
  }

  const reversedLayers = [...doc.layers].reverse();
  const groupedLayers = new Map();
  for (const layer of reversedLayers) {
    const group = getLayerGroupForLayer(layer, doc);
    if (!group) {
      continue;
    }
    if (!groupedLayers.has(group.id)) {
      groupedLayers.set(group.id, []);
    }
    groupedLayers.get(group.id).push(layer);
  }

  const renderedGroupIds = new Set();
  const blocks = [];

  for (const layer of reversedLayers) {
    const group = getLayerGroupForLayer(layer, doc);
    if (!group) {
      blocks.push({
        key: `layer:${layer.id}`,
        kind: "layer",
        layerId: layer.id,
        groupId: null,
        layers: [layer]
      });
      continue;
    }

    if (renderedGroupIds.has(group.id)) {
      continue;
    }

    renderedGroupIds.add(group.id);
    blocks.push({
      key: `group:${group.id}`,
      kind: "group",
      groupId: group.id,
      layers: groupedLayers.get(group.id) ?? []
    });
  }

  return blocks;
}

function getLayerPanelSelectableLayerIds() {
  return getLayerPanelBlocks().flatMap((block) => block.layers.map((layer) => layer.id));
}

function getGroupLayerIds(groupId) {
  return getLayerPanelBlocks()
    .find((block) => block.kind === "group" && block.groupId === groupId)
    ?.layers.map((layer) => layer.id) ?? [];
}

function isGroupFullySelected(groupId) {
  const groupLayerIds = getGroupLayerIds(groupId);
  return groupLayerIds.length > 0 && groupLayerIds.every((layerId) => isLayerSelected(layerId));
}

function isGroupPartiallySelected(groupId) {
  const groupLayerIds = getGroupLayerIds(groupId);
  return groupLayerIds.some((layerId) => isLayerSelected(layerId)) && !isGroupFullySelected(groupId);
}

function selectLayerRange(layerId) {
  const orderedLayerIds = getLayerPanelSelectableLayerIds();
  const anchorId = orderedLayerIds.includes(state.layerSelectionAnchorId)
    ? state.layerSelectionAnchorId
    : (state.activeLayerId ?? layerId);
  const startIndex = orderedLayerIds.indexOf(anchorId);
  const endIndex = orderedLayerIds.indexOf(layerId);

  if (startIndex === -1 || endIndex === -1) {
    selectSingleLayer(layerId);
    return;
  }

  const [fromIndex, toIndex] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
  const rangeLayerIds = orderedLayerIds.slice(fromIndex, toIndex + 1);
  setLayerSelection(rangeLayerIds, {
    activeLayerId: layerId,
    anchorId
  });
}

function toggleLayerSelection(layerId) {
  const selectedLayerIds = getSelectedLayerIds();
  if (selectedLayerIds.includes(layerId)) {
    if (selectedLayerIds.length === 1) {
      selectSingleLayer(layerId);
      return;
    }

    const remainingLayerIds = selectedLayerIds.filter((selectedLayerId) => selectedLayerId !== layerId);
    setLayerSelection(remainingLayerIds, {
      activeLayerId: state.activeLayerId === layerId ? remainingLayerIds.at(-1) ?? null : state.activeLayerId,
      anchorId: remainingLayerIds.at(-1) ?? null
    });
    return;
  }

  setLayerSelection([...selectedLayerIds, layerId], {
    activeLayerId: layerId,
    anchorId: layerId
  });
}

function handleLayerSelectionClick(layerId, event) {
  if (!layerId) {
    return;
  }

  if (event.shiftKey) {
    selectLayerRange(layerId);
    return;
  }

  if (event.metaKey || event.ctrlKey) {
    toggleLayerSelection(layerId);
    return;
  }

  selectSingleLayer(layerId);
}

function handleGroupSelectionClick(groupId, event) {
  const groupLayerIds = getGroupLayerIds(groupId);
  if (!groupLayerIds.length) {
    return;
  }

  if (event.metaKey || event.ctrlKey) {
    const selectedLayerIds = getSelectedLayerIds();
    const fullySelected = groupLayerIds.every((layerId) => selectedLayerIds.includes(layerId));
    if (fullySelected) {
      const remainingLayerIds = selectedLayerIds.filter((layerId) => !groupLayerIds.includes(layerId));
      if (!remainingLayerIds.length) {
        selectSingleLayer(groupLayerIds[0]);
        return;
      }
      setLayerSelection(remainingLayerIds, {
        activeLayerId: remainingLayerIds.at(-1) ?? null,
        anchorId: remainingLayerIds.at(-1) ?? null
      });
      return;
    }

    setLayerSelection([...selectedLayerIds, ...groupLayerIds], {
      activeLayerId: groupLayerIds[0],
      anchorId: groupLayerIds[0]
    });
    return;
  }

  setLayerSelection(groupLayerIds, {
    activeLayerId: groupLayerIds[0],
    anchorId: groupLayerIds[0]
  });
}

function rebuildLayersFromBlocks(blocks) {
  state.doc.layers = blocks.flatMap((block) => block.layers).reverse();
  pruneInvalidLayerClipping(state.doc);
}

function moveLayerPanelBlock(sourceKey, targetKey, position = "after") {
  const blocks = getLayerPanelBlocks();
  const sourceIndex = blocks.findIndex((block) => block.key === sourceKey);
  const targetIndex = blocks.findIndex((block) => block.key === targetKey);

  if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
    return false;
  }

  const [sourceBlock] = blocks.splice(sourceIndex, 1);
  let insertIndex = blocks.findIndex((block) => block.key === targetKey);
  if (insertIndex === -1) {
    return false;
  }

  if (position === "after") {
    insertIndex += 1;
  }

  blocks.splice(insertIndex, 0, sourceBlock);
  rebuildLayersFromBlocks(blocks);
  syncLayerSelection();
  pushHistory();
  refresh({ rebuildLayers: true });
  return true;
}

function getLayerReorderInsertionIndex(sourceIndex, count, action) {
  switch (action) {
    case "front":
      return 0;
    case "forward":
      return Math.max(0, sourceIndex - 1);
    case "backward":
      return Math.min(count - 1, sourceIndex + 1);
    case "back":
      return count - 1;
    default:
      return sourceIndex;
  }
}

function getLayerReorderContext(layerId) {
  if (!state.doc) {
    return null;
  }

  const layer = state.doc.layers.find((entry) => entry.id === layerId);
  if (!layer || isLayerPositionLocked(layer)) {
    return null;
  }

  const blocks = getLayerPanelBlocks();
  if (layer.groupId) {
    const groupBlock = blocks.find((block) => block.kind === "group" && block.groupId === layer.groupId);
    const sourceIndex = groupBlock?.layers.findIndex((entry) => entry.id === layerId) ?? -1;
    if (!groupBlock || sourceIndex === -1) {
      return null;
    }

    return {
      mode: "group",
      blocks,
      groupBlock,
      sourceIndex,
      count: groupBlock.layers.length
    };
  }

  const sourceIndex = blocks.findIndex((block) => block.key === `layer:${layerId}`);
  if (sourceIndex === -1) {
    return null;
  }

  return {
    mode: "blocks",
    blocks,
    sourceIndex,
    count: blocks.length
  };
}

function canReorderLayerByAction(layerId, action) {
  const context = getLayerReorderContext(layerId);
  if (!context) {
    return false;
  }

  return getLayerReorderInsertionIndex(context.sourceIndex, context.count, action) !== context.sourceIndex;
}

function reorderLayerByAction(layerId, action) {
  const context = getLayerReorderContext(layerId);
  if (!context) {
    return false;
  }

  const insertionIndex = getLayerReorderInsertionIndex(context.sourceIndex, context.count, action);
  if (insertionIndex === context.sourceIndex) {
    return false;
  }

  if (context.mode === "group") {
    const [layer] = context.groupBlock.layers.splice(context.sourceIndex, 1);
    context.groupBlock.layers.splice(insertionIndex, 0, layer);
  } else {
    const [block] = context.blocks.splice(context.sourceIndex, 1);
    context.blocks.splice(insertionIndex, 0, block);
  }

  rebuildLayersFromBlocks(context.blocks);
  syncLayerSelection();
  pushHistory();
  refresh({ rebuildLayers: true });
  return true;
}

function getDefaultLayerGroupIdForNewLayer() {
  const activeLayer = getActiveLayer();
  if (!activeLayer || isBackgroundLayer(activeLayer)) {
    return null;
  }

  return activeLayer.groupId ?? null;
}

function insertLayersAfterActiveLayer(layers) {
  if (!state.doc || !Array.isArray(layers) || !layers.length) {
    return;
  }

  const activeIndex = getActiveLayerIndex();
  if (activeIndex === -1) {
    state.doc.layers.push(...layers);
    return;
  }

  state.doc.layers.splice(activeIndex + 1, 0, ...layers);
}

function getBackgroundLayer() {
  return state.doc?.layers.find((layer) => isBackgroundLayer(layer)) ?? null;
}

function constrainLayerToCanvas(layer) {
  if (!state.doc || !layer || isBackgroundLayer(layer)) {
    return;
  }

  const bounds = getLayerAxisAlignedBounds(layer);
  let deltaX = 0;
  let deltaY = 0;

  if (bounds.width <= state.doc.width) {
    if (bounds.x < 0) {
      deltaX = -bounds.x;
    } else if (bounds.x + bounds.width > state.doc.width) {
      deltaX = state.doc.width - (bounds.x + bounds.width);
    }
  } else {
    if (bounds.x > 0) {
      deltaX = -bounds.x;
    } else if (bounds.x + bounds.width < state.doc.width) {
      deltaX = state.doc.width - (bounds.x + bounds.width);
    }
  }

  if (bounds.height <= state.doc.height) {
    if (bounds.y < 0) {
      deltaY = -bounds.y;
    } else if (bounds.y + bounds.height > state.doc.height) {
      deltaY = state.doc.height - (bounds.y + bounds.height);
    }
  } else {
    if (bounds.y > 0) {
      deltaY = -bounds.y;
    } else if (bounds.y + bounds.height < state.doc.height) {
      deltaY = state.doc.height - (bounds.y + bounds.height);
    }
  }

  layer.x += deltaX;
  layer.y += deltaY;
}

function getSelectionRect() {
  if (!state.doc) {
    return null;
  }

  if (state.selectionMaskCanvas && state.selectionMaskBounds) {
    return clampRectToDocument(cloneRect(state.selectionMaskBounds));
  }

  if (!state.selection) {
    return null;
  }

  const x1 = Math.min(state.selection.x1, state.selection.x2);
  const y1 = Math.min(state.selection.y1, state.selection.y2);
  const x2 = Math.max(state.selection.x1, state.selection.x2);
  const y2 = Math.max(state.selection.y1, state.selection.y2);

  const width = Math.round(x2 - x1);
  const height = Math.round(y2 - y1);

  if (width < 2 || height < 2) {
    return null;
  }

  return clampRectToDocument({
    x: Math.round(x1),
    y: Math.round(y1),
    width,
    height
  });
}

function hasPixelSelectionMask() {
  return Boolean(state.selectionMaskCanvas && state.selectionMaskBounds);
}

function setSelectionMask(maskCanvas, bounds) {
  if (!(maskCanvas instanceof HTMLCanvasElement) || !bounds) {
    state.selection = null;
    state.selectionMaskCanvas = null;
    state.selectionMaskBounds = null;
    return;
  }

  state.selection = null;
  state.selectionMaskCanvas = maskCanvas;
  state.selectionMaskBounds = cloneRect(bounds);
}

function clearSelectionState() {
  state.selection = null;
  state.selectionMaskCanvas = null;
  state.selectionMaskBounds = null;
}

function setSelectionRect(rect) {
  state.selectionMaskCanvas = null;
  state.selectionMaskBounds = null;
  state.selection = {
    x1: rect.x,
    y1: rect.y,
    x2: rect.x + rect.width,
    y2: rect.y + rect.height
  };
}

function createSelectionMaskCanvasFromRect(rect) {
  if (!state.doc || !rect) {
    return null;
  }

  const maskCanvas = createFilledMaskCanvas(state.doc.width, state.doc.height, 0);
  const maskContext = maskCanvas.getContext("2d");
  maskContext.fillStyle = "rgba(255, 255, 255, 1)";
  maskContext.fillRect(rect.x, rect.y, rect.width, rect.height);
  return maskCanvas;
}

function getSelectionMaskCanvas() {
  if (!state.doc) {
    return null;
  }

  if (state.selectionMaskCanvas) {
    return state.selectionMaskCanvas;
  }

  const selectionRect = getSelectionRect();
  return selectionRect ? createSelectionMaskCanvasFromRect(selectionRect) : null;
}

function createSelectionMaskCanvasFromEllipseRect(rect) {
  if (!state.doc || !rect) {
    return null;
  }

  const maskCanvas = createFilledMaskCanvas(state.doc.width, state.doc.height, 0);
  const maskContext = maskCanvas.getContext("2d");
  maskContext.fillStyle = "rgba(255, 255, 255, 1)";
  maskContext.beginPath();
  maskContext.ellipse(
    rect.x + rect.width / 2,
    rect.y + rect.height / 2,
    rect.width / 2,
    rect.height / 2,
    0,
    0,
    Math.PI * 2
  );
  maskContext.fill();
  return maskCanvas;
}

function getPointBounds(points = []) {
  const validPoints = points.filter((point) => Number.isFinite(point?.x) && Number.isFinite(point?.y));
  if (!validPoints.length) {
    return null;
  }

  const left = Math.min(...validPoints.map((point) => point.x));
  const top = Math.min(...validPoints.map((point) => point.y));
  const right = Math.max(...validPoints.map((point) => point.x));
  const bottom = Math.max(...validPoints.map((point) => point.y));
  return clampRectToDocument({
    x: Math.floor(left),
    y: Math.floor(top),
    width: Math.ceil(right - left),
    height: Math.ceil(bottom - top)
  });
}

function createSelectionMaskCanvasFromPolygon(points = []) {
  if (!state.doc || points.length < 3) {
    return null;
  }

  const bounds = getPointBounds(points);
  if (!bounds || bounds.width < 2 || bounds.height < 2) {
    return null;
  }

  const maskCanvas = createFilledMaskCanvas(state.doc.width, state.doc.height, 0);
  const maskContext = maskCanvas.getContext("2d");
  maskContext.fillStyle = "rgba(255, 255, 255, 1)";
  maskContext.beginPath();
  maskContext.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) {
    maskContext.lineTo(point.x, point.y);
  }
  maskContext.closePath();
  maskContext.fill();
  return maskCanvas;
}

function getSelectionCombineModeFromEvent(event, options = {}) {
  if (event.altKey) {
    return "subtract";
  }

  if (options.allowShiftAdd !== false && event.shiftKey) {
    return "add";
  }

  if (event.metaKey || event.ctrlKey) {
    return "add";
  }

  return "replace";
}

function composeSelectionMaskFromCanvas(maskCanvas, combineMode = "replace") {
  if (!state.doc || !(maskCanvas instanceof HTMLCanvasElement)) {
    return null;
  }

  if (combineMode === "replace") {
    const nextMaskCanvas = cloneCanvas(maskCanvas);
    const bounds = getNonTransparentPixelBounds(nextMaskCanvas);
    return bounds ? { maskCanvas: nextMaskCanvas, bounds } : null;
  }

  const baseSelectionMask = getSelectionMaskCanvas();
  if (!baseSelectionMask) {
    if (combineMode === "subtract") {
      return null;
    }

    const nextMaskCanvas = cloneCanvas(maskCanvas);
    const bounds = getNonTransparentPixelBounds(nextMaskCanvas);
    return bounds ? { maskCanvas: nextMaskCanvas, bounds } : null;
  }

  const nextMaskCanvas = createFilledMaskCanvas(state.doc.width, state.doc.height, 0);
  const nextMaskContext = nextMaskCanvas.getContext("2d");
  nextMaskContext.drawImage(baseSelectionMask, 0, 0);

  if (combineMode === "add") {
    nextMaskContext.drawImage(maskCanvas, 0, 0);
  } else if (combineMode === "subtract") {
    nextMaskContext.globalCompositeOperation = "destination-out";
    nextMaskContext.drawImage(maskCanvas, 0, 0);
    nextMaskContext.globalCompositeOperation = "source-over";
  }

  const bounds = getNonTransparentPixelBounds(nextMaskCanvas);
  return bounds ? { maskCanvas: nextMaskCanvas, bounds } : null;
}

function applySelectionMaskCanvas(maskCanvas, combineMode = "replace") {
  const composed = composeSelectionMaskFromCanvas(maskCanvas, combineMode);
  if (!composed) {
    clearSelectionState();
    return false;
  }

  setSelectionMask(composed.maskCanvas, composed.bounds);
  return true;
}

function intersectMaskCanvasWithCurrentSelection(maskCanvas) {
  if (!(maskCanvas instanceof HTMLCanvasElement)) {
    return null;
  }

  const selectionMaskCanvas = getSelectionMaskCanvas();
  if (!selectionMaskCanvas) {
    return maskCanvas;
  }

  const constrainedMaskCanvas = cloneCanvas(maskCanvas);
  const constrainedMaskContext = constrainedMaskCanvas.getContext("2d");
  constrainedMaskContext.globalCompositeOperation = "destination-in";
  constrainedMaskContext.drawImage(selectionMaskCanvas, 0, 0);
  constrainedMaskContext.globalCompositeOperation = "source-over";
  return constrainedMaskCanvas;
}

function getCropRect() {
  if (!state.cropRect || !state.doc) {
    return null;
  }

  const x = Math.round(state.cropRect.x);
  const y = Math.round(state.cropRect.y);
  const width = Math.round(state.cropRect.width);
  const height = Math.round(state.cropRect.height);

  if (width < 2 || height < 2) {
    return null;
  }

  return clampRectToDocument({
    x,
    y,
    width,
    height
  });
}

function setCropRect(rect) {
  state.cropRect = {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  };
}

function getDefaultCropRect() {
  return {
    x: 0,
    y: 0,
    width: state.doc.width,
    height: state.doc.height
  };
}

function ensureCropRect() {
  if (!state.doc || getCropRect()) {
    return;
  }

  setCropRect(getDefaultCropRect());
}

function setDocument(doc, options = {}) {
  const session = createDocumentSession(doc, {
    activeLayerId: options.activeLayerId,
    selectedLayerIds: options.selectedLayerIds,
    layerSelectionAnchorId: options.layerSelectionAnchorId,
    projectName: options.projectName,
    projectPath: options.projectPath,
    selection: options.selection,
    selectionMaskCanvas: options.selectionMaskCanvas,
    selectionMaskBounds: options.selectionMaskBounds,
    cropRect: options.cropRect,
    artboards: options.artboards,
    activeArtboardId: options.activeArtboardId,
    clipToDocument: options.clipToDocument
  });

  openDocumentSession(session, {
    fit: options.fit,
    resetHistory: options.resetHistory,
    historyLabel: options.historyLabel
  });
}

function fitToStage() {
  if (!state.doc || !canvas.width || !canvas.height) {
    return;
  }

  const contentRect = getContentRect();
  const zoom = Math.min((canvas.width * 0.88) / contentRect.width, (canvas.height * 0.88) / contentRect.height);
  state.zoom = clamp(zoom, limits.minZoom, limits.maxZoom);
  state.panX = (state.doc.width / 2 - contentRect.x - contentRect.width / 2) * state.zoom;
  state.panY = (state.doc.height / 2 - contentRect.y - contentRect.height / 2) * state.zoom;
}

function getDocBounds(zoom = state.zoom, panX = state.panX, panY = state.panY) {
  const safeZoom = normalizeZoom(zoom);
  return {
    x: (canvas.width - state.doc.width * safeZoom) / 2 + panX,
    y: (canvas.height - state.doc.height * safeZoom) / 2 + panY,
    width: state.doc.width * safeZoom,
    height: state.doc.height * safeZoom
  };
}

function normalizeAngle(angle) {
  let normalized = angle % 360;
  if (normalized > 180) {
    normalized -= 360;
  } else if (normalized <= -180) {
    normalized += 360;
  }
  return normalized;
}

function getLayerRotationRadians(layer) {
  return (layer.rotation || 0) * Math.PI / 180;
}

function getLayerCenter(layer) {
  return {
    x: layer.x + layer.width / 2,
    y: layer.y + layer.height / 2
  };
}

function rotatePoint(point, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos
  };
}

function unionRect(existing, next) {
  if (!existing) {
    return { ...next };
  }

  const left = Math.min(existing.x, next.x);
  const top = Math.min(existing.y, next.y);
  const right = Math.max(existing.x + existing.width, next.x + next.width);
  const bottom = Math.max(existing.y + existing.height, next.y + next.height);

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
}

function getContentRect() {
  if (!state.doc) {
    return { x: 0, y: 0, width: 1, height: 1 };
  }

  return {
    x: 0,
    y: 0,
    width: state.doc.width,
    height: state.doc.height
  };
}

function getExportTargetOptions() {
  const options = [
    { value: "canvas", label: "Canvas" }
  ];
  const activeLayer = getActiveLayer();
  const activeArtboard = getActiveArtboard();

  if (activeLayer) {
    options.push({
      value: "layer",
      label: isAdjustmentLayer(activeLayer)
        ? `Composite Through Active Adjustment${activeLayer.name ? ` (${activeLayer.name})` : ""}`
        : `Active Layer${activeLayer.name ? ` (${activeLayer.name})` : ""}`
    });
  }

  if (activeArtboard) {
    options.push({
      value: "artboard",
      label: `Active Artboard${activeArtboard.name ? ` (${activeArtboard.name})` : ""}`
    });
  }

  return options;
}

function getDefaultExportTargetKey(formatKey = getSelectedExportFormat()) {
  const options = getExportTargetOptions();
  const optionValues = new Set(options.map((option) => option.value));
  const preferred = state.exportPreferences.target;

  if (optionValues.has(preferred)) {
    return preferred;
  }

  if (formatKey === "svg" && optionValues.has("layer")) {
    return "layer";
  }

  if (optionValues.has("artboard")) {
    return "artboard";
  }

  return "canvas";
}

function clientToCanvasPoint(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

function canvasToDocPoint(point) {
  const bounds = getDocBounds();
  const safeZoom = normalizeZoom(state.zoom);

  return {
    x: (point.x - bounds.x) / safeZoom,
    y: (point.y - bounds.y) / safeZoom
  };
}

function docToCanvasPoint(docX, docY) {
  const bounds = getDocBounds();
  const safeZoom = normalizeZoom(state.zoom);
  return {
    x: bounds.x + docX * safeZoom,
    y: bounds.y + docY * safeZoom
  };
}

function getLayerDocRect(layer) {
  return {
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height
  };
}

function cloneLayerRect(layer) {
  return { ...getLayerDocRect(layer) };
}

function getLayerDisplayPoint(layer, point) {
  const center = getLayerCenter(layer);
  const relative = {
    x: point.x - center.x,
    y: point.y - center.y
  };
  const unrotated = rotatePoint(relative, -getLayerRotationRadians(layer));

  return {
    x: unrotated.x + layer.width / 2,
    y: unrotated.y + layer.height / 2
  };
}

function layerDisplayPointToDocPoint(layer, displayPoint) {
  const center = getLayerCenter(layer);
  const rotated = rotatePoint({
    x: displayPoint.x - layer.width / 2,
    y: displayPoint.y - layer.height / 2
  }, getLayerRotationRadians(layer));

  return {
    x: center.x + rotated.x,
    y: center.y + rotated.y
  };
}

function getLayerCornerPoints(layer) {
  return [
    layerDisplayPointToDocPoint(layer, { x: 0, y: 0 }),
    layerDisplayPointToDocPoint(layer, { x: layer.width, y: 0 }),
    layerDisplayPointToDocPoint(layer, { x: layer.width, y: layer.height }),
    layerDisplayPointToDocPoint(layer, { x: 0, y: layer.height })
  ];
}

function getLayerAxisAlignedBounds(layer) {
  const corners = getLayerCornerPoints(layer);
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  const right = Math.max(...xs);
  const bottom = Math.max(...ys);

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
}

function getExportTargetDefinition(targetKey = "canvas") {
  const activeLayer = getActiveLayer();
  const activeArtboard = getActiveArtboard();

  if (targetKey === "layer" && activeLayer) {
    if (isAdjustmentLayer(activeLayer)) {
      const activeIndex = state.doc.layers.findIndex((layer) => layer.id === activeLayer.id);
      return {
        key: "layer",
        rect: getContentRect(),
        layers: state.doc.layers.slice(0, activeIndex + 1).filter((layer) => isLayerEffectivelyVisible(layer))
      };
    }

    return {
      key: "layer",
      rect: normalizeArtboardRect(getLayerAxisAlignedBounds(activeLayer)) ?? getContentRect(),
      layers: [activeLayer]
    };
  }

  if (targetKey === "artboard" && activeArtboard) {
    return {
      key: "artboard",
      rect: normalizeArtboardRect(activeArtboard) ?? getContentRect(),
      layers: state.doc.layers.filter((layer) => isLayerEffectivelyVisible(layer))
    };
  }

  return {
    key: "canvas",
    rect: getContentRect(),
    layers: state.doc.layers.filter((layer) => isLayerEffectivelyVisible(layer))
  };
}

function isPointInsideRect(point, rect) {
  if (!point || !rect) {
    return false;
  }

  return (
    point.x >= rect.x
    && point.x <= rect.x + rect.width
    && point.y >= rect.y
    && point.y <= rect.y + rect.height
  );
}

function getTopmostArtboardAtDocPoint(point) {
  for (let index = state.artboards.length - 1; index >= 0; index -= 1) {
    const artboard = state.artboards[index];
    if (isPointInsideRect(point, artboard)) {
      return artboard;
    }
  }

  return null;
}

function setActiveArtboard(artboardId) {
  state.activeArtboardId = state.artboards.some((artboard) => artboard.id === artboardId)
    ? artboardId
    : null;
}

function createOrUpdateArtboardFromLayer(layer) {
  if (!layer) {
    return null;
  }

  const rect = normalizeArtboardRect(getLayerAxisAlignedBounds(layer));
  if (!rect) {
    return null;
  }

  const existing = state.artboards.find((artboard) => artboard.sourceLayerId === layer.id) ?? null;
  if (existing) {
    const changed = (
      Math.abs(existing.x - rect.x) > 0.01
      || Math.abs(existing.y - rect.y) > 0.01
      || Math.abs(existing.width - rect.width) > 0.01
      || Math.abs(existing.height - rect.height) > 0.01
    );
    existing.x = rect.x;
    existing.y = rect.y;
    existing.width = rect.width;
    existing.height = rect.height;
    setActiveArtboard(existing.id);
    return {
      artboard: existing,
      changed
    };
  }

  const artboard = normalizeArtboard({
    name: `${layer.name || nextGeneratedArtboardName()} Artboard`,
    sourceLayerId: layer.id,
    ...rect
  }, nextGeneratedArtboardName());
  state.artboards.push(artboard);
  setActiveArtboard(artboard.id);
  return {
    artboard,
    changed: true
  };
}

function deleteActiveArtboard() {
  const activeArtboard = getActiveArtboard();
  if (!activeArtboard) {
    return;
  }

  const index = state.artboards.findIndex((artboard) => artboard.id === activeArtboard.id);
  if (index === -1) {
    return;
  }

  state.artboards.splice(index, 1);
  setActiveArtboard(state.artboards[index]?.id ?? state.artboards[index - 1]?.id ?? null);
  pushHistory();
  refresh();
}

function shiftArtboards(offsetX, offsetY) {
  for (const artboard of state.artboards) {
    artboard.x = round(artboard.x + offsetX, 3);
    artboard.y = round(artboard.y + offsetY, 3);
  }
}

function clampDocPointToLayer(layer, point) {
  const displayPoint = getLayerDisplayPoint(layer, point);
  return layerDisplayPointToDocPoint(layer, {
    x: clamp(displayPoint.x, 0, layer.width),
    y: clamp(displayPoint.y, 0, layer.height)
  });
}

function clearGuides() {
  state.guides.vertical = null;
  state.guides.horizontal = null;
  state.guides.rotation = null;
}

function getMoveSnapThreshold() {
  return Math.max(3, 10 / Math.max(state.zoom, 0.0001));
}

function findBestSnap(values, targets, threshold) {
  let best = null;

  for (const value of values) {
    for (const target of targets) {
      const delta = target - value.value;
      const distance = Math.abs(delta);
      if (distance > threshold) {
        continue;
      }

      if (!best || distance < best.distance) {
        best = {
          delta,
          distance,
          target
        };
      }
    }
  }

  return best;
}

function snapLayerToDocument(layer, options = {}) {
  if (state.panelToggles.snap === false) {
    return {
      snappedX: false,
      snappedY: false
    };
  }

  const threshold = options.threshold ?? getMoveSnapThreshold();
  const bounds = getLayerAxisAlignedBounds(layer);
  const xValues = [
    { value: bounds.x, guide: "left" },
    { value: bounds.x + bounds.width / 2, guide: "center" },
    { value: bounds.x + bounds.width, guide: "right" }
  ];
  const yValues = [
    { value: bounds.y, guide: "top" },
    { value: bounds.y + bounds.height / 2, guide: "middle" },
    { value: bounds.y + bounds.height, guide: "bottom" }
  ];
  const xTargets = [0, state.doc.width / 2, state.doc.width];
  const yTargets = [0, state.doc.height / 2, state.doc.height];

  const xSnap = findBestSnap(xValues, xTargets, threshold);
  const ySnap = findBestSnap(yValues, yTargets, threshold);

  if (xSnap) {
    layer.x += xSnap.delta;
    state.guides.vertical = xSnap.target;
  }

  if (ySnap) {
    layer.y += ySnap.delta;
    state.guides.horizontal = ySnap.target;
  }

  return {
    snappedX: Boolean(xSnap),
    snappedY: Boolean(ySnap)
  };
}

function getRotationSnapAngle(rotation) {
  if (state.panelToggles.snap === false) {
    return rotation;
  }

  const increment = 15;
  const threshold = 4;
  const snapped = normalizeAngle(Math.round(rotation / increment) * increment);
  return Math.abs(normalizeAngle(snapped - rotation)) <= threshold ? snapped : rotation;
}

function getCanvasGuideLineWidth(multiplier = 1) {
  return Math.max(1, (window.devicePixelRatio || 1) * multiplier);
}

function getGridSpacingDocUnits() {
  const targetSpacing = 48 * (window.devicePixelRatio || 1);
  const rawSpacing = targetSpacing / Math.max(state.zoom, 0.0001);
  const steps = [5, 10, 25, 50, 100, 200, 500, 1000, 2000, 5000];
  return steps.find((step) => step >= rawSpacing) ?? steps.at(-1);
}

function formatRulerTickLabel(value) {
  const rounded = Math.round(value);
  return Math.abs(rounded) >= 10000 ? `${Math.round(rounded / 1000)}k` : String(rounded);
}

function isCanvasPointInViewport(point) {
  return Boolean(point)
    && Number.isFinite(point.x)
    && Number.isFinite(point.y)
    && point.x >= 0
    && point.x <= canvas.width
    && point.y >= 0
    && point.y <= canvas.height;
}

function clipToDocumentBounds(docBounds = getDocBounds()) {
  ctx.beginPath();
  ctx.rect(docBounds.x, docBounds.y, docBounds.width, docBounds.height);
  ctx.clip();
}

function renderGridOverlay(docBounds = getDocBounds()) {
  if (!state.panelToggles.grid) {
    return;
  }

  const spacing = getGridSpacingDocUnits();
  ctx.save();
  clipToDocumentBounds(docBounds);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = getCanvasGuideLineWidth(0.75);
  ctx.beginPath();

  for (let x = 0; x <= state.doc.width; x += spacing) {
    const canvasX = docToCanvasPoint(x, 0).x;
    ctx.moveTo(canvasX, docBounds.y);
    ctx.lineTo(canvasX, docBounds.y + docBounds.height);
  }

  for (let y = 0; y <= state.doc.height; y += spacing) {
    const canvasY = docToCanvasPoint(0, y).y;
    ctx.moveTo(docBounds.x, canvasY);
    ctx.lineTo(docBounds.x + docBounds.width, canvasY);
  }

  ctx.stroke();
  ctx.restore();
}

function renderRulerOverlay() {
  if (!state.doc || !state.panelToggles.rulers) {
    return;
  }

  const ratio = window.devicePixelRatio || 1;
  const rulerSize = Math.max(12, Math.min(18 * ratio, canvas.width / 4, canvas.height / 4));
  const spacing = getGridSpacingDocUnits();
  const visibleDocLeft = canvasToDocPoint({ x: 0, y: 0 }).x;
  const visibleDocRight = canvasToDocPoint({ x: canvas.width, y: 0 }).x;
  const visibleDocTop = canvasToDocPoint({ x: 0, y: 0 }).y;
  const visibleDocBottom = canvasToDocPoint({ x: 0, y: canvas.height }).y;

  if (![spacing, visibleDocLeft, visibleDocRight, visibleDocTop, visibleDocBottom].every(Number.isFinite) || spacing <= 0) {
    return;
  }

  const firstVisibleX = Math.floor(visibleDocLeft / spacing) * spacing;
  const firstVisibleY = Math.floor(visibleDocTop / spacing) * spacing;
  const majorSpacing = spacing * 2;
  const fontSize = Math.max(9 * ratio, Math.min(11 * ratio, rulerSize * 0.58));
  const labelInset = Math.max(2 * ratio, rulerSize * 0.12);
  ctx.save();
  ctx.fillStyle = "rgba(22, 22, 22, 0.72)";
  ctx.fillRect(0, 0, canvas.width, rulerSize);
  ctx.fillRect(0, 0, rulerSize, canvas.height);
  ctx.fillStyle = "rgba(10, 12, 15, 0.42)";
  ctx.fillRect(0, 0, rulerSize, rulerSize);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
  ctx.lineWidth = getCanvasGuideLineWidth(0.75);
  ctx.beginPath();

  for (let x = firstVisibleX, ticks = 0; x <= visibleDocRight && ticks < 1000; x += spacing, ticks += 1) {
    const canvasX = docToCanvasPoint(x, 0).x;
    const isMajor = x % majorSpacing === 0;
    ctx.moveTo(canvasX, rulerSize);
    ctx.lineTo(canvasX, isMajor ? rulerSize * 0.35 : rulerSize * 0.58);
  }

  for (let y = firstVisibleY, ticks = 0; y <= visibleDocBottom && ticks < 1000; y += spacing, ticks += 1) {
    const canvasY = docToCanvasPoint(0, y).y;
    const isMajor = y % majorSpacing === 0;
    ctx.moveTo(rulerSize, canvasY);
    ctx.lineTo(isMajor ? rulerSize * 0.35 : rulerSize * 0.58, canvasY);
  }

  ctx.stroke();

  ctx.font = `${fontSize}px Inter, "Segoe UI", sans-serif`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  ctx.fillText("px", labelInset, labelInset);

  for (let x = firstVisibleX, ticks = 0; x <= visibleDocRight && ticks < 1000; x += spacing, ticks += 1) {
    if (x % majorSpacing !== 0) {
      continue;
    }

    const canvasX = docToCanvasPoint(x, 0).x;
    if (canvasX <= rulerSize + labelInset || canvasX >= canvas.width - labelInset) {
      continue;
    }

    ctx.fillText(formatRulerTickLabel(x), canvasX + labelInset, labelInset);
  }

  for (let y = firstVisibleY, ticks = 0; y <= visibleDocBottom && ticks < 1000; y += spacing, ticks += 1) {
    if (y % majorSpacing !== 0) {
      continue;
    }

    const canvasY = docToCanvasPoint(0, y).y;
    const label = formatRulerTickLabel(y);
    if (canvasY <= rulerSize + ctx.measureText(label).width + labelInset || canvasY >= canvas.height - labelInset) {
      continue;
    }

    ctx.save();
    ctx.translate(labelInset, canvasY - labelInset);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  if (isCanvasPointInViewport(state.hoverCanvasPoint)) {
    const cursorPoint = state.hoverCanvasPoint;
    const docPoint = state.hoverDocPoint ?? canvasToDocPoint(cursorPoint);
    const xLabel = `${Math.round(docPoint.x)} px`;
    const yLabel = `${Math.round(docPoint.y)} px`;
    const badgePaddingX = 4 * ratio;
    const badgePaddingY = 2 * ratio;
    const badgeHeight = fontSize + badgePaddingY * 2;
    const xLabelWidth = ctx.measureText(xLabel).width + badgePaddingX * 2;
    const yLabelWidth = ctx.measureText(yLabel).width + badgePaddingX * 2;
    const xLabelLeft = clamp(cursorPoint.x + 6 * ratio, rulerSize + labelInset, Math.max(rulerSize + labelInset, canvas.width - xLabelWidth - labelInset));
    const yLabelAnchor = clamp(cursorPoint.y + yLabelWidth / 2, rulerSize + yLabelWidth + labelInset, Math.max(rulerSize + yLabelWidth + labelInset, canvas.height - labelInset));

    ctx.strokeStyle = "#ff7f41";
    ctx.lineWidth = Math.max(1.5, 1.5 * ratio);
    ctx.beginPath();
    ctx.moveTo(cursorPoint.x, 0);
    ctx.lineTo(cursorPoint.x, rulerSize);
    ctx.moveTo(0, cursorPoint.y);
    ctx.lineTo(rulerSize, cursorPoint.y);
    ctx.stroke();

    ctx.fillStyle = "#ff7f41";
    ctx.beginPath();
    ctx.moveTo(cursorPoint.x, rulerSize);
    ctx.lineTo(cursorPoint.x - 4 * ratio, rulerSize - 5 * ratio);
    ctx.lineTo(cursorPoint.x + 4 * ratio, rulerSize - 5 * ratio);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(rulerSize, cursorPoint.y);
    ctx.lineTo(rulerSize - 5 * ratio, cursorPoint.y - 4 * ratio);
    ctx.lineTo(rulerSize - 5 * ratio, cursorPoint.y + 4 * ratio);
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(xLabelLeft, labelInset, xLabelWidth, badgeHeight);
    ctx.fillStyle = "#0f1318";
    ctx.fillText(xLabel, xLabelLeft + badgePaddingX, labelInset + badgePaddingY);

    ctx.save();
    ctx.translate(labelInset, yLabelAnchor);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#ff7f41";
    ctx.fillRect(0, 0, yLabelWidth, badgeHeight);
    ctx.fillStyle = "#0f1318";
    ctx.fillText(yLabel, badgePaddingX, badgePaddingY);
    ctx.restore();
  }

  ctx.restore();
}

function renderStaticGuideOverlay(docBounds = getDocBounds()) {
  if (!state.panelToggles.guideColumns && !state.panelToggles.guideRows && !state.panelToggles.guideFrame) {
    return;
  }

  ctx.save();
  clipToDocumentBounds(docBounds);
  ctx.strokeStyle = "rgba(59, 157, 255, 0.78)";
  ctx.lineWidth = getCanvasGuideLineWidth(1);
  ctx.setLineDash([8, 5]);
  ctx.beginPath();

  if (state.panelToggles.guideColumns) {
    for (const x of [state.doc.width / 3, state.doc.width * 2 / 3]) {
      const canvasX = docToCanvasPoint(x, 0).x;
      ctx.moveTo(canvasX, docBounds.y);
      ctx.lineTo(canvasX, docBounds.y + docBounds.height);
    }
  }

  if (state.panelToggles.guideRows) {
    for (const y of [state.doc.height / 3, state.doc.height * 2 / 3]) {
      const canvasY = docToCanvasPoint(0, y).y;
      ctx.moveTo(docBounds.x, canvasY);
      ctx.lineTo(docBounds.x + docBounds.width, canvasY);
    }
  }

  if (state.panelToggles.guideFrame) {
    const margin = Math.min(state.doc.width, state.doc.height) * 0.08;
    const topLeft = docToCanvasPoint(margin, margin);
    const bottomRight = docToCanvasPoint(state.doc.width - margin, state.doc.height - margin);
    ctx.rect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
  }

  ctx.stroke();
  ctx.restore();
}

function renderGuides() {
  const hasDynamicGuides = state.guides.vertical !== null || state.guides.horizontal !== null;
  const hasPanelGuides = state.panelToggles.grid
    || state.panelToggles.guideColumns
    || state.panelToggles.guideRows
    || state.panelToggles.guideFrame;

  if (!hasDynamicGuides && !hasPanelGuides) {
    return;
  }

  const docBounds = getDocBounds();
  renderGridOverlay(docBounds);
  renderStaticGuideOverlay(docBounds);

  if (hasDynamicGuides) {
    ctx.save();
    ctx.strokeStyle = "rgba(255, 127, 65, 0.92)";
    ctx.lineWidth = getCanvasGuideLineWidth(1.25);
    ctx.setLineDash([10, 6]);

    if (state.guides.vertical !== null) {
      const x = docToCanvasPoint(state.guides.vertical, 0).x;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    if (state.guides.horizontal !== null) {
      const y = docToCanvasPoint(0, state.guides.horizontal).y;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.restore();
  }
}

function renderCropHandles(selectionRect) {
  const handles = getCropHandleDescriptors(selectionRect);

  ctx.save();
  ctx.setLineDash([]);
  ctx.fillStyle = "#ff7f41";
  ctx.strokeStyle = "#0f1318";
  ctx.lineWidth = Math.max(1, window.devicePixelRatio || 1);

  for (const handle of handles) {
    ctx.fillRect(handle.left, handle.top, handle.size, handle.size);
    ctx.strokeRect(handle.left, handle.top, handle.size, handle.size);
  }

  ctx.restore();
}

function getLayerScale(layer) {
  return {
    x: layer.canvas.width / Math.max(layer.width, 0.0001),
    y: layer.canvas.height / Math.max(layer.height, 0.0001)
  };
}

function docPointToLayerPoint(layer, point) {
  const displayPoint = getLayerDisplayPoint(layer, point);
  const scale = getLayerScale(layer);
  return {
    x: displayPoint.x * scale.x,
    y: displayPoint.y * scale.y
  };
}

function getLayerCanvasBounds(layer) {
  const bounds = getLayerAxisAlignedBounds(layer);
  const start = docToCanvasPoint(bounds.x, bounds.y);
  return {
    x: start.x,
    y: start.y,
    width: bounds.width * state.zoom,
    height: bounds.height * state.zoom
  };
}

function getLayerLocalRectForDocRect(layer, rect) {
  const left = Math.max(rect.x, layer.x);
  const top = Math.max(rect.y, layer.y);
  const right = Math.min(rect.x + rect.width, layer.x + layer.width);
  const bottom = Math.min(rect.y + rect.height, layer.y + layer.height);

  if (right <= left || bottom <= top) {
    return null;
  }

  const scale = getLayerScale(layer);

  return {
    x: (left - layer.x) * scale.x,
    y: (top - layer.y) * scale.y,
    width: (right - left) * scale.x,
    height: (bottom - top) * scale.y
  };
}

function getHandleSize() {
  return Math.max(10, 10 * (window.devicePixelRatio || 1));
}

function getResizeCursor(handle) {
  if (handle === "n" || handle === "s") {
    return "ns-resize";
  }

  if (handle === "e" || handle === "w") {
    return "ew-resize";
  }

  return handle === "ne" || handle === "sw" ? "nesw-resize" : "nwse-resize";
}

function getLayerHandleDescriptors(layer) {
  const size = getHandleSize();
  const half = size / 2;
  const cornerPoints = getLayerCornerPoints(layer).map((point) => docToCanvasPoint(point.x, point.y));
  const [nw, ne, se, sw] = cornerPoints;
  const topCenter = {
    x: (nw.x + ne.x) / 2,
    y: (nw.y + ne.y) / 2
  };
  const center = {
    x: (nw.x + se.x) / 2,
    y: (nw.y + se.y) / 2
  };
  const vector = {
    x: topCenter.x - center.x,
    y: topCenter.y - center.y
  };
  const length = Math.hypot(vector.x, vector.y) || 1;
  const rotationPoint = {
    x: topCenter.x + (vector.x / length) * 30,
    y: topCenter.y + (vector.y / length) * 30
  };

  return [
    { type: "resize", name: "nw", cursor: getResizeCursor("nw"), x: nw.x, y: nw.y, left: nw.x - half, top: nw.y - half, size },
    { type: "resize", name: "ne", cursor: getResizeCursor("ne"), x: ne.x, y: ne.y, left: ne.x - half, top: ne.y - half, size },
    { type: "resize", name: "sw", cursor: getResizeCursor("sw"), x: sw.x, y: sw.y, left: sw.x - half, top: sw.y - half, size },
    { type: "resize", name: "se", cursor: getResizeCursor("se"), x: se.x, y: se.y, left: se.x - half, top: se.y - half, size },
    {
      type: "rotate",
      name: "rotate",
      cursor: "grab",
      x: rotationPoint.x,
      y: rotationPoint.y,
      left: rotationPoint.x - half,
      top: rotationPoint.y - half,
      size
    }
  ];
}

function getCropHandleDescriptors(rect) {
  const size = getHandleSize();
  const half = size / 2;
  const start = docToCanvasPoint(rect.x, rect.y);
  const end = docToCanvasPoint(rect.x + rect.width, rect.y + rect.height);
  const middleX = (start.x + end.x) / 2;
  const middleY = (start.y + end.y) / 2;
  const points = [
    { name: "nw", x: start.x, y: start.y },
    { name: "n", x: middleX, y: start.y },
    { name: "ne", x: end.x, y: start.y },
    { name: "w", x: start.x, y: middleY },
    { name: "e", x: end.x, y: middleY },
    { name: "sw", x: start.x, y: end.y },
    { name: "s", x: middleX, y: end.y },
    { name: "se", x: end.x, y: end.y }
  ];

  return points.map((point) => ({
    type: "resize",
    name: point.name,
    cursor: getResizeCursor(point.name),
    x: point.x,
    y: point.y,
    left: point.x - half,
    top: point.y - half,
    size
  }));
}

function isDocPointInsideLayer(layer, point) {
  const displayPoint = getLayerDisplayPoint(layer, point);
  return (
    displayPoint.x >= 0
    && displayPoint.x <= layer.width
    && displayPoint.y >= 0
    && displayPoint.y <= layer.height
  );
}

function isDocPointOnVisibleLayer(layer, point, options = {}) {
  if (!isLayerEffectivelyVisible(layer)) {
    return false;
  }

  if (isAdjustmentLayer(layer)) {
    return false;
  }

  if (!isDocPointInsideLayer(layer, point)) {
    return false;
  }

  if (options.useAlpha === false || isBackgroundLayer(layer)) {
    return true;
  }

  let alpha = getLayerPixelAlphaAtDocPoint(layer, point, { applyMask: true });
  if (!isLayerClippedToBelow(layer)) {
    return alpha > 8;
  }

  const clipBase = getLayerClippingBase(layer);
  if (!clipBase || !isLayerEffectivelyVisible(clipBase)) {
    return false;
  }

  const clipAlpha = getLayerPixelAlphaAtDocPoint(clipBase, point, { applyMask: true });
  alpha = (alpha * clipAlpha) / 255;
  return alpha > 8;
}

function getTopmostVisibleLayerAtDocPoint(point, options = {}) {
  if (!state.doc) {
    return null;
  }

  for (let index = state.doc.layers.length - 1; index >= 0; index -= 1) {
    const layer = state.doc.layers[index];
    if (!options.includeBackground && isBackgroundLayer(layer)) {
      continue;
    }
    if (isDocPointOnVisibleLayer(layer, point, options)) {
      return layer;
    }
  }

  return null;
}

function getLayerTransformTarget(canvasPoint, layer = getActiveLayer()) {
  if (!isLayerEffectivelyVisible(layer) || !canTransformLayer(layer)) {
    return null;
  }

  for (const handle of getLayerHandleDescriptors(layer)) {
    if (
      canvasPoint.x >= handle.left
      && canvasPoint.x <= handle.left + handle.size
      && canvasPoint.y >= handle.top
      && canvasPoint.y <= handle.top + handle.size
    ) {
      return { type: handle.type, handle: handle.name, cursor: handle.cursor };
    }
  }

  const docPoint = canvasToDocPoint(canvasPoint);
  if (isDocPointOnVisibleLayer(layer, docPoint, { useAlpha: true })) {
    return { type: "body", cursor: "move" };
  }

  return null;
}

function getCurrentTransformTarget() {
  if (!state.hoverCanvasPoint) {
    return null;
  }

  return getLayerTransformTarget(state.hoverCanvasPoint);
}

function getCurrentVectorHandleTarget() {
  if (!state.hoverCanvasPoint) {
    return null;
  }

  return getVectorHandleTarget(state.hoverCanvasPoint);
}

function getCropSelectionTarget(canvasPoint) {
  const cropRect = getCropRect();
  if (!cropRect) {
    return null;
  }

  for (const handle of getCropHandleDescriptors(cropRect)) {
    if (
      canvasPoint.x >= handle.left
      && canvasPoint.x <= handle.left + handle.size
      && canvasPoint.y >= handle.top
      && canvasPoint.y <= handle.top + handle.size
    ) {
      return { type: "resize", handle: handle.name, cursor: handle.cursor };
    }
  }

  return null;
}

function getCurrentCropTarget() {
  if (!state.hoverCanvasPoint) {
    return null;
  }

  return getCropSelectionTarget(state.hoverCanvasPoint);
}

function clampDocPoint(point) {
  return {
    x: clamp(point.x, 0, state.doc.width),
    y: clamp(point.y, 0, state.doc.height)
  };
}

function intersectRects(first, second) {
  const left = Math.max(first.x, second.x);
  const top = Math.max(first.y, second.y);
  const right = Math.min(first.x + first.width, second.x + second.width);
  const bottom = Math.min(first.y + first.height, second.y + second.height);

  if (right - left < 2 || bottom - top < 2) {
    return null;
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
}

function clampRectToDocument(rect) {
  if (!state.doc) {
    return null;
  }

  return intersectRects(rect, {
    x: 0,
    y: 0,
    width: state.doc.width,
    height: state.doc.height
  });
}

function getRectFromPoints(startPoint, endPoint, preserveAspect = false) {
  let width = Math.abs(endPoint.x - startPoint.x);
  let height = Math.abs(endPoint.y - startPoint.y);

  if (preserveAspect) {
    const size = Math.max(width, height);
    width = size;
    height = size;
  }

  return clampRectToDocument({
    x: endPoint.x >= startPoint.x ? startPoint.x : startPoint.x - width,
    y: endPoint.y >= startPoint.y ? startPoint.y : startPoint.y - height,
    width,
    height
  });
}

function isLineBasedShapeType(shapeType) {
  return lineBasedShapeTypes.has(shapeType);
}

function isOutlineOnlyShapeType(shapeType) {
  return outlineOnlyShapeTypes.has(shapeType);
}

function getShapeTypeLabel(shapeType) {
  switch (shapeType) {
    case "outline-rectangle":
      return "Outline Rectangle";
    case "ellipse":
      return "Ellipse";
    case "triangle":
      return "Triangle";
    case "line":
      return "Line";
    case "arrow":
      return "Arrow";
    case "callout":
      return "Callout";
    default:
      return "Rectangle";
  }
}

function getShapeCreationStrokeWidth() {
  return Math.round(clamp(Number(state.shapeStrokeWidth) || 6, 1, 48));
}

function getConstrainedLineEndPoint(startPoint, endPoint) {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const distance = Math.hypot(dx, dy);

  if (distance < 0.001) {
    return { ...endPoint };
  }

  const step = Math.PI / 4;
  const snappedAngle = Math.round(Math.atan2(dy, dx) / step) * step;
  return {
    x: startPoint.x + Math.cos(snappedAngle) * distance,
    y: startPoint.y + Math.sin(snappedAngle) * distance
  };
}

function getShapeDraftFromPoints(shapeType, startPoint, endPoint, constrain = false) {
  const normalizedStart = clampDocPoint(startPoint);
  let normalizedEnd = clampDocPoint(endPoint);

  if (constrain && isLineBasedShapeType(shapeType)) {
    normalizedEnd = clampDocPoint(getConstrainedLineEndPoint(normalizedStart, normalizedEnd));
  }

  const rect = isLineBasedShapeType(shapeType)
    ? {
      x: Math.min(normalizedStart.x, normalizedEnd.x),
      y: Math.min(normalizedStart.y, normalizedEnd.y),
      width: Math.abs(normalizedEnd.x - normalizedStart.x),
      height: Math.abs(normalizedEnd.y - normalizedStart.y)
    }
    : (
      getRectFromPoints(normalizedStart, normalizedEnd, constrain)
      ?? {
        x: normalizedStart.x,
        y: normalizedStart.y,
        width: 0,
        height: 0
      }
    );

  return {
    ...rect,
    startPoint: normalizedStart,
    endPoint: normalizedEnd
  };
}

function getShapeDraftLength(shapeDraft) {
  if (!shapeDraft?.startPoint || !shapeDraft?.endPoint) {
    return 0;
  }

  return Math.hypot(
    shapeDraft.endPoint.x - shapeDraft.startPoint.x,
    shapeDraft.endPoint.y - shapeDraft.startPoint.y
  );
}

function isRenderableShapeDraft(shapeType, shapeDraft) {
  if (!shapeDraft) {
    return false;
  }

  if (isLineBasedShapeType(shapeType)) {
    return getShapeDraftLength(shapeDraft) >= 4;
  }

  return shapeDraft.width >= 2 && shapeDraft.height >= 2;
}

function getArrowHeadPoints(headPoint, oppositePoint, headLength) {
  const dx = oppositePoint.x - headPoint.x;
  const dy = oppositePoint.y - headPoint.y;
  const distance = Math.hypot(dx, dy) || 1;
  const angle = Math.atan2(dy, dx);
  const spread = Math.PI / 7;
  const length = clamp(headLength, 8, Math.max(distance, 8));

  return {
    left: {
      x: headPoint.x + Math.cos(angle + spread) * length,
      y: headPoint.y + Math.sin(angle + spread) * length
    },
    right: {
      x: headPoint.x + Math.cos(angle - spread) * length,
      y: headPoint.y + Math.sin(angle - spread) * length
    }
  };
}

function getLineShapeGeometry(startPoint, endPoint, strokeWidth = getShapeCreationStrokeWidth()) {
  const padding = Math.max(strokeWidth * 2, 8);
  const x = Math.min(startPoint.x, endPoint.x) - padding;
  const y = Math.min(startPoint.y, endPoint.y) - padding;
  const width = Math.max(Math.abs(endPoint.x - startPoint.x) + padding * 2, 1);
  const height = Math.max(Math.abs(endPoint.y - startPoint.y) + padding * 2, 1);

  return {
    x,
    y,
    width,
    height,
    localStart: {
      x: startPoint.x - x,
      y: startPoint.y - y
    },
    localEnd: {
      x: endPoint.x - x,
      y: endPoint.y - y
    }
  };
}

function buildLineShapePathData(startPoint, endPoint, strokeWidth = getShapeCreationStrokeWidth(), options = {}) {
  const geometry = getLineShapeGeometry(startPoint, endPoint, strokeWidth);
  const pathSegments = [
    `M ${round(geometry.localStart.x, 3)} ${round(geometry.localStart.y, 3)} L ${round(geometry.localEnd.x, 3)} ${round(geometry.localEnd.y, 3)}`
  ];
  const arrowHead = options.arrowHead ?? null;

  if (arrowHead === "start" || arrowHead === "end") {
    const headPoint = arrowHead === "start" ? geometry.localStart : geometry.localEnd;
    const oppositePoint = arrowHead === "start" ? geometry.localEnd : geometry.localStart;
    const head = getArrowHeadPoints(headPoint, oppositePoint, Math.max(strokeWidth * 3.4, 14));
    pathSegments.push(
      `M ${round(head.left.x, 3)} ${round(head.left.y, 3)} L ${round(headPoint.x, 3)} ${round(headPoint.y, 3)} L ${round(head.right.x, 3)} ${round(head.right.y, 3)}`
    );
  }

  return {
    geometry,
    pathData: pathSegments.join(" ")
  };
}

function buildPenPathDefinition(points, strokeWidth = getShapeCreationStrokeWidth(), options = {}) {
  const normalizedPoints = Array.isArray(points)
    ? points.filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y))
    : [];

  if (normalizedPoints.length < 2) {
    return null;
  }

  const padding = Math.max(strokeWidth * 2, 8);
  const xs = normalizedPoints.map((point) => point.x);
  const ys = normalizedPoints.map((point) => point.y);
  const x = Math.min(...xs) - padding;
  const y = Math.min(...ys) - padding;
  const width = Math.max(Math.max(...xs) - Math.min(...xs) + padding * 2, 1);
  const height = Math.max(Math.max(...ys) - Math.min(...ys) + padding * 2, 1);
  const localPoints = normalizedPoints.map((point) => ({
    x: point.x - x,
    y: point.y - y
  }));
  const pathSegments = [`M ${round(localPoints[0].x, 3)} ${round(localPoints[0].y, 3)}`];

  for (const point of localPoints.slice(1)) {
    pathSegments.push(`L ${round(point.x, 3)} ${round(point.y, 3)}`);
  }

  if (options.closed === true && localPoints.length >= 3) {
    pathSegments.push("Z");
  }

  return {
    x,
    y,
    width,
    height,
    pathData: pathSegments.join(" ")
  };
}

function getCalloutTextBoxRect(targetPoint, labelPoint, width, height) {
  const offset = Math.max(16, getShapeCreationStrokeWidth() * 2);
  return {
    x: round(labelPoint.x + (labelPoint.x >= targetPoint.x ? offset : -width - offset), 3),
    y: round(labelPoint.y + (labelPoint.y >= targetPoint.y ? offset : -height - offset), 3),
    width,
    height
  };
}

function getNearestPointOnRect(rect, point) {
  return {
    x: clamp(point.x, rect.x, rect.x + rect.width),
    y: clamp(point.y, rect.y, rect.y + rect.height)
  };
}

function drawShapePath(targetContext, shapeType, width, height) {
  targetContext.beginPath();

  if (shapeType === "ellipse") {
    targetContext.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    return;
  }

  if (shapeType === "triangle") {
    targetContext.moveTo(width / 2, 0);
    targetContext.lineTo(width, height);
    targetContext.lineTo(0, height);
    targetContext.closePath();
    return;
  }

  targetContext.rect(0, 0, width, height);
}

function drawLinePreviewPath(targetContext, startPoint, endPoint, options = {}) {
  const arrowHead = options.arrowHead ?? null;
  const headLength = Math.max((options.strokeWidth ?? 2) * 3.4, 12);

  targetContext.beginPath();
  targetContext.moveTo(startPoint.x, startPoint.y);
  targetContext.lineTo(endPoint.x, endPoint.y);

  if (arrowHead === "start" || arrowHead === "end") {
    const headPoint = arrowHead === "start" ? startPoint : endPoint;
    const oppositePoint = arrowHead === "start" ? endPoint : startPoint;
    const head = getArrowHeadPoints(headPoint, oppositePoint, headLength);
    targetContext.moveTo(head.left.x, head.left.y);
    targetContext.lineTo(headPoint.x, headPoint.y);
    targetContext.lineTo(head.right.x, head.right.y);
  }
}

function renderShapeDraftOverlay(targetContext, shapeDraft) {
  if (!shapeDraft) {
    return;
  }

  const previewStrokeWidth = Math.max(2, getShapeCreationStrokeWidth() * state.zoom);
  const shapeType = shapeDraft.type ?? state.shapeType;

  if (shapeType === "callout") {
    const previewRect = getCalloutTextBoxRect(
      shapeDraft.startPoint,
      shapeDraft.endPoint,
      Math.max(180, state.textFontSize * 4.5),
      Math.max(56, state.textFontSize * 1.7)
    );
    const previewLeaderEnd = getNearestPointOnRect(previewRect, shapeDraft.startPoint);
    const start = docToCanvasPoint(shapeDraft.startPoint.x, shapeDraft.startPoint.y);
    const end = docToCanvasPoint(previewLeaderEnd.x, previewLeaderEnd.y);
    const boxStart = docToCanvasPoint(previewRect.x, previewRect.y);

    targetContext.save();
    targetContext.globalAlpha = state.brushOpacity;
    targetContext.strokeStyle = state.brushColor;
    targetContext.fillStyle = "rgba(255, 255, 255, 0.04)";
    targetContext.lineWidth = previewStrokeWidth;
    targetContext.lineCap = "round";
    targetContext.lineJoin = "round";
    targetContext.setLineDash([10, 6]);
    drawLinePreviewPath(targetContext, start, end, {
      arrowHead: "start",
      strokeWidth: previewStrokeWidth
    });
    targetContext.stroke();
    targetContext.strokeRect(
      boxStart.x,
      boxStart.y,
      previewRect.width * state.zoom,
      previewRect.height * state.zoom
    );
    targetContext.fillRect(
      boxStart.x,
      boxStart.y,
      previewRect.width * state.zoom,
      previewRect.height * state.zoom
    );
    targetContext.restore();
    return;
  }

  if (isLineBasedShapeType(shapeType)) {
    const start = docToCanvasPoint(shapeDraft.startPoint.x, shapeDraft.startPoint.y);
    const end = docToCanvasPoint(shapeDraft.endPoint.x, shapeDraft.endPoint.y);
    targetContext.save();
    targetContext.globalAlpha = state.brushOpacity;
    targetContext.strokeStyle = state.brushColor;
    targetContext.lineWidth = previewStrokeWidth;
    targetContext.lineCap = "round";
    targetContext.lineJoin = "round";
    targetContext.setLineDash([10, 6]);
    drawLinePreviewPath(targetContext, start, end, {
      arrowHead: shapeType === "arrow" ? "end" : null,
      strokeWidth: previewStrokeWidth
    });
    targetContext.stroke();
    targetContext.restore();
    return;
  }

  const start = docToCanvasPoint(shapeDraft.x, shapeDraft.y);
  targetContext.save();
  targetContext.translate(start.x, start.y);
  targetContext.globalAlpha = state.brushOpacity;
  targetContext.fillStyle = state.brushColor;
  targetContext.strokeStyle = state.brushColor;
  targetContext.lineWidth = isOutlineOnlyShapeType(shapeType)
    ? previewStrokeWidth
    : Math.max(2, (window.devicePixelRatio || 1) * 1.5);
  targetContext.setLineDash([10, 6]);
  drawShapePath(
    targetContext,
    shapeType === "outline-rectangle" ? "rectangle" : shapeType,
    shapeDraft.width * state.zoom,
    shapeDraft.height * state.zoom
  );
  if (!isOutlineOnlyShapeType(shapeType)) {
    targetContext.fill();
  }
  targetContext.stroke();
  targetContext.restore();
}

function isPointNearPoint(pointA, pointB, tolerance = Math.max(6, 12 / Math.max(state.zoom, 0.1))) {
  if (!pointA || !pointB) {
    return false;
  }

  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y) <= tolerance;
}

function getRulerMeasurement(startPoint, endPoint) {
  if (!startPoint || !endPoint) {
    return null;
  }

  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  return {
    dx: round(dx, 1),
    dy: round(dy, 1),
    distance: round(Math.hypot(dx, dy), 1),
    angle: round(Math.atan2(dy, dx) * 180 / Math.PI, 1)
  };
}

function formatRulerMeasurement(measurement) {
  if (!measurement) {
    return "Drag on the canvas to measure distance and angle.";
  }

  return `${measurement.distance}px · dx ${measurement.dx}px · dy ${measurement.dy}px · ${measurement.angle}deg`;
}

function renderGradientDraftOverlay(targetContext, gradientDraft) {
  if (!gradientDraft?.startPoint || !gradientDraft?.endPoint) {
    return;
  }

  const start = docToCanvasPoint(gradientDraft.startPoint.x, gradientDraft.startPoint.y);
  const end = docToCanvasPoint(gradientDraft.endPoint.x, gradientDraft.endPoint.y);
  const radius = Math.max(5, 5 * (window.devicePixelRatio || 1));

  targetContext.save();
  targetContext.strokeStyle = "rgba(255, 255, 255, 0.92)";
  targetContext.lineWidth = Math.max(2, (window.devicePixelRatio || 1) * 1.5);
  targetContext.setLineDash([12, 8]);
  targetContext.beginPath();
  targetContext.moveTo(start.x, start.y);
  targetContext.lineTo(end.x, end.y);
  targetContext.stroke();
  targetContext.setLineDash([]);
  targetContext.fillStyle = state.brushColor;
  targetContext.beginPath();
  targetContext.arc(start.x, start.y, radius, 0, Math.PI * 2);
  targetContext.fill();
  targetContext.fillStyle = state.backgroundColor;
  targetContext.beginPath();
  targetContext.arc(end.x, end.y, radius, 0, Math.PI * 2);
  targetContext.fill();
  targetContext.strokeStyle = "#0f1318";
  targetContext.beginPath();
  targetContext.arc(start.x, start.y, radius, 0, Math.PI * 2);
  targetContext.arc(end.x, end.y, radius, 0, Math.PI * 2);
  targetContext.stroke();
  targetContext.restore();
}

function renderRulerDraftOverlay(targetContext, rulerDraft) {
  if (!rulerDraft?.startPoint || !rulerDraft?.endPoint) {
    return;
  }

  const start = docToCanvasPoint(rulerDraft.startPoint.x, rulerDraft.startPoint.y);
  const end = docToCanvasPoint(rulerDraft.endPoint.x, rulerDraft.endPoint.y);
  const measurement = getRulerMeasurement(rulerDraft.startPoint, rulerDraft.endPoint);
  const label = measurement ? `${measurement.distance}px · ${measurement.angle}deg` : "";
  const labelPoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };

  targetContext.save();
  targetContext.strokeStyle = "rgba(255, 209, 102, 0.96)";
  targetContext.lineWidth = Math.max(2, (window.devicePixelRatio || 1) * 1.5);
  targetContext.setLineDash([10, 6]);
  targetContext.beginPath();
  targetContext.moveTo(start.x, start.y);
  targetContext.lineTo(end.x, end.y);
  targetContext.stroke();
  targetContext.setLineDash([]);
  targetContext.fillStyle = "rgba(255, 209, 102, 0.96)";
  targetContext.beginPath();
  targetContext.arc(start.x, start.y, Math.max(4, 4 * (window.devicePixelRatio || 1)), 0, Math.PI * 2);
  targetContext.arc(end.x, end.y, Math.max(4, 4 * (window.devicePixelRatio || 1)), 0, Math.PI * 2);
  targetContext.fill();

  if (label) {
    targetContext.font = `${Math.max(11, Math.round(11 * (window.devicePixelRatio || 1)))}px Inter, "Segoe UI", sans-serif`;
    targetContext.textBaseline = "middle";
    const labelWidth = targetContext.measureText(label).width + 16;
    const labelHeight = Math.max(18, 18 * (window.devicePixelRatio || 1));
    targetContext.fillStyle = "rgba(255, 209, 102, 0.96)";
    targetContext.fillRect(labelPoint.x - labelWidth / 2, labelPoint.y - labelHeight - 8, labelWidth, labelHeight);
    targetContext.fillStyle = "#0f1318";
    targetContext.fillText(label, labelPoint.x - labelWidth / 2 + 8, labelPoint.y - labelHeight / 2 - 8);
  }

  targetContext.restore();
}

function getPenDraftPreviewPoint() {
  if (!state.penDraft?.points?.length || !state.hoverDocPoint || !state.doc) {
    return null;
  }

  if (!isPointInsideDocument(state.hoverDocPoint)) {
    return null;
  }

  return clampDocPoint(state.hoverDocPoint);
}

function renderPenDraftOverlay(targetContext, penDraft) {
  if (!penDraft?.points?.length) {
    return;
  }

  const previewPoint = getPenDraftPreviewPoint();
  const firstPoint = penDraft.points[0];
  const canClose = penDraft.points.length >= 3 && isPointNearPoint(previewPoint, firstPoint);

  targetContext.save();
  targetContext.strokeStyle = state.brushColor;
  targetContext.fillStyle = state.brushColor;
  targetContext.lineWidth = Math.max(2, getShapeCreationStrokeWidth() * 0.5 * state.zoom);
  targetContext.lineCap = "round";
  targetContext.lineJoin = "round";
  targetContext.setLineDash([10, 6]);
  targetContext.beginPath();

  penDraft.points.forEach((point, index) => {
    const canvasPoint = docToCanvasPoint(point.x, point.y);
    if (index === 0) {
      targetContext.moveTo(canvasPoint.x, canvasPoint.y);
    } else {
      targetContext.lineTo(canvasPoint.x, canvasPoint.y);
    }
  });

  if (previewPoint) {
    const previewCanvasPoint = docToCanvasPoint(
      canClose ? firstPoint.x : previewPoint.x,
      canClose ? firstPoint.y : previewPoint.y
    );
    targetContext.lineTo(previewCanvasPoint.x, previewCanvasPoint.y);
  }

  targetContext.stroke();
  targetContext.setLineDash([]);

  for (const point of penDraft.points) {
    const canvasPoint = docToCanvasPoint(point.x, point.y);
    const radius = Math.max(4, 4 * (window.devicePixelRatio || 1));
    targetContext.fillStyle = point === firstPoint && canClose ? "#ffd166" : "#ffffff";
    targetContext.beginPath();
    targetContext.arc(canvasPoint.x, canvasPoint.y, radius, 0, Math.PI * 2);
    targetContext.fill();
    targetContext.strokeStyle = "#0f1318";
    targetContext.lineWidth = Math.max(1, window.devicePixelRatio || 1);
    targetContext.stroke();
  }

  targetContext.restore();
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(hexColor) {
  const normalized = String(hexColor || "").trim().replace(/^#/, "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return null;
  }

  return {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16)
  };
}

function rgbaStringFromState() {
  return rgbaStringFromParts(state.brushColor, state.brushOpacity, { red: 255, green: 107, blue: 61 });
}

function rgbaStringFromParts(hexColor, opacity, fallback = { red: 255, green: 107, blue: 61 }) {
  const rgb = hexToRgb(hexColor) ?? fallback;
  return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${round(clamp(Number(opacity ?? 1), 0, 1), 3)})`;
}

function normalizeColorInputValue(value, fallback = "#000000") {
  return /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : fallback;
}

function updateColorInputs() {
  const foregroundColor = normalizeColorInputValue(state.brushColor, "#ff6b3d");
  const backgroundColor = normalizeColorInputValue(state.backgroundColor, "#ffffff");
  ui.brushColor.value = foregroundColor;
  if (ui.backgroundColor) {
    ui.backgroundColor.value = backgroundColor;
  }
  ui.toolColorStack?.style.setProperty("--fg-swatch", foregroundColor);
  ui.toolColorStack?.style.setProperty("--bg-swatch", backgroundColor);
  ui.brushColorValue.value = rgbaStringFromState();
}

function swapForegroundBackgroundColors() {
  const nextForeground = normalizeColorInputValue(state.backgroundColor, "#ffffff");
  state.backgroundColor = normalizeColorInputValue(state.brushColor, "#ff6b3d");
  state.brushColor = nextForeground;
  updateColorInputs();
  refresh();
}

function resetForegroundBackgroundColors() {
  state.brushColor = "#000000";
  state.backgroundColor = "#ffffff";
  updateColorInputs();
  refresh();
}

function parseColorValue(input, options = {}) {
  const normalized = String(input || "").trim();

  if (options.allowTransparent && (!normalized || /^(transparent|none)$/i.test(normalized))) {
    return {
      color: "transparent",
      opacity: null,
      cssColor: "transparent"
    };
  }

  if (/^#[0-9a-f]{6}$/i.test(normalized)) {
    const rgb = hexToRgb(normalized);
    return {
      color: normalized.toLowerCase(),
      opacity: null,
      cssColor: `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 1)`
    };
  }

  const rgbMatch = normalized.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|0?\.\d+|1(?:\.0+)?)\s*)?\)$/i);
  if (!rgbMatch) {
    return null;
  }

  const red = clamp(Number(rgbMatch[1]), 0, 255);
  const green = clamp(Number(rgbMatch[2]), 0, 255);
  const blue = clamp(Number(rgbMatch[3]), 0, 255);
  const alpha = rgbMatch[4] === undefined ? null : clamp(Number(rgbMatch[4]), 0, 1);

  return {
    color: rgbToHex(red, green, blue),
    opacity: alpha,
    cssColor: `rgba(${red}, ${green}, ${blue}, ${round(alpha ?? 1, 3)})`
  };
}

function nextGeneratedLayerName(prefix) {
  const normalizedPrefix = String(prefix || "Layer");
  let count = 0;

  if (state.doc) {
    for (const layer of state.doc.layers) {
      if (layer.name === normalizedPrefix || layer.name.startsWith(`${normalizedPrefix} `)) {
        count += 1;
      }
    }
  }

  return count === 0 ? normalizedPrefix : `${normalizedPrefix} ${count + 1}`;
}

function isTextLayer(layer) {
  return layer?.layerKind === "text" && layer.textStyle;
}

function getTextStyleDefaults() {
  return {
    fontFamily: state.textFontFamily,
    fontWeight: state.textFontWeight,
    fontSize: state.textFontSize,
    lineHeight: state.textLineHeight,
    color: state.textColor,
    opacity: state.textOpacity,
    strokeColor: state.textStrokeColor,
    strokeWidth: state.textStrokeWidth,
    backgroundColor: state.textBackgroundColor,
    align: state.textAlign,
    boxWidth: null
  };
}

function ensureTextStyle(textStyle = {}) {
  const lineHeight = Number(textStyle.lineHeight);
  const strokeWidth = Number(textStyle.strokeWidth);
  return {
    fontFamily: textStyle.fontFamily || state.textFontFamily,
    fontWeight: ["300", "400", "500", "600", "700", "800"].includes(String(textStyle.fontWeight))
      ? String(textStyle.fontWeight)
      : state.textFontWeight,
    fontSize: clamp(Number(textStyle.fontSize) || state.textFontSize, 8, 320),
    lineHeight: clamp(Number.isFinite(lineHeight) ? lineHeight : state.textLineHeight, 0.8, 3),
    color: textStyle.color || state.textColor,
    opacity: clamp(Number(textStyle.opacity ?? state.textOpacity), 0, 1),
    strokeColor: typeof textStyle.strokeColor === "string" ? textStyle.strokeColor : state.textStrokeColor,
    strokeWidth: clamp(Number.isFinite(strokeWidth) ? strokeWidth : state.textStrokeWidth, 0, 24),
    backgroundColor: typeof textStyle.backgroundColor === "string" ? textStyle.backgroundColor : state.textBackgroundColor,
    align: ["left", "center", "right"].includes(textStyle.align) ? textStyle.align : state.textAlign,
    boxWidth: Number.isFinite(textStyle.boxWidth) && textStyle.boxWidth > 0
      ? Math.max(32, Math.round(textStyle.boxWidth))
      : null
  };
}

function getCanvasTextFont(style) {
  return `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
}

function breakWordToWidth(word, measureContext, maxWidth) {
  const segments = [];
  let current = "";

  for (const character of String(word)) {
    const candidate = current + character;
    if (current && measureContext.measureText(candidate).width > maxWidth) {
      segments.push(current);
      current = character;
    } else {
      current = candidate;
    }
  }

  if (current) {
    segments.push(current);
  }

  return segments.length ? segments : [""];
}

function wrapTextLine(line, measureContext, maxWidth) {
  if (!Number.isFinite(maxWidth) || maxWidth <= 0) {
    return [line];
  }

  if (!line) {
    return [""];
  }

  const words = String(line).split(/\s+/).filter(Boolean);
  if (!words.length) {
    return [""];
  }

  const wrapped = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      if (measureContext.measureText(word).width <= maxWidth) {
        current = word;
        continue;
      }

      const pieces = breakWordToWidth(word, measureContext, maxWidth);
      wrapped.push(...pieces.slice(0, -1));
      current = pieces.at(-1) || "";
      continue;
    }

    const candidate = `${current} ${word}`;
    if (measureContext.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }

    wrapped.push(current);

    if (measureContext.measureText(word).width <= maxWidth) {
      current = word;
      continue;
    }

    const pieces = breakWordToWidth(word, measureContext, maxWidth);
    wrapped.push(...pieces.slice(0, -1));
    current = pieces.at(-1) || "";
  }

  wrapped.push(current);
  return wrapped;
}

function getTextLayout(style, text) {
  const padding = Math.max(8, Math.round(style.fontSize * 0.25) + Math.ceil(style.strokeWidth));
  const lineHeight = Math.max(1, style.fontSize * style.lineHeight);
  const measureCanvas = createCanvasElement(1, 1);
  const measureContext = measureCanvas.getContext("2d");
  measureContext.font = getCanvasTextFont(style);
  const baseLines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const wrapWidth = Number.isFinite(style.boxWidth) ? Math.max(1, style.boxWidth - padding * 2) : null;
  const lines = wrapWidth
    ? baseLines.flatMap((line) => wrapTextLine(line, measureContext, wrapWidth))
    : baseLines;
  const textWidth = Math.max(...lines.map((line) => Math.ceil(measureContext.measureText(line || " ").width)), 1);
  const textHeight = Math.max(1, Math.ceil(lines.length * lineHeight));
  const canvasWidth = wrapWidth ? style.boxWidth : (textWidth + padding * 2);
  return {
    lines,
    padding,
    lineHeight,
    canvasWidth,
    canvasHeight: textHeight + padding * 2
  };
}

function renderTextLayerBitmap(layer) {
  if (!isTextLayer(layer)) {
    return;
  }

  const style = ensureTextStyle(layer.textStyle);
  const text = String(layer.textContent || "");
  const layout = getTextLayout(style, text);
  const nextCanvas = createCanvasElement(layout.canvasWidth, layout.canvasHeight);
  const nextContext = nextCanvas.getContext("2d");

  if (style.backgroundColor && style.backgroundColor !== "transparent") {
    nextContext.fillStyle = style.backgroundColor;
    nextContext.fillRect(0, 0, layout.canvasWidth, layout.canvasHeight);
  }

  nextContext.font = getCanvasTextFont(style);
  nextContext.textBaseline = "top";
  nextContext.textAlign = style.align;
  nextContext.lineJoin = "round";
  nextContext.miterLimit = 2;
  nextContext.fillStyle = rgbaStringFromParts(style.color, style.opacity);
  nextContext.globalAlpha = 1;
  const textX = style.align === "center"
    ? layout.canvasWidth / 2
    : (style.align === "right" ? layout.canvasWidth - layout.padding : layout.padding);

  layout.lines.forEach((line, index) => {
    if (style.strokeWidth > 0 && style.strokeColor !== "transparent") {
      nextContext.strokeStyle = style.strokeColor;
      nextContext.lineWidth = style.strokeWidth;
      nextContext.strokeText(line || " ", textX, layout.padding + index * layout.lineHeight);
    }
    nextContext.fillText(line || " ", textX, layout.padding + index * layout.lineHeight);
  });

  replaceLayerBitmap(layer, nextCanvas);
  layer.width = layout.canvasWidth;
  layer.height = layout.canvasHeight;
  layer.textStyle = style;
  layer.hasContent = text.trim().length > 0;
}

function positionTextEditor(layer) {
  if (!state.doc || !layer || !isTextLayer(layer)) {
    return;
  }

  const topLeft = docToCanvasPoint(layer.x, layer.y);
  const style = ensureTextStyle(layer.textStyle);
  const liveText = state.textEditorLayerId === layer.id ? ui.textEditor.value : layer.textContent;
  const layout = getTextLayout(style, liveText);
  ui.textEditor.style.left = `${topLeft.x}px`;
  ui.textEditor.style.top = `${topLeft.y}px`;
  ui.textEditor.style.width = `${Math.max(1, layout.canvasWidth * state.zoom)}px`;
  ui.textEditor.style.height = `${Math.max(1, layout.canvasHeight * state.zoom)}px`;
  ui.textEditor.style.padding = `${Math.max(0, layout.padding * state.zoom)}px`;
  ui.textEditor.style.fontFamily = style.fontFamily;
  ui.textEditor.style.fontWeight = style.fontWeight;
  ui.textEditor.style.fontSize = `${Math.max(12, style.fontSize * state.zoom)}px`;
  ui.textEditor.style.lineHeight = `${Math.max(14, layout.lineHeight * state.zoom)}px`;
  ui.textEditor.style.color = rgbaStringFromParts(style.color, style.opacity);
  ui.textEditor.style.background = style.backgroundColor || "transparent";
  ui.textEditor.style.textAlign = style.align;
  ui.textEditor.style.webkitTextStrokeColor = style.strokeColor;
  ui.textEditor.style.webkitTextStrokeWidth = `${Math.max(0, style.strokeWidth * state.zoom)}px`;
}

function autosizeTextEditor() {
  if (ui.textEditor.hidden || !state.textEditorLayerId || !state.doc) {
    return;
  }

  const layer = state.doc.layers.find((entry) => entry.id === state.textEditorLayerId) ?? null;
  if (!layer) {
    return;
  }

  positionTextEditor(layer);
}

function openInlineTextEditor(layer, options = {}) {
  if (!layer || !isTextLayer(layer)) {
    return;
  }

  if (state.textEditorLayerId && state.textEditorLayerId !== layer.id) {
    closeInlineTextEditor();
  }

  selectSingleLayer(layer.id);
  state.textEditorLayerId = layer.id;
  state.textEditorIsNewLayer = options.isNewLayer === true;
  state.textEditorOriginalText = layer.textContent;
  ui.textEditor.hidden = false;
  ui.textEditor.value = layer.textContent;
  positionTextEditor(layer);
  autosizeTextEditor();
  requestAnimationFrame(() => {
    ui.textEditor.focus();
    if (options.isNewLayer) {
      ui.textEditor.select();
      return;
    }

    const end = ui.textEditor.value.length;
    ui.textEditor.setSelectionRange(end, end);
  });
}

function closeInlineTextEditor(options = {}) {
  const layerId = state.textEditorLayerId;
  const isNewLayer = state.textEditorIsNewLayer;
  const originalText = state.textEditorOriginalText;
  state.textEditorLayerId = null;
  state.textEditorIsNewLayer = false;
  state.textEditorOriginalText = "";

  if (!layerId) {
    ui.textEditor.hidden = true;
    return;
  }

  const layer = state.doc?.layers.find((entry) => entry.id === layerId) ?? null;
  if (!layer || !isTextLayer(layer)) {
    ui.textEditor.hidden = true;
    refresh({ rebuildLayers: true });
    return;
  }

  if (options.commit !== false) {
    layer.textContent = ui.textEditor.value;
    renderTextLayerBitmap(layer);
    constrainLayerToCanvas(layer);
    const changed = layer.textContent !== originalText;

    if (!layer.textContent.trim()) {
      const index = state.doc.layers.findIndex((entry) => entry.id === layer.id);
      if (index !== -1) {
        state.doc.layers.splice(index, 1);
        pruneDocumentLayerGroups(state.doc);
        state.collapsedLayerGroups = pruneCollapsedLayerGroupState(state.doc, state.collapsedLayerGroups);
        if (state.activeLayerId === layer.id) {
          selectSingleLayer(state.doc.layers.at(-1)?.id ?? null);
        }
      }
    }

    if (changed || isNewLayer) {
      pushHistory();
    }
  } else if (isNewLayer) {
    const index = state.doc.layers.findIndex((entry) => entry.id === layer.id);
    if (index !== -1) {
      state.doc.layers.splice(index, 1);
      pruneDocumentLayerGroups(state.doc);
      state.collapsedLayerGroups = pruneCollapsedLayerGroupState(state.doc, state.collapsedLayerGroups);
      if (state.activeLayerId === layer.id) {
        selectSingleLayer(state.doc.layers.at(-1)?.id ?? null);
      }
    }
  } else {
    layer.textContent = originalText;
    renderTextLayerBitmap(layer);
  }

  ui.textEditor.hidden = true;
  refresh({ rebuildLayers: true });
}

function getTextStyleForUi() {
  const activeLayer = getActiveLayer();
  return isTextLayer(activeLayer) ? ensureTextStyle(activeLayer.textStyle) : getTextStyleDefaults();
}

function updateTextDefaults(changes = {}) {
  if (typeof changes.fontFamily === "string") {
    state.textFontFamily = changes.fontFamily;
  }
  if (typeof changes.fontWeight === "string" && ["300", "400", "500", "600", "700", "800"].includes(changes.fontWeight)) {
    state.textFontWeight = changes.fontWeight;
  }
  if (Number.isFinite(changes.fontSize)) {
    state.textFontSize = Math.round(clamp(Number(changes.fontSize), 8, 320));
  }
  if (Number.isFinite(changes.lineHeight)) {
    state.textLineHeight = clamp(Number(changes.lineHeight), 0.8, 3);
  }
  if (typeof changes.color === "string") {
    state.textColor = changes.color;
  }
  if (Number.isFinite(changes.opacity)) {
    state.textOpacity = clamp(Number(changes.opacity), 0, 1);
  }
  if (typeof changes.strokeColor === "string") {
    state.textStrokeColor = changes.strokeColor;
  }
  if (Number.isFinite(changes.strokeWidth)) {
    state.textStrokeWidth = clamp(Number(changes.strokeWidth), 0, 24);
  }
  if (typeof changes.backgroundColor === "string") {
    state.textBackgroundColor = changes.backgroundColor;
  }
  if (typeof changes.align === "string" && ["left", "center", "right"].includes(changes.align)) {
    state.textAlign = changes.align;
  }
}

function applyTextStyleToActiveLayer(changes = {}, options = {}) {
  const activeLayer = getActiveLayer();
  if (!isTextLayer(activeLayer)) {
    return false;
  }

  if (state.textEditorLayerId === activeLayer.id) {
    activeLayer.textContent = ui.textEditor.value;
  }

  activeLayer.textStyle = ensureTextStyle({
    ...activeLayer.textStyle,
    ...changes
  });
  renderTextLayerBitmap(activeLayer);
  constrainLayerToCanvas(activeLayer);
  if (state.textEditorLayerId === activeLayer.id) {
    positionTextEditor(activeLayer);
  }

  const shouldPushHistory = options.pushHistory !== false
    && !(state.textEditorIsNewLayer && state.textEditorLayerId === activeLayer.id);

  if (shouldPushHistory) {
    pushHistory();
  }

  refresh({ rebuildLayers: true });
  return true;
}

function isPointInsideDocument(point) {
  return point.x >= 0 && point.x <= state.doc.width && point.y >= 0 && point.y <= state.doc.height;
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(stage.clientWidth * ratio));
  const height = Math.max(1, Math.floor(stage.clientHeight * ratio));

  if (canvas.width === width && canvas.height === height) {
    return false;
  }

  canvas.width = width;
  canvas.height = height;
  return true;
}

function needsCompositePreview(layers = []) {
  return layers.some((layer) => isAdjustmentLayer(layer) || normalizeBlendMode(layer.blendMode) !== "normal");
}

function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!state.doc) {
    stage.style.cursor = "default";
    return;
  }

  ctx.save();
  ctx.fillStyle = "#0f1318";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  const docBounds = getDocBounds();

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
  ctx.shadowBlur = Math.max(12, 24 * (window.devicePixelRatio || 1));
  ctx.shadowOffsetY = Math.max(4, 10 * (window.devicePixelRatio || 1));
  ctx.fillStyle = "#11161c";
  ctx.fillRect(docBounds.x, docBounds.y, docBounds.width, docBounds.height);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = transparencyPattern;
  ctx.fillRect(docBounds.x, docBounds.y, docBounds.width, docBounds.height);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(docBounds.x, docBounds.y, docBounds.width, docBounds.height);
  ctx.clip();

  const renderableLayers = state.doc.layers.filter((layer) => isLayerEffectivelyVisible(layer) && state.textEditorLayerId !== layer.id);
  if (needsCompositePreview(renderableLayers)) {
    const compositeCanvas = composeCompositeCanvas(null, state.doc.width, state.doc.height, {
      rect: {
        x: 0,
        y: 0,
        width: state.doc.width,
        height: state.doc.height
      },
      layers: renderableLayers
    });
    ctx.drawImage(compositeCanvas, docBounds.x, docBounds.y, docBounds.width, docBounds.height);
  } else {
    for (const layer of renderableLayers) {
      drawRenderableLayerToContext(ctx, layer, {
        canvasOffsetX: docBounds.x,
        canvasOffsetY: docBounds.y,
        scale: state.zoom
      });
    }
  }

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = Math.max(1, window.devicePixelRatio || 1);
  ctx.strokeRect(docBounds.x, docBounds.y, docBounds.width, docBounds.height);
  ctx.restore();

  renderArtboardOverlays();
  renderGuides();

  const activeLayer = getActiveLayer();
  if (
    activeLayer
    && activeLayer.visible
    && !isBackgroundLayer(activeLayer)
    && !isAdjustmentLayer(activeLayer)
    && (
      state.pointer.mode === "move-layer"
      || state.pointer.mode === "resize-layer"
      || (state.transientTool || state.tool) === "transform"
    )
  ) {
    const handles = getLayerHandleDescriptors(activeLayer);
    const corners = getLayerCornerPoints(activeLayer).map((point) => docToCanvasPoint(point.x, point.y));
    const rotateHandle = handles.find((handle) => handle.type === "rotate");
    const topCenter = {
      x: (corners[0].x + corners[1].x) / 2,
      y: (corners[0].y + corners[1].y) / 2
    };

    ctx.save();
    ctx.strokeStyle = "rgba(59, 157, 255, 0.96)";
    ctx.lineWidth = Math.max(2, 2 * (window.devicePixelRatio || 1));
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (const corner of corners.slice(1)) {
      ctx.lineTo(corner.x, corner.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#3b9dff";
    for (const handle of handles.filter((entry) => entry.type === "resize")) {
      ctx.fillRect(handle.left, handle.top, handle.size, handle.size);
      ctx.strokeStyle = "#0f1318";
      ctx.lineWidth = Math.max(1, window.devicePixelRatio || 1);
      ctx.strokeRect(handle.left, handle.top, handle.size, handle.size);
    }
    if (rotateHandle) {
      ctx.strokeStyle = "rgba(59, 157, 255, 0.96)";
      ctx.lineWidth = Math.max(1.5, window.devicePixelRatio || 1);
      ctx.beginPath();
      ctx.moveTo(topCenter.x, topCenter.y);
      ctx.lineTo(rotateHandle.x, rotateHandle.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "#ff7f41";
      ctx.arc(rotateHandle.x, rotateHandle.y, rotateHandle.size / 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0f1318";
      ctx.stroke();
    }
    ctx.restore();
  }

  if (
    activeLayer
    && activeLayer.visible
    && !isBackgroundLayer(activeLayer)
    && isVectorLayer(activeLayer)
    && (
      state.pointer.mode === "edit-vector"
      || (state.transientTool || state.tool) === "direct"
    )
  ) {
    renderVectorPathOverlay(activeLayer);
  }

  const selectionRect = getSelectionRect();
  if (selectionRect && hasPixelSelectionMask()) {
    const selectionOverlay = createCanvasElement(state.selectionMaskCanvas.width, state.selectionMaskCanvas.height);
    const selectionOverlayContext = selectionOverlay.getContext("2d");
    selectionOverlayContext.fillStyle = "rgba(33, 184, 157, 0.22)";
    selectionOverlayContext.fillRect(0, 0, selectionOverlay.width, selectionOverlay.height);
    selectionOverlayContext.globalCompositeOperation = "destination-in";
    selectionOverlayContext.drawImage(state.selectionMaskCanvas, 0, 0);
    selectionOverlayContext.globalCompositeOperation = "source-over";

    ctx.save();
    ctx.drawImage(selectionOverlay, docBounds.x, docBounds.y, docBounds.width, docBounds.height);
    ctx.strokeStyle = "#21b89d";
    ctx.lineWidth = Math.max(2, (window.devicePixelRatio || 1) * 1.5);
    ctx.setLineDash([12, 8]);
    const selectionStart = docToCanvasPoint(selectionRect.x, selectionRect.y);
    ctx.strokeRect(selectionStart.x, selectionStart.y, selectionRect.width * state.zoom, selectionRect.height * state.zoom);
    ctx.restore();
  } else if (selectionRect) {
    const start = docToCanvasPoint(selectionRect.x, selectionRect.y);

    ctx.save();
    ctx.strokeStyle = "#21b89d";
    ctx.lineWidth = Math.max(2, (window.devicePixelRatio || 1) * 1.5);
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(start.x, start.y, selectionRect.width * state.zoom, selectionRect.height * state.zoom);
    ctx.fillStyle = "rgba(33, 184, 157, 0.08)";
    ctx.fillRect(start.x, start.y, selectionRect.width * state.zoom, selectionRect.height * state.zoom);
    ctx.restore();
  }

  if (state.lassoDraft?.points?.length > 1) {
    renderLassoDraftOverlay(state.lassoDraft);
  }

  const cropRect = getCropRect();
  if (state.tool === "crop" && cropRect) {
    const start = docToCanvasPoint(cropRect.x, cropRect.y);

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.48)";
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.rect(start.x, start.y, cropRect.width * state.zoom, cropRect.height * state.zoom);
    ctx.fill("evenodd");
    ctx.strokeStyle = "#ff7f41";
    ctx.lineWidth = Math.max(2, (window.devicePixelRatio || 1) * 1.5);
    ctx.setLineDash([12, 8]);
    ctx.strokeRect(start.x, start.y, cropRect.width * state.zoom, cropRect.height * state.zoom);
    ctx.fillStyle = "rgba(255, 127, 65, 0.08)";
    ctx.fillRect(start.x, start.y, cropRect.width * state.zoom, cropRect.height * state.zoom);
    ctx.restore();

    renderCropHandles(cropRect);
  }

  if (state.shapeDraft) {
    renderShapeDraftOverlay(ctx, state.shapeDraft);
  }

  if (state.gradientDraft) {
    renderGradientDraftOverlay(ctx, state.gradientDraft);
  }

  if (state.rulerDraft) {
    renderRulerDraftOverlay(ctx, state.rulerDraft);
  }

  if (state.penDraft) {
    renderPenDraftOverlay(ctx, state.penDraft);
  }

  renderRulerOverlay();

  stage.style.cursor = getCursor();
}

function renderArtboardOverlays() {
  if (!state.artboards.length) {
    return;
  }

  ctx.save();
  ctx.font = `${Math.max(11, Math.round(11 * (window.devicePixelRatio || 1)))}px Inter, "Segoe UI", sans-serif`;
  ctx.textBaseline = "middle";

  for (const artboard of state.artboards) {
    const start = docToCanvasPoint(artboard.x, artboard.y);
    const width = artboard.width * state.zoom;
    const height = artboard.height * state.zoom;
    const isActive = artboard.id === state.activeArtboardId;

    ctx.strokeStyle = isActive ? "#ffd166" : "rgba(255, 209, 102, 0.76)";
    ctx.lineWidth = Math.max(2, (window.devicePixelRatio || 1) * 1.3);
    ctx.setLineDash(isActive ? [14, 8] : [8, 8]);
    ctx.strokeRect(start.x, start.y, width, height);
    ctx.setLineDash([]);

    const label = `${artboard.name} · ${Math.round(artboard.width)} x ${Math.round(artboard.height)}`;
    const labelWidth = ctx.measureText(label).width + 16;
    const labelHeight = Math.max(18, 18 * (window.devicePixelRatio || 1));
    const labelTop = Math.max(6, start.y - labelHeight - 6);

    ctx.fillStyle = isActive ? "#ffd166" : "rgba(255, 209, 102, 0.92)";
    ctx.fillRect(start.x, labelTop, labelWidth, labelHeight);
    ctx.fillStyle = "#0f1318";
    ctx.fillText(label, start.x + 8, labelTop + labelHeight / 2);
  }

  ctx.restore();
}

function drawLayerToContext(targetContext, layer, options = {}) {
  const scaleX = options.scaleX ?? options.scale ?? 1;
  const scaleY = options.scaleY ?? options.scale ?? 1;
  const canvasOffsetX = options.canvasOffsetX ?? 0;
  const canvasOffsetY = options.canvasOffsetY ?? 0;
  const docOffsetX = options.docOffsetX ?? 0;
  const docOffsetY = options.docOffsetY ?? 0;
  const opacity = options.opacity ?? layer.opacity;
  const blendMode = options.blendMode ?? layer.blendMode;
  const center = getLayerCenter(layer);
  const sourceCanvas = getLayerDrawableCanvas(layer, {
    sourceCanvas: options.sourceCanvas,
    applyMask: options.applyMask
  });

  targetContext.save();
  targetContext.globalAlpha = opacity;
  targetContext.globalCompositeOperation = getCanvasBlendMode(blendMode);
  targetContext.translate(
    canvasOffsetX + (center.x - docOffsetX) * scaleX,
    canvasOffsetY + (center.y - docOffsetY) * scaleY
  );
  targetContext.rotate(getLayerRotationRadians(layer));
  if (layer.layerEffects?.dropShadow && options.applyEffects !== false) {
    const effectScale = Math.max(Math.abs(scaleX), Math.abs(scaleY), 1);
    targetContext.shadowColor = "rgba(0, 0, 0, 0.45)";
    targetContext.shadowBlur = 12 * effectScale;
    targetContext.shadowOffsetX = 4 * effectScale;
    targetContext.shadowOffsetY = 6 * effectScale;
  }
  targetContext.drawImage(
    sourceCanvas,
    -layer.width * scaleX / 2,
    -layer.height * scaleY / 2,
    layer.width * scaleX,
    layer.height * scaleY
  );
  targetContext.restore();
}

function drawRenderableLayerToContext(targetContext, layer, options = {}) {
  if (isAdjustmentLayer(layer)) {
    return;
  }

  if (!isLayerClippedToBelow(layer)) {
    drawLayerToContext(targetContext, layer, options);
    return;
  }

  const clipBase = getLayerClippingBase(layer);
  if (!clipBase || !isLayerEffectivelyVisible(clipBase)) {
    return;
  }

  const layerCanvas = createCanvasElement(targetContext.canvas.width, targetContext.canvas.height);
  const layerContext = layerCanvas.getContext("2d");
  drawLayerToContext(layerContext, layer, {
    ...options,
    opacity: 1,
    blendMode: "normal"
  });

  const clipCanvas = createCanvasElement(targetContext.canvas.width, targetContext.canvas.height);
  const clipContext = clipCanvas.getContext("2d");
  drawLayerToContext(clipContext, clipBase, {
    ...options,
    opacity: 1,
    blendMode: "normal"
  });

  layerContext.globalCompositeOperation = "destination-in";
  layerContext.drawImage(clipCanvas, 0, 0);
  layerContext.globalCompositeOperation = "source-over";

  targetContext.save();
  targetContext.globalAlpha = options.opacity ?? layer.opacity;
  targetContext.globalCompositeOperation = getCanvasBlendMode(options.blendMode ?? layer.blendMode);
  targetContext.drawImage(layerCanvas, 0, 0);
  targetContext.restore();
}

function getCursor() {
  if (
    state.pointer.mode === "pan"
    || state.pointer.mode === "move-layer"
    || state.pointer.mode === "rotate-layer"
    || state.pointer.mode === "move-crop"
  ) {
    return "grabbing";
  }

  if (state.pointer.mode === "resize-layer" || state.pointer.mode === "resize-crop") {
    return getResizeCursor(state.pointer.resizeHandle);
  }

  if (state.pointer.mode === "edit-vector") {
    return "crosshair";
  }

  switch (state.transientTool || state.tool) {
    case "move":
      return "grab";
    case "transform": {
      const target = getCurrentTransformTarget();
      return target?.cursor ?? "grab";
    }
    case "direct":
      return getCurrentVectorHandleTarget()?.role ? "crosshair" : "move";
    case "crop": {
      const target = getCurrentCropTarget();
      return target?.cursor ?? "crosshair";
    }
    case "zoom":
      return "zoom-in";
    case "text":
      return "text";
    case "pen":
    case "shape":
    case "line":
    case "eyedropper":
    case "bucket":
    case "gradient":
    case "color-range":
    case "magic-wand":
    case "lasso":
    case "brush":
    case "pencil":
    case "eraser":
    case "magic-eraser":
    case "select":
    case "ruler":
      return "crosshair";
    case "artboard":
      return "crosshair";
    default:
      return "default";
  }
}

function renderLassoDraftOverlay(lassoDraft) {
  const points = lassoDraft?.points ?? [];
  if (points.length < 2) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = "#21b89d";
  ctx.lineWidth = Math.max(2, (window.devicePixelRatio || 1) * 1.5);
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  const firstPoint = docToCanvasPoint(points[0].x, points[0].y);
  ctx.moveTo(firstPoint.x, firstPoint.y);
  for (const point of points.slice(1)) {
    const canvasPoint = docToCanvasPoint(point.x, point.y);
    ctx.lineTo(canvasPoint.x, canvasPoint.y);
  }
  if (points.length > 2) {
    ctx.closePath();
    ctx.fillStyle = "rgba(33, 184, 157, 0.08)";
    ctx.fill();
  }
  ctx.stroke();
  ctx.restore();
}

function renderLayerThumbnail(layer, thumbCanvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(48 * ratio));
  const height = Math.max(1, Math.round(36 * ratio));
  thumbCanvas.width = width;
  thumbCanvas.height = height;

  const cacheKey = [
    state.thumbnailCacheVersion,
    width,
    height,
    state.doc?.width ?? 0,
    state.doc?.height ?? 0,
    layer.id,
    layer.clippedToBelow ? 1 : 0,
    layer.layerKind,
    layer.adjustmentType || "",
    layer.canvas.width,
    layer.canvas.height,
    round(layer.x, 2),
    round(layer.y, 2),
    round(layer.width, 2),
    round(layer.height, 2),
    round(layer.rotation, 2),
    round(layer.opacity, 3)
  ].join("|");

  if (!layer.thumbnailCache || layer.thumbnailCache.key !== cacheKey) {
    const cacheCanvas = document.createElement("canvas");
    cacheCanvas.width = width;
    cacheCanvas.height = height;
    const cacheContext = cacheCanvas.getContext("2d");
    cacheContext.clearRect(0, 0, width, height);
    cacheContext.fillStyle = "#1f2328";
    cacheContext.fillRect(0, 0, width, height);
    cacheContext.fillStyle = "#171b1f";
    cacheContext.fillRect(0, 0, width / 2, height / 2);
    cacheContext.fillRect(width / 2, height / 2, width / 2, height / 2);

    if (isAdjustmentLayer(layer)) {
      cacheContext.fillStyle = "rgba(72, 170, 255, 0.12)";
      cacheContext.fillRect(4 * ratio, 4 * ratio, width - 8 * ratio, height - 8 * ratio);
      cacheContext.strokeStyle = "rgba(72, 170, 255, 0.5)";
      cacheContext.lineWidth = Math.max(1, ratio);
      cacheContext.strokeRect(4.5 * ratio, 4.5 * ratio, width - 9 * ratio, height - 9 * ratio);
      cacheContext.fillStyle = "#9ad8ff";
      cacheContext.font = `${Math.max(8, Math.round(8 * ratio))}px Inter, "Segoe UI", sans-serif`;
      cacheContext.textAlign = "center";
      cacheContext.textBaseline = "middle";
      cacheContext.fillText(getAdjustmentLayerShortLabel(layer.adjustmentType), width / 2, height / 2);
    } else if (state.doc) {
      const scale = Math.min(width / state.doc.width, height / state.doc.height);
      const offsetX = (width - state.doc.width * scale) / 2;
      const offsetY = (height - state.doc.height * scale) / 2;

      cacheContext.save();
      drawRenderableLayerToContext(cacheContext, layer, {
        canvasOffsetX: offsetX,
        canvasOffsetY: offsetY,
        scale,
        blendMode: "normal"
      });
      cacheContext.restore();
    }

    layer.thumbnailCache = {
      key: cacheKey,
      canvas: cacheCanvas
    };
  }

  const thumbContext = thumbCanvas.getContext("2d");
  thumbContext.clearRect(0, 0, width, height);
  thumbContext.drawImage(layer.thumbnailCache.canvas, 0, 0, width, height);
}

function getVisibilityIconMarkup(isVisible) {
  return isVisible
    ? `<i data-lucide="eye" class="icon icon-sm"></i>`
    : `<i data-lucide="eye-off" class="icon icon-sm"></i>`;
}

function getLayerGroupDisclosureIconMarkup(isCollapsed) {
  return isCollapsed
    ? `<i data-lucide="chevron-right" class="icon icon-sm"></i>`
    : `<i data-lucide="chevron-down" class="icon icon-sm"></i>`;
}

function getLayerLockIconMarkup(layer) {
  if (
    isLayerFullyLocked(layer)
    || layer?.lockTransparentPixels
    || layer?.lockImagePixels
    || layer?.lockPosition
    || layer?.lockGeneratedPixels
  ) {
    return `<i data-lucide="lock" class="icon icon-sm"></i>`;
  }

  if (layer?.linked) {
    return `<i data-lucide="link" class="icon icon-sm"></i>`;
  }

  return "";
}

function getLayerMaskButtonLabel(layer) {
  if (hasLayerMask(layer)) {
    return isEditingLayerMask(layer) ? "Editing Mask" : "Mask";
  }

  return "Add Mask";
}

function getLayerClipButtonLabel(layer) {
  return isLayerClippedToBelow(layer) ? "Clipped" : "Clip";
}

function getLayerDragHandleMarkup() {
  return `<i data-lucide="grip-vertical" class="icon icon-sm"></i>`;
}

function createLayerDragHandle(options = {}) {
  if (options.draggable === false) {
    const placeholder = document.createElement("div");
    placeholder.className = "layer-row-drag-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    return placeholder;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "layer-row-drag-handle";
  button.dataset.layerDragHandle = "true";
  if (options.layerId) {
    button.dataset.layerId = options.layerId;
  }
  if (options.groupId) {
    button.dataset.groupId = options.groupId;
  }
  button.draggable = true;
  button.title = "Drag to reorder";
  button.setAttribute("aria-label", options.ariaLabel || "Drag to reorder");
  button.innerHTML = getLayerDragHandleMarkup();
  return button;
}

function createLayerGroupRow(group, layers) {
  const row = document.createElement("div");
  row.className = "layer-row layer-row--group";
  row.dataset.groupId = group.id;
  row.dataset.blockKey = `group:${group.id}`;
  if (!group.visible) {
    row.classList.add("is-effectively-hidden");
  }
  if (isGroupFullySelected(group.id)) {
    row.classList.add("is-selected");
  } else if (isGroupPartiallySelected(group.id)) {
    row.classList.add("is-selected-partial");
  }

  const isCollapsed = isLayerGroupCollapsed(group.id);
  const containsActiveLayer = layers.some((layer) => layer.id === state.activeLayerId);

  const collapseButton = document.createElement("button");
  collapseButton.type = "button";
  collapseButton.className = "layer-row-collapse";
  collapseButton.dataset.groupAction = "collapse";
  collapseButton.dataset.groupId = group.id;
  collapseButton.setAttribute("aria-label", isCollapsed ? `Expand ${group.name}` : `Collapse ${group.name}`);
  collapseButton.setAttribute("aria-expanded", String(!isCollapsed));
  collapseButton.title = isCollapsed ? "Expand Group" : "Collapse Group";
  collapseButton.innerHTML = getLayerGroupDisclosureIconMarkup(isCollapsed);

  const visibilityButton = document.createElement("button");
  visibilityButton.type = "button";
  visibilityButton.className = "layer-row-visibility";
  if (!group.visible) {
    visibilityButton.classList.add("is-hidden");
  }
  visibilityButton.dataset.groupAction = "visibility";
  visibilityButton.dataset.groupId = group.id;
  visibilityButton.setAttribute("aria-label", group.visible ? `Hide ${group.name}` : `Show ${group.name}`);
  visibilityButton.title = group.visible ? "Hide Group" : "Show Group";
  visibilityButton.innerHTML = getVisibilityIconMarkup(group.visible);

  const selectButton = document.createElement("button");
  selectButton.type = "button";
  selectButton.className = "layer-row-thumb layer-row-thumb--group";
  selectButton.dataset.groupAction = "select";
  selectButton.dataset.groupId = group.id;
  selectButton.setAttribute("aria-label", `Select ${group.name}`);
  selectButton.innerHTML = `<i data-lucide="folder" class="icon icon-sm"></i>`;

  const body = document.createElement("div");
  body.className = "layer-row-body layer-row-body--group";
  if (containsActiveLayer) {
    body.classList.add("is-active");
  }

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "layer-row-name";
  nameInput.value = group.name;
  nameInput.dataset.groupAction = "rename";
  nameInput.dataset.groupId = group.id;
  nameInput.setAttribute("aria-label", `${group.name} group name`);

  const meta = document.createElement("div");
  meta.className = "layer-row-meta";
  meta.textContent = `${layers.length} ${layers.length === 1 ? "layer" : "layers"}${group.visible ? "" : ", hidden"}`;

  const lockIndicator = document.createElement("span");
  lockIndicator.className = "layer-row-lock";
  lockIndicator.setAttribute("aria-hidden", "true");

  body.append(nameInput, meta);
  row.append(collapseButton, visibilityButton, selectButton, body, lockIndicator);
  return row;
}

function createLayerRow(layer, options = {}) {
  const row = document.createElement("div");
  row.className = "layer-row";
  row.dataset.layerId = layer.id;
  row.dataset.blockKey = layer.groupId ? `group:${layer.groupId}` : `layer:${layer.id}`;
  if (options.nested) {
    row.classList.add("layer-row--nested");
  }
  if (!isLayerEffectivelyVisible(layer)) {
    row.classList.add("is-effectively-hidden");
  }
  if (isLayerSelected(layer.id)) {
    row.classList.add("is-selected");
  }
  if (isLayerClippedToBelow(layer)) {
    row.classList.add("is-clipped");
  }
  if (isEditingLayerMask(layer)) {
    row.classList.add("is-editing-mask");
  }

  const visibilityButton = document.createElement("button");
  visibilityButton.type = "button";
  visibilityButton.className = "layer-row-visibility";
  if (!layer.visible) {
    visibilityButton.classList.add("is-hidden");
  }
  visibilityButton.dataset.layerAction = "visibility";
  visibilityButton.dataset.layerId = layer.id;
  visibilityButton.setAttribute("aria-label", layer.visible ? `Hide ${layer.name}` : `Show ${layer.name}`);
  visibilityButton.title = layer.visible ? "Hide Layer" : "Show Layer";
  visibilityButton.innerHTML = getVisibilityIconMarkup(layer.visible);

  const thumbButton = document.createElement("button");
  thumbButton.type = "button";
  thumbButton.className = "layer-row-thumb";
  thumbButton.dataset.layerAction = "select";
  thumbButton.dataset.layerId = layer.id;
  thumbButton.setAttribute("aria-label", `Select ${layer.name}`);

  const thumbCanvas = document.createElement("canvas");
  renderLayerThumbnail(layer, thumbCanvas);
  thumbButton.append(thumbCanvas);

  const body = document.createElement("div");
  body.className = "layer-row-body";
  if (layer.id === state.activeLayerId) {
    body.classList.add("is-active");
  }

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "layer-row-name";
  nameInput.value = layer.name;
  nameInput.dataset.layerAction = "rename";
  nameInput.dataset.layerId = layer.id;
  nameInput.setAttribute("aria-label", `${layer.name} layer name`);

  const lockIndicator = document.createElement("span");
  lockIndicator.className = "layer-row-lock";
  lockIndicator.setAttribute("aria-hidden", "true");
  lockIndicator.innerHTML = getLayerLockIconMarkup(layer);

  body.append(nameInput);
  row.append(visibilityButton, thumbButton, body, lockIndicator);
  return row;
}

function doesLayerMatchPanelSearch(layer) {
  const query = state.layerSearchQuery.trim().toLowerCase();
  return !query || String(layer?.name || "").toLowerCase().includes(query);
}

function isEllipseVectorLayer(layer) {
  return isVectorLayer(layer) && /<(ellipse|circle)\b/i.test(String(layer.vectorSource || ""));
}

function doesLayerMatchPanelFilter(layer) {
  switch (state.layerPanelFilter) {
    case "visible":
      return isLayerEffectivelyVisible(layer);
    case "text":
      return isTextLayer(layer);
    case "vector":
      return isVectorLayer(layer);
    case "ellipse":
      return isEllipseVectorLayer(layer);
    case "adjustment":
      return isAdjustmentLayer(layer);
    default:
      return true;
  }
}

function getFilteredLayerPanelBlocks() {
  return getLayerPanelBlocks()
    .map((block) => {
      if (block.kind === "group") {
        const group = getLayerGroup(block.groupId);
        const query = state.layerSearchQuery.trim().toLowerCase();
        const groupMatches = Boolean(query) && String(group?.name || "").toLowerCase().includes(query);
        const layers = block.layers.filter((layer) => (
          (groupMatches || doesLayerMatchPanelSearch(layer))
          && doesLayerMatchPanelFilter(layer)
        ));
        return layers.length || groupMatches ? { ...block, layers } : null;
      }

      const layer = block.layers[0];
      return doesLayerMatchPanelSearch(layer) && doesLayerMatchPanelFilter(layer) ? block : null;
    })
    .filter(Boolean);
}

function renderLayers() {
  layerList.textContent = "";

  if (!state.doc) {
    return;
  }

  syncLayerSelection();

  for (const block of getFilteredLayerPanelBlocks()) {
    if (block.kind === "group") {
      const group = getLayerGroup(block.groupId);
      if (!group) {
        continue;
      }
      const groupRow = createLayerGroupRow(group, block.layers);
      layerList.append(groupRow);

      if (isLayerGroupCollapsed(group.id)) {
        continue;
      }

      for (const groupLayer of block.layers) {
        layerList.append(createLayerRow(groupLayer, { nested: true }));
      }
      continue;
    }

    layerList.append(createLayerRow(block.layers[0]));
  }

  syncLayerPanelDropIndicators();

  if (typeof window.renderIcons === "function") {
    window.renderIcons(layerList);
  }
}

function normalizeHistoryLabel(label) {
  const normalized = String(label || "").trim();
  return normalized || "";
}

function getSnapshotLayer(snapshot, layerId) {
  return snapshot?.layers?.find((layer) => layer.id === layerId) ?? null;
}

function isSameSnapshotValue(first, second) {
  return JSON.stringify(first ?? null) === JSON.stringify(second ?? null);
}

function getHistoryLayerKindLabel(layer) {
  if (!layer) {
    return "Layer";
  }

  if (layer.isBackground) {
    return "Background";
  }

  if (layer.layerKind === "text") {
    return "Text Layer";
  }

  if (layer.layerKind === "vector") {
    return "Shape Layer";
  }

  if (layer.layerKind === "adjustment") {
    return getAdjustmentLayerLabel(layer.adjustmentType);
  }

  return "Layer";
}

function getHistoryLayerChangeLabel(layer, previousLayer) {
  if (!layer || !previousLayer) {
    return "";
  }

  if (layer.name !== previousLayer.name) {
    return "Rename Layer";
  }

  if (layer.visible !== previousLayer.visible) {
    return "Toggle Visibility";
  }

  if (
    layer.locked !== previousLayer.locked
    || layer.lockTransparentPixels !== previousLayer.lockTransparentPixels
    || layer.lockImagePixels !== previousLayer.lockImagePixels
    || layer.lockPosition !== previousLayer.lockPosition
    || layer.lockGeneratedPixels !== previousLayer.lockGeneratedPixels
    || layer.linked !== previousLayer.linked
  ) {
    return "Layer Lock";
  }

  if (layer.opacity !== previousLayer.opacity || layer.blendMode !== previousLayer.blendMode) {
    return "Layer Settings";
  }

  if (layer.layerKind !== previousLayer.layerKind) {
    return "Convert Layer";
  }

  if (
    layer.x !== previousLayer.x
    || layer.y !== previousLayer.y
    || layer.width !== previousLayer.width
    || layer.height !== previousLayer.height
    || layer.rotation !== previousLayer.rotation
  ) {
    return "Transform Layer";
  }

  if (layer.textContent !== previousLayer.textContent || !isSameSnapshotValue(layer.textStyle, previousLayer.textStyle)) {
    return "Edit Text";
  }

  if (
    layer.vectorSource !== previousLayer.vectorSource
    || layer.vectorIntrinsicWidth !== previousLayer.vectorIntrinsicWidth
    || layer.vectorIntrinsicHeight !== previousLayer.vectorIntrinsicHeight
    || !isSameSnapshotValue(layer.vectorStyle, previousLayer.vectorStyle)
  ) {
    return "Edit Shape";
  }

  if (
    layer.adjustmentType !== previousLayer.adjustmentType
    || !isSameSnapshotValue(layer.adjustmentSettings, previousLayer.adjustmentSettings)
  ) {
    return "Edit Adjustment";
  }

  if (layer.maskDataUrl !== previousLayer.maskDataUrl) {
    return "Edit Mask";
  }

  if (layer.dataUrl !== previousLayer.dataUrl || layer.hasContent !== previousLayer.hasContent) {
    return "Edit Pixels";
  }

  if (layer.groupId !== previousLayer.groupId || layer.clippedToBelow !== previousLayer.clippedToBelow) {
    return "Layer Settings";
  }

  return "";
}

function inferHistoryEntryLabel(snapshot, previousSnapshot = null) {
  if (!previousSnapshot) {
    return "Open Document";
  }

  if (
    snapshot.width !== previousSnapshot.width
    || snapshot.height !== previousSnapshot.height
    || snapshot.resolution !== previousSnapshot.resolution
    || snapshot.backgroundContents !== previousSnapshot.backgroundContents
  ) {
    return "Canvas Size";
  }

  if (!isSameSnapshotValue(snapshot.artboards, previousSnapshot.artboards)) {
    return "Edit Artboards";
  }

  if (!isSameSnapshotValue(snapshot.layerGroups, previousSnapshot.layerGroups)) {
    return "Edit Groups";
  }

  if (snapshot.layers.length > previousSnapshot.layers.length) {
    const previousLayerIds = new Set(previousSnapshot.layers.map((layer) => layer.id));
    const addedLayer = snapshot.layers.find((layer) => !previousLayerIds.has(layer.id));
    return `Add ${getHistoryLayerKindLabel(addedLayer)}`;
  }

  if (snapshot.layers.length < previousSnapshot.layers.length) {
    return "Delete Layer";
  }

  const currentLayerOrder = snapshot.layers.map((layer) => layer.id).join("|");
  const previousLayerOrder = previousSnapshot.layers.map((layer) => layer.id).join("|");
  if (currentLayerOrder !== previousLayerOrder) {
    return "Reorder Layers";
  }

  const changedLayers = [];
  for (const layer of snapshot.layers) {
    const previousLayer = getSnapshotLayer(previousSnapshot, layer.id);
    const label = getHistoryLayerChangeLabel(layer, previousLayer);
    if (label) {
      changedLayers.push(label);
    }
  }

  if (changedLayers.length === 1) {
    return changedLayers[0];
  }

  if (changedLayers.length > 1) {
    return "Edit Layers";
  }

  if (
    snapshot.activeLayerId !== previousSnapshot.activeLayerId
    || !isSameSnapshotValue(snapshot.selectedLayerIds, previousSnapshot.selectedLayerIds)
  ) {
    return "Select Layer";
  }

  return "Edit Document";
}

function getHistoryEntryLabel(entry, index) {
  return normalizeHistoryLabel(entry?.historyLabel)
    || inferHistoryEntryLabel(entry, state.history[index - 1] ?? null);
}

function getHistoryEntryIconName(label) {
  const lowerLabel = String(label || "").toLowerCase();

  if (lowerLabel.includes("new")) return "file-plus";
  if (lowerLabel.includes("open")) return "folder-open";
  if (lowerLabel.includes("delete")) return "trash";
  if (lowerLabel.includes("add")) return "plus";
  if (lowerLabel.includes("canvas") || lowerLabel.includes("crop")) return "crop";
  if (lowerLabel.includes("text")) return "type";
  if (lowerLabel.includes("shape") || lowerLabel.includes("vector")) return "square";
  if (lowerLabel.includes("adjustment")) return "sliders-horizontal";
  if (lowerLabel.includes("mask")) return "rectangle-circle";
  if (lowerLabel.includes("transform") || lowerLabel.includes("move")) return "move";
  if (lowerLabel.includes("visibility")) return "eye";
  if (lowerLabel.includes("lock")) return "lock";
  if (lowerLabel.includes("pixel") || lowerLabel.includes("paint")) return "brush";
  if (lowerLabel.includes("group")) return "folder";
  if (lowerLabel.includes("reorder")) return "layers";
  return "history";
}

function getHistoryPanelSignature() {
  return JSON.stringify({
    documentId: state.activeDocumentId,
    historyIndex: state.historyIndex,
    entries: state.history.map((entry, index) => ({
      revision: entry?.revision ?? index,
      label: getHistoryEntryLabel(entry, index)
    }))
  });
}

function renderHistoryPanel(force = false) {
  if (!ui.historyList) {
    return;
  }

  const signature = getHistoryPanelSignature();
  if (!force && signature === state.historyPanelSignature) {
    return;
  }

  state.historyPanelSignature = signature;
  ui.historyList.textContent = "";

  const currentStep = state.doc && state.historyIndex >= 0 ? state.historyIndex + 1 : 0;
  if (ui.historyCount) {
    ui.historyCount.textContent = state.doc && state.history.length
      ? `${currentStep}/${state.history.length}`
      : "0";
  }

  if (!state.doc || !state.history.length) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = state.doc ? "No history yet" : "No document";
    ui.historyList.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  state.history.forEach((entry, index) => {
    const label = getHistoryEntryLabel(entry, index);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "history-row";
    row.dataset.historyIndex = String(index);
    row.setAttribute("aria-label", `${label}, state ${index + 1} of ${state.history.length}`);
    if (index === state.historyIndex) {
      row.classList.add("is-active");
      row.setAttribute("aria-current", "step");
    } else if (index > state.historyIndex) {
      row.classList.add("is-future");
    }

    const icon = document.createElement("span");
    icon.className = "history-row-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = `<i data-lucide="${getHistoryEntryIconName(label)}" class="icon icon-sm"></i>`;

    const labelElement = document.createElement("span");
    labelElement.className = "history-row-label";
    labelElement.textContent = label;

    const step = document.createElement("span");
    step.className = "history-row-step";
    step.textContent = String(index + 1);

    row.append(icon, labelElement, step);
    fragment.append(row);
  });

  ui.historyList.append(fragment);
  ui.historyList.querySelector(".history-row.is-active")?.scrollIntoView({ block: "nearest" });

  if (typeof window.renderIcons === "function") {
    window.renderIcons(ui.historyList);
  }
}

function getLayerPanelDropTarget(clientY) {
  const rows = [...layerList.querySelectorAll(".layer-row")];
  if (!rows.length) {
    return null;
  }

  for (const row of rows) {
    const blockKey = row.dataset.blockKey;
    if (!blockKey) {
      continue;
    }

    const rect = row.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (clientY <= midpoint) {
      return { targetKey: blockKey, position: "before" };
    }
    if (clientY <= rect.bottom) {
      return { targetKey: blockKey, position: "after" };
    }
  }

  const lastRow = rows.at(-1);
  if (!lastRow?.dataset.blockKey) {
    return null;
  }

  return {
    targetKey: lastRow.dataset.blockKey,
    position: "after"
  };
}

function syncLayerPanelDropIndicators() {
  const rows = [...layerList.querySelectorAll(".layer-row")];
  for (const row of rows) {
    row.classList.remove("layer-row--drop-before", "layer-row--drop-after");
  }

  const targetKey = state.layerPanelDrag?.targetKey;
  if (!targetKey) {
    return;
  }

  const matchingRows = rows.filter((row) => row.dataset.blockKey === targetKey);
  if (!matchingRows.length) {
    return;
  }

  const targetRow = state.layerPanelDrag.position === "before"
    ? matchingRows[0]
    : matchingRows.at(-1);
  targetRow?.classList.add(state.layerPanelDrag.position === "before" ? "layer-row--drop-before" : "layer-row--drop-after");
}

function syncInputValue(input, value) {
  if (document.activeElement === input) {
    return;
  }

  input.value = value;
}

function syncCheckedValue(input, value) {
  if (document.activeElement === input) {
    return;
  }

  input.checked = Boolean(value);
}

function syncIndeterminateValue(input, value) {
  input.indeterminate = Boolean(value);
  input.setAttribute("aria-checked", input.indeterminate ? "mixed" : String(Boolean(input.checked)));
}

function syncTransformInputs(activeLayer) {
  const transformInputs = [
    ui.transformX,
    ui.transformY,
    ui.transformWidth,
    ui.transformHeight,
    ui.transformRotation
  ];

  ui.transformLayerName.textContent = activeLayer?.name ?? "None";

  for (const input of transformInputs) {
    input.disabled = !canTransformLayer(activeLayer);
  }

  if (!canTransformLayer(activeLayer)) {
    for (const input of transformInputs) {
      syncInputValue(input, "");
    }
    return;
  }

  syncInputValue(ui.transformX, String(Math.round(activeLayer.x)));
  syncInputValue(ui.transformY, String(Math.round(activeLayer.y)));
  syncInputValue(ui.transformWidth, String(Math.round(activeLayer.width)));
  syncInputValue(ui.transformHeight, String(Math.round(activeLayer.height)));
  syncInputValue(ui.transformRotation, String(Math.round(activeLayer.rotation)));
}

function syncAdjustmentControls(activeLayer) {
  const isAdjustment = isAdjustmentLayer(activeLayer);
  const adjustmentType = isAdjustment ? activeLayer.adjustmentType : "";
  const settings = isAdjustment ? getAdjustmentSettings(activeLayer) : {};
  const visibleControls = new Set(adjustmentLayerControlMap[adjustmentType] ?? []);
  const controlStates = [
    {
      key: "brightness",
      input: ui.adjustmentBrightness,
      value: ui.adjustmentBrightnessValue,
      format: (nextValue) => `${nextValue}%`
    },
    {
      key: "contrast",
      input: ui.adjustmentContrast,
      value: ui.adjustmentContrastValue,
      format: (nextValue) => `${nextValue}%`
    },
    {
      key: "hue",
      input: ui.adjustmentHue,
      value: ui.adjustmentHueValue,
      format: (nextValue) => `${nextValue}°`
    },
    {
      key: "saturation",
      input: ui.adjustmentSaturation,
      value: ui.adjustmentSaturationValue,
      format: (nextValue) => `${nextValue}%`
    }
  ];

  ui.adjustmentTypeLabel.textContent = isAdjustment
    ? getAdjustmentLayerLabel(adjustmentType)
    : "None";

  for (const control of controlStates) {
    const wrapper = control.input.closest("[data-adjustment-control]");
    const isVisible = isAdjustment && visibleControls.has(control.key);
    const value = Number(settings[control.key] ?? 0);

    if (wrapper) {
      wrapper.hidden = !isVisible;
    }

    control.input.disabled = !isVisible;
    syncInputValue(control.input, String(value));
    control.value.textContent = control.format(value);
  }
}

function canvasPointToStagePoint(point) {
  const scaleX = canvas.width > 0 ? stage.clientWidth / canvas.width : 1;
  const scaleY = canvas.height > 0 ? stage.clientHeight / canvas.height : 1;
  return {
    x: point.x * scaleX,
    y: point.y * scaleY
  };
}

function clientToStagePoint(clientX, clientY) {
  const rect = stage.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function docRectToStageRect(rect) {
  if (!state.doc || !rect) {
    return null;
  }

  const topLeft = canvasPointToStagePoint(docToCanvasPoint(rect.x, rect.y));
  const bottomRight = canvasPointToStagePoint(docToCanvasPoint(rect.x + rect.width, rect.y + rect.height));

  return {
    x: Math.min(topLeft.x, bottomRight.x),
    y: Math.min(topLeft.y, bottomRight.y),
    width: Math.abs(bottomRight.x - topLeft.x),
    height: Math.abs(bottomRight.y - topLeft.y)
  };
}

function clampContextualBarPosition(position, width = ui.contextualBar.offsetWidth || 0, height = ui.contextualBar.offsetHeight || 0) {
  const margin = 8;
  return {
    x: clamp(position.x, margin, Math.max(margin, stage.clientWidth - width - margin)),
    y: clamp(position.y, margin, Math.max(margin, stage.clientHeight - height - margin))
  };
}

function applyContextualBarPosition(position) {
  ui.contextualBar.style.left = `${position.x}px`;
  ui.contextualBar.style.top = `${position.y}px`;
  ui.contextualBar.style.right = "auto";
  // Clear the stylesheet fallback; top + bottom would stretch the absolute box.
  ui.contextualBar.style.bottom = "auto";
  ui.contextualBar.style.transform = "none";
}

function setContextualBarPinned(isPinned, options = {}) {
  const nextPinned = Boolean(isPinned);
  state.contextualBarPinned = nextPinned;

  if (nextPinned) {
    if (options.position) {
      state.contextualBarPosition = clampContextualBarPosition(options.position);
    } else {
      state.contextualBarPosition = clampContextualBarPosition({
        x: parseFloat(ui.contextualBar.style.left) || 8,
        y: parseFloat(ui.contextualBar.style.top) || 8
      });
    }
  } else if (!options.preservePosition) {
    state.contextualBarPosition = null;
  }
}

function toggleContextualBarVisibility(forceVisible = null) {
  state.contextualBarVisible = typeof forceVisible === "boolean"
    ? forceVisible
    : !state.contextualBarVisible;
  refresh();
}

function resetContextualBarPosition() {
  state.contextualBarPinned = false;
  state.contextualBarPosition = null;
  refresh();
}

function syncContextualBarMenuState() {
  if (ui.windowContextualBarToggle) {
    ui.windowContextualBarToggle.textContent = state.contextualBarVisible
      ? "Hide Contextual Task Bar"
      : "Show Contextual Task Bar";
    ui.windowContextualBarToggle.disabled = !state.doc;
  }

  if (ui.windowContextualBarReset) {
    ui.windowContextualBarReset.disabled = !state.doc || (!state.contextualBarPinned && !state.contextualBarPosition);
  }

  ui.contextualBarPin?.classList.toggle("is-active", state.contextualBarPinned);
  if (ui.contextualBarPin) {
    ui.contextualBarPin.textContent = state.contextualBarPinned ? "Unpin" : "Pin";
    ui.contextualBarPin.title = state.contextualBarPinned ? "Follow the selection again" : "Keep this bar where it is";
  }
}

function hideContextualBar() {
  ui.contextualBar.hidden = true;
}

function setContextualBarSection(sectionId) {
  for (const section of contextualBarSections) {
    section.hidden = section.dataset.contextualSection !== sectionId;
  }
  if (typeof window.renderIcons === "function") {
    window.renderIcons(ui.contextualBar);
  }
}

function getContextualBarContext() {
  if (
    !state.doc
    || !state.contextualBarVisible
    || ui.appMain.hidden
    || isDialogOpen()
    || state.pointer.mode
    || state.penDraft
    || state.textEditorLayerId
    || !ui.selectionMenu.hidden
    || !ui.layerContextMenu.hidden
  ) {
    return null;
  }

  const cropRect = getCropRect();
  if (state.tool === "crop" && cropRect) {
    return {
      kind: "crop",
      title: "Crop",
      subtitle: `${cropRect.width} x ${cropRect.height} px`,
      anchorRect: docRectToStageRect(cropRect),
      cropRect
    };
  }

  const selectionRect = getSelectionRect();
  if (selectionRect) {
    return {
      kind: "selection",
      title: "Selection",
      subtitle: `${selectionRect.width} x ${selectionRect.height} px`,
      anchorRect: docRectToStageRect(selectionRect),
      selectionRect
    };
  }

  const selectedLayers = getSelectedLayers();
  if (selectedLayers.length !== 1) {
    return null;
  }

  const activeLayer = selectedLayers[0];
  if (
    !activeLayer
    || !isLayerEffectivelyVisible(activeLayer)
    || isBackgroundLayer(activeLayer)
    || isAdjustmentLayer(activeLayer)
    || isEditingLayerMask(activeLayer)
  ) {
    return null;
  }

  const anchorRect = docRectToStageRect(getLayerAxisAlignedBounds(activeLayer));
  const sizeLabel = `${Math.round(activeLayer.width)} x ${Math.round(activeLayer.height)} px`;

  if (isTextLayer(activeLayer)) {
    return {
      kind: "text",
      title: activeLayer.name || "Text",
      subtitle: `Text Layer · ${sizeLabel}`,
      anchorRect,
      layer: activeLayer
    };
  }

  if (isVectorLayer(activeLayer)) {
    return {
      kind: "vector",
      title: activeLayer.name || "Vector",
      subtitle: `Vector Layer · ${sizeLabel}`,
      anchorRect,
      layer: activeLayer
    };
  }

  return {
    kind: "raster",
    title: activeLayer.name || "Layer",
    subtitle: `Raster Layer · ${sizeLabel}`,
    anchorRect,
    layer: activeLayer
  };
}

function positionContextualBar(anchorRect) {
  if (state.contextualBarPinned && state.contextualBarPosition) {
    const pinnedPosition = clampContextualBarPosition(state.contextualBarPosition);
    applyContextualBarPosition(pinnedPosition);
    state.contextualBarPosition = pinnedPosition;
    return;
  }

  const margin = 8;
  const offset = 12;
  const stageWidth = stage.clientWidth;
  const stageHeight = stage.clientHeight;
  const fallbackRect = {
    x: stageWidth / 2,
    y: stageHeight / 2,
    width: 0,
    height: 0
  };
  const rect = anchorRect ?? fallbackRect;
  const barWidth = ui.contextualBar.offsetWidth;
  const barHeight = ui.contextualBar.offsetHeight;
  const centeredLeft = rect.x + rect.width / 2 - barWidth / 2;
  const belowTop = rect.y + rect.height + offset;
  const aboveTop = rect.y - barHeight - offset;
  let top = belowTop;

  if (belowTop + barHeight > stageHeight - margin && aboveTop >= margin) {
    top = aboveTop;
  }

  top = clamp(top, margin, Math.max(margin, stageHeight - barHeight - margin));
  const left = clamp(centeredLeft, margin, Math.max(margin, stageWidth - barWidth - margin));

  applyContextualBarPosition({ x: left, y: top });
}

function syncContextualBar() {
  const context = getContextualBarContext();
  syncContextualBarMenuState();
  if (!context) {
    hideContextualBar();
    return;
  }

  ui.contextualBarTitle.textContent = context.title;
  ui.contextualBarSubtitle.textContent = context.subtitle;
  setContextualBarSection(context.kind);

  if (context.kind === "raster" && context.layer) {
    syncInputValue(ui.contextualRasterWidth, String(Math.round(context.layer.width)));
    syncInputValue(ui.contextualRasterHeight, String(Math.round(context.layer.height)));
    syncInputValue(ui.contextualRasterOpacity, String(Math.round((context.layer.opacity ?? 1) * 100)));
    ui.contextualRasterOpacityValue.textContent = `${Math.round((context.layer.opacity ?? 1) * 100)}%`;
  } else if (context.kind === "text" && context.layer) {
    const textStyle = ensureTextStyle(context.layer.textStyle);
    syncInputValue(ui.contextualTextFontFamily, textStyle.fontFamily);
    syncInputValue(ui.contextualTextFontSize, String(textStyle.fontSize));
    syncInputValue(ui.contextualTextAlign, textStyle.align);
    syncInputValue(ui.contextualTextColor, colorInputValueFromPaint(textStyle.color, state.textColor));
  } else if (context.kind === "vector" && context.layer) {
    const vectorStyle = ensureVectorStyleSummary(context.layer.vectorStyleSummary, context.layer.vectorStyle);
    syncInputValue(ui.contextualVectorFill, colorInputValueFromPaint(vectorStyle.fill, state.brushColor));
    syncInputValue(ui.contextualVectorStroke, colorInputValueFromPaint(vectorStyle.stroke, state.brushColor));
    syncInputValue(ui.contextualVectorStrokeWidth, String(Math.round(vectorStyle.strokeWidth)));
  } else if (context.kind === "selection") {
    const activeLayer = getActiveLayer();
    const isMaskEditing = isEditingLayerMask(activeLayer);
    const hasMaskSelection = hasPixelSelectionMask();
    const canFillVectorLayer = isVectorLayer(activeLayer) && !isMaskEditing && !hasMaskSelection;
    const canFillSelection = Boolean(context.selectionRect)
      && (!isVectorLayer(activeLayer) || isMaskEditing || !hasMaskSelection);
    const canRunFillCommand = Boolean(activeLayer)
      && !isAdjustmentLayer(activeLayer)
      && (canFillSelection || canFillVectorLayer);
    const canClearSelection = canFillSelection;
    ui.contextualSelectionFill.disabled = !canRunFillCommand;
    ui.contextualSelectionClear.disabled = !canClearSelection;
    ui.contextualSelectionCrop.disabled = !context.selectionRect || hasMaskSelection;
    ui.contextualSelectionDeselect.disabled = !context.selectionRect;
  } else if (context.kind === "crop") {
    ui.contextualCropSize.textContent = `${context.cropRect.width} x ${context.cropRect.height} px`;
  }

  ui.contextualBar.hidden = false;
  positionContextualBar(context.anchorRect);
}

function beginContextualBarDrag(event) {
  if (!state.doc || ui.contextualBar.hidden) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  const stagePoint = clientToStagePoint(event.clientX, event.clientY);
  const currentPosition = {
    x: parseFloat(ui.contextualBar.style.left) || 8,
    y: parseFloat(ui.contextualBar.style.top) || 8
  };

  state.contextualBarDrag = {
    pointerId: event.pointerId,
    startStagePoint: stagePoint,
    startPosition: currentPosition
  };
  document.body.classList.add("is-contextual-bar-dragging");
}

function updateContextualBarDrag(event) {
  if (!state.contextualBarDrag || state.contextualBarDrag.pointerId !== event.pointerId) {
    return;
  }

  const stagePoint = clientToStagePoint(event.clientX, event.clientY);
  const nextPosition = clampContextualBarPosition({
    x: state.contextualBarDrag.startPosition.x + (stagePoint.x - state.contextualBarDrag.startStagePoint.x),
    y: state.contextualBarDrag.startPosition.y + (stagePoint.y - state.contextualBarDrag.startStagePoint.y)
  });

  setContextualBarPinned(true, { position: nextPosition });
  applyContextualBarPosition(nextPosition);
  syncContextualBarMenuState();
}

function endContextualBarDrag(event) {
  if (!state.contextualBarDrag || state.contextualBarDrag.pointerId !== event.pointerId) {
    return;
  }

  state.contextualBarDrag = null;
  document.body.classList.remove("is-contextual-bar-dragging");
}

function syncOptionsBar(activeLayer, selectionRect, cropRect, textStyleForUi) {
  const activeTool = state.tool;
  const activeArtboard = getActiveArtboard();
  const isMaskEditing = isEditingLayerMask(activeLayer);
  const isAdjustment = isAdjustmentLayer(activeLayer);
  const hasMaskSelection = hasPixelSelectionMask();
  const canFillVectorLayer = isVectorLayer(activeLayer) && !isMaskEditing && !hasMaskSelection;
  const canFillSelection = Boolean(selectionRect)
    && (!isVectorLayer(activeLayer) || isMaskEditing || !hasMaskSelection);
  const canClearSelection = canFillSelection;
  const fillCommandLabel = isMaskEditing ? "Fill Mask" : (canFillVectorLayer ? "Fill Layer" : "Fill");
  const canRunFillCommand = Boolean(activeLayer) && !isAdjustment && (canFillSelection || canFillVectorLayer);
  ui.toolOptionsLabel.textContent = toolLabels[activeTool] ?? (activeTool[0].toUpperCase() + activeTool.slice(1));

  for (const section of toolOptionSections) {
    const supportedTools = section.dataset.toolOptions?.split(/\s+/).filter(Boolean) ?? [];
    section.hidden = !supportedTools.includes(activeTool);
  }
  ui.optionsSelectionShapeField.hidden = activeTool !== "select";
  syncInputValue(ui.optionsSelectionShape, state.selectionShape);

  const canTransform = canTransformLayer(activeLayer);
  const transformOptionInputs = [
    ui.optionsTransformX,
    ui.optionsTransformY,
    ui.optionsTransformWidth,
    ui.optionsTransformHeight,
    ui.optionsTransformRotation
  ];

  for (const input of transformOptionInputs) {
    input.disabled = !canTransform;
  }

  if (canTransform) {
    syncInputValue(ui.optionsTransformX, String(Math.round(activeLayer.x)));
    syncInputValue(ui.optionsTransformY, String(Math.round(activeLayer.y)));
    syncInputValue(ui.optionsTransformWidth, String(Math.round(activeLayer.width)));
    syncInputValue(ui.optionsTransformHeight, String(Math.round(activeLayer.height)));
    syncInputValue(ui.optionsTransformRotation, String(Math.round(activeLayer.rotation)));
  } else {
    for (const input of transformOptionInputs) {
      syncInputValue(input, "");
    }
  }

  ui.optionsTransformHeight.disabled = !canTransform || isTextLayer(activeLayer);
  syncInputValue(ui.optionsBrushSize, String(state.brushSize));
  syncInputValue(ui.optionsBrushOpacity, String(Math.round(state.brushOpacity * 100)));
  ui.optionsBrushSizeValue.textContent = `${state.brushSize}px`;
  ui.optionsBrushOpacityValue.textContent = `${Math.round(state.brushOpacity * 100)}%`;

  syncInputValue(ui.optionsTextFontFamily, textStyleForUi.fontFamily);
  syncInputValue(ui.optionsTextFontSize, String(textStyleForUi.fontSize));
  syncInputValue(ui.optionsTextAlign, textStyleForUi.align);

  syncInputValue(ui.optionsShapeType, state.shapeType);
  syncInputValue(ui.optionsShapeStrokeWidth, String(state.shapeStrokeWidth));
  syncInputValue(ui.optionsShapeOpacity, String(Math.round(state.brushOpacity * 100)));
  ui.optionsShapeOpacityValue.textContent = `${Math.round(state.brushOpacity * 100)}%`;
  syncInputValue(ui.optionsRegionTolerance, String(state.regionTolerance));
  ui.optionsRegionToleranceValue.textContent = String(state.regionTolerance);
  syncCheckedValue(ui.optionsRegionContiguous, state.regionContiguous);
  syncInputValue(ui.optionsGradientType, state.gradientType);
  ui.optionsPenFinish.disabled = !canFinishPenDraft();
  ui.optionsPenClose.disabled = !canClosePenDraft();
  ui.optionsRulerClear.disabled = !state.rulerDraft;
  ui.optionsRulerValue.textContent = formatRulerMeasurement(
    state.rulerDraft ? getRulerMeasurement(state.rulerDraft.startPoint, state.rulerDraft.endPoint) : null
  );

  ui.optionsFillSelection.textContent = fillCommandLabel;
  ui.optionsFillSelection.disabled = !canRunFillCommand;
  ui.optionsClearSelection.disabled = !canClearSelection;
  ui.optionsApplyCrop.disabled = !cropRect;
  ui.optionsCancelCrop.disabled = !cropRect;
  ui.optionsFitCanvasLayer.disabled = !canTransformLayer(activeLayer);
  ui.optionsFitCanvasArtboard.disabled = !activeArtboard;
  ui.optionsDeleteArtboard.disabled = !activeArtboard;
}

function syncLayerPanelControls() {
  for (const button of layerFilterButtons) {
    const filter = button.dataset.layerFilter || "all";
    const isActive = state.layerPanelFilter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  const lockableLayers = getLockableSelectedLayers();
  for (const button of layerLockButtons) {
    const lockType = button.dataset.layerLock;
    const isDisabled = lockableLayers.length === 0;
    const isActive = lockableLayers.length > 0 && lockableLayers.every((layer) => getLayerLockState(layer, lockType));
    const isMixed = lockableLayers.some((layer) => getLayerLockState(layer, lockType)) && !isActive;
    button.disabled = isDisabled;
    button.classList.toggle("is-active", isActive);
    button.classList.toggle("is-mixed", isMixed);
    button.setAttribute("aria-pressed", String(isActive));
  }

  const selectedLayers = getLockableSelectedLayers();
  const selectedEditableLayers = getSelectedEditableLayers();
  ui.linkLayer.disabled = selectedLayers.length < 2;
  const isLinked = selectedLayers.length > 1 && selectedLayers.every((layer) => layer.linked === true);
  ui.linkLayer.classList.toggle("is-active", isLinked);
  ui.linkLayer.setAttribute("aria-pressed", String(isLinked));
  ui.layerStyle.disabled = selectedEditableLayers.length === 0;
  const hasLayerStyle = selectedEditableLayers.length > 0 && selectedEditableLayers.every((layer) => layer.layerEffects?.dropShadow === true);
  ui.layerStyle.classList.toggle("is-active", hasLayerStyle);
  ui.layerStyle.setAttribute("aria-pressed", String(hasLayerStyle));

  const hasLayerNarrowing = state.layerPanelFilter !== "all" || state.layerSearchQuery.trim().length > 0;
  ui.layersMore.classList.toggle("is-active", hasLayerNarrowing);
  ui.layersMore.disabled = !hasLayerNarrowing;
}

function syncPanelToggleControls() {
  for (const button of panelToggleButtons) {
    const toggleKey = button.dataset.panelToggle;
    const isActive = Boolean(state.panelToggles[toggleKey]);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function syncUi(options = {}) {
  renderHistoryPanel();

  if (!state.doc) {
    ui.statusFile.textContent = "No document";
    ui.statusFile.title = "No document";
    ui.statusTool.textContent = toolLabels[state.tool] ?? "Transform";
    ui.statusZoom.textContent = "100%";
    ui.statusPointer.textContent = "x -, y -";
    ui.statWidth.textContent = "0 px";
    ui.statHeight.textContent = "0 px";
    ui.statZoom.textContent = "100%";
    ui.statSelection.textContent = "None";
    ui.activeLayerName.textContent = "None";
    ui.canvasSize.disabled = true;
    ui.propertiesImageSize.disabled = true;
    ui.propertiesCrop.disabled = true;
    ui.fitCanvasLayer.disabled = true;
    ui.fitCanvasArtboard.disabled = true;
    ui.undo.disabled = true;
    ui.redo.disabled = true;
    ui.menuUndo.disabled = true;
    ui.menuRedo.disabled = true;
    ui.saveProject.disabled = true;
    ui.saveProjectAs.disabled = true;
    ui.exportImage.disabled = true;
    ui.menuDuplicateLayer.disabled = true;
    ui.menuDeleteLayer.disabled = true;
    ui.menuLayerNew.disabled = true;
    ui.menuLayerGroup.disabled = true;
    ui.menuLayerUngroup.disabled = true;
    ui.menuLayerMaskAdd.disabled = true;
    ui.menuLayerMaskEdit.disabled = true;
    ui.menuLayerMaskEdit.textContent = "Edit Layer Mask";
    ui.menuLayerMaskDelete.disabled = true;
    ui.menuLayerMaskApply.disabled = true;
    ui.menuLayerClippingMask.disabled = true;
    ui.menuLayerClippingMask.textContent = "Create Clipping Mask";
    ui.menuLayerAdjustmentGrayscale.disabled = true;
    ui.menuLayerAdjustmentInvert.disabled = true;
    ui.menuLayerAdjustmentBrightnessContrast.disabled = true;
    ui.menuLayerAdjustmentHueSaturation.disabled = true;
    ui.menuLayerDuplicate.disabled = true;
    ui.menuLayerDelete.disabled = true;
    ui.menuLayerUp.disabled = true;
    ui.menuLayerDown.disabled = true;
    ui.menuLayerFlipHorizontal.disabled = true;
    ui.menuLayerFlipVertical.disabled = true;
    ui.menuTypeNew.disabled = true;
    ui.menuTypeEdit.disabled = true;
    ui.menuTypeAlignLeft.disabled = true;
    ui.menuTypeAlignCenter.disabled = true;
    ui.menuTypeAlignRight.disabled = true;
    ui.menuSelectAll.disabled = true;
    ui.menuSelectNone.disabled = true;
    ui.menuSelectFill.disabled = true;
    ui.menuSelectClear.disabled = true;
    ui.menuSelectCrop.disabled = true;
    ui.grayscaleMenu.disabled = true;
    ui.invertMenu.disabled = true;
    ui.menuZoomIn.disabled = true;
    ui.menuZoomOut.disabled = true;
    ui.menuFitView.disabled = true;
    ui.menuResetView.disabled = true;
    ui.cropSelection.disabled = true;
    ui.clearSelection.disabled = true;
    ui.grayscale.disabled = true;
    ui.invert.disabled = true;
    ui.rotateLeft.disabled = true;
    ui.rotateRight.disabled = true;
    ui.flipHorizontal.disabled = true;
    ui.flipVertical.disabled = true;
    ui.alignLeft.disabled = true;
    ui.alignCenterX.disabled = true;
    ui.alignRight.disabled = true;
    ui.alignTop.disabled = true;
    ui.alignCenterY.disabled = true;
    ui.alignBottom.disabled = true;
    ui.groupLayer.disabled = true;
    ui.ungroupLayer.disabled = true;
    ui.duplicateLayer.disabled = true;
    ui.linkLayer.disabled = true;
    ui.layerStyle.disabled = true;
    ui.layerMask.disabled = true;
    ui.layerAdjustment.disabled = true;
    ui.deleteLayer.disabled = true;
    ui.moveLayerUp.disabled = true;
    ui.moveLayerDown.disabled = true;
    ui.transformHeight.disabled = true;
    ui.layerBlendMode.disabled = true;
    ui.layerOpacity.disabled = true;
    ui.layerOpacitySlider.disabled = true;
    ui.layerOpacityValue.textContent = "100%";
    syncLayerPanelControls();
    syncPanelToggleControls();
    ui.vectorFillValue.disabled = true;
    ui.vectorFillTransparent.disabled = true;
    ui.vectorStrokeValue.disabled = true;
    ui.vectorStrokeTransparent.disabled = true;
    ui.vectorStrokeWidth.disabled = true;
    syncAdjustmentControls(null);
    syncContextualBar();
    syncInspectorPanels({ activeLayer: null, effectiveTool: state.transientTool || state.tool });
    renderLayers();
    return;
  }

  const selectionRect = getSelectionRect();
  const cropRect = getCropRect();
  const activeLayer = getActiveLayer();
  const selectedLayers = getSelectedLayers();
  const selectedEditableLayers = getSelectedEditableLayers();
  const canGroupActiveLayer = selectedEditableLayers.length > 0 && selectedEditableLayers.every((layer) => !layer.groupId);
  const canUngroupActiveLayer = selectedEditableLayers.some((layer) => layer.groupId);
  const canMoveLayerUp = selectedLayers.length === 1 && canMoveLayer(activeLayer, 1);
  const canMoveLayerDown = selectedLayers.length === 1 && canMoveLayer(activeLayer, -1);
  const isMaskEditing = isEditingLayerMask(activeLayer);
  const isAdjustment = isAdjustmentLayer(activeLayer);
  const canManageMaskLayer = selectedLayers.length === 1 && Boolean(activeLayer) && !isLayerFullyLocked(activeLayer) && !isAdjustment;
  const activeLayerHasMask = hasLayerMask(activeLayer);
  const canToggleClippingMask = selectedLayers.length === 1 && Boolean(activeLayer) && !isBackgroundLayer(activeLayer) && (isLayerClippedToBelow(activeLayer) || canLayerClipToBelow(activeLayer));
  const effectiveTool = state.transientTool || state.tool;
  const statsRect = state.tool === "crop" ? cropRect : selectionRect;
  const textStyleForUi = getTextStyleForUi();
  const vectorStyleForUi = getVectorStyleSummaryForUi();
  const activeArtboard = getActiveArtboard();
  const hasMaskSelection = hasPixelSelectionMask();
  const canFillVectorLayer = isVectorLayer(activeLayer) && !isMaskEditing && !hasMaskSelection && canModifyLayerPixels(activeLayer);
  const canFillSelection = Boolean(selectionRect)
    && canModifyLayerPixels(activeLayer)
    && (!isVectorLayer(activeLayer) || isMaskEditing || !hasMaskSelection);
  const canClearSelection = canFillSelection;
  const fillCommandLabel = isMaskEditing ? "Fill Mask" : (canFillVectorLayer ? "Fill Layer" : "Fill Selection");
  const canRunFillCommand = Boolean(activeLayer) && !isAdjustment && (canFillSelection || canFillVectorLayer);

  ui.statusFile.textContent = basename(state.projectPath || state.projectName || "Untitled");
  ui.statusFile.title = state.projectPath || state.projectName || "Untitled";
  ui.statusTool.textContent = toolLabels[effectiveTool] ?? (effectiveTool[0].toUpperCase() + effectiveTool.slice(1));
  ui.statusZoom.textContent = `${Math.round(state.zoom * 100)}%`;
  ui.statusPointer.textContent = state.hoverDocPoint
    ? `x ${Math.round(state.hoverDocPoint.x)}, y ${Math.round(state.hoverDocPoint.y)}`
    : "x -, y -";

  ui.statWidth.textContent = `${state.doc.width} px`;
  ui.statHeight.textContent = `${state.doc.height} px`;
  ui.statZoom.textContent = `${Math.round(state.zoom * 100)}%`;
  ui.statSelection.textContent = statsRect ? `${statsRect.width} x ${statsRect.height}` : "None";
  ui.activeLayerName.textContent = selectedLayers.length > 1
    ? `${selectedLayers.length} layers`
    : (isMaskEditing && activeLayer ? `${activeLayer.name} Mask` : (activeLayer?.name ?? "None"));
  ui.brushSizeValue.textContent = `${state.brushSize}px`;
  ui.brushOpacityValue.textContent = `${Math.round(state.brushOpacity * 100)}%`;
  ui.layerOpacityValue.textContent = `${Math.round((activeLayer?.opacity ?? 1) * 100)}%`;
  syncInputValue(ui.brushOpacity, String(Math.round(state.brushOpacity * 100)));
  syncInputValue(ui.brushColor, state.brushColor);
  syncInputValue(ui.brushColorValue, rgbaStringFromState());
  syncInputValue(ui.layerBlendMode, normalizeBlendMode(activeLayer?.blendMode));
  syncInputValue(ui.layerOpacity, String(Math.round((activeLayer?.opacity ?? 1) * 100)));
  syncInputValue(ui.layerOpacitySlider, String(Math.round((activeLayer?.opacity ?? 1) * 100)));
  syncInputValue(ui.vectorFillValue, colorInputValueFromPaint(vectorStyleForUi.fill, state.brushColor));
  syncCheckedValue(ui.vectorFillTransparent, vectorStyleForUi.fillTransparent);
  syncIndeterminateValue(ui.vectorFillTransparent, vectorStyleForUi.mixedFillTransparency);
  syncInputValue(ui.vectorStrokeValue, colorInputValueFromPaint(vectorStyleForUi.stroke, state.brushColor));
  syncCheckedValue(ui.vectorStrokeTransparent, vectorStyleForUi.strokeTransparent);
  syncIndeterminateValue(ui.vectorStrokeTransparent, vectorStyleForUi.mixedStrokeTransparency);
  if (vectorStyleForUi.mixedStrokeWidth) {
    if (document.activeElement !== ui.vectorStrokeWidth) {
      ui.vectorStrokeWidth.value = "";
    }
  } else {
    syncInputValue(ui.vectorStrokeWidth, String(Math.round(vectorStyleForUi.strokeWidth)));
  }
  ui.vectorStrokeWidth.placeholder = vectorStyleForUi.mixedStrokeWidth ? "Mixed" : "";
  ui.vectorFillState.hidden = !vectorStyleForUi.mixedFill;
  ui.vectorStrokeState.hidden = !vectorStyleForUi.mixedStroke;
  ui.vectorStrokeWidthState.hidden = !vectorStyleForUi.mixedStrokeWidth;
  ui.vectorFillValue.closest(".paint-field")?.classList.toggle("is-mixed", vectorStyleForUi.mixedFill);
  ui.vectorStrokeValue.closest(".paint-field")?.classList.toggle("is-mixed", vectorStyleForUi.mixedStroke);
  ui.vectorFillTransparent.closest(".paint-toggle")?.classList.toggle("is-mixed", vectorStyleForUi.mixedFillTransparency);
  ui.vectorStrokeTransparent.closest(".paint-toggle")?.classList.toggle("is-mixed", vectorStyleForUi.mixedStrokeTransparency);
  ui.vectorStrokeWidth.classList.toggle("is-mixed", vectorStyleForUi.mixedStrokeWidth);
  ui.vectorFillValue.title = vectorStyleForUi.mixedFill ? "Mixed fill values. Changing this applies one fill to the whole vector layer." : "";
  ui.vectorStrokeValue.title = vectorStyleForUi.mixedStroke ? "Mixed stroke values. Changing this applies one stroke to the whole vector layer." : "";
  ui.vectorStrokeWidth.title = vectorStyleForUi.mixedStrokeWidth ? "Mixed stroke widths. Changing this applies one width to the whole vector layer." : "";
  syncInputValue(ui.textFontFamily, textStyleForUi.fontFamily);
  syncInputValue(ui.textFontWeight, textStyleForUi.fontWeight);
  syncInputValue(ui.textFontSize, String(textStyleForUi.fontSize));
  syncInputValue(ui.textLineHeight, String(round(textStyleForUi.lineHeight, 2)));
  syncInputValue(ui.textColorValue, rgbaStringFromParts(textStyleForUi.color, textStyleForUi.opacity));
  syncInputValue(ui.textStrokeValue, textStyleForUi.strokeColor || "transparent");
  syncInputValue(ui.textStrokeWidth, String(Math.round(textStyleForUi.strokeWidth)));
  syncInputValue(ui.textBackgroundValue, textStyleForUi.backgroundColor || "transparent");
  syncInputValue(ui.textAlign, textStyleForUi.align);
  syncInputValue(ui.shapeType, state.shapeType);
  syncInputValue(ui.shapeStrokeWidth, String(state.shapeStrokeWidth));
  ui.fillSelection.textContent = fillCommandLabel;
  ui.fillSelection.disabled = !canRunFillCommand;
  syncTransformInputs(activeLayer);
  syncAdjustmentControls(activeLayer);
  syncInspectorPanels({ activeLayer, effectiveTool });

  for (const button of toolButtons) {
    const isActive = button.dataset.tool === state.tool;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  ui.cropSelection.disabled = !cropRect;
  ui.propertiesCrop.disabled = !cropRect;
  ui.clearSelection.disabled = !canClearSelection;
  ui.grayscale.disabled = !activeLayer || isMaskEditing || isAdjustment;
  ui.invert.disabled = !activeLayer || isMaskEditing || isAdjustment;
  ui.rotateLeft.disabled = !canTransformLayer(activeLayer);
  ui.rotateRight.disabled = !canTransformLayer(activeLayer);
  ui.flipHorizontal.disabled = !canTransformLayer(activeLayer);
  ui.flipVertical.disabled = !canTransformLayer(activeLayer);
  ui.alignLeft.disabled = !canTransformLayer(activeLayer);
  ui.alignCenterX.disabled = !canTransformLayer(activeLayer);
  ui.alignRight.disabled = !canTransformLayer(activeLayer);
  ui.alignTop.disabled = !canTransformLayer(activeLayer);
  ui.alignCenterY.disabled = !canTransformLayer(activeLayer);
  ui.alignBottom.disabled = !canTransformLayer(activeLayer);
  ui.canvasSize.disabled = !state.doc;
  ui.propertiesImageSize.disabled = !state.doc;
  ui.fitCanvasLayer.disabled = !canTransformLayer(activeLayer);
  ui.fitCanvasArtboard.disabled = !activeArtboard;
  ui.undo.disabled = state.historyIndex <= 0;
  ui.redo.disabled = state.historyIndex >= state.history.length - 1;
  ui.menuUndo.disabled = ui.undo.disabled;
  ui.menuRedo.disabled = ui.redo.disabled;
  ui.saveProject.disabled = !state.doc;
  ui.saveProjectAs.disabled = !state.doc;
  ui.exportImage.disabled = !state.doc;
  ui.menuDuplicateLayer.disabled = selectedEditableLayers.length === 0;
  ui.menuDeleteLayer.disabled = selectedEditableLayers.length === 0 || state.doc.layers.length - selectedEditableLayers.length < 1;
  ui.menuLayerNew.disabled = !state.doc;
  ui.menuLayerGroup.disabled = !canGroupActiveLayer;
  ui.menuLayerUngroup.disabled = !canUngroupActiveLayer;
  ui.menuLayerMaskAdd.disabled = !canManageMaskLayer || activeLayerHasMask;
  ui.menuLayerMaskEdit.disabled = !canManageMaskLayer || !activeLayerHasMask;
  ui.menuLayerMaskEdit.textContent = isMaskEditing ? "Edit Layer Content" : "Edit Layer Mask";
  ui.menuLayerMaskDelete.disabled = !canManageMaskLayer || !activeLayerHasMask;
  ui.menuLayerMaskApply.disabled = !canManageMaskLayer || !activeLayerHasMask;
  ui.menuLayerClippingMask.disabled = !canToggleClippingMask;
  ui.menuLayerClippingMask.textContent = isLayerClippedToBelow(activeLayer) ? "Release Clipping Mask" : "Create Clipping Mask";
  ui.menuLayerAdjustmentGrayscale.disabled = !state.doc;
  ui.menuLayerAdjustmentInvert.disabled = !state.doc;
  ui.menuLayerAdjustmentBrightnessContrast.disabled = !state.doc;
  ui.menuLayerAdjustmentHueSaturation.disabled = !state.doc;
  ui.menuLayerDuplicate.disabled = selectedEditableLayers.length === 0;
  ui.menuLayerDelete.disabled = selectedEditableLayers.length === 0 || state.doc.layers.length - selectedEditableLayers.length < 1;
  ui.menuLayerUp.disabled = !canMoveLayerUp;
  ui.menuLayerDown.disabled = !canMoveLayerDown;
  ui.menuLayerFlipHorizontal.disabled = !canTransformLayer(activeLayer);
  ui.menuLayerFlipVertical.disabled = !canTransformLayer(activeLayer);
  ui.menuTypeNew.disabled = !state.doc;
  ui.menuTypeEdit.disabled = !isTextLayer(activeLayer);
  ui.menuTypeAlignLeft.disabled = !isTextLayer(activeLayer);
  ui.menuTypeAlignCenter.disabled = !isTextLayer(activeLayer);
  ui.menuTypeAlignRight.disabled = !isTextLayer(activeLayer);
  ui.menuSelectAll.disabled = !state.doc;
  ui.menuSelectNone.disabled = !selectionRect;
  ui.menuSelectFill.textContent = fillCommandLabel;
  ui.menuSelectFill.disabled = !canRunFillCommand;
  ui.menuSelectClear.disabled = !canClearSelection;
  ui.menuSelectCrop.disabled = !selectionRect || hasMaskSelection;
  ui.grayscaleMenu.disabled = !activeLayer || isMaskEditing || isAdjustment;
  ui.invertMenu.disabled = !activeLayer || isMaskEditing || isAdjustment;
  ui.menuZoomIn.disabled = !state.doc;
  ui.menuZoomOut.disabled = !state.doc;
  ui.menuFitView.disabled = !state.doc;
  ui.menuResetView.disabled = !state.doc;
  ui.groupLayer.disabled = !canGroupActiveLayer;
  ui.ungroupLayer.disabled = !canUngroupActiveLayer;
  ui.duplicateLayer.disabled = selectedEditableLayers.length === 0;
  ui.layerMask.disabled = !canManageMaskLayer;
  ui.layerMask.title = activeLayerHasMask
    ? (isMaskEditing ? "Edit Layer Content" : "Edit Layer Mask")
    : "Add Layer Mask";
  ui.layerAdjustment.disabled = !state.doc;
  ui.deleteLayer.disabled = selectedEditableLayers.length === 0 || state.doc.layers.length - selectedEditableLayers.length < 1;
  ui.moveLayerUp.disabled = !canMoveLayerUp;
  ui.moveLayerDown.disabled = !canMoveLayerDown;
  ui.transformHeight.disabled = !canTransformLayer(activeLayer) || isTextLayer(activeLayer);
  ui.layerBlendMode.disabled = !activeLayer || isAdjustment || isLayerFullyLocked(activeLayer);
  ui.layerOpacity.disabled = !activeLayer || isLayerFullyLocked(activeLayer);
  ui.layerOpacitySlider.disabled = ui.layerOpacity.disabled;
  ui.vectorFillValue.disabled = !isVectorLayer(activeLayer);
  ui.vectorFillTransparent.disabled = !isVectorLayer(activeLayer);
  ui.vectorStrokeValue.disabled = !isVectorLayer(activeLayer);
  ui.vectorStrokeTransparent.disabled = !isVectorLayer(activeLayer);
  ui.vectorStrokeWidth.disabled = !isVectorLayer(activeLayer);
  syncOptionsBar(activeLayer, selectionRect, cropRect, textStyleForUi);
  syncContextualBar();
  syncLayerPanelControls();
  syncPanelToggleControls();

  if (options.rebuildLayers) {
    renderLayers();
  }

  if (state.textEditorLayerId) {
    const editingLayer = state.doc.layers.find((layer) => layer.id === state.textEditorLayerId) ?? null;
    if (editingLayer) {
      positionTextEditor(editingLayer);
    } else {
      ui.textEditor.hidden = true;
      state.textEditorLayerId = null;
      state.textEditorIsNewLayer = false;
    }
  }
}

function refresh(options = {}) {
  syncLayerSelection();
  syncActiveDocumentSession();
  updateDocumentTitle();
  renderProjectTabs();
  renderCanvas();
  syncShellState();
  syncUi(options);
  if (!state.doc) {
    void renderHomePresets();
  }
}

function captureSnapshot() {
  return {
    width: state.doc.width,
    height: state.doc.height,
    resolution: state.doc.resolution,
    backgroundContents: state.doc.backgroundContents,
    activeLayerId: state.activeLayerId,
    selectedLayerIds: [...state.selectedLayerIds],
    layerSelectionAnchorId: state.layerSelectionAnchorId,
    activeArtboardId: state.activeArtboardId,
    clipToDocument: state.clipToDocument,
    artboards: cloneArtboards(state.artboards),
    layerGroups: cloneLayerGroups(state.doc.layerGroups),
    layers: state.doc.layers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      visible: layer.visible,
      opacity: layer.opacity,
      blendMode: layer.blendMode,
      locked: layer.locked === true,
      lockTransparentPixels: layer.lockTransparentPixels === true,
      lockImagePixels: layer.lockImagePixels === true,
      lockPosition: layer.lockPosition === true,
      lockGeneratedPixels: layer.lockGeneratedPixels === true,
      linked: layer.linked === true,
      layerEffects: layer.layerEffects ? { ...layer.layerEffects } : {},
      groupId: layer.groupId,
      clippedToBelow: layer.clippedToBelow === true,
      hasContent: layer.hasContent,
      isBackground: layer.isBackground === true,
      layerKind: layer.layerKind,
      vectorSource: layer.vectorSource,
      vectorIntrinsicWidth: layer.vectorIntrinsicWidth,
      vectorIntrinsicHeight: layer.vectorIntrinsicHeight,
      vectorStyle: layer.vectorStyle ? { ...layer.vectorStyle } : null,
      textContent: layer.textContent,
      textStyle: layer.textStyle ? { ...layer.textStyle } : null,
      adjustmentType: layer.adjustmentType,
      adjustmentSettings: isAdjustmentLayer(layer) ? { ...getAdjustmentSettings(layer) } : null,
      x: layer.x,
      y: layer.y,
      width: layer.width,
      height: layer.height,
      rotation: layer.rotation,
      dataUrl: layer.canvas.toDataURL("image/png"),
      maskDataUrl: hasLayerMask(layer) ? layer.maskCanvas.toDataURL("image/png") : null
    }))
  };
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${source}`));
    image.src = source;
  });
}

function rgbToHslChannels(red, green, blue) {
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const maxChannel = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const minChannel = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const lightness = (maxChannel + minChannel) / 2;
  let hue = 0;
  let saturation = 0;

  if (maxChannel !== minChannel) {
    const delta = maxChannel - minChannel;
    saturation = lightness > 0.5
      ? delta / (2 - maxChannel - minChannel)
      : delta / (maxChannel + minChannel);

    switch (maxChannel) {
      case normalizedRed:
        hue = ((normalizedGreen - normalizedBlue) / delta) + (normalizedGreen < normalizedBlue ? 6 : 0);
        break;
      case normalizedGreen:
        hue = ((normalizedBlue - normalizedRed) / delta) + 2;
        break;
      default:
        hue = ((normalizedRed - normalizedGreen) / delta) + 4;
        break;
    }

    hue /= 6;
  }

  return { hue, saturation, lightness };
}

function hueToRgbChannel(channelA, channelB, hue) {
  let nextHue = hue;
  if (nextHue < 0) {
    nextHue += 1;
  }
  if (nextHue > 1) {
    nextHue -= 1;
  }
  if (nextHue < 1 / 6) {
    return channelA + (channelB - channelA) * 6 * nextHue;
  }
  if (nextHue < 1 / 2) {
    return channelB;
  }
  if (nextHue < 2 / 3) {
    return channelA + (channelB - channelA) * ((2 / 3) - nextHue) * 6;
  }
  return channelA;
}

function hslToRgbChannels(hue, saturation, lightness) {
  if (saturation <= 0) {
    const gray = Math.round(clamp(lightness, 0, 1) * 255);
    return { red: gray, green: gray, blue: gray };
  }

  const channelB = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation;
  const channelA = 2 * lightness - channelB;

  return {
    red: Math.round(clamp(hueToRgbChannel(channelA, channelB, hue + (1 / 3)), 0, 1) * 255),
    green: Math.round(clamp(hueToRgbChannel(channelA, channelB, hue), 0, 1) * 255),
    blue: Math.round(clamp(hueToRgbChannel(channelA, channelB, hue - (1 / 3)), 0, 1) * 255)
  };
}

function applyAdjustmentTransform(adjustmentType, pixels, settings = {}) {
  const normalizedSettings = normalizeAdjustmentSettings(adjustmentType, settings);

  switch (adjustmentType) {
    case "grayscale":
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] === 0) {
          continue;
        }
        const average = Math.round(pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114);
        pixels[index] = average;
        pixels[index + 1] = average;
        pixels[index + 2] = average;
      }
      return true;
    case "invert":
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] === 0) {
          continue;
        }
        pixels[index] = 255 - pixels[index];
        pixels[index + 1] = 255 - pixels[index + 1];
        pixels[index + 2] = 255 - pixels[index + 2];
      }
      return true;
    case "brightnessContrast": {
      const brightnessOffset = normalizedSettings.brightness * 2.55;
      const contrastValue = clamp(normalizedSettings.contrast * 2.55, -255, 254.999);
      const contrastFactor = (259 * (contrastValue + 255)) / (255 * (259 - contrastValue));

      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] === 0) {
          continue;
        }

        pixels[index] = Math.round(clamp(contrastFactor * (pixels[index] - 128) + 128 + brightnessOffset, 0, 255));
        pixels[index + 1] = Math.round(clamp(contrastFactor * (pixels[index + 1] - 128) + 128 + brightnessOffset, 0, 255));
        pixels[index + 2] = Math.round(clamp(contrastFactor * (pixels[index + 2] - 128) + 128 + brightnessOffset, 0, 255));
      }
      return true;
    }
    case "hueSaturation": {
      const hueOffset = normalizedSettings.hue / 360;
      const saturationDelta = normalizedSettings.saturation / 100;

      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] === 0) {
          continue;
        }

        const { hue, saturation, lightness } = rgbToHslChannels(
          pixels[index],
          pixels[index + 1],
          pixels[index + 2]
        );
        const nextHue = ((hue + hueOffset) % 1 + 1) % 1;
        const nextSaturation = saturationDelta >= 0
          ? saturation + (1 - saturation) * saturationDelta
          : saturation * (1 + saturationDelta);
        const nextRgb = hslToRgbChannels(nextHue, clamp(nextSaturation, 0, 1), lightness);

        pixels[index] = nextRgb.red;
        pixels[index + 1] = nextRgb.green;
        pixels[index + 2] = nextRgb.blue;
      }
      return true;
    }
    default:
      return false;
  }
}

function applyAdjustmentLayerToComposite(targetContext, layer) {
  if (!isAdjustmentLayer(layer)) {
    return false;
  }

  const imageData = targetContext.getImageData(0, 0, targetContext.canvas.width, targetContext.canvas.height);
  const originalPixels = imageData.data;
  const adjustedPixels = new Uint8ClampedArray(originalPixels);
  if (!applyAdjustmentTransform(layer.adjustmentType, adjustedPixels, layer.adjustmentSettings)) {
    return false;
  }

  const opacity = clamp(layer.opacity ?? 1, 0, 1);
  if (opacity >= 0.999) {
    originalPixels.set(adjustedPixels);
  } else if (opacity > 0) {
    for (let index = 0; index < originalPixels.length; index += 1) {
      originalPixels[index] = Math.round(originalPixels[index] + (adjustedPixels[index] - originalPixels[index]) * opacity);
    }
  }

  targetContext.putImageData(imageData, 0, 0);
  return true;
}

function renderLayerStackToContext(targetContext, layers, options = {}) {
  for (const layer of layers) {
    if (!isLayerEffectivelyVisible(layer)) {
      continue;
    }

    if (isAdjustmentLayer(layer)) {
      applyAdjustmentLayerToComposite(targetContext, layer);
      continue;
    }

    drawRenderableLayerToContext(targetContext, layer, options);
  }
}

function drawLayerOntoContext(targetContext, layer, offsetX = 0, offsetY = 0) {
  if (!isLayerEffectivelyVisible(layer)) {
    return;
  }

  drawRenderableLayerToContext(targetContext, layer, {
    docOffsetX: offsetX,
    docOffsetY: offsetY
  });
}

function composeCompositeCanvas(backgroundColor = null, outputWidth = null, outputHeight = null, exportTarget = getExportTargetDefinition()) {
  const contentRect = exportTarget.rect;
  const exportCanvas = document.createElement("canvas");
  const finalWidth = Math.max(1, Math.round(outputWidth ?? contentRect.width));
  const finalHeight = Math.max(1, Math.round(outputHeight ?? contentRect.height));
  const scaleX = finalWidth / Math.max(1, contentRect.width);
  const scaleY = finalHeight / Math.max(1, contentRect.height);

  exportCanvas.width = finalWidth;
  exportCanvas.height = finalHeight;
  const exportContext = exportCanvas.getContext("2d");
  exportContext.imageSmoothingEnabled = true;
  exportContext.imageSmoothingQuality = "high";

  renderLayerStackToContext(exportContext, exportTarget.layers, {
    docOffsetX: contentRect.x,
    docOffsetY: contentRect.y,
    scaleX,
    scaleY
  });

  if (backgroundColor) {
    exportContext.save();
    exportContext.globalCompositeOperation = "destination-over";
    exportContext.fillStyle = backgroundColor;
    exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportContext.restore();
  }

  return exportCanvas;
}

function buildProjectPayload() {
  return JSON.stringify({
    version: 8,
    name: state.projectName,
    savedAt: new Date().toISOString(),
    document: captureSnapshot()
  }, null, 2);
}

async function loadProjectPayload(projectJson, options = {}) {
  let parsed;

  try {
    parsed = JSON.parse(projectJson);
  } catch (error) {
    throw new Error(`Project file is not valid JSON: ${error instanceof Error ? error.message : "Unknown parse error"}`);
  }

  const snapshot = parsed?.document;
  if (!snapshot || !Array.isArray(snapshot.layers) || !Number.isFinite(snapshot.width) || !Number.isFinite(snapshot.height)) {
    throw new Error("Project file is missing document data.");
  }

  const projectName = options.projectName ?? (typeof parsed.name === "string" ? parsed.name : "Project");
  const nextDoc = await hydrateSnapshot(snapshot);

  setDocument(nextDoc, {
    activeLayerId: snapshot.activeLayerId,
    selectedLayerIds: snapshot.selectedLayerIds,
    layerSelectionAnchorId: snapshot.layerSelectionAnchorId,
    artboards: snapshot.artboards,
    activeArtboardId: snapshot.activeArtboardId,
    projectName,
    projectPath: options.projectPath ?? null,
    historyLabel: "Open Project"
  });
}

function getPathBasename(path = "") {
  return String(path).split(/[\\/]/).filter(Boolean).at(-1) ?? String(path);
}

function ensureProjectSavePath(path = "") {
  const trimmed = String(path || "").trim();
  if (!trimmed) {
    return "";
  }

  const segment = getPathBasename(trimmed);
  return segment.includes(".") ? trimmed : `${trimmed}.raster`;
}

async function doesPathExist(path) {
  const bridge = getTauriBridge();
  if (!bridge.invoke || !path) {
    return false;
  }

  try {
    return Boolean(await invokeTauri("path_exists", { path }));
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function confirmOverwritePath(path, label = "file") {
  return confirmDialog({
    title: "Overwrite Existing File",
    message: `${getPathBasename(path)} already exists. Overwrite this ${label}?`,
    confirmLabel: "Overwrite",
    cancelLabel: "Cancel",
    confirmClassName: "is-danger",
    closeOnOverlay: false
  });
}

async function confirmCanvasClipping(title, message, confirmLabel = "Continue") {
  return confirmDialog({
    title,
    message,
    confirmLabel,
    cancelLabel: "Cancel",
    confirmClassName: "is-danger",
    closeOnOverlay: false
  });
}

async function pickProjectOpenPath(defaultPath) {
  const bridge = getTauriBridge();
  if (bridge.openDialog) {
    const result = await bridge.openDialog({
      defaultPath,
      directory: false,
      multiple: false,
      filters: [{ name: "Photoshop Project", extensions: ["raster", "json"] }]
    });

    return Array.isArray(result) ? (result[0] ?? null) : (result ?? null);
  }

  const response = await showDialog({
    title: "Open Project",
    message: "Enter the path to a Photoshop project file.",
    confirmLabel: "Open",
    cancelLabel: "Cancel",
    fields: [
      {
        name: "path",
        label: "Project Path",
        type: "text",
        value: defaultPath,
        spellcheck: false
      }
    ],
    validate(values) {
      return values.path?.trim() ? null : "Enter a project path.";
    }
  });

  return response.confirmed ? response.values.path.trim() : null;
}

async function pickSavePath(defaultPath, filters, promptLabel) {
  const bridge = getTauriBridge();
  if (bridge.saveDialog) {
    return bridge.saveDialog({
      defaultPath,
      filters
    });
  }

  const extensionHint = Array.isArray(filters) && filters.length
    ? filters.flatMap((filter) => filter.extensions || []).join(", ")
    : "";
  const response = await showDialog({
    title: promptLabel || "Save File",
    message: extensionHint
      ? `Enter a save path for: ${extensionHint}.`
      : "Enter a path to save the file.",
    confirmLabel: "Save",
    cancelLabel: "Cancel",
    fields: [
      {
        name: "path",
        label: "Save Path",
        type: "text",
        value: defaultPath,
        spellcheck: false
      }
    ],
    validate(values) {
      return values.path?.trim() ? null : "Enter a save path.";
    }
  });

  return response.confirmed ? response.values.path.trim() : null;
}

async function hydrateSnapshot(snapshot) {
  const layers = [];

  for (const layerSnapshot of snapshot.layers) {
    if (layerSnapshot.layerKind === "adjustment" && hasOwn(adjustmentLayerTypes, layerSnapshot.adjustmentType)) {
      const layer = createLayer(layerSnapshot.name || getAdjustmentLayerLabel(layerSnapshot.adjustmentType), snapshot.width, snapshot.height, {
        visible: layerSnapshot.visible,
        opacity: layerSnapshot.opacity,
        blendMode: "normal",
        locked: layerSnapshot.locked === true,
        lockTransparentPixels: layerSnapshot.lockTransparentPixels === true,
        lockImagePixels: layerSnapshot.lockImagePixels === true,
        lockPosition: layerSnapshot.lockPosition === true,
        lockGeneratedPixels: layerSnapshot.lockGeneratedPixels === true,
        linked: layerSnapshot.linked === true,
        layerEffects: layerSnapshot.layerEffects,
        groupId: layerSnapshot.groupId,
        clippedToBelow: false,
        hasContent: true,
        layerKind: "adjustment",
        adjustmentType: layerSnapshot.adjustmentType,
        adjustmentSettings: layerSnapshot.adjustmentSettings,
        x: 0,
        y: 0,
        width: snapshot.width,
        height: snapshot.height,
        rotation: 0
      });
      layer.id = layerSnapshot.id;
      ensureLayerGeometry(layer, snapshot.width, snapshot.height);
      layers.push(layer);
      continue;
    }

    if (layerSnapshot.layerKind === "vector" && typeof layerSnapshot.vectorSource === "string" && layerSnapshot.vectorSource) {
      try {
        const layer = await createVectorLayerFromSvgSource(layerSnapshot.vectorSource, layerSnapshot.name, {
          visible: layerSnapshot.visible,
          opacity: layerSnapshot.opacity,
          blendMode: layerSnapshot.blendMode,
          locked: layerSnapshot.locked === true,
          lockTransparentPixels: layerSnapshot.lockTransparentPixels === true,
          lockImagePixels: layerSnapshot.lockImagePixels === true,
          lockPosition: layerSnapshot.lockPosition === true,
          lockGeneratedPixels: layerSnapshot.lockGeneratedPixels === true,
          linked: layerSnapshot.linked === true,
          layerEffects: layerSnapshot.layerEffects,
          groupId: layerSnapshot.groupId,
          clippedToBelow: layerSnapshot.clippedToBelow === true,
          hasContent: layerSnapshot.hasContent ?? true,
          x: layerSnapshot.x,
          y: layerSnapshot.y,
          width: layerSnapshot.width,
          height: layerSnapshot.height,
          rotation: layerSnapshot.rotation,
          vectorIntrinsicWidth: layerSnapshot.vectorIntrinsicWidth,
          vectorIntrinsicHeight: layerSnapshot.vectorIntrinsicHeight,
          vectorStyle: layerSnapshot.vectorStyle
        });
        layer.id = layerSnapshot.id;
        if (typeof layerSnapshot.maskDataUrl === "string" && layerSnapshot.maskDataUrl) {
          const maskImage = await loadImage(layerSnapshot.maskDataUrl);
          const maskCanvas = createFilledMaskCanvas(maskImage.naturalWidth || maskImage.width, maskImage.naturalHeight || maskImage.height, 0);
          maskCanvas.getContext("2d").drawImage(maskImage, 0, 0, maskCanvas.width, maskCanvas.height);
          setLayerMaskCanvas(layer, maskCanvas);
        }
        ensureLayerGeometry(layer, snapshot.width, snapshot.height);
        layers.push(layer);
        continue;
      } catch {
        // Fall back to the saved raster preview so a bad SVG does not break the whole document.
      }
    }

    const image = await loadImage(layerSnapshot.dataUrl);
    const layer = createLayer(layerSnapshot.name, image.naturalWidth || image.width || snapshot.width, image.naturalHeight || image.height || snapshot.height, {
      visible: layerSnapshot.visible,
      opacity: layerSnapshot.opacity,
      blendMode: layerSnapshot.blendMode,
      locked: layerSnapshot.locked === true,
      lockTransparentPixels: layerSnapshot.lockTransparentPixels === true,
      lockImagePixels: layerSnapshot.lockImagePixels === true,
      lockPosition: layerSnapshot.lockPosition === true,
      lockGeneratedPixels: layerSnapshot.lockGeneratedPixels === true,
      linked: layerSnapshot.linked === true,
      layerEffects: layerSnapshot.layerEffects,
      groupId: layerSnapshot.groupId,
      clippedToBelow: layerSnapshot.clippedToBelow === true,
      hasContent: layerSnapshot.hasContent ?? true,
      isBackground: layerSnapshot.isBackground === true,
      layerKind: layerSnapshot.layerKind,
      vectorSource: layerSnapshot.vectorSource,
      vectorIntrinsicWidth: layerSnapshot.vectorIntrinsicWidth,
      vectorIntrinsicHeight: layerSnapshot.vectorIntrinsicHeight,
      vectorStyle: layerSnapshot.vectorStyle,
      textContent: layerSnapshot.textContent,
      textStyle: layerSnapshot.textStyle,
      x: layerSnapshot.x,
      y: layerSnapshot.y,
      width: layerSnapshot.width,
      height: layerSnapshot.height,
      rotation: layerSnapshot.rotation
    });
    layer.id = layerSnapshot.id;
    layer.ctx.drawImage(image, 0, 0, layer.canvas.width, layer.canvas.height);
    if (typeof layerSnapshot.maskDataUrl === "string" && layerSnapshot.maskDataUrl) {
      const maskImage = await loadImage(layerSnapshot.maskDataUrl);
      const maskCanvas = createFilledMaskCanvas(maskImage.naturalWidth || maskImage.width, maskImage.naturalHeight || maskImage.height, 0);
      maskCanvas.getContext("2d").drawImage(maskImage, 0, 0, maskCanvas.width, maskCanvas.height);
      setLayerMaskCanvas(layer, maskCanvas);
    }
    ensureLayerGeometry(layer, snapshot.width, snapshot.height);
    if (isTextLayer(layer)) {
      renderTextLayerBitmap(layer);
    }
    layers.push(layer);
  }

  return {
    width: snapshot.width,
    height: snapshot.height,
    resolution: snapshot.resolution,
    backgroundContents: snapshot.backgroundContents,
    clipToDocument: Boolean(snapshot.clipToDocument),
    layerGroups: cloneLayerGroups(snapshot.layerGroups),
    layers
  };
}

function pushHistory(label = "") {
  const previousSnapshot = state.history[state.historyIndex] ?? null;
  const snapshot = captureSnapshot();
  snapshot.revision = ++state.nextHistoryRevision;
  snapshot.historyLabel = normalizeHistoryLabel(label) || inferHistoryEntryLabel(snapshot, previousSnapshot);

  if (state.historyIndex < state.history.length - 1) {
    state.history = state.history.slice(0, state.historyIndex + 1);
  }

  state.history.push(snapshot);

  if (state.history.length > limits.history) {
    state.history.shift();
  }

  state.historyIndex = state.history.length - 1;
  state.thumbnailCacheVersion += 1;
  syncActiveDocumentSession();
  renderProjectTabs();
  syncUi();
}

async function restoreHistory(index) {
  if (index < 0 || index >= state.history.length || index === state.historyIndex) {
    return;
  }

  const snapshot = state.history[index];
  const previous = state.doc;
  const nextDoc = await hydrateSnapshot(snapshot);

  state.doc = nextDoc;
  state.collapsedLayerGroups = pruneCollapsedLayerGroupState(nextDoc, state.collapsedLayerGroups);
  state.selectedLayerIds = Array.isArray(snapshot.selectedLayerIds) ? [...snapshot.selectedLayerIds] : [];
  state.layerSelectionAnchorId = snapshot.layerSelectionAnchorId ?? null;
  state.activeLayerId = snapshot.activeLayerId ?? nextDoc.layers.at(-1)?.id ?? null;
  state.artboards = cloneArtboards(snapshot.artboards);
  state.activeArtboardId = state.artboards.some((artboard) => artboard.id === snapshot.activeArtboardId)
    ? snapshot.activeArtboardId
    : (state.artboards[0]?.id ?? null);
  clearSelectionState();
  state.cropRect = null;
  state.hoverCanvasPoint = null;
  state.hoverDocPoint = null;
  state.activeLayerMaskId = null;
  state.clipToDocument = Boolean(snapshot.clipToDocument);
  clearGuides();
  state.historyIndex = index;

  if (!previous || previous.width !== nextDoc.width || previous.height !== nextDoc.height) {
    fitToStage();
  }

  refresh({ rebuildLayers: true });
}

function drawStrokeSegment(layer, fromPoint, toPoint) {
  if (!canModifyLayerPixels(layer)) {
    return;
  }

  const paintTarget = getLayerPaintTarget(layer);
  if (!paintTarget) {
    return;
  }

  const layerContext = paintTarget.ctx;
  const scale = getLayerScale(layer);
  const from = docPointToLayerPoint(layer, fromPoint);
  const to = docPointToLayerPoint(layer, toPoint);
  const activePaintTool = state.transientTool || state.tool;
  const isPencil = activePaintTool === "pencil";
  const brushWidth = state.brushSize * ((Math.abs(scale.x) + Math.abs(scale.y)) / 2);
  layerContext.save();
  layerContext.globalAlpha = state.brushOpacity;
  layerContext.lineCap = isPencil ? "square" : "round";
  layerContext.lineJoin = isPencil ? "miter" : "round";
  layerContext.lineWidth = isPencil ? Math.max(1, Math.round(brushWidth)) : brushWidth;

  if (activePaintTool === "eraser") {
    if (!paintTarget.isMask && isLayerTransparencyLocked(layer)) {
      layerContext.restore();
      return;
    }
    layerContext.globalCompositeOperation = "destination-out";
    layerContext.strokeStyle = "rgba(0, 0, 0, 1)";
  } else {
    layerContext.globalCompositeOperation = !paintTarget.isMask && isLayerTransparencyLocked(layer) ? "source-atop" : "source-over";
    layerContext.strokeStyle = paintTarget.isMask ? "rgba(255, 255, 255, 1)" : state.brushColor;
  }

  layerContext.beginPath();
  layerContext.moveTo(from.x, from.y);
  layerContext.lineTo(to.x, to.y);
  layerContext.stroke();
  layerContext.restore();
  if (!paintTarget.isMask) {
    layer.hasContent = true;
  }
  invalidateLayerRenderCaches(layer);
}

function canUseStraightPaintLine(layer, tool) {
  return Boolean(
    layer
    && state.lastPaintStroke
    && state.lastPaintStroke.layerId === layer.id
    && state.lastPaintStroke.tool === tool
    && state.lastPaintStroke.isMask === isEditingLayerMask(layer)
  );
}

function replaceLayerBitmap(layer, nextCanvas) {
  const previousMaskCanvas = hasLayerMask(layer) ? layer.maskCanvas : null;
  layer.canvas = nextCanvas;
  layer.ctx = nextCanvas.getContext("2d");
  if (previousMaskCanvas) {
    const nextMaskCanvas = createFilledMaskCanvas(nextCanvas.width, nextCanvas.height, 0);
    nextMaskCanvas.getContext("2d").drawImage(
      previousMaskCanvas,
      0,
      0,
      previousMaskCanvas.width,
      previousMaskCanvas.height,
      0,
      0,
      nextMaskCanvas.width,
      nextMaskCanvas.height
    );
    setLayerMaskCanvas(layer, nextMaskCanvas);
  } else {
    invalidateLayerRenderCaches(layer);
  }
  layer.hasContent = true;
}

function rotateActiveLayer(direction) {
  const activeLayer = getActiveLayer();
  if (!canTransformLayer(activeLayer)) {
    return;
  }

  activeLayer.rotation = normalizeAngle(activeLayer.rotation + direction * 90);
  constrainLayerToCanvas(activeLayer);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function flipActiveLayer(axis) {
  const activeLayer = getActiveLayer();
  if (!canTransformLayer(activeLayer)) {
    return;
  }

  if (isVectorLayer(activeLayer)) {
    void flipVectorLayer(activeLayer, axis).then((updated) => {
      if (!updated) {
        refresh();
        return;
      }

      clearGuides();
      constrainLayerToCanvas(activeLayer);
      pushHistory();
      refresh({ rebuildLayers: true });
    }).catch((error) => reportError(error, "Unable to flip the vector layer."));
    return;
  }

  flattenLayerKindsToRaster(activeLayer);

  const nextCanvas = document.createElement("canvas");
  nextCanvas.width = activeLayer.canvas.width;
  nextCanvas.height = activeLayer.canvas.height;
  const nextContext = nextCanvas.getContext("2d");

  nextContext.save();
  if (axis === "horizontal") {
    nextContext.translate(nextCanvas.width, 0);
    nextContext.scale(-1, 1);
  } else {
    nextContext.translate(0, nextCanvas.height);
    nextContext.scale(1, -1);
  }
  nextContext.drawImage(activeLayer.canvas, 0, 0);
  nextContext.restore();

  replaceLayerBitmap(activeLayer, nextCanvas);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function alignActiveLayer(axis, mode) {
  const activeLayer = getActiveLayer();
  if (!canTransformLayer(activeLayer)) {
    return;
  }

  const bounds = getLayerAxisAlignedBounds(activeLayer);
  let delta = 0;

  if (axis === "x") {
    if (mode === "start") {
      delta = -bounds.x;
    } else if (mode === "center") {
      delta = state.doc.width / 2 - (bounds.x + bounds.width / 2);
    } else if (mode === "end") {
      delta = state.doc.width - (bounds.x + bounds.width);
    }

    if (Math.abs(delta) <= 0.01) {
      refresh();
      return;
    }

    activeLayer.x += delta;
  } else {
    if (mode === "start") {
      delta = -bounds.y;
    } else if (mode === "center") {
      delta = state.doc.height / 2 - (bounds.y + bounds.height / 2);
    } else if (mode === "end") {
      delta = state.doc.height - (bounds.y + bounds.height);
    }

    if (Math.abs(delta) <= 0.01) {
      refresh();
      return;
    }

    activeLayer.y += delta;
  }

  clearGuides();
  constrainLayerToCanvas(activeLayer);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function zoomAt(factor, clientX = null, clientY = null) {
  if (!state.doc) {
    return;
  }

  state.zoom = normalizeZoom(state.zoom);
  const targetCanvasPoint = clientX === null || clientY === null
    ? { x: canvas.width / 2, y: canvas.height / 2 }
    : clientToCanvasPoint(clientX, clientY);

  const docPoint = canvasToDocPoint(targetCanvasPoint);
  const nextZoom = clamp(state.zoom * factor, limits.minZoom, limits.maxZoom);

  state.zoom = nextZoom;
  state.panX = targetCanvasPoint.x - (canvas.width - state.doc.width * nextZoom) / 2 - docPoint.x * nextZoom;
  state.panY = targetCanvasPoint.y - (canvas.height - state.doc.height * nextZoom) / 2 - docPoint.y * nextZoom;
  refresh();
}

function applyDocRectToLayer(layer, docRect, drawOperation) {
  const paintTarget = getLayerPaintTarget(layer);
  if (!paintTarget) {
    return false;
  }

  const scale = getLayerScale(layer);
  const center = getLayerCenter(layer);
  paintTarget.ctx.save();
  paintTarget.ctx.scale(scale.x, scale.y);
  paintTarget.ctx.translate(layer.width / 2, layer.height / 2);
  paintTarget.ctx.rotate(-getLayerRotationRadians(layer));
  paintTarget.ctx.translate(-center.x, -center.y);
  drawOperation(paintTarget.ctx, paintTarget);
  paintTarget.ctx.restore();
  if (!paintTarget.isMask) {
    layer.hasContent = true;
  }
  invalidateLayerRenderCaches(layer);
  return true;
}

function clearSelectedArea() {
  const selectionRect = getSelectionRect();
  const selectionMaskCanvas = getSelectionMaskCanvas();
  const activeLayer = getActiveLayer();

  if (!selectionRect || !selectionMaskCanvas || !activeLayer) {
    return;
  }

  if (isAdjustmentLayer(activeLayer) || !canModifyLayerPixels(activeLayer)) {
    return;
  }

  if (!isEditingLayerMask(activeLayer) && isLayerTransparencyLocked(activeLayer)) {
    return;
  }

  if (!isEditingLayerMask(activeLayer) && isVectorLayer(activeLayer)) {
    if (hasPixelSelectionMask()) {
      void reportError(new Error("Color range clears are not supported on vector layers."), "Select a raster layer to clear a sampled color range.");
      return;
    }

    void clearVectorLayerSelection(activeLayer, selectionRect).then((updated) => {
      if (!updated) {
        refresh();
        return;
      }

      pushHistory();
      refresh({ rebuildLayers: true });
    }).catch((error) => reportError(error, "Unable to clear the selected vector area."));
    return;
  }

  applySelectionMaskClearToLayer(activeLayer, selectionMaskCanvas);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function selectEntireCanvas() {
  if (!state.doc) {
    return;
  }

  setTool("select");
  setSelectionRect({
    x: 0,
    y: 0,
    width: state.doc.width,
    height: state.doc.height
  });
  refresh();
}

function clearSelectionOnly() {
  if (!state.selection && !state.selectionMaskCanvas) {
    return;
  }

  clearSelectionState();
  closeContextMenus();
  refresh();
}

function fillSelectedArea() {
  const selectionRect = getSelectionRect();
  const selectionMaskCanvas = getSelectionMaskCanvas();
  const activeLayer = getActiveLayer();
  closeContextMenus();

  if (!activeLayer) {
    return;
  }

  if (isAdjustmentLayer(activeLayer) || !canModifyLayerPixels(activeLayer)) {
    return;
  }

  if (isEditingLayerMask(activeLayer) && !selectionRect) {
    return;
  }

  if (!isEditingLayerMask(activeLayer) && isVectorLayer(activeLayer)) {
    if (hasPixelSelectionMask()) {
      void reportError(new Error("Color range fills are not supported on vector layers."), "Select a raster layer to fill a sampled color range.");
      return;
    }

    applyActiveVectorLayerStyle(
      getVectorFillChanges(activeLayer, getVectorBrushFill()),
      "Unable to update the vector fill."
    );
    return;
  }

  if (!selectionRect || !selectionMaskCanvas) {
    return;
  }

  applySelectionMaskFillToLayer(
    activeLayer,
    selectionMaskCanvas,
    isEditingLayerMask(activeLayer) ? "rgba(255, 255, 255, 1)" : state.brushColor,
    isEditingLayerMask(activeLayer) ? 1 : state.brushOpacity
  );
  pushHistory();
  refresh({ rebuildLayers: true });
}

function useSelectionForCrop() {
  const selectionRect = getSelectionRect();
  if (!selectionRect) {
    return;
  }

  if (hasPixelSelectionMask()) {
    void reportError(new Error("Color range selections cannot be used for crop."), "Use the marquee tool for rectangular crop selections.");
    return;
  }

  closeContextMenus();
  clearSelectionState();
  setTool("crop");
  setCropRect(selectionRect);
  refresh();
}

function createCanvasElement(width, height) {
  const nextCanvas = document.createElement("canvas");
  nextCanvas.width = Math.max(1, Math.round(width));
  nextCanvas.height = Math.max(1, Math.round(height));
  return nextCanvas;
}

function createShapeLayerFromDraft(shapeDraft) {
  return createVectorShapeLayerFromDraft(shapeDraft);
}

async function addShapeLayerFromDraft(shapeDraft) {
  if (!state.doc || !isRenderableShapeDraft(state.shapeType, shapeDraft)) {
    return;
  }

  if (state.shapeType === "callout") {
    await createCalloutAnnotationFromDraft(shapeDraft);
    return;
  }

  const layer = await createShapeLayerFromDraft(shapeDraft);
  insertLayersAfterActiveLayer([layer]);
  selectSingleLayer(layer.id);
  clearSelectionState();
  pushHistory();
  refresh({ rebuildLayers: true });
}

function canFinishPenDraft() {
  return Boolean(state.penDraft?.points?.length >= 2);
}

function canClosePenDraft() {
  return Boolean(state.penDraft?.points?.length >= 3);
}

async function commitPenDraft(options = {}) {
  if (!state.doc || !canFinishPenDraft()) {
    return false;
  }

  const layer = await createVectorPenLayerFromPoints(
    state.penDraft.points.map((point) => ({ ...point })),
    {
      closed: options.closed === true
    }
  );
  if (!layer) {
    return false;
  }

  insertLayersAfterActiveLayer([layer]);
  selectSingleLayer(layer.id);
  state.penDraft = null;
  clearSelectionState();
  pushHistory();
  refresh({ rebuildLayers: true });
  return true;
}

function createTextLayer(text, point) {
  const style = getTextStyleForUi();
  const layer = createLayer(nextGeneratedLayerName("Text"), 160, Math.max(48, style.fontSize * 1.8), {
    hasContent: true,
    groupId: getDefaultLayerGroupIdForNewLayer(),
    x: point.x,
    y: point.y,
    width: 160,
    height: Math.max(48, style.fontSize * 1.8),
    opacity: 1,
    layerKind: "text",
    textContent: text,
    textStyle: {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      color: style.color,
      opacity: style.opacity,
      backgroundColor: style.backgroundColor
    }
  });
  renderTextLayerBitmap(layer);
  return layer;
}

async function createCalloutAnnotationFromDraft(shapeDraft) {
  const targetPoint = shapeDraft.startPoint;
  const labelPoint = shapeDraft.endPoint;
  state.doc.layerGroups = getDocumentLayerGroups(state.doc);
  const group = normalizeLayerGroup({ name: "Annotation" });

  const textLayer = createTextLayer("Annotation", { x: 0, y: 0 });
  textLayer.name = nextGeneratedLayerName("Annotation");
  textLayer.groupId = group.id;
  textLayer.textStyle = ensureTextStyle({
    ...textLayer.textStyle,
    boxWidth: Math.max(220, Math.round(state.textFontSize * 5))
  });
  renderTextLayerBitmap(textLayer);

  const initialLabelRect = getCalloutTextBoxRect(
    targetPoint,
    labelPoint,
    textLayer.width,
    textLayer.height
  );
  textLayer.x = initialLabelRect.x;
  textLayer.y = initialLabelRect.y;
  constrainLayerToCanvas(textLayer);

  const textRect = {
    x: textLayer.x,
    y: textLayer.y,
    width: textLayer.width,
    height: textLayer.height
  };
  const leaderEndPoint = getNearestPointOnRect(textRect, targetPoint);
  const leaderLayer = await createVectorLineLayerFromPoints(targetPoint, leaderEndPoint, {
    arrowHead: "start",
    groupId: group.id,
    name: "Callout"
  });

  state.doc.layerGroups.push(group);
  insertLayersAfterActiveLayer([leaderLayer, textLayer]);
  selectSingleLayer(textLayer.id);
  clearSelectionState();
  pushHistory();
  refresh({ rebuildLayers: true });
  openInlineTextEditor(textLayer, { isNewLayer: true });
}

function addTextLayerAtPoint(point) {
  if (!state.doc) {
    return;
  }

  const layer = createTextLayer("New text", point);
  constrainLayerToCanvas(layer);
  insertLayersAfterActiveLayer([layer]);
  selectSingleLayer(layer.id);
  refresh({ rebuildLayers: true });
  openInlineTextEditor(layer, { isNewLayer: true });
}

function addTextLayerAtCenter() {
  if (!state.doc) {
    return;
  }

  const previewLayer = createTextLayer("New text", { x: 0, y: 0 });
  const point = {
    x: Math.max(0, Math.round((state.doc.width - previewLayer.width) / 2)),
    y: Math.max(0, Math.round((state.doc.height - previewLayer.height) / 2))
  };

  addTextLayerAtPoint(point);
}

function editActiveTextLayer() {
  const activeLayer = getActiveLayer();
  if (!isTextLayer(activeLayer)) {
    return;
  }

  openInlineTextEditor(activeLayer);
}

function setActiveTextAlignment(align) {
  updateTextDefaults({ align });
  if (!applyTextStyleToActiveLayer({ align })) {
    refresh();
  }
}

function createDocumentRenderCanvas() {
  if (!state.doc) {
    return null;
  }

  return createCanvasElement(state.doc.width, state.doc.height);
}

function getRegionSampleSourceCanvas(options = {}) {
  if (!state.doc) {
    return null;
  }

  const activeLayer = options.layer ?? getActiveLayer();
  const sourceCanvas = createDocumentRenderCanvas();
  const sourceContext = sourceCanvas?.getContext("2d");
  if (!sourceCanvas || !sourceContext) {
    return null;
  }

  if (options.useMask === true && activeLayer && hasLayerMask(activeLayer)) {
    drawLayerToContext(sourceContext, activeLayer, {
      sourceCanvas: activeLayer.maskCanvas,
      applyMask: false,
      opacity: 1,
      blendMode: "normal"
    });
    return sourceCanvas;
  }

  if (options.sourceMode === "active" && activeLayer && !isAdjustmentLayer(activeLayer)) {
    drawRenderableLayerToContext(sourceContext, activeLayer, {
      opacity: 1,
      blendMode: "normal"
    });
    return sourceCanvas;
  }

  renderLayerStackToContext(sourceContext, state.doc.layers, {
    opacity: 1,
    blendMode: "normal"
  });
  return sourceCanvas;
}

function getColorMatchDistance(data, pixelIndex, sample) {
  return Math.max(
    Math.abs(data[pixelIndex] - sample.red),
    Math.abs(data[pixelIndex + 1] - sample.green),
    Math.abs(data[pixelIndex + 2] - sample.blue),
    Math.abs(data[pixelIndex + 3] - sample.alpha)
  );
}

function createRegionMaskFromCanvas(sourceCanvas, point, options = {}) {
  if (!sourceCanvas || !point) {
    return null;
  }

  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  if (!width || !height) {
    return null;
  }

  const startX = clamp(Math.floor(point.x), 0, width - 1);
  const startY = clamp(Math.floor(point.y), 0, height - 1);
  const sourceContext = sourceCanvas.getContext("2d");
  const imageData = sourceContext.getImageData(0, 0, width, height);
  const { data } = imageData;
  const sampleIndex = (startY * width + startX) * 4;
  const sample = {
    red: data[sampleIndex],
    green: data[sampleIndex + 1],
    blue: data[sampleIndex + 2],
    alpha: data[sampleIndex + 3]
  };
  const tolerance = clamp(Number(options.tolerance) || 0, 0, 255);
  const contiguous = options.contiguous !== false;
  const maskCanvas = createFilledMaskCanvas(width, height, 0);
  const maskContext = maskCanvas.getContext("2d");
  const maskImageData = maskContext.getImageData(0, 0, width, height);
  const maskData = maskImageData.data;
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  let selectedCount = 0;

  const markSelected = (pixelOffset, pixelX, pixelY) => {
    maskData[pixelOffset] = 255;
    maskData[pixelOffset + 1] = 255;
    maskData[pixelOffset + 2] = 255;
    maskData[pixelOffset + 3] = 255;
    left = Math.min(left, pixelX);
    top = Math.min(top, pixelY);
    right = Math.max(right, pixelX);
    bottom = Math.max(bottom, pixelY);
    selectedCount += 1;
  };

  if (contiguous) {
    const visited = new Uint8Array(width * height);
    const stack = [startY * width + startX];

    while (stack.length) {
      const index = stack.pop();
      if (visited[index]) {
        continue;
      }

      visited[index] = 1;
      const x = index % width;
      const y = Math.floor(index / width);
      const pixelOffset = index * 4;
      if (getColorMatchDistance(data, pixelOffset, sample) > tolerance) {
        continue;
      }

      markSelected(pixelOffset, x, y);

      if (x > 0) {
        stack.push(index - 1);
      }
      if (x < width - 1) {
        stack.push(index + 1);
      }
      if (y > 0) {
        stack.push(index - width);
      }
      if (y < height - 1) {
        stack.push(index + width);
      }
    }
  } else {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const pixelOffset = (y * width + x) * 4;
        if (getColorMatchDistance(data, pixelOffset, sample) > tolerance) {
          continue;
        }

        markSelected(pixelOffset, x, y);
      }
    }
  }

  if (!selectedCount) {
    return null;
  }

  maskContext.putImageData(maskImageData, 0, 0);
  return {
    maskCanvas,
    bounds: {
      x: left,
      y: top,
      width: right - left + 1,
      height: bottom - top + 1
    },
    sample
  };
}

function drawDocumentCanvasToLayer(layer, sourceCanvas, options = {}) {
  if (!state.doc || !layer || !(sourceCanvas instanceof HTMLCanvasElement)) {
    return false;
  }

  const paintTarget = getLayerPaintTarget(layer);
  if (!paintTarget) {
    return false;
  }

  const scale = getLayerScale(layer);
  const center = getLayerCenter(layer);
  paintTarget.ctx.save();
  paintTarget.ctx.scale(scale.x, scale.y);
  paintTarget.ctx.translate(layer.width / 2, layer.height / 2);
  paintTarget.ctx.rotate(-getLayerRotationRadians(layer));
  paintTarget.ctx.translate(-center.x, -center.y);
  paintTarget.ctx.globalAlpha = options.opacity ?? 1;
  const requestedCompositeOperation = options.compositeOperation ?? "source-over";
  if (!paintTarget.isMask && isLayerTransparencyLocked(layer) && requestedCompositeOperation === "destination-out") {
    paintTarget.ctx.restore();
    return false;
  }
  paintTarget.ctx.globalCompositeOperation = !paintTarget.isMask && isLayerTransparencyLocked(layer) && requestedCompositeOperation === "source-over"
    ? "source-atop"
    : requestedCompositeOperation;
  paintTarget.ctx.drawImage(sourceCanvas, 0, 0, state.doc.width, state.doc.height);
  paintTarget.ctx.restore();
  if (!paintTarget.isMask) {
    layer.hasContent = true;
  }
  invalidateLayerRenderCaches(layer);
  return true;
}

function applySelectionMaskFillToLayer(layer, selectionMaskCanvas, fillStyle, opacity = 1) {
  if (!state.doc || !(selectionMaskCanvas instanceof HTMLCanvasElement)) {
    return false;
  }

  const fillCanvas = createDocumentRenderCanvas();
  const fillContext = fillCanvas?.getContext("2d");
  if (!fillCanvas || !fillContext) {
    return false;
  }

  fillContext.fillStyle = fillStyle;
  fillContext.globalAlpha = opacity;
  fillContext.fillRect(0, 0, state.doc.width, state.doc.height);
  fillContext.globalCompositeOperation = "destination-in";
  fillContext.drawImage(selectionMaskCanvas, 0, 0);
  fillContext.globalCompositeOperation = "source-over";
  return drawDocumentCanvasToLayer(layer, fillCanvas);
}

function applySelectionMaskClearToLayer(layer, selectionMaskCanvas) {
  return drawDocumentCanvasToLayer(layer, selectionMaskCanvas, {
    compositeOperation: "destination-out"
  });
}

function sampleCompositeColorAtDocPoint(point) {
  if (!state.doc || !isPointInsideDocument(point)) {
    return null;
  }

  const compositeCanvas = getRegionSampleSourceCanvas();
  if (!compositeCanvas) {
    return null;
  }
  const sampleContext = compositeCanvas.getContext("2d");
  const pixel = sampleContext.getImageData(
    clamp(Math.floor(point.x), 0, compositeCanvas.width - 1),
    clamp(Math.floor(point.y), 0, compositeCanvas.height - 1),
    1,
    1
  ).data;

  return rgbToHex(pixel[0], pixel[1], pixel[2]);
}

function applyEyedropperAtPoint(point) {
  const sampledColor = sampleCompositeColorAtDocPoint(point);
  if (!sampledColor) {
    return;
  }

  state.brushColor = sampledColor;
  updateColorInputs();
  refresh();
}

function getRegionSelectionAtPoint(point, layer = getActiveLayer(), options = {}) {
  if (!state.doc || !isPointInsideDocument(point)) {
    return null;
  }

  const sourceCanvas = getRegionSampleSourceCanvas({
    layer,
    useMask: isEditingLayerMask(layer),
    sourceMode: options.sourceMode
  });
  if (!sourceCanvas) {
    return null;
  }

  return createRegionMaskFromCanvas(sourceCanvas, point, {
    tolerance: state.regionTolerance,
    contiguous: state.regionContiguous
  });
}

function getConstrainedOperationMaskCanvas(maskCanvas) {
  const constrainedMaskCanvas = intersectMaskCanvasWithCurrentSelection(maskCanvas);
  if (!(constrainedMaskCanvas instanceof HTMLCanvasElement)) {
    return null;
  }

  return getNonTransparentPixelBounds(constrainedMaskCanvas) ? constrainedMaskCanvas : null;
}

function applyPaintBucketAtPoint(point) {
  const activeLayer = getActiveLayer();
  if (!activeLayer) {
    return;
  }

  if (isAdjustmentLayer(activeLayer) || !canModifyLayerPixels(activeLayer)) {
    void reportError(new Error("Adjustment layers cannot be filled."), "Select a raster, text, vector, or mask target for the paint bucket.");
    return;
  }

  const region = getRegionSelectionAtPoint(point, activeLayer, {
    sourceMode: "active"
  });
  if (!region) {
    return;
  }

  const operationMaskCanvas = getConstrainedOperationMaskCanvas(region.maskCanvas);
  if (!operationMaskCanvas) {
    return;
  }

  applySelectionMaskFillToLayer(
    activeLayer,
    operationMaskCanvas,
    isEditingLayerMask(activeLayer) ? "rgba(255, 255, 255, 1)" : state.brushColor,
    isEditingLayerMask(activeLayer) ? 1 : state.brushOpacity
  );
  pushHistory();
  refresh({ rebuildLayers: true });
}

function selectColorRangeAtPoint(point, options = {}) {
  const region = getRegionSelectionAtPoint(point);
  if (!region) {
    if ((options.combineMode ?? "replace") === "replace") {
      clearSelectionState();
    }
    refresh();
    return;
  }

  applySelectionMaskCanvas(region.maskCanvas, options.combineMode ?? "replace");
  closeContextMenus();
  refresh();
}

function selectMagicWandAtPoint(point, options = {}) {
  selectColorRangeAtPoint(point, options);
}

function applyMagicEraserAtPoint(point) {
  const activeLayer = getActiveLayer();
  if (!activeLayer) {
    return;
  }

  if (isAdjustmentLayer(activeLayer) || !canModifyLayerPixels(activeLayer)) {
    void reportError(new Error("Adjustment layers cannot be erased."), "Select a raster, text, vector, or mask target for the magic eraser.");
    return;
  }

  if (!isEditingLayerMask(activeLayer) && isLayerTransparencyLocked(activeLayer)) {
    return;
  }

  const region = getRegionSelectionAtPoint(point, activeLayer, {
    sourceMode: "active"
  });
  if (!region) {
    return;
  }

  const operationMaskCanvas = getConstrainedOperationMaskCanvas(region.maskCanvas);
  if (!operationMaskCanvas) {
    return;
  }

  applySelectionMaskClearToLayer(activeLayer, operationMaskCanvas);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function getGradientEndpointColors(layer) {
  if (isEditingLayerMask(layer)) {
    return {
      startColor: "rgba(255, 255, 255, 1)",
      endColor: "rgba(255, 255, 255, 0)"
    };
  }

  return {
    startColor: rgbaStringFromParts(state.brushColor, state.brushOpacity),
    endColor: rgbaStringFromParts(state.backgroundColor, state.brushOpacity, { red: 255, green: 255, blue: 255 })
  };
}

function createGradientFillCanvas(gradientDraft, layer) {
  if (!state.doc || !gradientDraft?.startPoint || !gradientDraft?.endPoint || !layer) {
    return null;
  }

  const fillCanvas = createDocumentRenderCanvas();
  const fillContext = fillCanvas?.getContext("2d");
  if (!fillCanvas || !fillContext) {
    return null;
  }

  const { startPoint, endPoint } = gradientDraft;
  let gradient = null;
  if ((gradientDraft.type ?? state.gradientType) === "radial") {
    gradient = fillContext.createRadialGradient(
      startPoint.x,
      startPoint.y,
      0,
      startPoint.x,
      startPoint.y,
      Math.max(Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y), 1)
    );
  } else {
    gradient = fillContext.createLinearGradient(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
  }

  const { startColor, endColor } = getGradientEndpointColors(layer);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  fillContext.fillStyle = gradient;
  fillContext.fillRect(0, 0, state.doc.width, state.doc.height);

  const selectionMaskCanvas = getSelectionMaskCanvas();
  if (selectionMaskCanvas) {
    fillContext.globalCompositeOperation = "destination-in";
    fillContext.drawImage(selectionMaskCanvas, 0, 0);
    fillContext.globalCompositeOperation = "source-over";
  }

  return fillCanvas;
}

function applyGradientDraft(gradientDraft) {
  const activeLayer = getActiveLayer();
  if (!activeLayer) {
    return;
  }

  if (isAdjustmentLayer(activeLayer) || !canModifyLayerPixels(activeLayer)) {
    void reportError(new Error("Adjustment layers cannot receive gradients."), "Select a raster, text, vector, or mask target for the gradient tool.");
    return;
  }

  const fillCanvas = createGradientFillCanvas(gradientDraft, activeLayer);
  if (!fillCanvas) {
    return;
  }

  drawDocumentCanvasToLayer(activeLayer, fillCanvas);
  closeContextMenus();
  pushHistory();
  refresh();
}

function getNonTransparentPixelBounds(sourceCanvas) {
  const sourceContext = sourceCanvas.getContext("2d");
  const imageData = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const { data } = imageData;
  let left = sourceCanvas.width;
  let top = sourceCanvas.height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < sourceCanvas.height; y += 1) {
    for (let x = 0; x < sourceCanvas.width; x += 1) {
      if (data[(y * sourceCanvas.width + x) * 4 + 3] === 0) {
        continue;
      }

      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }

  if (right === -1 || bottom === -1) {
    return null;
  }

  return {
    x: left,
    y: top,
    width: right - left + 1,
    height: bottom - top + 1
  };
}

function copyCanvasRegion(sourceCanvas, rect) {
  const nextCanvas = createCanvasElement(rect.width, rect.height);
  const nextContext = nextCanvas.getContext("2d");
  nextContext.drawImage(
    sourceCanvas,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    0,
    0,
    rect.width,
    rect.height
  );
  return nextCanvas;
}

function rasterizeLayerToCropCanvas(layer, cropRect, options = {}) {
  const scale = getLayerScale(layer);
  const nextCanvas = createCanvasElement(
    cropRect.width * Math.abs(scale.x),
    cropRect.height * Math.abs(scale.y)
  );
  const nextContext = nextCanvas.getContext("2d");

  drawLayerToContext(nextContext, layer, {
    canvasOffsetX: -cropRect.x * scale.x,
    canvasOffsetY: -cropRect.y * scale.y,
    scaleX: scale.x,
    scaleY: scale.y,
    opacity: 1,
    blendMode: "normal",
    applyMask: options.applyMask,
    sourceCanvas: options.sourceCanvas
  });

  return {
    canvas: nextCanvas,
    scale
  };
}

function cropLayerToDocumentRect(layer, cropRect) {
  if (!isBackgroundLayer(layer) && (isVectorLayer(layer) || isTextLayer(layer))) {
    layer.x -= cropRect.x;
    layer.y -= cropRect.y;
    return;
  }

  rasterizeVectorLayer(layer);
  const { canvas: croppedCanvas, scale } = rasterizeLayerToCropCanvas(layer, cropRect, {
    applyMask: false
  });
  const croppedMaskCanvas = hasLayerMask(layer)
    ? rasterizeLayerToCropCanvas(layer, cropRect, {
      sourceCanvas: layer.maskCanvas,
      applyMask: false
    }).canvas
    : null;
  const boundsSourceCanvas = croppedMaskCanvas
    ? applyMaskToSourceCanvas(croppedCanvas, croppedMaskCanvas)
    : croppedCanvas;

  if (isBackgroundLayer(layer)) {
    replaceLayerBitmap(layer, croppedCanvas);
    layer.x = 0;
    layer.y = 0;
    layer.width = cropRect.width;
    layer.height = cropRect.height;
    layer.rotation = 0;
    layer.hasContent = true;
    layer.isBackground = true;
    return;
  }

  const alphaBounds = getNonTransparentPixelBounds(boundsSourceCanvas);
  const scaleX = Math.max(Math.abs(scale.x), 0.0001);
  const scaleY = Math.max(Math.abs(scale.y), 0.0001);

  if (!alphaBounds) {
    replaceLayerBitmap(layer, createCanvasElement(1, 1));
    setLayerMaskCanvas(layer, croppedMaskCanvas ? createFilledMaskCanvas(1, 1, 0) : null);
    layer.x = 0;
    layer.y = 0;
    layer.width = Math.max(1, 1 / scaleX);
    layer.height = Math.max(1, 1 / scaleY);
    layer.rotation = 0;
    layer.hasContent = false;
    return;
  }

  replaceLayerBitmap(layer, copyCanvasRegion(croppedCanvas, alphaBounds));
  if (croppedMaskCanvas) {
    setLayerMaskCanvas(layer, copyCanvasRegion(croppedMaskCanvas, alphaBounds));
  }
  layer.x = alphaBounds.x / scaleX;
  layer.y = alphaBounds.y / scaleY;
  layer.width = alphaBounds.width / scaleX;
  layer.height = alphaBounds.height / scaleY;
  layer.rotation = 0;
  layer.hasContent = true;
}

async function commitCropSelection() {
  const cropRect = clampRectToDocument(getCropRect());
  if (!cropRect) {
    return;
  }

  const isFullDocumentCrop = (
    cropRect.x === 0
    && cropRect.y === 0
    && cropRect.width === state.doc.width
    && cropRect.height === state.doc.height
  );

  if (!isFullDocumentCrop) {
    const confirmed = await confirmCanvasClipping(
      "Crop Canvas",
      "Cropping will permanently trim the canvas and any layer pixels outside the crop area. Continue?",
      "Apply Crop"
    );
    if (!confirmed) {
      return;
    }
  }

  cropToSelection();
}

function cropToSelection() {
  const cropRect = clampRectToDocument(getCropRect());

  if (!cropRect) {
    return;
  }

  if (
    cropRect.x === 0
    && cropRect.y === 0
    && cropRect.width === state.doc.width
    && cropRect.height === state.doc.height
  ) {
    state.cropRect = null;
    refresh();
    return;
  }

  for (const layer of state.doc.layers) {
    cropLayerToDocumentRect(layer, cropRect);
  }

  state.doc.width = cropRect.width;
  state.doc.height = cropRect.height;
  normalizeDocument(state.doc);
  clearSelectionState();
  state.cropRect = null;
  state.clipToDocument = false;
  fitToStage();
  pushHistory();
  refresh({ rebuildLayers: true });
}

function applyFilter(transform) {
  const activeLayer = getActiveLayer();

  if (!activeLayer) {
    return;
  }

  if (isAdjustmentLayer(activeLayer) || !canModifyLayerPixels(activeLayer)) {
    void reportError(new Error("Adjustment layers are already non-destructive."), "Use the Layer menu to add a non-destructive adjustment layer instead.");
    return;
  }

  flattenLayerKindsToRaster(activeLayer);

  const imageData = activeLayer.ctx.getImageData(0, 0, activeLayer.canvas.width, activeLayer.canvas.height);
  transform(imageData.data);
  activeLayer.ctx.putImageData(imageData, 0, 0);
  invalidateLayerRenderCaches(activeLayer);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function addLayer() {
  const nextName = `Layer ${state.doc.layers.length}`;
  const layer = createLayer(nextName, state.doc.width, state.doc.height, {
    groupId: getDefaultLayerGroupIdForNewLayer()
  });
  insertLayersAfterActiveLayer([layer]);
  selectSingleLayer(layer.id);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function duplicateLayerInstance(sourceLayer) {
  const duplicate = createLayer(`${sourceLayer.name} Copy`, sourceLayer.canvas.width, sourceLayer.canvas.height, {
    visible: sourceLayer.visible,
    opacity: sourceLayer.opacity,
    blendMode: sourceLayer.blendMode,
    locked: false,
    lockTransparentPixels: sourceLayer.lockTransparentPixels === true,
    lockImagePixels: sourceLayer.lockImagePixels === true,
    lockPosition: sourceLayer.lockPosition === true,
    lockGeneratedPixels: sourceLayer.lockGeneratedPixels === true,
    linked: sourceLayer.linked === true,
    layerEffects: sourceLayer.layerEffects ? { ...sourceLayer.layerEffects } : {},
    groupId: sourceLayer.groupId,
    hasContent: sourceLayer.hasContent,
    isBackground: sourceLayer.isBackground === true,
    layerKind: sourceLayer.layerKind,
    vectorSource: sourceLayer.vectorSource,
    vectorIntrinsicWidth: sourceLayer.vectorIntrinsicWidth,
    vectorIntrinsicHeight: sourceLayer.vectorIntrinsicHeight,
    vectorImage: sourceLayer.vectorImage,
    vectorStyle: sourceLayer.vectorStyle ? { ...sourceLayer.vectorStyle } : null,
    vectorStyleSummary: sourceLayer.vectorStyleSummary ? { ...sourceLayer.vectorStyleSummary } : null,
    textContent: sourceLayer.textContent,
    textStyle: sourceLayer.textStyle ? { ...sourceLayer.textStyle } : null,
    adjustmentType: sourceLayer.adjustmentType,
    adjustmentSettings: sourceLayer.adjustmentSettings ? { ...sourceLayer.adjustmentSettings } : null,
    x: sourceLayer.x,
    y: sourceLayer.y,
    width: sourceLayer.width,
    height: sourceLayer.height,
    rotation: sourceLayer.rotation,
    clippedToBelow: sourceLayer.clippedToBelow === true,
    maskCanvas: hasLayerMask(sourceLayer) ? sourceLayer.maskCanvas : null
  });
  if (isVectorLayer(duplicate)) {
    duplicate.vectorSource = remapVectorClearMaskIds(duplicate.vectorSource, sourceLayer.id, duplicate.id);
    duplicate.vectorStyleSummary = getVectorStyleSummaryFromSvgSource(duplicate.vectorSource, duplicate.vectorStyle);
    duplicate.vectorStyle = ensureVectorStyle(duplicate.vectorStyleSummary);
    renderVectorLayerBitmap(duplicate, duplicate.width, duplicate.height);
  } else {
    duplicate.ctx.drawImage(sourceLayer.canvas, 0, 0);
  }
  constrainLayerToCanvas(duplicate);
  return duplicate;
}

function duplicateSelectedLayers() {
  const selectedLayers = getSelectedEditableLayers();
  if (!selectedLayers.length) {
    return;
  }

  const selectedLayerIdSet = new Set(selectedLayers.map((layer) => layer.id));
  const duplicates = selectedLayers.map((layer) => duplicateLayerInstance(layer));
  const highestSelectedIndex = Math.max(...state.doc.layers
    .map((layer, index) => selectedLayerIdSet.has(layer.id) ? index : -1)
    .filter((index) => index !== -1));

  state.doc.layers.splice(highestSelectedIndex + 1, 0, ...duplicates);
  pruneInvalidLayerClipping(state.doc);
  setLayerSelection(duplicates.map((layer) => layer.id), {
    activeLayerId: duplicates.at(-1)?.id ?? null,
    anchorId: duplicates[0]?.id ?? null
  });
  pushHistory();
  refresh({ rebuildLayers: true });
}

function moveActiveLayer(direction) {
  const activeLayer = getActiveLayer();
  if (!activeLayer) {
    return;
  }

  reorderLayerByAction(activeLayer.id, direction > 0 ? "forward" : "backward");
}

function deleteSelectedLayers() {
  const selectedLayers = getSelectedEditableLayers();
  if (!selectedLayers.length || state.doc.layers.length - selectedLayers.length < 1) {
    return;
  }

  const selectedLayerIdSet = new Set(selectedLayers.map((layer) => layer.id));
  const selectedIndices = state.doc.layers
    .map((layer, index) => selectedLayerIdSet.has(layer.id) ? index : -1)
    .filter((index) => index !== -1);
  const nextActiveCandidateIndex = Math.max(0, Math.min(...selectedIndices) - 1);

  state.doc.layers = state.doc.layers.filter((layer) => !selectedLayerIdSet.has(layer.id));
  pruneDocumentLayerGroups(state.doc);
  pruneInvalidLayerClipping(state.doc);
  state.collapsedLayerGroups = pruneCollapsedLayerGroupState(state.doc, state.collapsedLayerGroups);
  selectSingleLayer(state.doc.layers[nextActiveCandidateIndex]?.id ?? state.doc.layers.at(-1)?.id ?? null);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function canMoveLayer(layer, direction) {
  return canReorderLayerByAction(layer?.id ?? null, direction > 0 ? "forward" : "backward");
}

async function confirmDeleteActiveLayer() {
  const selectedLayers = getSelectedEditableLayers();
  if (!selectedLayers.length || state.doc.layers.length - selectedLayers.length < 1) {
    return;
  }

  const confirmed = await confirmDialog({
    title: selectedLayers.length > 1 ? "Delete Layers" : "Delete Layer",
    message: selectedLayers.length > 1
      ? `Delete ${selectedLayers.length} selected layers? This cannot be undone without using Undo.`
      : `Delete ${selectedLayers[0].name}? This cannot be undone without using Undo.`,
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    confirmClassName: "is-danger",
    closeOnOverlay: false
  });

  if (!confirmed) {
    return;
  }

  deleteSelectedLayers();
}

function toggleLayerVisibility(layerId) {
  const layer = state.doc.layers.find((entry) => entry.id === layerId);
  if (!layer) {
    return;
  }

  layer.visible = !layer.visible;
  pushHistory();
  refresh({ rebuildLayers: true });
}

function getLayerLockProperty(lockType) {
  return {
    transparent: "lockTransparentPixels",
    pixels: "lockImagePixels",
    position: "lockPosition",
    image: "lockGeneratedPixels",
    all: "locked"
  }[lockType] ?? "";
}

function getLockableSelectedLayers() {
  return getSelectedLayers().filter((layer) => !isBackgroundLayer(layer));
}

function toggleSelectedLayerLock(lockType) {
  const property = getLayerLockProperty(lockType);
  const layers = getLockableSelectedLayers();
  if (!property || !layers.length) {
    refresh();
    return;
  }

  const shouldEnable = !layers.every((layer) => layer[property] === true);
  for (const layer of layers) {
    layer[property] = shouldEnable;
  }

  pushHistory();
  refresh({ rebuildLayers: true });
}

function toggleSelectedLayersLinked() {
  const layers = getLockableSelectedLayers();
  if (layers.length < 2) {
    refresh();
    return;
  }

  const shouldLink = !layers.every((layer) => layer.linked === true);
  for (const layer of layers) {
    layer.linked = shouldLink;
  }

  pushHistory();
  refresh({ rebuildLayers: true });
}

function toggleSelectedLayerStyle() {
  const layers = getSelectedEditableLayers();
  if (!layers.length) {
    refresh();
    return;
  }

  const shouldEnable = !layers.every((layer) => layer.layerEffects?.dropShadow === true);
  for (const layer of layers) {
    layer.layerEffects = {
      ...(layer.layerEffects || {}),
      dropShadow: shouldEnable
    };
  }

  pushHistory();
  refresh({ rebuildLayers: true });
}

function renameLayer(layerId, nextName) {
  const layer = state.doc.layers.find((entry) => entry.id === layerId);
  if (!layer) {
    return;
  }

  const normalizedName = String(nextName || "").trim() || "Layer";
  if (normalizedName === layer.name) {
    refresh();
    return;
  }

  layer.name = normalizedName;
  pushHistory();
  refresh({ rebuildLayers: true });
}

function nextGeneratedLayerGroupName() {
  const baseName = "Group";
  const usedNames = new Set(getDocumentLayerGroups().map((group) => group.name));

  if (!usedNames.has(baseName)) {
    return baseName;
  }

  let index = 2;
  while (usedNames.has(`${baseName} ${index}`)) {
    index += 1;
  }

  return `${baseName} ${index}`;
}

function groupSelectedLayers() {
  const selectedLayers = getSelectedEditableLayers();
  if (!selectedLayers.length || selectedLayers.some((layer) => layer.groupId)) {
    return;
  }

  state.doc.layerGroups = getDocumentLayerGroups(state.doc);
  const group = normalizeLayerGroup({ name: nextGeneratedLayerGroupName() });
  const selectedLayerIdSet = new Set(selectedLayers.map((layer) => layer.id));
  const selectedIndices = state.doc.layers
    .map((layer, index) => selectedLayerIdSet.has(layer.id) ? index : -1)
    .filter((index) => index !== -1);
  const highestSelectedIndex = Math.max(...selectedIndices);
  const selectedLayersInDocOrder = state.doc.layers.filter((layer) => selectedLayerIdSet.has(layer.id));
  const remainingLayers = state.doc.layers.filter((layer) => !selectedLayerIdSet.has(layer.id));
  let insertIndex = 0;

  for (let index = highestSelectedIndex - 1; index >= 0; index -= 1) {
    const candidateLayer = state.doc.layers[index];
    if (selectedLayerIdSet.has(candidateLayer.id)) {
      continue;
    }
    insertIndex = remainingLayers.findIndex((layer) => layer.id === candidateLayer.id) + 1;
    break;
  }

  remainingLayers.splice(insertIndex, 0, ...selectedLayersInDocOrder);
  state.doc.layers = remainingLayers;
  for (const layer of selectedLayersInDocOrder) {
    layer.groupId = group.id;
  }
  state.doc.layerGroups.push(group);
  pruneInvalidLayerClipping(state.doc);
  state.collapsedLayerGroups = pruneCollapsedLayerGroupState(state.doc, state.collapsedLayerGroups);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function removeSelectedLayersFromGroups() {
  const selectedLayers = getSelectedEditableLayers().filter((layer) => layer.groupId);
  if (!selectedLayers.length) {
    return;
  }

  for (const layer of selectedLayers) {
    layer.groupId = null;
  }
  pruneDocumentLayerGroups(state.doc);
  pruneInvalidLayerClipping(state.doc);
  state.collapsedLayerGroups = pruneCollapsedLayerGroupState(state.doc, state.collapsedLayerGroups);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function toggleLayerGroupVisibility(groupId) {
  const group = getLayerGroup(groupId);
  if (!group) {
    return;
  }

  group.visible = !group.visible;
  pushHistory();
  refresh({ rebuildLayers: true });
}

function toggleLayerGroupCollapsed(groupId) {
  if (!getLayerGroup(groupId)) {
    return;
  }

  state.collapsedLayerGroups[groupId] = !isLayerGroupCollapsed(groupId);
  state.collapsedLayerGroups = pruneCollapsedLayerGroupState(state.doc, state.collapsedLayerGroups);
  syncActiveDocumentSession();
  renderLayers();
}

function renameLayerGroup(groupId, nextName) {
  const group = getLayerGroup(groupId);
  if (!group) {
    return;
  }

  const normalizedName = String(nextName || "").trim() || "Group";
  if (normalizedName === group.name) {
    refresh();
    return;
  }

  group.name = normalizedName;
  pushHistory();
  refresh({ rebuildLayers: true });
}

function setLayerOpacity(layerId, nextOpacity, options = {}) {
  const layer = state.doc.layers.find((entry) => entry.id === layerId);
  if (!layer) {
    return;
  }

  if (isLayerFullyLocked(layer)) {
    refresh();
    return;
  }

  const parsedOpacity = Number(nextOpacity);
  if (!Number.isFinite(parsedOpacity)) {
    refresh();
    return;
  }

  layer.opacity = clamp(parsedOpacity / 100, 0, 1);

  if (options.commit) {
    pushHistory();
    refresh({ rebuildLayers: true });
    return;
  }

  refresh();
}

function setActiveLayerOpacityFromControl(rawValue, options = {}) {
  const activeLayer = getActiveLayer();
  if (!activeLayer || isLayerFullyLocked(activeLayer)) {
    refresh();
    return;
  }

  const normalizedValue = String(rawValue).trim();
  if (!normalizedValue) {
    return;
  }

  const parsed = Math.round(clamp(Number(normalizedValue), 0, 100));
  if (!Number.isFinite(parsed)) {
    refresh();
    return;
  }

  ui.layerOpacityValue.textContent = `${parsed}%`;
  syncInputValue(ui.layerOpacity, String(parsed));
  syncInputValue(ui.layerOpacitySlider, String(parsed));
  setLayerOpacity(activeLayer.id, parsed, options);
}

function showLayerOpacityPopover() {
  if (!ui.layerOpacityPopover || ui.layerOpacity.disabled) {
    return;
  }

  ui.layerOpacityPopover.hidden = false;
}

function hideLayerOpacityPopover() {
  if (ui.layerOpacityPopover) {
    ui.layerOpacityPopover.hidden = true;
  }
}

function getMaxInspectorWidth() {
  const mainWidth = ui.appMain?.getBoundingClientRect().width || 0;
  return Math.max(limits.inspectorMinWidth, Math.min(limits.inspectorMaxWidth, mainWidth - 360));
}

function applyInspectorWidth(width) {
  const maxWidth = getMaxInspectorWidth();
  state.inspectorWidth = Math.round(clamp(Number(width) || limits.inspectorMinWidth, limits.inspectorMinWidth, maxWidth));
  ui.appMain?.style.setProperty("--inspector-width", `${state.inspectorWidth}px`);
}

function beginInspectorResize(event) {
  if (!ui.appMain) {
    return;
  }

  event.preventDefault();
  state.inspectorResize = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startWidth: state.inspectorWidth
  };
  document.body.classList.add("is-inspector-resizing");
  ui.inspectorResizeHandle.setPointerCapture(event.pointerId);
}

function updateInspectorResize(event) {
  if (!state.inspectorResize || state.inspectorResize.pointerId !== event.pointerId) {
    return;
  }

  applyInspectorWidth(state.inspectorResize.startWidth + (state.inspectorResize.startX - event.clientX));
  resizeCanvas();
}

function endInspectorResize(event) {
  if (!state.inspectorResize || state.inspectorResize.pointerId !== event.pointerId) {
    return;
  }

  state.inspectorResize = null;
  document.body.classList.remove("is-inspector-resizing");
  resizeCanvas();
}

function setActiveAdjustmentSetting(field, rawValue, options = {}) {
  const activeLayer = getActiveLayer();
  if (!isAdjustmentLayer(activeLayer)) {
    refresh();
    return;
  }

  const defaults = getDefaultAdjustmentSettings(activeLayer.adjustmentType);
  if (!hasOwn(defaults, field)) {
    refresh();
    return;
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    refresh();
    return;
  }

  activeLayer.adjustmentSettings = {
    ...getAdjustmentSettings(activeLayer),
    [field]: normalizeAdjustmentSettingValue(field, parsed)
  };

  if (options.commit) {
    pushHistory();
    refresh();
    return;
  }

  refresh();
}

function setLayerBlendMode(layerId, nextBlendMode) {
  const layer = state.doc.layers.find((entry) => entry.id === layerId);
  if (!layer) {
    return;
  }

  if (isAdjustmentLayer(layer) || isLayerFullyLocked(layer)) {
    refresh();
    return;
  }

  const normalizedBlendMode = normalizeBlendMode(nextBlendMode);
  if (layer.blendMode === normalizedBlendMode) {
    refresh();
    return;
  }

  layer.blendMode = normalizedBlendMode;
  pushHistory();
  refresh({ rebuildLayers: true });
}

function setActiveLayerTransform(field, rawValue) {
  const activeLayer = getActiveLayer();
  if (!canTransformLayer(activeLayer)) {
    return;
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    refresh();
    return;
  }

  const nextValue = field === "width" || field === "height"
    ? Math.max(1, Math.round(parsed))
    : Math.round(parsed);

  const normalizedValue = field === "rotation" ? normalizeAngle(nextValue) : nextValue;

  if (isTextLayer(activeLayer) && field === "height") {
    refresh();
    return;
  }

  if (isTextLayer(activeLayer) && field === "width") {
    const currentStyle = ensureTextStyle(activeLayer.textStyle);
    const nextBoxWidth = Math.max(32, normalizedValue);
    if (currentStyle.boxWidth === nextBoxWidth) {
      refresh();
      return;
    }

    activeLayer.textStyle = {
      ...currentStyle,
      boxWidth: nextBoxWidth
    };
    renderTextLayerBitmap(activeLayer);
    constrainLayerToCanvas(activeLayer);
    if (state.textEditorLayerId === activeLayer.id) {
      positionTextEditor(activeLayer);
    }
    pushHistory();
    refresh({ rebuildLayers: true });
    return;
  }

  if (isVectorLayer(activeLayer) && (field === "width" || field === "height")) {
    const nextWidth = field === "width" ? normalizedValue : activeLayer.width;
    const nextHeight = field === "height" ? normalizedValue : activeLayer.height;
    if (Math.abs(activeLayer.width - nextWidth) <= 0.01 && Math.abs(activeLayer.height - nextHeight) <= 0.01) {
      refresh();
      return;
    }

    activeLayer.width = nextWidth;
    activeLayer.height = nextHeight;
    renderVectorLayerBitmap(activeLayer, nextWidth, nextHeight);
    constrainLayerToCanvas(activeLayer);
    pushHistory();
    refresh({ rebuildLayers: true });
    return;
  }

  if (activeLayer[field] === normalizedValue) {
    refresh();
    return;
  }

  activeLayer[field] = normalizedValue;
  constrainLayerToCanvas(activeLayer);
  pushHistory();
  refresh({ rebuildLayers: true });
}

function fileExtension(name = "") {
  return String(name).includes(".") ? String(name).split(".").at(-1).toLowerCase() : "";
}

function isSupportedImageFile(file) {
  if (!file) {
    return false;
  }

  return supportedImportMimeTypes.has(file.type) || supportedImportExtensions.has(fileExtension(file.name));
}

function isSvgFile(file) {
  return file?.type === "image/svg+xml" || fileExtension(file?.name) === "svg";
}

function createRasterExportCanvas(settings = {}, background = null) {
  const exportTarget = getExportTargetDefinition(settings.targetKey);
  return composeCompositeCanvas(background, settings.width, settings.height, exportTarget);
}

function createRasterExportDataUrl(format, settings = {}, exportCanvas = null) {
  const canvas = exportCanvas ?? createRasterExportCanvas(settings, format.background ?? null);
  const quality = Number.isFinite(settings.quality)
    ? clamp(settings.quality / 100, 0.01, 1)
    : format.quality;
  const dataUrl = canvas.toDataURL(format.mimeType, quality);

  if (!dataUrl.startsWith(`data:${format.mimeType}`)) {
    throw new Error(`${format.label} export is not available in this runtime.`);
  }

  return dataUrl;
}

function createSvgLayerMarkup(layer, exportRect) {
  if (isLayerClippedToBelow(layer)) {
    const rasterCanvas = createCanvasElement(exportRect.width, exportRect.height);
    const rasterContext = rasterCanvas.getContext("2d");
    drawRenderableLayerToContext(rasterContext, layer, {
      docOffsetX: exportRect.x,
      docOffsetY: exportRect.y,
      opacity: 1,
      blendMode: "normal"
    });

    const opacity = round(layer.opacity, 3);
    const blendMode = getCssBlendMode(layer.blendMode);
    const opacityAttribute = opacity < 1 ? ` opacity="${opacity}"` : "";
    const blendAttribute = blendMode !== "normal" ? ` style="mix-blend-mode:${blendMode}"` : "";
    const href = rasterCanvas.toDataURL("image/png");
    return `    <g${opacityAttribute}${blendAttribute}><image href="${href}" x="0" y="0" width="${round(exportRect.width, 3)}" height="${round(exportRect.height, 3)}" preserveAspectRatio="none" /></g>`;
  }

  const center = getLayerCenter(layer);
  const opacity = round(layer.opacity, 3);
  const blendMode = getCssBlendMode(layer.blendMode);
  const transforms = [
    `translate(${round(center.x - exportRect.x, 3)} ${round(center.y - exportRect.y, 3)})`
  ];

  if (Math.abs(layer.rotation) > 0.001) {
    transforms.push(`rotate(${round(layer.rotation, 3)})`);
  }

  transforms.push(`translate(${round(-layer.width / 2, 3)} ${round(-layer.height / 2, 3)})`);

  const opacityAttribute = opacity < 1 ? ` opacity="${opacity}"` : "";
  const blendAttribute = blendMode !== "normal" ? ` style="mix-blend-mode:${blendMode}"` : "";
  if (isVectorLayer(layer) && !hasLayerMask(layer)) {
    const intrinsic = getVectorIntrinsicSize(layer);
    return `    <g${opacityAttribute}${blendAttribute} transform="${transforms.join(" ")}"><g transform="scale(${round(layer.width / intrinsic.width, 6)} ${round(layer.height / intrinsic.height, 6)})">${layer.vectorSource}</g></g>`;
  }

  const href = getLayerDrawableCanvas(layer).toDataURL("image/png");
  return `    <g${opacityAttribute}${blendAttribute} transform="${transforms.join(" ")}"><image href="${href}" width="${round(layer.width, 3)}" height="${round(layer.height, 3)}" preserveAspectRatio="none" /></g>`;
}

function createSvgExportContents(settings = {}) {
  const exportTarget = getExportTargetDefinition(settings.targetKey);
  const contentRect = exportTarget.rect;
  const exportWidth = Math.max(1, Math.round(settings.width ?? contentRect.width));
  const exportHeight = Math.max(1, Math.round(settings.height ?? contentRect.height));
  if (exportTarget.layers.some((layer) => isAdjustmentLayer(layer))) {
    const rasterCanvas = createRasterExportCanvas({
      ...settings,
      targetKey: exportTarget.key
    });
    const href = rasterCanvas.toDataURL("image/png");
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 ${contentRect.width} ${contentRect.height}">`,
      `  <image href="${href}" x="0" y="0" width="${contentRect.width}" height="${contentRect.height}" preserveAspectRatio="none" />`,
      "</svg>"
    ].join("\n");
  }

  const layerMarkup = exportTarget.layers
    .map((layer) => createSvgLayerMarkup(layer, contentRect))
    .filter(Boolean)
    .join("\n");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 ${contentRect.width} ${contentRect.height}">`,
    '  <defs>',
    '    <clipPath id="doc-clip">',
    `      <rect x="0" y="0" width="${contentRect.width}" height="${contentRect.height}" />`,
    "    </clipPath>",
    "  </defs>",
    '  <g clip-path="url(#doc-clip)">',
    layerMarkup,
    "  </g>",
    "</svg>"
  ].join("\n");
}

async function openExportDialog(initialFormatKey = getSelectedExportFormat()) {
  if (!state.doc) {
    return;
  }

  const settings = await promptForExportSettings(initialFormatKey);
  if (!settings) {
    return;
  }

  await exportImage(settings);
}

async function exportImage(settings = null) {
  try {
    const bridge = getTauriBridge();
    const exportSettings = settings ?? await promptForExportSettings();
    if (!exportSettings) {
      return;
    }

    const formatKey = exportSettings.formatKey;
    const format = exportFormats[formatKey];
    const suggestedStem = sanitizeFileStem(state.projectName || "photoshop-project");
    const suggestedPath = `${suggestedStem}.${format.extension}`;

    if (formatKey === "svg") {
      const contents = createSvgExportContents(exportSettings);

      if (bridge.invoke) {
        const selectedPath = await pickSavePath(
          suggestedPath,
          format.filters,
          `${format.label} export path`
        );

        if (!selectedPath) {
          return;
        }

        if (await doesPathExist(selectedPath)) {
          const shouldOverwrite = await confirmOverwritePath(selectedPath, "export");
          if (!shouldOverwrite) {
            return;
          }
        }

        await invokeTauri("save_text_to_path", {
          path: selectedPath,
          contents,
          extension: format.extension
        });
        return;
      }

      downloadTextFile(suggestedPath, contents, format.mimeType);
      return;
    }

    if (formatKey === "avif" && bridge.invoke) {
      const selectedPath = await pickSavePath(
        suggestedPath,
        format.filters,
        `${format.label} export path`
      );

      if (!selectedPath) {
        return;
      }

      if (await doesPathExist(selectedPath)) {
        const shouldOverwrite = await confirmOverwritePath(selectedPath, "export");
        if (!shouldOverwrite) {
          return;
        }
      }

      const exportCanvas = createRasterExportCanvas(exportSettings, format.background ?? null);
      const sourceDataUrl = createRasterExportDataUrl(exportFormats.png, exportSettings, exportCanvas);
      await invokeTauri("export_avif_data_url_to_path", {
        path: selectedPath,
        dataUrl: sourceDataUrl,
        quality: exportSettings.quality
      });
      return;
    }

    const dataUrl = createRasterExportDataUrl(format, exportSettings);

    if (bridge.invoke) {
      const selectedPath = await pickSavePath(
        suggestedPath,
        format.filters,
        `${format.label} export path`
      );

      if (!selectedPath) {
        return;
      }

      if (await doesPathExist(selectedPath)) {
        const shouldOverwrite = await confirmOverwritePath(selectedPath, "export");
        if (!shouldOverwrite) {
          return;
        }
      }

      await invokeTauri("export_data_url_to_path", {
        path: selectedPath,
        dataUrl,
        extension: format.extension
      });
      return;
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = suggestedPath;
    link.click();
  } catch (error) {
    await reportError(error, "Unable to export the image.");
  }
}

async function importFile(file) {
  if (!file) {
    return;
  }

  if (!isSupportedImageFile(file)) {
    throw new Error("Unsupported image type. Use PNG, JPG, WebP, AVIF, or SVG.");
  }

  if (isSvgFile(file)) {
    const svgSource = await file.text();
    await addVectorLayer(svgSource, withoutExtension(file.name) || "SVG");
    return;
  }

  const url = URL.createObjectURL(file);

  try {
    const image = await loadImage(url);
    addImageAsLayer(image, withoutExtension(file.name) || "Image");
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function importProjectFile(file) {
  if (!file) {
    return;
  }

  const projectJson = await file.text();
  await loadProjectPayload(projectJson, {
    projectName: withoutExtension(file.name) || "Project",
    projectPath: null
  });
}

async function saveProject(options = {}) {
  try {
    const bridge = getTauriBridge();
    const projectJson = buildProjectPayload();
    const suggestedStem = sanitizeFileStem(state.projectName || "photoshop-project");
    const forceChoosePath = options.forceChoosePath === true;

    if (bridge.invoke) {
      let targetPath = state.projectPath;

      if (!targetPath || forceChoosePath) {
        targetPath = await pickSavePath(
          state.projectPath || `${suggestedStem}.raster`,
          [{ name: "Photoshop Project", extensions: ["raster"] }],
          "Project path to save"
        );

        if (!targetPath) {
          return false;
        }

        const normalizedTargetPath = ensureProjectSavePath(targetPath);
        if (await doesPathExist(normalizedTargetPath) && normalizedTargetPath !== state.projectPath) {
          const shouldOverwrite = await confirmOverwritePath(normalizedTargetPath, "project");
          if (!shouldOverwrite) {
            return false;
          }
        }
      }

      const savedPath = await invokeTauri("save_project_to_path", {
        path: targetPath,
        projectJson
      });

      state.projectPath = savedPath;
      state.projectName = withoutExtension(basename(savedPath)) || state.projectName;
      markCurrentDocumentSaved();
      updateDocumentTitle();
      refresh();
      return true;
    }

    state.projectPath = null;
    state.projectName = suggestedStem;
    markCurrentDocumentSaved();
    updateDocumentTitle();
    downloadTextFile(`${suggestedStem}.raster`, projectJson);
    refresh();
    return true;
  } catch (error) {
    await reportError(error, "Unable to save project.");
    return false;
  }
}

async function openProject() {
  try {
    const bridge = getTauriBridge();
    if (bridge.invoke) {
      const selectedPath = await pickProjectOpenPath(state.projectPath || `${sanitizeFileStem(state.projectName || "photoshop-project")}.raster`);

      if (!selectedPath) {
        return;
      }

      const projectJson = await invokeTauri("load_project_from_path", {
        path: selectedPath
      });

      await loadProjectPayload(projectJson, {
        projectName: withoutExtension(basename(selectedPath)) || "Project",
        projectPath: selectedPath
      });
      return;
    }

    projectInput.click();
  } catch (error) {
    await reportError(error, "Unable to open project.");
  }
}

function beginInteraction(event) {
  if (!state.doc || state.pointer.mode) {
    return;
  }

  if (![0, 1].includes(event.button)) {
    return;
  }

  stage.focus();
  const canvasPoint = clientToCanvasPoint(event.clientX, event.clientY);
  const docPoint = canvasToDocPoint(canvasPoint);
  state.hoverCanvasPoint = canvasPoint;
  state.hoverDocPoint = docPoint;
  closeContextMenus();

  const tool = event.button === 1 ? "move" : (state.transientTool || state.tool);

  if (tool === "move" || event.button === 1) {
    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = docPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = docPoint;
    state.pointer.startLayerRect = null;
    state.pointer.resizeHandle = null;
    state.pointer.mutated = false;
    state.pointer.mode = "pan";
    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "transform") {
    const activeLayer = getActiveLayer();
    const hitLayer = getTopmostVisibleLayerAtDocPoint(docPoint, { includeBackground: true });
    const activeTarget = event.button === 0 ? getLayerTransformTarget(canvasPoint, activeLayer) : null;
    const activeHandleTarget = activeTarget?.type && activeTarget.type !== "body" ? activeTarget : null;
    const targetLayer = hitLayer && !activeHandleTarget ? hitLayer : activeLayer;
    if (targetLayer?.id && targetLayer.id !== state.activeLayerId) {
      setActiveLayerId(targetLayer.id);
    }
    const transformTarget = event.button === 0 && canTransformLayer(targetLayer)
      ? getLayerTransformTarget(canvasPoint, targetLayer)
      : null;

    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = docPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = docPoint;
    state.pointer.startLayerRect = targetLayer ? cloneLayerRect(targetLayer) : null;
    state.pointer.startLayerRotation = targetLayer?.rotation ?? 0;
    state.pointer.vectorHandle = null;
    state.pointer.vectorEditSnapshot = null;
    state.pointer.resizeHandle = transformTarget?.handle ?? null;
    state.pointer.mutated = false;
    state.pointer.mode = !transformTarget
      ? "pan"
      : (transformTarget.type === "resize"
        ? "resize-layer"
        : (transformTarget.type === "rotate" ? "rotate-layer" : "move-layer"));
    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "direct") {
    const hitLayer = getTopmostVisibleLayerAtDocPoint(docPoint, { includeBackground: true });
    if (hitLayer?.id && hitLayer.id !== state.activeLayerId) {
      setActiveLayerId(hitLayer.id);
    }

    const targetLayer = hitLayer ?? getActiveLayer();
    const vectorHandle = event.button === 0 ? getVectorHandleTarget(canvasPoint, targetLayer) : null;

    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = docPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = docPoint;
    state.pointer.startLayerRect = targetLayer ? cloneLayerRect(targetLayer) : null;
    state.pointer.startLayerRotation = targetLayer?.rotation ?? 0;
    state.pointer.resizeHandle = null;
    state.pointer.vectorHandle = vectorHandle;
    state.pointer.vectorEditSnapshot = vectorHandle && targetLayer
      ? {
        vectorSource: targetLayer.vectorSource,
        x: targetLayer.x,
        y: targetLayer.y,
        width: targetLayer.width,
        height: targetLayer.height,
        rotation: targetLayer.rotation,
        vectorIntrinsicWidth: targetLayer.vectorIntrinsicWidth,
        vectorIntrinsicHeight: targetLayer.vectorIntrinsicHeight
      }
      : null;
    state.pointer.mutated = false;
    state.pointer.mode = vectorHandle
      ? "edit-vector"
      : (!canTransformLayer(targetLayer) ? "pan" : "move-layer");
    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "brush" || tool === "eraser" || tool === "pencil") {
    const activeLayer = getActiveLayer();
    if (isAdjustmentLayer(activeLayer) || !canModifyLayerPixels(activeLayer)) {
      void reportError(new Error("Adjustment layers cannot be painted."), "Select a raster layer to paint, or edit a layer mask.");
      return;
    }
    if (!activeLayer || !isDocPointInsideLayer(activeLayer, docPoint)) {
      return;
    }
    if (tool === "eraser" && !isEditingLayerMask(activeLayer) && isLayerTransparencyLocked(activeLayer)) {
      return;
    }

    const point = clampDocPointToLayer(activeLayer, docPoint);
    if (event.shiftKey && canUseStraightPaintLine(activeLayer, tool)) {
      drawStrokeSegment(activeLayer, state.lastPaintStroke.point, point);
      state.lastPaintStroke = {
        layerId: activeLayer.id,
        point,
        tool,
        isMask: isEditingLayerMask(activeLayer)
      };
      pushHistory();
      refresh({ rebuildLayers: true });
      return;
    }

    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = docPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.mode = "paint";
    drawStrokeSegment(activeLayer, point, point);
    state.pointer.lastDoc = point;
    state.pointer.startLayerRect = null;
    state.pointer.resizeHandle = null;
    state.pointer.mutated = true;
    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "crop") {
    const cropTarget = getCropSelectionTarget(canvasPoint);
    if (!cropTarget && !isPointInsideDocument(docPoint)) {
      return;
    }

    const point = clampDocPoint(docPoint);

    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = point;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = point;
    state.pointer.startLayerRect = getCropRect();
    state.pointer.mode = cropTarget?.type === "resize" ? "resize-crop" : "crop-draw";
    state.pointer.resizeHandle = cropTarget?.handle ?? null;
    state.pointer.mutated = false;

    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "zoom") {
    zoomAt(event.altKey ? 1 / 1.2 : 1.2, event.clientX, event.clientY);
    return;
  }

  if (tool === "text") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    const point = clampDocPoint(docPoint);
    const hitLayer = getTopmostVisibleLayerAtDocPoint(point);
    if (isTextLayer(hitLayer)) {
      openInlineTextEditor(hitLayer);
      refresh({ rebuildLayers: true });
      return;
    }

    addTextLayerAtPoint(point);
    return;
  }

  if (tool === "pen") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    const point = clampDocPoint(docPoint);
    const currentDraft = state.penDraft;
    if (!currentDraft) {
      state.penDraft = {
        points: [point]
      };
      refresh();
      return;
    }

    const firstPoint = currentDraft.points[0];
    const lastPoint = currentDraft.points.at(-1);
    if (currentDraft.points.length >= 3 && isPointNearPoint(point, firstPoint)) {
      void commitPenDraft({ closed: true }).catch((error) => reportError(error, "Unable to create the pen path."));
      return;
    }

    if (event.detail >= 2) {
      if (!isPointNearPoint(point, lastPoint)) {
        currentDraft.points = [...currentDraft.points, point];
      }
      void commitPenDraft().catch((error) => reportError(error, "Unable to create the pen path."));
      return;
    }

    if (!isPointNearPoint(point, lastPoint)) {
      currentDraft.points = [...currentDraft.points, point];
    }
    refresh();
    return;
  }

  if (tool === "eyedropper") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    applyEyedropperAtPoint(clampDocPoint(docPoint));
    return;
  }

  if (tool === "bucket") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    applyPaintBucketAtPoint(clampDocPoint(docPoint));
    return;
  }

  if (tool === "gradient") {
    if (!isPointInsideDocument(docPoint) || !canModifyLayerPixels(getActiveLayer())) {
      return;
    }

    const startPoint = clampDocPoint(docPoint);
    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = startPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = startPoint;
    state.pointer.startLayerRect = null;
    state.pointer.resizeHandle = null;
    state.pointer.combineMode = null;
    state.pointer.mutated = false;
    state.pointer.mode = "gradient";
    state.gradientDraft = {
      startPoint,
      endPoint: startPoint,
      type: state.gradientType
    };
    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "color-range") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    selectColorRangeAtPoint(clampDocPoint(docPoint), {
      combineMode: getSelectionCombineModeFromEvent(event)
    });
    return;
  }

  if (tool === "magic-wand") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    selectMagicWandAtPoint(clampDocPoint(docPoint), {
      combineMode: getSelectionCombineModeFromEvent(event)
    });
    return;
  }

  if (tool === "lasso") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    const startPoint = clampDocPoint(docPoint);
    const combineMode = getSelectionCombineModeFromEvent(event, { allowShiftAdd: false });
    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = startPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = startPoint;
    state.pointer.startLayerRect = null;
    state.pointer.resizeHandle = null;
    state.pointer.combineMode = combineMode;
    state.pointer.mutated = false;
    state.pointer.mode = "lasso";
    state.lassoDraft = {
      points: [startPoint],
      combineMode
    };
    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "magic-eraser") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    applyMagicEraserAtPoint(clampDocPoint(docPoint));
    return;
  }

  if (tool === "ruler") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    const startPoint = clampDocPoint(docPoint);
    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = startPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = startPoint;
    state.pointer.startLayerRect = null;
    state.pointer.resizeHandle = null;
    state.pointer.combineMode = null;
    state.pointer.mutated = false;
    state.pointer.mode = "ruler";
    state.rulerDraft = {
      startPoint,
      endPoint: startPoint
    };
    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "artboard") {
    const hitLayer = getTopmostVisibleLayerAtDocPoint(docPoint, { includeBackground: false });
    if (hitLayer) {
      setActiveLayerId(hitLayer.id);
      const result = createOrUpdateArtboardFromLayer(hitLayer);
      if (result?.changed) {
        pushHistory();
      }
      refresh({ rebuildLayers: true });
      return;
    }

    const hitArtboard = getTopmostArtboardAtDocPoint(docPoint);
    if (hitArtboard) {
      setActiveArtboard(hitArtboard.id);
      refresh();
    }
    return;
  }

  if (tool === "shape" || tool === "line") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    const startPoint = clampDocPoint(docPoint);
    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = startPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = startPoint;
    state.pointer.mode = "draw-shape";
    state.pointer.startLayerRect = null;
    state.pointer.resizeHandle = null;
    state.pointer.mutated = false;
    state.shapeDraft = getShapeDraftFromPoints(state.shapeType, startPoint, startPoint);
    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "select" && state.selectionShape === "ellipse") {
    if (!isPointInsideDocument(docPoint)) {
      return;
    }

    const clampedStartPoint = clampDocPoint(docPoint);
    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = clampedStartPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = clampedStartPoint;
    state.pointer.mode = "select-ellipse";
    state.pointer.startLayerRect = null;
    state.pointer.resizeHandle = null;
    state.pointer.combineMode = getSelectionCombineModeFromEvent(event, { allowShiftAdd: false });
    state.pointer.mutated = false;
    state.shapeDraft = {
      type: "ellipse",
      ...getShapeDraftFromPoints("ellipse", clampedStartPoint, clampedStartPoint)
    };
    stage.setPointerCapture(event.pointerId);
    refresh();
    return;
  }

  if (tool === "select") {
    const clampedStartPoint = clampDocPoint(docPoint);
    state.pointer.id = event.pointerId;
    state.pointer.startCanvas = canvasPoint;
    state.pointer.startDoc = clampedStartPoint;
    state.pointer.startPan = { x: state.panX, y: state.panY };
    state.pointer.lastDoc = clampedStartPoint;
    state.pointer.mode = "select";
    state.pointer.startLayerRect = null;
    state.pointer.resizeHandle = null;
    state.pointer.combineMode = null;
    state.pointer.mutated = false;
    state.selectionMaskCanvas = null;
    state.selectionMaskBounds = null;
    state.selection = {
      x1: clampedStartPoint.x,
      y1: clampedStartPoint.y,
      x2: clampedStartPoint.x,
      y2: clampedStartPoint.y
    };
    stage.setPointerCapture(event.pointerId);
    refresh();
  }
}

function getResizedLayerRect(startRect, handle, currentDocPoint, preserveAspect = true) {
  const minSize = 8;
  if (!preserveAspect) {
    let left = startRect.x;
    let top = startRect.y;
    let right = startRect.x + startRect.width;
    let bottom = startRect.y + startRect.height;

    if (handle === "nw") {
      left = Math.min(currentDocPoint.x, right - minSize);
      top = Math.min(currentDocPoint.y, bottom - minSize);
    } else if (handle === "ne") {
      right = Math.max(currentDocPoint.x, left + minSize);
      top = Math.min(currentDocPoint.y, bottom - minSize);
    } else if (handle === "sw") {
      left = Math.min(currentDocPoint.x, right - minSize);
      bottom = Math.max(currentDocPoint.y, top + minSize);
    } else {
      right = Math.max(currentDocPoint.x, left + minSize);
      bottom = Math.max(currentDocPoint.y, top + minSize);
    }

    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top
    };
  }

  const aspectRatio = startRect.width / Math.max(startRect.height, 0.0001);
  const minScale = Math.max(minSize / startRect.width, minSize / startRect.height);

  if (handle === "nw") {
    const anchorX = startRect.x + startRect.width;
    const anchorY = startRect.y + startRect.height;
    const scale = Math.max(
      (anchorX - currentDocPoint.x) / startRect.width,
      (anchorY - currentDocPoint.y) / startRect.height,
      minScale
    );
    const width = startRect.width * scale;
    const height = width / aspectRatio;
    return {
      x: anchorX - width,
      y: anchorY - height,
      width,
      height
    };
  }

  if (handle === "ne") {
    const anchorX = startRect.x;
    const anchorY = startRect.y + startRect.height;
    const scale = Math.max(
      (currentDocPoint.x - anchorX) / startRect.width,
      (anchorY - currentDocPoint.y) / startRect.height,
      minScale
    );
    const width = startRect.width * scale;
    const height = width / aspectRatio;
    return {
      x: anchorX,
      y: anchorY - height,
      width,
      height
    };
  }

  if (handle === "sw") {
    const anchorX = startRect.x + startRect.width;
    const anchorY = startRect.y;
    const scale = Math.max(
      (anchorX - currentDocPoint.x) / startRect.width,
      (currentDocPoint.y - anchorY) / startRect.height,
      minScale
    );
    const width = startRect.width * scale;
    const height = width / aspectRatio;
    return {
      x: anchorX - width,
      y: anchorY,
      width,
      height
    };
  }

  const anchorX = startRect.x;
  const anchorY = startRect.y;
  const scale = Math.max(
    (currentDocPoint.x - anchorX) / startRect.width,
    (currentDocPoint.y - anchorY) / startRect.height,
    minScale
  );
  const width = startRect.width * scale;
  const height = width / aspectRatio;
  return {
    x: anchorX,
    y: anchorY,
    width,
    height
  };
}

function moveRectWithinDocument(startRect, deltaX, deltaY) {
  return {
    x: startRect.x + deltaX,
    y: startRect.y + deltaY,
    width: startRect.width,
    height: startRect.height
  };
}

function resizeTextLayerBox(layer, startRect, handle, currentDocPoint) {
  const nextRect = getResizedLayerRect(startRect, handle, currentDocPoint, false);
  const nextBoxWidth = Math.max(32, Math.round(nextRect.width));

  layer.textStyle = ensureTextStyle({
    ...layer.textStyle,
    boxWidth: nextBoxWidth
  });
  renderTextLayerBitmap(layer);
  layer.x = handle.includes("w") ? nextRect.x : startRect.x;
  layer.y = handle.includes("n")
    ? startRect.y + startRect.height - layer.height
    : startRect.y;

  return getLayerDocRect(layer);
}

function getResizedCropRect(startRect, handle, currentDocPoint) {
  const minSize = 2;
  const point = clampDocPoint(currentDocPoint);
  let left = startRect.x;
  let top = startRect.y;
  let right = startRect.x + startRect.width;
  let bottom = startRect.y + startRect.height;

  if (handle.includes("w")) {
    left = Math.min(point.x, right - minSize);
  }

  if (handle.includes("e")) {
    right = Math.max(point.x, left + minSize);
  }

  if (handle.includes("n")) {
    top = Math.min(point.y, bottom - minSize);
  }

  if (handle.includes("s")) {
    bottom = Math.max(point.y, top + minSize);
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top
  };
}

function updateInteraction(event) {
  if (!state.doc) {
    return;
  }

  const canvasPoint = clientToCanvasPoint(event.clientX, event.clientY);
  const docPoint = canvasToDocPoint(canvasPoint);
  state.hoverCanvasPoint = canvasPoint;
  state.hoverDocPoint = docPoint;

  if (!state.pointer.mode) {
    refresh();
    return;
  }

  if (state.pointer.mode === "pan") {
    clearGuides();
    state.panX = state.pointer.startPan.x + (canvasPoint.x - state.pointer.startCanvas.x);
    state.panY = state.pointer.startPan.y + (canvasPoint.y - state.pointer.startCanvas.y);
    refresh();
    return;
  }

  if (state.pointer.mode === "move-layer") {
    const activeLayer = getActiveLayer();
    if (!activeLayer || !state.pointer.startLayerRect) {
      return;
    }

    const deltaX = docPoint.x - state.pointer.startDoc.x;
    const deltaY = docPoint.y - state.pointer.startDoc.y;
    activeLayer.x = state.pointer.startLayerRect.x + deltaX;
    activeLayer.y = state.pointer.startLayerRect.y + deltaY;
    clearGuides();
    if (!event.shiftKey) {
      snapLayerToDocument(activeLayer);
    }
    constrainLayerToCanvas(activeLayer);
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(activeLayer.x - state.pointer.startLayerRect.x) > 0.01
      || Math.abs(activeLayer.y - state.pointer.startLayerRect.y) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "rotate-layer") {
    const activeLayer = getActiveLayer();
    if (!activeLayer) {
      return;
    }

    const center = getLayerCenter(activeLayer);
    const startAngle = Math.atan2(
      state.pointer.startDoc.y - center.y,
      state.pointer.startDoc.x - center.x
    );
    const currentAngle = Math.atan2(docPoint.y - center.y, docPoint.x - center.x);
    const angleDelta = (currentAngle - startAngle) * 180 / Math.PI;
    const rawRotation = normalizeAngle(state.pointer.startLayerRotation + angleDelta);
    const nextRotation = event.shiftKey ? rawRotation : getRotationSnapAngle(rawRotation);
    activeLayer.rotation = nextRotation;
    constrainLayerToCanvas(activeLayer);
    state.guides.rotation = nextRotation === rawRotation ? null : nextRotation;
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(normalizeAngle(nextRotation - state.pointer.startLayerRotation)) > 0.1;
    refresh();
    return;
  }

  if (state.pointer.mode === "resize-layer") {
    const activeLayer = getActiveLayer();
    if (!activeLayer || !state.pointer.startLayerRect || !state.pointer.resizeHandle) {
      return;
    }

    const nextRect = isTextLayer(activeLayer)
      ? resizeTextLayerBox(
        activeLayer,
        state.pointer.startLayerRect,
        state.pointer.resizeHandle,
        docPoint
      )
      : getResizedLayerRect(
        state.pointer.startLayerRect,
        state.pointer.resizeHandle,
        docPoint,
        !event.shiftKey
      );
    clearGuides();
    if (!isTextLayer(activeLayer)) {
      activeLayer.x = nextRect.x;
      activeLayer.y = nextRect.y;
      activeLayer.width = nextRect.width;
      activeLayer.height = nextRect.height;
      if (isVectorLayer(activeLayer)) {
        renderVectorLayerBitmap(activeLayer, nextRect.width, nextRect.height);
      }
    }
    constrainLayerToCanvas(activeLayer);
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(nextRect.x - state.pointer.startLayerRect.x) > 0.01
      || Math.abs(nextRect.y - state.pointer.startLayerRect.y) > 0.01
      || Math.abs(nextRect.width - state.pointer.startLayerRect.width) > 0.01
      || Math.abs(nextRect.height - state.pointer.startLayerRect.height) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "edit-vector") {
    const activeLayer = getActiveLayer();
    const vectorHandle = state.pointer.vectorHandle;
    const vectorSnapshot = state.pointer.vectorEditSnapshot;
    if (!activeLayer || !vectorHandle || !vectorSnapshot) {
      return;
    }

    const sourceModel = createVectorPathModelFromSource(vectorSnapshot.vectorSource);
    if (!sourceModel) {
      return;
    }

    const vectorLocalPoint = docPointToVectorPathLocalPoint({
      ...activeLayer,
      x: vectorSnapshot.x,
      y: vectorSnapshot.y,
      width: vectorSnapshot.width,
      height: vectorSnapshot.height,
      rotation: vectorSnapshot.rotation,
      vectorIntrinsicWidth: vectorSnapshot.vectorIntrinsicWidth,
      vectorIntrinsicHeight: vectorSnapshot.vectorIntrinsicHeight
    }, sourceModel.matrix, docPoint);

    if (!updateVectorPathCommandHandle(sourceModel.commands, vectorHandle, vectorLocalPoint)) {
      return;
    }

    sourceModel.target.setAttribute("d", serializeSvgPathData(sourceModel.commands));
    activeLayer.vectorSource = new XMLSerializer().serializeToString(sourceModel.parsed.documentElement);
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(vectorLocalPoint.x - vectorHandle.point.x) > 0.01
      || Math.abs(vectorLocalPoint.y - vectorHandle.point.y) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "crop-draw") {
    clearGuides();
    const point = clampDocPoint(docPoint);
    setCropRect({
      x: Math.min(state.pointer.startDoc.x, point.x),
      y: Math.min(state.pointer.startDoc.y, point.y),
      width: Math.abs(point.x - state.pointer.startDoc.x),
      height: Math.abs(point.y - state.pointer.startDoc.y)
    });
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(point.x - state.pointer.startDoc.x) > 0.01
      || Math.abs(point.y - state.pointer.startDoc.y) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "move-crop") {
    if (!state.pointer.startLayerRect) {
      return;
    }

    clearGuides();
    const deltaX = docPoint.x - state.pointer.startDoc.x;
    const deltaY = docPoint.y - state.pointer.startDoc.y;
    const nextRect = moveRectWithinDocument(state.pointer.startLayerRect, deltaX, deltaY);
    setCropRect(nextRect);
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(nextRect.x - state.pointer.startLayerRect.x) > 0.01
      || Math.abs(nextRect.y - state.pointer.startLayerRect.y) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "resize-crop") {
    if (!state.pointer.startLayerRect || !state.pointer.resizeHandle) {
      return;
    }

    clearGuides();
    const nextRect = getResizedCropRect(
      state.pointer.startLayerRect,
      state.pointer.resizeHandle,
      docPoint
    );
    setCropRect(nextRect);
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(nextRect.x - state.pointer.startLayerRect.x) > 0.01
      || Math.abs(nextRect.y - state.pointer.startLayerRect.y) > 0.01
      || Math.abs(nextRect.width - state.pointer.startLayerRect.width) > 0.01
      || Math.abs(nextRect.height - state.pointer.startLayerRect.height) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "draw-shape") {
    clearGuides();
    const point = clampDocPoint(docPoint);
    state.shapeDraft = getShapeDraftFromPoints(state.shapeType, state.pointer.startDoc, point, event.shiftKey);
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(point.x - state.pointer.startDoc.x) > 0.01
      || Math.abs(point.y - state.pointer.startDoc.y) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "gradient") {
    clearGuides();
    const point = clampDocPoint(docPoint);
    state.gradientDraft = {
      startPoint: state.pointer.startDoc,
      endPoint: point,
      type: state.gradientType
    };
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(point.x - state.pointer.startDoc.x) > 0.01
      || Math.abs(point.y - state.pointer.startDoc.y) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "ruler") {
    clearGuides();
    const point = clampDocPoint(docPoint);
    state.rulerDraft = {
      startPoint: state.pointer.startDoc,
      endPoint: point
    };
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(point.x - state.pointer.startDoc.x) > 0.01
      || Math.abs(point.y - state.pointer.startDoc.y) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "lasso") {
    clearGuides();
    const point = clampDocPoint(docPoint);
    const points = state.lassoDraft?.points ?? [];
    const lastPoint = points.at(-1);
    const minDistance = Math.max(1, 2 / Math.max(state.zoom, 0.0001));
    if (!lastPoint || Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) >= minDistance) {
      state.lassoDraft = {
        points: [...points, point],
        combineMode: state.pointer.combineMode ?? "replace"
      };
      state.pointer.lastDoc = point;
      state.pointer.mutated = state.pointer.mutated
        || Math.abs(point.x - state.pointer.startDoc.x) > 0.01
        || Math.abs(point.y - state.pointer.startDoc.y) > 0.01;
      refresh();
    }
    return;
  }

  if (state.pointer.mode === "paint") {
    const activeLayer = getActiveLayer();
    if (!activeLayer) {
      return;
    }

    clearGuides();
    const point = clampDocPointToLayer(activeLayer, docPoint);
    drawStrokeSegment(activeLayer, state.pointer.lastDoc, point);
    state.pointer.lastDoc = point;
    refresh();
    return;
  }

  if (state.pointer.mode === "select-ellipse") {
    clearGuides();
    const point = clampDocPoint(docPoint);
    state.shapeDraft = {
      type: "ellipse",
      ...getShapeDraftFromPoints("ellipse", state.pointer.startDoc, point, event.shiftKey)
    };
    state.pointer.mutated = state.pointer.mutated
      || Math.abs(point.x - state.pointer.startDoc.x) > 0.01
      || Math.abs(point.y - state.pointer.startDoc.y) > 0.01;
    refresh();
    return;
  }

  if (state.pointer.mode === "select") {
    clearGuides();
    const point = clampDocPoint(docPoint);
    state.selection = {
      x1: state.pointer.startDoc.x,
      y1: state.pointer.startDoc.y,
      x2: point.x,
      y2: point.y
    };
    refresh();
  }
}

function endInteraction(event) {
  if (state.pointer.id !== null && event.pointerId !== state.pointer.id) {
    return;
  }

  const completedMode = state.pointer.mode;
  const mutated = state.pointer.mutated;
  const startLayerRect = state.pointer.startLayerRect;
  const shapeDraft = state.shapeDraft ? { ...state.shapeDraft } : null;
  const lassoDraft = state.lassoDraft
    ? {
      points: state.lassoDraft.points.map((point) => ({ ...point })),
      combineMode: state.lassoDraft.combineMode
    }
    : null;
  const gradientDraft = state.gradientDraft ? { ...state.gradientDraft } : null;
  const lastPaintDoc = state.pointer.lastDoc ? { ...state.pointer.lastDoc } : null;
  const paintTool = state.transientTool || state.tool;
  const selectionCombineMode = state.pointer.combineMode;
  const shouldRebuildLayers = ["paint", "move-layer", "resize-layer", "rotate-layer"].includes(completedMode);
  const activeLayer = getActiveLayer();

  if (state.pointer.id !== null && stage.hasPointerCapture(state.pointer.id)) {
    stage.releasePointerCapture(state.pointer.id);
  }

  state.pointer.id = null;
  state.pointer.mode = null;
  state.pointer.startCanvas = null;
  state.pointer.startDoc = null;
  state.pointer.startPan = null;
  state.pointer.lastDoc = null;
  state.pointer.startLayerRect = null;
  state.pointer.startLayerRotation = null;
  state.pointer.vectorHandle = null;
  state.pointer.vectorEditSnapshot = null;
  state.pointer.resizeHandle = null;
  state.pointer.combineMode = null;
  state.pointer.mutated = false;
  state.shapeDraft = null;
  state.lassoDraft = null;
  state.gradientDraft = null;
  clearGuides();

  if (mutated && shouldRebuildLayers) {
    pushHistory();
  }

  if (completedMode === "paint" && mutated && activeLayer && lastPaintDoc) {
    state.lastPaintStroke = {
      layerId: activeLayer.id,
      point: lastPaintDoc,
      tool: paintTool,
      isMask: isEditingLayerMask(activeLayer)
    };
  }

  if (completedMode === "draw-shape" && mutated && isRenderableShapeDraft(state.shapeType, shapeDraft)) {
    void addShapeLayerFromDraft(shapeDraft).catch((error) => reportError(error, "Unable to create the vector shape."));
    return;
  }

  if (completedMode === "gradient" && mutated && gradientDraft) {
    applyGradientDraft(gradientDraft);
    return;
  }

  if (completedMode === "select-ellipse" && mutated && isRenderableShapeDraft("ellipse", shapeDraft)) {
    const ellipseMaskCanvas = createSelectionMaskCanvasFromEllipseRect(shapeDraft);
    applySelectionMaskCanvas(ellipseMaskCanvas, selectionCombineMode ?? "replace");
    refresh();
    return;
  }

  if (completedMode === "lasso" && mutated && lassoDraft?.points?.length >= 3) {
    const lassoMaskCanvas = createSelectionMaskCanvasFromPolygon(lassoDraft.points);
    if (lassoMaskCanvas) {
      applySelectionMaskCanvas(lassoMaskCanvas, selectionCombineMode ?? lassoDraft.combineMode ?? "replace");
    }
    refresh();
    return;
  }

  if (completedMode === "edit-vector" && mutated && activeLayer) {
    void finalizeVectorLayerEditing(activeLayer).catch((error) => reportError(error, "Unable to update the vector path."));
    return;
  }

  if (completedMode === "ruler" && !mutated) {
    state.rulerDraft = null;
  }

  if (completedMode === "crop-draw" && !mutated) {
    state.cropRect = startLayerRect;
  }

  if (
    (
      completedMode === "select"
    )
    && !getSelectionRect()
  ) {
    clearSelectionState();
  }

  if (
    (
      completedMode === "crop-draw"
      || completedMode === "move-crop"
      || completedMode === "resize-crop"
    )
    && !getCropRect()
  ) {
    state.cropRect = null;
  }

  refresh({ rebuildLayers: shouldRebuildLayers });
}

function setTool(tool) {
  const previousTool = state.tool;
  if (state.textEditorLayerId && tool !== "text") {
    closeInlineTextEditor();
  }
  if (tool === "line") {
    state.shapeType = "line";
  }
  state.tool = tool;
  state.shapeDraft = null;
  state.lassoDraft = null;
  if (tool !== "gradient") {
    state.gradientDraft = null;
  }
  if (tool !== "ruler") {
    state.rulerDraft = null;
  }
  if (tool !== "pen") {
    state.penDraft = null;
  }
  clearGuides();
  closeContextMenus();
  if (tool === "crop") {
    clearSelectionState();
    ensureCropRect();
  } else if (previousTool === "crop") {
    state.cropRect = null;
  }
  refresh();
}

function isEditableTarget(target) {
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function handleShortcuts(event) {
  if (isDialogOpen()) {
    return;
  }

  const key = event.key.toLowerCase();
  const modifier = event.metaKey || event.ctrlKey;

  if (key === "escape") {
    hideLayerOpacityPopover();
  }

  if (modifier && key === "s") {
    event.preventDefault();
    if (event.shiftKey) {
      void openExportDialog();
    } else {
      void saveProject();
    }
    return;
  }

  if (modifier && key === "o") {
    event.preventDefault();
    void openProject();
    return;
  }

  if (modifier && key === "z") {
    event.preventDefault();
    if (event.shiftKey) {
      restoreHistory(state.historyIndex + 1);
    } else {
      restoreHistory(state.historyIndex - 1);
    }
    return;
  }

  if (modifier && key === "y") {
    event.preventDefault();
    restoreHistory(state.historyIndex + 1);
    return;
  }

  if (event.code === "Space" && !isEditableTarget(event.target)) {
    if (!state.transientTool) {
      state.transientTool = "move";
      refresh();
    }
    event.preventDefault();
    return;
  }

  if (isEditableTarget(event.target)) {
    return;
  }

  if (!modifier && key === "x") {
    event.preventDefault();
    swapForegroundBackgroundColors();
  } else if (!modifier && key === "d") {
    event.preventDefault();
    resetForegroundBackgroundColors();
  } else if (!modifier && key === "n") {
    setTool("pencil");
  } else if (!modifier && key === "s") {
    setTool("lasso");
  } else if (!modifier && key === "y") {
    setTool("line");
  } else if (!modifier && key === "z") {
    setTool("zoom");
  } else if (key === "b") {
    setTool("brush");
  } else if (key === "g") {
    setTool("bucket");
  } else if (key === "l") {
    setTool("gradient");
  } else if (key === "w") {
    setTool("color-range");
  } else if (key === "k") {
    setTool("magic-wand");
  } else if (key === "a") {
    setTool("direct");
  } else if (key === "c") {
    setTool("crop");
  } else if (key === "e") {
    setTool("eraser");
  } else if (key === "j") {
    setTool("magic-eraser");
  } else if (key === "v") {
    setTool("transform");
  } else if (key === "t") {
    setTool("text");
  } else if (key === "p") {
    setTool("pen");
  } else if (key === "u") {
    setTool("shape");
  } else if (key === "q") {
    setTool("artboard");
  } else if (key === "r") {
    setTool("ruler");
  } else if (key === "i") {
    setTool("eyedropper");
  } else if (key === "h") {
    setTool("move");
  } else if (key === "o") {
    state.selectionShape = "ellipse";
    setTool("select");
  } else if (key === "enter" && getCropRect() && state.tool === "crop") {
    event.preventDefault();
    void commitCropSelection();
  } else if (key === "enter" && state.tool === "pen" && canFinishPenDraft()) {
    event.preventDefault();
    void commitPenDraft().catch((error) => reportError(error, "Unable to create the pen path."));
  } else if (key === "m") {
    state.selectionShape = "rectangle";
    setTool("select");
  } else if (key === "escape") {
    if (state.penDraft) {
      state.penDraft = null;
      refresh();
      return;
    }

    if (state.tool === "ruler" && state.rulerDraft) {
      state.rulerDraft = null;
      refresh();
      return;
    }

    closeMenus();
    if (state.tool === "crop") {
      state.cropRect = null;
    } else {
      clearSelectionState();
    }
    refresh();
  } else if (key === "delete" || key === "backspace") {
    event.preventDefault();
    if (getSelectionRect()) {
      clearSelectedArea();
    } else {
      void confirmDeleteActiveLayer();
    }
  }
}

function releaseShortcut(event) {
  if (event.code === "Space" && state.transientTool) {
    state.transientTool = null;
    refresh();
  }
}

function attachEvents() {
  const handleNewDocument = () => {
    closeMenus();
    void createNewDocument();
  };
  const handleOpenImage = () => {
    closeMenus();
    fileInput.click();
  };
  const handleOpenProject = () => {
    closeMenus();
    void openProject();
  };

  for (const button of toolButtons) {
    button.addEventListener("click", () => setTool(button.dataset.tool));
  }

  for (const button of inspectorSectionToggles) {
    button.addEventListener("click", () => {
      toggleInspectorSection(button.dataset.inspectorToggle);
    });
  }

  // Inspector tabs — show/hide dock panels based on selected tab.
  document.querySelectorAll(".inspector-tab").forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      const target = tabBtn.dataset.inspectorTab;
      state.activeInspectorPanel = target || "properties";
      document.querySelectorAll(".inspector-tab").forEach((b) => {
        const on = b === tabBtn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      syncInspectorPanels();
    });
  });
  // Initialize: show the "properties" panel, hide the others.
  document.querySelectorAll(".inspector-panels .dock-panel").forEach((p) => {
    p.hidden = p.dataset.inspectorPanel !== state.activeInspectorPanel;
  });

  for (const button of windowPanelToggleButtons) {
    button.addEventListener("click", () => {
      cycleInspectorSectionMode(button.dataset.windowPanelToggle);
    });
  }

  for (const button of panelToggleButtons) {
    button.addEventListener("click", () => {
      const toggleKey = button.dataset.panelToggle;
      state.panelToggles[toggleKey] = !state.panelToggles[toggleKey];
      clearGuides();
      syncPanelToggleControls();
      refresh();
    });
  }

  ui.windowPanelsReset?.addEventListener("click", () => {
    resetInspectorSectionModes();
  });

  ui.windowContextualBarToggle?.addEventListener("click", () => {
    closeMenus();
    toggleContextualBarVisibility();
  });

  ui.windowContextualBarReset?.addEventListener("click", () => {
    closeMenus();
    resetContextualBarPosition();
  });

  ui.contextualBar?.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });

  ui.contextualBar?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  ui.contextualBarHandle?.addEventListener("pointerdown", beginContextualBarDrag);
  ui.contextualBarPin?.addEventListener("click", () => {
    setContextualBarPinned(!state.contextualBarPinned);
    refresh();
  });
  ui.contextualBarClose?.addEventListener("click", () => {
    toggleContextualBarVisibility(false);
  });

  for (const root of menuRoots) {
    const button = root.querySelector("[data-menu-button]");
    const menuId = button?.dataset.menuButton;

    if (!menuId) {
      continue;
    }

    root.addEventListener("mouseenter", () => {
      setMenuOpen(menuId, true, "hover");
    });
  }

  for (const button of menuButtons) {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMenu(button.dataset.menuButton);
    });
  }

  ui.newDoc.addEventListener("click", handleNewDocument);
  ui.homeNewDoc?.addEventListener("click", handleNewDocument);
  ui.homePrimaryNew?.addEventListener("click", handleNewDocument);
  ui.openImage.addEventListener("click", handleOpenImage);
  ui.homeOpenImage?.addEventListener("click", handleOpenImage);
  ui.homePrimaryOpenImage?.addEventListener("click", handleOpenImage);
  ui.openProject.addEventListener("click", handleOpenProject);
  ui.homeOpenProject?.addEventListener("click", handleOpenProject);
  ui.homePrimaryOpenProject?.addEventListener("click", handleOpenProject);
  ui.saveProject.addEventListener("click", () => {
    closeMenus();
    void saveProject();
  });
  ui.saveProjectAs.addEventListener("click", () => {
    closeMenus();
    void saveProject({ forceChoosePath: true });
  });
  ui.exportImage.addEventListener("click", () => {
    closeMenus();
    void openExportDialog();
  });
  ui.canvasSize.addEventListener("click", () => {
    closeMenus();
    void openCanvasSizeDialog();
  });
  ui.propertiesImageSize.addEventListener("click", () => {
    void openCanvasSizeDialog();
  });
  ui.fitCanvasLayer.addEventListener("click", () => {
    closeMenus();
    fitCanvasToActiveLayer();
  });
  ui.fitCanvasArtboard.addEventListener("click", () => {
    closeMenus();
    fitCanvasToActiveArtboard();
  });

  ui.menuUndo.addEventListener("click", () => {
    closeMenus();
    restoreHistory(state.historyIndex - 1);
  });
  ui.menuRedo.addEventListener("click", () => {
    closeMenus();
    restoreHistory(state.historyIndex + 1);
  });
  ui.menuDuplicateLayer.addEventListener("click", () => {
    closeMenus();
    duplicateSelectedLayers();
  });
  ui.menuDeleteLayer.addEventListener("click", () => {
    closeMenus();
    void confirmDeleteActiveLayer();
  });
  ui.menuLayerNew.addEventListener("click", () => {
    closeMenus();
    addLayer();
  });
  ui.menuLayerGroup.addEventListener("click", () => {
    closeMenus();
    groupSelectedLayers();
  });
  ui.menuLayerUngroup.addEventListener("click", () => {
    closeMenus();
    removeSelectedLayersFromGroups();
  });
  ui.menuLayerMaskAdd.addEventListener("click", () => {
    closeMenus();
    addLayerMask(state.activeLayerId);
  });
  ui.menuLayerMaskEdit.addEventListener("click", () => {
    closeMenus();
    toggleLayerMaskEditing(state.activeLayerId);
  });
  ui.menuLayerMaskDelete.addEventListener("click", () => {
    closeMenus();
    deleteLayerMask(state.activeLayerId);
  });
  ui.menuLayerMaskApply.addEventListener("click", () => {
    closeMenus();
    void applyLayerMask(state.activeLayerId);
  });
  ui.menuLayerClippingMask.addEventListener("click", () => {
    closeMenus();
    toggleLayerClippingMask(state.activeLayerId);
  });
  ui.menuLayerAdjustmentGrayscale.addEventListener("click", () => {
    closeMenus();
    addAdjustmentLayer("grayscale");
  });
  ui.menuLayerAdjustmentInvert.addEventListener("click", () => {
    closeMenus();
    addAdjustmentLayer("invert");
  });
  ui.menuLayerAdjustmentBrightnessContrast.addEventListener("click", () => {
    closeMenus();
    addAdjustmentLayer("brightnessContrast");
  });
  ui.menuLayerAdjustmentHueSaturation.addEventListener("click", () => {
    closeMenus();
    addAdjustmentLayer("hueSaturation");
  });
  ui.menuLayerDuplicate.addEventListener("click", () => {
    closeMenus();
    duplicateSelectedLayers();
  });
  ui.menuLayerDelete.addEventListener("click", () => {
    closeMenus();
    void confirmDeleteActiveLayer();
  });
  ui.menuLayerUp.addEventListener("click", () => {
    closeMenus();
    moveActiveLayer(1);
  });
  ui.menuLayerDown.addEventListener("click", () => {
    closeMenus();
    moveActiveLayer(-1);
  });
  ui.menuLayerFlipHorizontal.addEventListener("click", () => {
    closeMenus();
    flipActiveLayer("horizontal");
  });
  ui.menuLayerFlipVertical.addEventListener("click", () => {
    closeMenus();
    flipActiveLayer("vertical");
  });
  ui.menuTypeNew.addEventListener("click", () => {
    closeMenus();
    addTextLayerAtCenter();
  });
  ui.menuTypeEdit.addEventListener("click", () => {
    closeMenus();
    editActiveTextLayer();
  });
  ui.menuTypeAlignLeft.addEventListener("click", () => {
    closeMenus();
    setActiveTextAlignment("left");
  });
  ui.menuTypeAlignCenter.addEventListener("click", () => {
    closeMenus();
    setActiveTextAlignment("center");
  });
  ui.menuTypeAlignRight.addEventListener("click", () => {
    closeMenus();
    setActiveTextAlignment("right");
  });
  ui.menuSelectAll.addEventListener("click", () => {
    closeMenus();
    selectEntireCanvas();
  });
  ui.menuSelectNone.addEventListener("click", () => {
    closeMenus();
    clearSelectionOnly();
  });
  ui.menuSelectFill.addEventListener("click", () => {
    closeMenus();
    fillSelectedArea();
  });
  ui.menuSelectClear.addEventListener("click", () => {
    closeMenus();
    clearSelectedArea();
  });
  ui.menuSelectCrop.addEventListener("click", () => {
    closeMenus();
    useSelectionForCrop();
  });
  ui.menuHelpShortcuts.addEventListener("click", () => {
    closeMenus();
    void showKeyboardShortcutsDialog();
  });
  ui.toolbarHelpShortcuts.addEventListener("click", () => {
    void showKeyboardShortcutsDialog();
  });
  ui.menuHelpAbout.addEventListener("click", () => {
    closeMenus();
    void showAboutDialog();
  });
  ui.grayscaleMenu.addEventListener("click", () => {
    closeMenus();
    applyFilter((data) => {
      for (let index = 0; index < data.length; index += 4) {
        const average = Math.round(data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114);
        data[index] = average;
        data[index + 1] = average;
        data[index + 2] = average;
      }
    });
  });
  ui.invertMenu.addEventListener("click", () => {
    closeMenus();
    applyFilter((data) => {
      for (let index = 0; index < data.length; index += 4) {
        data[index] = 255 - data[index];
        data[index + 1] = 255 - data[index + 1];
        data[index + 2] = 255 - data[index + 2];
      }
    });
  });
  ui.menuZoomIn.addEventListener("click", () => {
    closeMenus();
    zoomAt(1.15);
  });
  ui.menuZoomOut.addEventListener("click", () => {
    closeMenus();
    zoomAt(1 / 1.15);
  });
  ui.menuFitView.addEventListener("click", () => {
    closeMenus();
    fitToStage();
    refresh();
  });
  ui.menuResetView.addEventListener("click", () => {
    closeMenus();
    fitToStage();
    refresh();
  });
  ui.undo.addEventListener("click", () => restoreHistory(state.historyIndex - 1));
  ui.redo.addEventListener("click", () => restoreHistory(state.historyIndex + 1));
  ui.historyList.addEventListener("click", (event) => {
    const row = event.target.closest("[data-history-index]");
    if (!row) {
      return;
    }

    restoreHistory(Number(row.dataset.historyIndex));
  });
  ui.zoomIn.addEventListener("click", () => zoomAt(1.15));
  ui.zoomOut.addEventListener("click", () => zoomAt(1 / 1.15));
  ui.fitView.addEventListener("click", () => {
    fitToStage();
    refresh();
  });
  ui.resetView.addEventListener("click", () => {
    fitToStage();
    refresh();
  });
  ui.optionsFillSelection.addEventListener("click", fillSelectedArea);
  ui.optionsClearSelection.addEventListener("click", clearSelectedArea);
  ui.optionsPenFinish.addEventListener("click", () => {
    void commitPenDraft().catch((error) => reportError(error, "Unable to create the pen path."));
  });
  ui.optionsPenClose.addEventListener("click", () => {
    void commitPenDraft({ closed: true }).catch((error) => reportError(error, "Unable to create the pen path."));
  });
  ui.optionsApplyCrop.addEventListener("click", () => {
    void commitCropSelection();
  });
  ui.optionsCancelCrop.addEventListener("click", () => {
    state.cropRect = null;
    refresh();
  });
  ui.optionsFitCanvasLayer.addEventListener("click", fitCanvasToActiveLayer);
  ui.optionsFitCanvasArtboard.addEventListener("click", fitCanvasToActiveArtboard);
  ui.optionsDeleteArtboard.addEventListener("click", deleteActiveArtboard);
  ui.cropSelection.addEventListener("click", () => {
    void commitCropSelection();
  });
  ui.propertiesCrop.addEventListener("click", () => {
    void commitCropSelection();
  });
  ui.clearSelection.addEventListener("click", clearSelectedArea);
  ui.fillSelection.addEventListener("click", fillSelectedArea);
  ui.contextualSelectionFill.addEventListener("click", fillSelectedArea);
  ui.contextualSelectionClear.addEventListener("click", clearSelectedArea);
  ui.contextualSelectionCrop.addEventListener("click", useSelectionForCrop);
  ui.contextualSelectionDeselect.addEventListener("click", clearSelectionOnly);
  ui.contextualCropApply.addEventListener("click", () => {
    void commitCropSelection();
  });
  ui.contextualCropCancel.addEventListener("click", () => {
    state.cropRect = null;
    refresh();
  });
  ui.layerBringToFront.addEventListener("click", () => {
    closeContextMenus();
    reorderLayerByAction(state.activeLayerId, "front");
  });
  ui.layerBringForward.addEventListener("click", () => {
    closeContextMenus();
    reorderLayerByAction(state.activeLayerId, "forward");
  });
  ui.layerSendBackward.addEventListener("click", () => {
    closeContextMenus();
    reorderLayerByAction(state.activeLayerId, "backward");
  });
  ui.layerSendToBack.addEventListener("click", () => {
    closeContextMenus();
    reorderLayerByAction(state.activeLayerId, "back");
  });
  ui.grayscale.addEventListener("click", () => applyFilter((data) => {
    for (let index = 0; index < data.length; index += 4) {
      const average = Math.round(data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114);
      data[index] = average;
      data[index + 1] = average;
      data[index + 2] = average;
    }
  }));
  ui.invert.addEventListener("click", () => applyFilter((data) => {
    for (let index = 0; index < data.length; index += 4) {
      data[index] = 255 - data[index];
      data[index + 1] = 255 - data[index + 1];
      data[index + 2] = 255 - data[index + 2];
    }
  }));
  ui.rotateLeft.addEventListener("click", () => rotateActiveLayer(-1));
  ui.rotateRight.addEventListener("click", () => rotateActiveLayer(1));
  ui.flipHorizontal.addEventListener("click", () => flipActiveLayer("horizontal"));
  ui.flipVertical.addEventListener("click", () => flipActiveLayer("vertical"));
  ui.alignLeft.addEventListener("click", () => alignActiveLayer("x", "start"));
  ui.alignCenterX.addEventListener("click", () => alignActiveLayer("x", "center"));
  ui.alignRight.addEventListener("click", () => alignActiveLayer("x", "end"));
  ui.alignTop.addEventListener("click", () => alignActiveLayer("y", "start"));
  ui.alignCenterY.addEventListener("click", () => alignActiveLayer("y", "center"));
  ui.alignBottom.addEventListener("click", () => alignActiveLayer("y", "end"));
  ui.contextualRasterRotateLeft.addEventListener("click", () => rotateActiveLayer(-1));
  ui.contextualRasterRotateRight.addEventListener("click", () => rotateActiveLayer(1));
  ui.contextualRasterDuplicate.addEventListener("click", duplicateSelectedLayers);
  ui.contextualRasterFitCanvas.addEventListener("click", fitCanvasToActiveLayer);
  ui.contextualTextEdit.addEventListener("click", editActiveTextLayer);
  ui.contextualTextDuplicate.addEventListener("click", duplicateSelectedLayers);
  ui.contextualVectorEditPath.addEventListener("click", () => setTool("direct"));
  ui.contextualVectorDuplicate.addEventListener("click", duplicateSelectedLayers);

  ui.layerSearch.addEventListener("input", (event) => {
    state.layerSearchQuery = event.target.value;
    syncLayerPanelControls();
    renderLayers();
  });

  ui.layersMore.addEventListener("click", () => {
    state.layerPanelFilter = "all";
    state.layerSearchQuery = "";
    syncInputValue(ui.layerSearch, "");
    syncLayerPanelControls();
    renderLayers();
  });

  for (const button of layerFilterButtons) {
    button.addEventListener("click", () => {
      const filter = button.dataset.layerFilter || "all";
      state.layerPanelFilter = state.layerPanelFilter === filter ? "all" : filter;
      syncLayerPanelControls();
      renderLayers();
    });
  }

  for (const button of layerLockButtons) {
    button.addEventListener("click", () => {
      toggleSelectedLayerLock(button.dataset.layerLock);
    });
  }

  ui.addLayer.addEventListener("click", addLayer);
  ui.linkLayer.addEventListener("click", toggleSelectedLayersLinked);
  ui.layerStyle.addEventListener("click", toggleSelectedLayerStyle);
  ui.layerMask.addEventListener("click", () => {
    const activeLayer = getActiveLayer();
    if (!activeLayer) {
      return;
    }

    if (hasLayerMask(activeLayer)) {
      toggleLayerMaskEditing(activeLayer.id);
    } else {
      addLayerMask(activeLayer.id);
    }
  });
  ui.layerAdjustment.addEventListener("click", () => addAdjustmentLayer("brightnessContrast"));
  ui.groupLayer.addEventListener("click", groupSelectedLayers);
  ui.ungroupLayer.addEventListener("click", removeSelectedLayersFromGroups);
  ui.duplicateLayer.addEventListener("click", duplicateSelectedLayers);
  ui.moveLayerUp.addEventListener("click", () => moveActiveLayer(1));
  ui.moveLayerDown.addEventListener("click", () => moveActiveLayer(-1));
  ui.deleteLayer.addEventListener("click", () => {
    void confirmDeleteActiveLayer();
  });

  ui.brushSize.addEventListener("input", (event) => {
    state.brushSize = Number(event.target.value);
    refresh();
  });

  ui.optionsBrushSize.addEventListener("input", (event) => {
    state.brushSize = Number(event.target.value);
    refresh();
  });

  ui.brushOpacity.addEventListener("input", (event) => {
    state.brushOpacity = Number(event.target.value) / 100;
    updateColorInputs();
    refresh();
  });

  ui.optionsBrushOpacity.addEventListener("input", (event) => {
    state.brushOpacity = Number(event.target.value) / 100;
    updateColorInputs();
    refresh();
  });

  ui.optionsRegionTolerance.addEventListener("input", (event) => {
    state.regionTolerance = Math.round(clamp(Number(event.target.value) || state.regionTolerance, 0, 255));
    ui.optionsRegionToleranceValue.textContent = String(state.regionTolerance);
    refresh();
  });

  ui.optionsRegionContiguous.addEventListener("change", (event) => {
    state.regionContiguous = event.target.checked;
    refresh();
  });

  ui.optionsSelectionShape.addEventListener("change", (event) => {
    state.selectionShape = event.target.value === "ellipse" ? "ellipse" : "rectangle";
    refresh();
  });

  ui.optionsGradientType.addEventListener("change", (event) => {
    state.gradientType = event.target.value === "radial" ? "radial" : "linear";
    if (state.gradientDraft) {
      state.gradientDraft = {
        ...state.gradientDraft,
        type: state.gradientType
      };
    }
    refresh();
  });

  ui.optionsRulerClear.addEventListener("click", () => {
    state.rulerDraft = null;
    refresh();
  });

  ui.brushColor.addEventListener("input", (event) => {
    state.brushColor = event.target.value;
    updateColorInputs();
  });

  ui.brushColor.addEventListener("change", (event) => {
    state.brushColor = event.target.value;
    updateColorInputs();
    refresh();
  });

  ui.backgroundColor.addEventListener("input", (event) => {
    state.backgroundColor = event.target.value;
    updateColorInputs();
  });

  ui.backgroundColor.addEventListener("change", (event) => {
    state.backgroundColor = event.target.value;
    updateColorInputs();
    refresh();
  });

  ui.swapColors.addEventListener("click", swapForegroundBackgroundColors);
  ui.resetColors.addEventListener("click", resetForegroundBackgroundColors);

  ui.brushColorValue.addEventListener("change", (event) => {
    const parsed = parseColorValue(event.target.value);
    if (!parsed) {
      updateColorInputs();
      refresh();
      return;
    }

    state.brushColor = parsed.color;
    if (parsed.opacity !== null) {
      state.brushOpacity = parsed.opacity;
    }
    updateColorInputs();
    refresh();
  });

  ui.brushColorValue.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  });

  ui.vectorFillValue.addEventListener("input", () => {
    if (ui.vectorFillTransparent.checked) {
      ui.vectorFillTransparent.checked = false;
    }
  });

  ui.vectorFillValue.addEventListener("change", (event) => {
    const activeLayer = getActiveLayer();
    if (!isVectorLayer(activeLayer)) {
      refresh();
      return;
    }

    applyActiveVectorLayerStyle(
      getVectorFillChanges(activeLayer, event.target.value),
      "Unable to update the vector fill."
    );
  });

  ui.vectorFillTransparent.addEventListener("change", (event) => {
    const activeLayer = getActiveLayer();
    if (!isVectorLayer(activeLayer)) {
      refresh();
      return;
    }

    applyActiveVectorLayerStyle(
      getVectorFillChanges(activeLayer, event.target.checked ? "transparent" : ui.vectorFillValue.value),
      "Unable to update the vector fill."
    );
  });

  ui.vectorStrokeValue.addEventListener("input", () => {
    if (ui.vectorStrokeTransparent.checked) {
      ui.vectorStrokeTransparent.checked = false;
    }
  });

  ui.vectorStrokeValue.addEventListener("change", (event) => {
    applyActiveVectorLayerStyle(
      { stroke: event.target.value },
      "Unable to update the vector stroke."
    );
  });

  ui.vectorStrokeTransparent.addEventListener("change", (event) => {
    applyActiveVectorLayerStyle(
      { stroke: event.target.checked ? "transparent" : ui.vectorStrokeValue.value },
      "Unable to update the vector stroke."
    );
  });

  ui.vectorStrokeWidth.addEventListener("change", (event) => {
    const strokeWidth = Math.round(clamp(Number(event.target.value) || 0, 0, 24));
    applyActiveVectorLayerStyle(
      { strokeWidth },
      "Unable to update the vector stroke width."
    );
  });

  ui.contextualVectorFill.addEventListener("change", (event) => {
    applyActiveVectorLayerStyle(
      getVectorFillChanges(getActiveLayer(), event.target.value),
      "Unable to update the vector fill."
    );
  });

  ui.contextualVectorStroke.addEventListener("change", (event) => {
    applyActiveVectorLayerStyle(
      { stroke: event.target.value },
      "Unable to update the vector stroke."
    );
  });

  ui.contextualVectorStrokeWidth.addEventListener("change", (event) => {
    const strokeWidth = Math.round(clamp(Number(event.target.value) || 0, 0, 24));
    applyActiveVectorLayerStyle(
      { strokeWidth },
      "Unable to update the vector stroke width."
    );
  });

  ui.textFontFamily.addEventListener("change", (event) => {
    updateTextDefaults({ fontFamily: event.target.value });
    applyTextStyleToActiveLayer({ fontFamily: event.target.value });
  });

  ui.optionsTextFontFamily.addEventListener("change", (event) => {
    updateTextDefaults({ fontFamily: event.target.value });
    applyTextStyleToActiveLayer({ fontFamily: event.target.value });
  });

  ui.contextualTextFontFamily.addEventListener("change", (event) => {
    updateTextDefaults({ fontFamily: event.target.value });
    applyTextStyleToActiveLayer({ fontFamily: event.target.value });
  });

  ui.textFontWeight.addEventListener("change", (event) => {
    updateTextDefaults({ fontWeight: event.target.value });
    applyTextStyleToActiveLayer({ fontWeight: event.target.value });
  });

  ui.textFontSize.addEventListener("change", (event) => {
    const nextSize = clamp(Number(event.target.value) || state.textFontSize, 8, 320);
    const fontSize = Math.round(nextSize);
    updateTextDefaults({ fontSize });
    event.target.value = String(state.textFontSize);
    applyTextStyleToActiveLayer({ fontSize });
  });

  ui.optionsTextFontSize.addEventListener("change", (event) => {
    const nextSize = clamp(Number(event.target.value) || state.textFontSize, 8, 320);
    const fontSize = Math.round(nextSize);
    updateTextDefaults({ fontSize });
    event.target.value = String(state.textFontSize);
    applyTextStyleToActiveLayer({ fontSize });
  });

  ui.contextualTextFontSize.addEventListener("change", (event) => {
    const nextSize = clamp(Number(event.target.value) || state.textFontSize, 8, 320);
    const fontSize = Math.round(nextSize);
    updateTextDefaults({ fontSize });
    event.target.value = String(state.textFontSize);
    applyTextStyleToActiveLayer({ fontSize });
  });

  ui.textLineHeight.addEventListener("change", (event) => {
    const nextLineHeight = clamp(Number(event.target.value) || state.textLineHeight, 0.8, 3);
    const lineHeight = round(nextLineHeight, 2);
    updateTextDefaults({ lineHeight });
    event.target.value = String(state.textLineHeight);
    applyTextStyleToActiveLayer({ lineHeight });
  });

  ui.textColorValue.addEventListener("change", (event) => {
    const parsed = parseColorValue(event.target.value);
    if (!parsed) {
      refresh();
      return;
    }

    const nextDefaults = { color: parsed.color };
    const nextLayerStyle = { color: parsed.color };
    if (parsed.opacity !== null) {
      nextDefaults.opacity = parsed.opacity;
      nextLayerStyle.opacity = parsed.opacity;
    }
    updateTextDefaults(nextDefaults);
    if (!applyTextStyleToActiveLayer(nextLayerStyle)) {
      refresh();
    }
  });

  ui.textColorValue.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  });

  ui.contextualTextColor.addEventListener("change", (event) => {
    updateTextDefaults({ color: event.target.value });
    if (!applyTextStyleToActiveLayer({ color: event.target.value })) {
      refresh();
    }
  });

  ui.textStrokeValue.addEventListener("change", (event) => {
    const parsed = parseColorValue(event.target.value, { allowTransparent: true });
    if (!parsed) {
      refresh();
      return;
    }

    updateTextDefaults({ strokeColor: parsed.cssColor });
    if (!applyTextStyleToActiveLayer({ strokeColor: parsed.cssColor })) {
      refresh();
    }
  });

  ui.textStrokeValue.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  });

  ui.textStrokeWidth.addEventListener("change", (event) => {
    const nextStrokeWidth = clamp(Number(event.target.value) || 0, 0, 24);
    const strokeWidth = Math.round(nextStrokeWidth);
    updateTextDefaults({ strokeWidth });
    event.target.value = String(state.textStrokeWidth);
    applyTextStyleToActiveLayer({ strokeWidth });
  });

  ui.textBackgroundValue.addEventListener("change", (event) => {
    const parsed = parseColorValue(event.target.value, { allowTransparent: true });
    if (!parsed) {
      refresh();
      return;
    }

    updateTextDefaults({ backgroundColor: parsed.cssColor });
    if (!applyTextStyleToActiveLayer({ backgroundColor: parsed.cssColor })) {
      refresh();
    }
  });

  ui.textBackgroundValue.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur();
    }
  });

  ui.textAlign.addEventListener("change", (event) => {
    updateTextDefaults({ align: event.target.value });
    applyTextStyleToActiveLayer({ align: event.target.value });
  });

  ui.optionsTextAlign.addEventListener("change", (event) => {
    updateTextDefaults({ align: event.target.value });
    applyTextStyleToActiveLayer({ align: event.target.value });
  });

  ui.contextualTextAlign.addEventListener("change", (event) => {
    updateTextDefaults({ align: event.target.value });
    applyTextStyleToActiveLayer({ align: event.target.value });
  });

  ui.shapeType.addEventListener("change", (event) => {
    state.shapeType = event.target.value;
    if (state.tool === "line" && state.shapeType !== "line") {
      state.tool = "shape";
    }
    refresh();
  });

  ui.optionsShapeType.addEventListener("change", (event) => {
    state.shapeType = event.target.value;
    if (state.tool === "line" && state.shapeType !== "line") {
      state.tool = "shape";
    }
    refresh();
  });

  ui.shapeStrokeWidth.addEventListener("change", (event) => {
    state.shapeStrokeWidth = Math.round(clamp(Number(event.target.value) || state.shapeStrokeWidth, 1, 48));
    event.target.value = String(state.shapeStrokeWidth);
    refresh();
  });

  ui.optionsShapeStrokeWidth.addEventListener("change", (event) => {
    state.shapeStrokeWidth = Math.round(clamp(Number(event.target.value) || state.shapeStrokeWidth, 1, 48));
    event.target.value = String(state.shapeStrokeWidth);
    refresh();
  });

  ui.optionsShapeOpacity.addEventListener("input", (event) => {
    state.brushOpacity = Number(event.target.value) / 100;
    updateColorInputs();
    refresh();
  });

  ui.textEditor.addEventListener("input", () => {
    autosizeTextEditor();
  });

  ui.textEditor.addEventListener("blur", () => {
    if (state.textEditorLayerId) {
      closeInlineTextEditor();
    }
  });

  ui.textEditor.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      ui.textEditor.blur();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeInlineTextEditor({ commit: false });
    }
  });

  const transformInputs = [
    ui.transformX,
    ui.transformY,
    ui.transformWidth,
    ui.transformHeight,
    ui.transformRotation
  ];

  const optionTransformInputs = [
    ui.optionsTransformX,
    ui.optionsTransformY,
    ui.optionsTransformWidth,
    ui.optionsTransformHeight,
    ui.optionsTransformRotation
  ];

  for (const input of transformInputs) {
    input.addEventListener("change", (event) => {
      const field = event.target.dataset.transformField;
      if (!field) {
        return;
      }

      setActiveLayerTransform(field, event.target.value);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.target.blur();
      }
    });
  }

  for (const input of optionTransformInputs) {
    input.addEventListener("change", (event) => {
      const field = event.target.dataset.optionsTransformField;
      if (!field) {
        return;
      }

      setActiveLayerTransform(field, event.target.value);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.target.blur();
      }
    });
  }

  ui.layerBlendMode.addEventListener("change", (event) => {
    const activeLayer = getActiveLayer();
    if (!activeLayer) {
      refresh();
      return;
    }

    setLayerBlendMode(activeLayer.id, event.target.value);
  });

  ui.layerOpacity.addEventListener("focus", showLayerOpacityPopover);
  ui.layerOpacity.addEventListener("click", showLayerOpacityPopover);
  ui.layerOpacity.addEventListener("input", (event) => {
    setActiveLayerOpacityFromControl(event.target.value, { commit: false });
  });

  ui.layerOpacity.addEventListener("change", (event) => {
    setActiveLayerOpacityFromControl(event.target.value, { commit: true });
  });

  ui.layerOpacitySlider.addEventListener("input", (event) => {
    setActiveLayerOpacityFromControl(event.target.value, { commit: false });
  });

  ui.layerOpacitySlider.addEventListener("change", (event) => {
    setActiveLayerOpacityFromControl(event.target.value, { commit: true });
  });

  ui.contextualRasterOpacity.addEventListener("input", (event) => {
    const activeLayer = getActiveLayer();
    if (!activeLayer) {
      refresh();
      return;
    }

    ui.contextualRasterOpacityValue.textContent = `${event.target.value}%`;
    setLayerOpacity(activeLayer.id, event.target.value, { commit: false });
  });

  ui.contextualRasterOpacity.addEventListener("change", (event) => {
    const activeLayer = getActiveLayer();
    if (!activeLayer) {
      refresh();
      return;
    }

    setLayerOpacity(activeLayer.id, event.target.value, { commit: true });
  });

  const contextualTransformInputs = [
    ui.contextualRasterWidth,
    ui.contextualRasterHeight
  ];

  for (const input of contextualTransformInputs) {
    input.addEventListener("change", (event) => {
      const field = event.target.dataset.contextualTransformField;
      if (!field) {
        return;
      }

      setActiveLayerTransform(field, event.target.value);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.target.blur();
      }
    });
  }

  const contextualTextNumericInputs = [
    ui.contextualTextFontSize,
    ui.contextualVectorStrokeWidth
  ];

  for (const input of contextualTextNumericInputs) {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.target.blur();
      }
    });
  }

  for (const input of adjustmentInputs) {
    input.addEventListener("input", (event) => {
      const field = event.target.dataset.adjustmentSetting;
      if (!field) {
        return;
      }

      setActiveAdjustmentSetting(field, event.target.value, { commit: false });
    });

    input.addEventListener("change", (event) => {
      const field = event.target.dataset.adjustmentSetting;
      if (!field) {
        return;
      }

      setActiveAdjustmentSetting(field, event.target.value, { commit: true });
    });
  }

  fileInput.addEventListener("change", (event) => {
    Promise.resolve(importFile(event.target.files?.[0]))
      .catch((error) => reportError(error, "Unable to open the image."))
      .finally(() => {
        event.target.value = "";
      });
  });

  projectInput.addEventListener("change", async (event) => {
    try {
      await importProjectFile(event.target.files?.[0]);
    } catch (error) {
      await reportError(error, "Unable to open project.");
    } finally {
      event.target.value = "";
    }
  });

  layerList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-layer-action], button[data-group-action], button[data-layer-mask-action], button[data-layer-clip-action]");
    if (!button) {
      if (event.target instanceof HTMLInputElement) {
        return;
      }

      const row = event.target.closest(".layer-row");
      if (row?.dataset.layerId) {
        handleLayerSelectionClick(row.dataset.layerId, event);
        refresh({ rebuildLayers: true });
      } else if (row?.dataset.groupId) {
        handleGroupSelectionClick(row.dataset.groupId, event);
        refresh({ rebuildLayers: true });
      }
      return;
    }

    const { layerAction, layerId, groupAction, groupId, layerMaskAction, layerClipAction } = button.dataset;
    if (layerMaskAction === "add" && layerId) {
      selectSingleLayer(layerId);
      addLayerMask(layerId);
      return;
    }

    if (layerMaskAction === "edit" && layerId) {
      selectSingleLayer(layerId);
      toggleLayerMaskEditing(layerId);
      return;
    }

    if (layerClipAction === "toggle" && layerId) {
      selectSingleLayer(layerId);
      toggleLayerClippingMask(layerId);
      return;
    }

    if (layerAction === "visibility") {
      toggleLayerVisibility(layerId);
      return;
    }

    if (layerAction === "select") {
      handleLayerSelectionClick(layerId, event);
      refresh({ rebuildLayers: true });
      return;
    }

    if (groupAction === "select") {
      handleGroupSelectionClick(groupId, event);
      refresh({ rebuildLayers: true });
      return;
    }

    if (groupAction === "visibility") {
      toggleLayerGroupVisibility(groupId);
      return;
    }

    if (groupAction === "collapse") {
      toggleLayerGroupCollapsed(groupId);
    }
  });

  layerList.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const { layerAction, layerId } = target.dataset;
    if (!layerId) {
      return;
    }

    if (layerAction === "opacity") {
      selectSingleLayer(layerId);
      const valueLabel = target.parentElement?.querySelector("strong");
      if (valueLabel) {
        valueLabel.textContent = `${target.value}%`;
      }
      setLayerOpacity(layerId, target.value, { commit: false });
    }
  });

  layerList.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const { layerAction, layerId, groupAction, groupId } = target.dataset;
    if (layerAction === "rename" && layerId) {
      selectSingleLayer(layerId);
      renameLayer(layerId, target.value);
    } else if (layerAction === "opacity" && layerId) {
      selectSingleLayer(layerId);
      setLayerOpacity(layerId, target.value, { commit: true });
    } else if (groupAction === "rename" && groupId) {
      renameLayerGroup(groupId, target.value);
    }
  });

  layerList.addEventListener("keydown", (event) => {
    const target = event.target;
    if (
      event.key === "Enter"
      && target instanceof HTMLInputElement
      && (target.dataset.layerAction === "rename" || target.dataset.groupAction === "rename")
    ) {
      target.blur();
    }
  });

  layerList.addEventListener("dragstart", (event) => {
    const handle = event.target.closest("[data-layer-drag-handle]");
    if (!(handle instanceof HTMLElement)) {
      return;
    }

    const row = handle.closest(".layer-row");
    const blockKey = row?.dataset.blockKey;
    if (!blockKey || !event.dataTransfer) {
      return;
    }

    let selectionChanged = false;
    if (handle.dataset.layerId && !isLayerSelected(handle.dataset.layerId)) {
      selectSingleLayer(handle.dataset.layerId);
      selectionChanged = true;
    } else if (handle.dataset.groupId && !isGroupFullySelected(handle.dataset.groupId)) {
      const groupLayerIds = getGroupLayerIds(handle.dataset.groupId);
      setLayerSelection(groupLayerIds, {
        activeLayerId: groupLayerIds[0] ?? null,
        anchorId: groupLayerIds[0] ?? null
      });
      selectionChanged = true;
    }

    state.layerPanelDrag = {
      sourceKey: blockKey,
      targetKey: null,
      position: "after"
    };
    document.body.classList.add("is-layer-panel-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", blockKey);
    if (selectionChanged) {
      refresh({ rebuildLayers: true });
      return;
    }
    syncLayerPanelDropIndicators();
  });

  layerList.addEventListener("dragover", (event) => {
    if (!state.layerPanelDrag) {
      return;
    }

    const target = getLayerPanelDropTarget(event.clientY);
    if (!target || target.targetKey === state.layerPanelDrag.sourceKey) {
      if (state.layerPanelDrag.targetKey !== null) {
        state.layerPanelDrag = {
          ...state.layerPanelDrag,
          targetKey: null
        };
        syncLayerPanelDropIndicators();
      }
      return;
    }

    event.preventDefault();
    if (state.layerPanelDrag.targetKey !== target.targetKey || state.layerPanelDrag.position !== target.position) {
      state.layerPanelDrag = {
        ...state.layerPanelDrag,
        targetKey: target.targetKey,
        position: target.position
      };
      syncLayerPanelDropIndicators();
    }
  });

  layerList.addEventListener("drop", (event) => {
    if (!state.layerPanelDrag) {
      return;
    }

    event.preventDefault();
    const { sourceKey, targetKey, position } = state.layerPanelDrag;
    state.layerPanelDrag = null;
    document.body.classList.remove("is-layer-panel-dragging");
    if (!targetKey) {
      syncLayerPanelDropIndicators();
      return;
    }

    moveLayerPanelBlock(sourceKey, targetKey, position);
  });

  layerList.addEventListener("dragend", () => {
    if (!state.layerPanelDrag) {
      return;
    }

    state.layerPanelDrag = null;
    document.body.classList.remove("is-layer-panel-dragging");
    syncLayerPanelDropIndicators();
  });

  ui.dialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitDialog();
  });

  ui.dialogCancel.addEventListener("click", () => {
    cancelDialog();
  });

  ui.dialogExtra.addEventListener("click", () => {
    closeDialog({
      action: ui.dialogExtra.dataset.actionValue || "extra",
      confirmed: false,
      values: null
    });
  });

  ui.dialogClose.addEventListener("click", () => {
    cancelDialog();
  });

  ui.dialog.addEventListener("click", (event) => {
    const dismissTarget = event.target instanceof Element ? event.target.closest("[data-dialog-dismiss]") : null;
    if (dismissTarget && state.dialogSession?.closeOnOverlay) {
      cancelDialog();
    }
  });

  ui.dialog.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Escape" && state.dialogSession?.allowCancel) {
      event.preventDefault();
      cancelDialog();
    }
  });

  stage.addEventListener("pointerdown", beginInteraction);
  ui.inspectorResizeHandle.addEventListener("pointerdown", beginInspectorResize);
  window.addEventListener("pointermove", updateInteraction);
  window.addEventListener("pointermove", updateContextualBarDrag);
  window.addEventListener("pointermove", updateInspectorResize);
  window.addEventListener("pointerup", endInteraction);
  window.addEventListener("pointerup", endContextualBarDrag);
  window.addEventListener("pointerup", endInspectorResize);
  window.addEventListener("pointercancel", endInteraction);
  window.addEventListener("pointercancel", endContextualBarDrag);
  window.addEventListener("pointercancel", endInspectorResize);

  stage.addEventListener("pointerleave", () => {
    if (state.pointer.mode) {
      return;
    }

    state.hoverCanvasPoint = null;
    state.hoverDocPoint = null;
    refresh();
  });

  stage.addEventListener("wheel", (event) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.08 : 1 / 1.08;
    zoomAt(factor, event.clientX, event.clientY);
  }, { passive: false });

  stage.addEventListener("contextmenu", (event) => {
    const canvasPoint = clientToCanvasPoint(event.clientX, event.clientY);
    const docPoint = canvasToDocPoint(canvasPoint);
    const hitLayer = isPointInsideDocument(docPoint)
      ? getTopmostVisibleLayerAtDocPoint(docPoint, { includeBackground: false })
      : null;

    if (hitLayer && !isBackgroundLayer(hitLayer)) {
      event.preventDefault();
      state.hoverCanvasPoint = canvasPoint;
      state.hoverDocPoint = docPoint;
      selectSingleLayer(hitLayer.id);
      ui.layerBringToFront.disabled = !canReorderLayerByAction(hitLayer.id, "front");
      ui.layerBringForward.disabled = !canReorderLayerByAction(hitLayer.id, "forward");
      ui.layerSendBackward.disabled = !canReorderLayerByAction(hitLayer.id, "backward");
      ui.layerSendToBack.disabled = !canReorderLayerByAction(hitLayer.id, "back");
      setLayerContextMenuOpen(true, event.clientX, event.clientY);
      refresh({ rebuildLayers: true });
      return;
    }

    const selectionRect = getSelectionRect();
    if (!selectionRect || !getActiveLayer()) {
      closeContextMenus();
      return;
    }

    event.preventDefault();
    setSelectionMenuOpen(true, event.clientX, event.clientY);
  });

  stage.addEventListener("dragenter", (event) => {
    event.preventDefault();
    stage.classList.add("is-drag-over");
  });

  stage.addEventListener("dragover", (event) => {
    event.preventDefault();
    stage.classList.add("is-drag-over");
  });

  stage.addEventListener("dragleave", (event) => {
    if (event.target === stage) {
      stage.classList.remove("is-drag-over");
    }
  });

  stage.addEventListener("drop", (event) => {
    event.preventDefault();
    stage.classList.remove("is-drag-over");
    const file = [...(event.dataTransfer?.files || [])].find((entry) => isSupportedImageFile(entry));
    Promise.resolve(importFile(file)).catch((error) => reportError(error, "Unable to open the image."));
  });

  window.addEventListener("keydown", handleShortcuts);
  window.addEventListener("keyup", releaseShortcut);
  window.addEventListener("click", (event) => {
    closeContextMenus();
    if (!(event.target instanceof Element) || !event.target.closest(".opacity-value-control")) {
      hideLayerOpacityPopover();
    }
    if (!(event.target instanceof Node) || !event.target.closest("[data-menu-root]")) {
      closeMenus();
    }
  });

  document.querySelector(".topbar-menus")?.addEventListener("mouseleave", () => {
    closeMenus();
  });

  const resizeObserver = new ResizeObserver(() => {
    if (resizeCanvas()) {
      fitToStage();
    }
    refresh();
  });
  resizeObserver.observe(stage);
}

function initialize() {
  syncExportFormatControl();
  ui.brushSize.value = String(state.brushSize);
  ui.brushOpacity.value = String(state.brushOpacity * 100);
  ui.optionsRegionTolerance.value = String(state.regionTolerance);
  ui.optionsRegionToleranceValue.textContent = String(state.regionTolerance);
  ui.optionsRegionContiguous.checked = state.regionContiguous;
  ui.optionsGradientType.value = state.gradientType;
  ui.optionsRulerValue.textContent = formatRulerMeasurement(null);
  updateColorInputs();
  ui.vectorFillValue.value = state.brushColor;
  ui.vectorFillTransparent.checked = true;
  ui.vectorStrokeValue.value = state.brushColor;
  ui.vectorStrokeTransparent.checked = true;
  ui.vectorStrokeWidth.value = "0";
  ui.textFontFamily.value = state.textFontFamily;
  ui.textFontWeight.value = state.textFontWeight;
  ui.textFontSize.value = String(state.textFontSize);
  ui.textLineHeight.value = String(state.textLineHeight);
  ui.textColorValue.value = rgbaStringFromParts(state.textColor, state.textOpacity);
  ui.textStrokeValue.value = state.textStrokeColor;
  ui.textStrokeWidth.value = String(state.textStrokeWidth);
  ui.textBackgroundValue.value = state.textBackgroundColor;
  ui.textAlign.value = state.textAlign;
  ui.shapeType.value = state.shapeType;
  ui.shapeStrokeWidth.value = String(state.shapeStrokeWidth);
  ui.optionsShapeStrokeWidth.value = String(state.shapeStrokeWidth);
  applyInspectorWidth(state.inspectorWidth);
  attachEvents();
  syncShellState();
  refresh({ rebuildLayers: true });
}

initialize();
