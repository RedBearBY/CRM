import { useState, useEffect, useMemo, useCallback, useRef } from "react";

const App = () => {
  // Initial control points for Polygraphy
  const initialControlPointsPolygraphy = [
    { id: 1, purchase: 0, retail: 0, name: "" }, // Added name field
    { id: 2, purchase: 50, retail: 700, name: "" },
    { id: 3, purchase: 100, retail: 800, name: "" },
    { id: 4, purchase: 138, retail: 993.6, name: "" },
    { id: 5, purchase: 1000, retail: 2700, name: "" },
    { id: 6, purchase: 10000, retail: 15000, name: "" }
  ];

  // Initial control points for Wide Format
  const initialControlPointsWideFormat = [
    { id: 1, purchase: 0, retail: 0, name: "" }, // Added name field
    { id: 2, purchase: 100, retail: 300, name: "" },
    { id: 3, purchase: 500, retail: 1200, name: "" },
    { id: 4, purchase: 1000, retail: 2000, name: "" },
    { id: 5, purchase: 5000, retail: 7500, name: "" },
    { id: 6, purchase: 10000, retail: 12000, name: "" }
  ];

  // Initial control points for Retail
  const initialControlPointsRetail = [
    { id: 1, purchase: 0, retail: 0, name: "" }, // Added name field
    { id: 2, purchase: 100, retail: 250, name: "" },
    { id: 3, purchase: 500, retail: 1000, name: "" },
    { id: 4, purchase: 1000, retail: 1800, name: "" },
    { id: 5, purchase: 5000, retail: 6000, name: "" },
    { id: 6, purchase: 10000, retail: 11000, name: "" }
  ];


  // State for minimum coefficient (Polygraphy)
  const [minCoefficientPolygraphy, setMinCoefficientPolygraphy] = useState(() => {
    const saved = localStorage.getItem("minCoefficientPolygraphy");
    try {
      const parsed = saved ? JSON.parse(saved) : {};
      return !isNaN(parseFloat(parsed.value)) ? parseFloat(parsed.value) : (!isNaN(parseFloat(saved)) ? parseFloat(saved) : 1.5);
    } catch (e) {
      console.error("Failed to parse minCoefficientPolygraphy from localStorage:", e);
      return !isNaN(parseFloat(saved)) ? parseFloat(saved) : 1.5;
    }
  });

  // State for minimum coefficient (Wide Format)
  const [minCoefficientWideFormat, setMinCoefficientWideFormat] = useState(() => {
    const saved = localStorage.getItem("minCoefficientWideFormat");
    try {
      const parsed = saved ? JSON.parse(saved) : {};
      return !isNaN(parseFloat(parsed.value)) ? parseFloat(parsed.value) : (!isNaN(parseFloat(saved)) ? parseFloat(saved) : 2.0);
    } catch (e) {
      console.error("Failed to parse minCoefficientWideFormat from localStorage:", e);
      return !isNaN(parseFloat(saved)) ? parseFloat(saved) : 2.0;
    }
  });

  // State for minimum coefficient (Retail)
  const [minCoefficientRetail, setMinCoefficientRetail] = useState(() => {
    const saved = localStorage.getItem("minCoefficientRetail");
    try {
      const parsed = saved ? JSON.parse(saved) : {};
      return !isNaN(parseFloat(parsed.value)) ? parseFloat(parsed.value) : (!isNaN(parseFloat(saved)) ? parseFloat(saved) : 1.2);
    } catch (e) {
      console.error("Failed to parse minCoefficientRetail from localStorage:", e);
      return !isNaN(parseFloat(saved)) ? parseFloat(saved) : 1.2;
    }
  });


  // State for low margin threshold
  const [lowMarginThreshold, setLowMarginThreshold] = useState(() => {
    const saved = localStorage.getItem("lowMarginThreshold");
    return saved && !isNaN(parseFloat(saved)) ? parseFloat(saved) : 900;
  });

  // State for control points (Polygraphy)
  const [controlPointsPolygraphy, setControlPointsPolygraphy] = useState(() => {
    const saved = localStorage.getItem("controlPointsPolygraphy");
    try {
      const parsed = saved ? JSON.parse(saved) : initialControlPointsPolygraphy;
      return parsed.map(p => ({
        ...p,
        purchase: !isNaN(parseFloat(p.purchase)) ? parseFloat(p.purchase) : 0,
        retail: !isNaN(parseFloat(p.retail)) ? parseFloat(p.retail) : 0,
        name: p.name ?? "" // Ensure name field exists
      })).sort((a, b) => a.purchase - b.purchase);
    } catch (e) {
      console.error("Failed to parse controlPointsPolygraphy from localStorage:", e);
      return initialControlPointsPolygraphy.map(p => ({ ...p, name: "" })).sort((a, b) => a.purchase - b.purchase);
    }
  });

  // State for control points (Wide Format)
  const [controlPointsWideFormat, setControlPointsWideFormat] = useState(() => {
    const saved = localStorage.getItem("controlPointsWideFormat");
    try {
      const parsed = saved ? JSON.parse(saved) : initialControlPointsWideFormat;
      return parsed.map(p => ({
        ...p,
        purchase: !isNaN(parseFloat(p.purchase)) ? parseFloat(p.purchase) : 0,
        retail: !isNaN(parseFloat(p.retail)) ? parseFloat(p.retail) : 0,
        name: p.name ?? "" // Ensure name field exists
      })).sort((a, b) => a.purchase - b.purchase);
    } catch (e) {
      console.error("Failed to parse controlPointsWideFormat from localStorage:", e);
      return initialControlPointsWideFormat.map(p => ({ ...p, name: "" })).sort((a, b) => a.purchase - b.purchase);
    }
  });

  // State for control points (Retail)
  const [controlPointsRetail, setControlPointsRetail] = useState(() => {
    const saved = localStorage.getItem("controlPointsRetail");
    try {
      const parsed = saved ? JSON.parse(saved) : initialControlPointsRetail;
      return parsed.map(p => ({
        ...p,
        purchase: !isNaN(parseFloat(p.purchase)) ? parseFloat(p.purchase) : 0,
        retail: !isNaN(parseFloat(p.retail)) ? parseFloat(p.retail) : 0,
        name: p.name ?? "" // Ensure name field exists
      })).sort((a, b) => a.purchase - b.purchase);
    } catch (e) {
      console.error("Failed to parse controlPointsRetail from localStorage:", e);
      return initialControlPointsRetail.map(p => ({ ...p, name: "" })).sort((a, b) => a.purchase - b.purchase);
    }
  });


  // State for available tags and their colors
  const [availableTags, setAvailableTags] = useState(() => {
    const saved = localStorage.getItem("availableTags");
    try {
      return saved ? JSON.parse(saved) : [
        { id: 1, name: "Срочный", color: "#EF4444" }, // Red
        { id: 2, name: "Новый клиент", color: "#3B82F6" }, // Blue
        { id: 3, name: "Повторный заказ", color: "#22C55E" }, // Green
      ];
    } catch (e) {
      console.error("Failed to parse availableTags from localStorage:", e);
      return [];
    }
  });

  // State for available client tags and their colors
  const [availableClientTags, setAvailableClientTags] = useState(() => {
    const saved = localStorage.getItem("availableClientTags");
    try {
      return saved ? JSON.parse(saved) : [
        { id: 1, name: "VIP", color: "#F59E0B" }, // Amber
        { id: 2, name: "Постоянный", color: "#10B981" }, // Emerald
        { id: 3, name: "Проблемный", color: "#EF4444" }, // Red
      ];
    } catch (e) {
      console.error("Failed to parse availableClientTags from localStorage:", e);
      return [];
    }
  });

  // State for customizable order statuses
  const [availableStatuses, setAvailableStatuses] = useState(() => {
    const saved = localStorage.getItem("availableStatuses");
    try {
      return saved ? JSON.parse(saved) : [
        { id: 1, name: "Новый", value: "new", color: "#3B82F6" }, // Blue
        { id: 2, name: "В работе", value: "inProgress", color: "#F59E0B" }, // Yellow
        { id: 3, name: "Выполнен", value: "completed", color: "#10B981" }, // Green
      ];
    } catch (e) {
      console.error("Failed to parse availableStatuses from localStorage:", e);
      return [
        { id: 1, name: "Новый", value: "new", color: "#3B82F6" },
        { id: 2, name: "В работе", value: "inProgress", color: "#F59E0B" },
        { id: 3, name: "Выполнен", value: "completed", color: "#10B981" },
      ];
    }
  });

  // New: State for customizable payment statuses
  const [availablePaymentStatuses, setAvailablePaymentStatuses] = useState(() => {
    const saved = localStorage.getItem("availablePaymentStatuses");
    try {
      return saved ? JSON.parse(saved) : [
        { id: 1, name: "Оплачен", value: "paid", color: "#22C55E" },
        { id: 2, name: "Не оплачен", value: "unpaid", color: "#EF4444" },
        { id: 3, name: "Частично оплачен", value: "partiallyPaid", color: "#F59E0B" }
      ];
    } catch (e) {
      console.error("Failed to parse availablePaymentStatuses from localStorage:", e);
      return [
        { id: 1, name: "Оплачен", value: "paid", color: "#22C55E" },
        { id: 2, name: "Не оплачен", value: "unpaid", color: "#EF4444" },
        { id: 3, name: "Частично оплачен", value: "partiallyPaid", color: "#F59E0B" }
      ];
    }
  });


  // State for available employees
  const [availableEmployees, setAvailableEmployees] = useState(() => {
      const saved = localStorage.getItem("availableEmployees");
      try {
          // Add default color to existing employees if not present
          const parsed = saved ? JSON.parse(saved) : [{ id: 1, name: "Не указан", color: "#6B7280" }];
          return parsed.map(emp => ({ ...emp, color: emp.color || "#6B7280" }));
      } catch (e) {
          console.error("Failed to parse availableEmployees from localStorage:", e);
          return [{ id: 1, name: "Не указан", color: "#6B7280" }];
      }
  });

  // State for calculation history, loaded from localStorage
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("calculationHistory");
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map(item => ({
        ...item,
        isArchived: item.isArchived ?? false,
        status: Array.isArray(item.status) ? item.status : (item.status ? [item.status] : ["new"]),
        paymentStatus: item.paymentStatus ?? "unpaid", // New: Initialize paymentStatus
        products: Array.isArray(item.products) && item.products.length > 0
          ? item.products.map(p => ({
              id: p.id ?? Date.now() + Math.random(),
              purchase: !isNaN(parseFloat(p.purchase)) ? parseFloat(p.purchase) : 0,
              delivery: !isNaN(parseFloat(p.delivery)) ? parseFloat(p.delivery) : 0,
              productName: p.productName ?? "",
              paperFormat: p.paperFormat ?? "",
              sides: p.sides ?? 1,
              layoutStatus: p.layoutStatus ?? "client",
              quantity: !isNaN(parseInt(p.quantity)) ? parseInt(p.quantity) : 1,
              productComment: p.productComment ?? "",
              deliveryDate: p.deliveryDate ?? "",
              retail: p.retail ?? null,
              markup: p.markup ?? null,
              margin: p.margin ?? null,
              calculatorType: p.calculatorType ?? 'polygraphy',
              tags: p.tags ?? [],
              layoutCost: p.layoutCost ?? "",
              manualRetailEnabled: p.manualRetailEnabled ?? false,
              manualRetailPrice: p.manualRetailPrice ?? "",
            }))
          : [{
              id: 1,
              purchase: !isNaN(parseFloat(item.purchase)) ? parseFloat(item.purchase) : 0,
              delivery: !isNaN(parseFloat(item.delivery)) ? parseFloat(item.delivery) : 0,
              productName: item.productDetails?.product ?? "",
              paperFormat: item.productDetails?.paperFormat ?? "",
              sides: item.productDetails?.sides ?? 1,
              layoutStatus: item.productDetails?.layoutStatus ?? "client",
              quantity: item.productDetails?.quantity ?? 1,
              productComment: item.productDetails?.orderComment ?? "",
              deliveryDate: item.productDetails?.deliveryDate ?? "",
              retail: item.retail ?? null,
              markup: item.markup ?? null,
              margin: item.margin ?? null,
              coefficient: item.coefficient ?? null,
              calculatorType: item.calculatorType ?? 'polygraphy',
              tags: [],
              layoutCost: "",
              manualRetailEnabled: false,
              manualRetailPrice: "",
            }],
        productDetails: undefined,
        purchase: undefined,
        delivery: undefined,
        retail: undefined,
        markup: undefined,
        margin: undefined,
        coefficient: undefined,
        calculatorType: undefined,
        employee: item.employee ?? "Не указан", // Initialize employee field
      }));
    } catch (e) {
      console.error("Failed to parse calculationHistory from localStorage:", e);
      return [];
    }
  });

  // State for all clients, loaded from localStorage
  const [allClients, setAllClients] = useState(() => {
    const saved = localStorage.getItem("allClients");
    try {
        // Ensure 'messenger', 'comment', and 'clientTags' fields exist for existing clients
        const parsed = saved ? JSON.parse(saved) : [];
        return parsed.map(client => ({
            ...client,
            messenger: client.messenger ?? "",
            comment: client.comment ?? "", // Initialize new comment field
            clientTags: client.clientTags ?? [], // Initialize new clientTags field
        }));
    } catch (e) {
        console.error("Failed to parse allClients from localStorage:", e);
        return [];
    }
  });

  // Effect to populate uniqueClientsData whenever history changes
  useEffect(() => {
    // This effect is now redundant for client suggestions, as suggestions will come from allClients directly.
    // However, it's kept to show how it *would* be used if uniqueClientsData was still derived from history.
    // For now, clientSuggestions will be directly filtered from allClients.
  }, [history]);

  // --- History View States ---
  const [selectedStatusesFilter, setSelectedStatusesFilter] = useState(() => {
    const saved = localStorage.getItem("selectedStatusesFilter");
    return saved ? JSON.parse(saved) : [];
  });
  const [showStatusFilterDropdown, setShowStatusFilterDropdown] = useState(false);
  const statusFilterRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem("searchQuery") || "");
  const [startDateFilter, setStartDateFilter] = useState(() => localStorage.getItem("startDateFilter") || "");
  const [endDateFilter, setEndDateFilter] = useState(() => localStorage.getItem("endDateFilter") || "");
  // Renamed for clarity: showClientTagFilterDropdown -> showClientManagerTagFilterDropdown
  const [showClientManagerTagFilterDropdown, setShowClientManagerTagFilterDropdown] = useState(false);
  const [selectedTagsFilter, setSelectedTagsFilter] = useState(() => {
    const saved = localStorage.getItem("selectedTagsFilter");
    return saved ? JSON.parse(saved) : [];
  });
  const [showTagFilterDropdown, setShowTagFilterDropdown] = useState(false);
  const tagFilterRef = useRef(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(() => {
    const saved = localStorage.getItem("sortConfig");
    return saved ? JSON.parse(saved) : { key: 'timestamp', direction: 'descending' };
  });
  const [showFilters, setShowFilters] = useState(true);
  const [showArchiveView, setShowArchiveView] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState([]);

  // State for tag editing popover in history view
  const [showHistoryTagEditPopover, setShowHistoryTagEditPopover] = useState(false);
  const [editingHistoryTagProduct, setEditingHistoryTagProduct] = useState(null); // Stores { orderId, productId, targetElement }
  const historyTagEditRef = useRef(null);

  // State for order status editing popover in history view
  const [showHistoryStatusEditPopover, setShowHistoryStatusEditPopover] = useState(false);
  const [editingHistoryStatusOrder, setEditingHistoryStatusOrder] = useState(null); // Stores { orderId, targetElement }
  const historyStatusEditRef = useRef(null);

  // New: State for payment status editing popover in history view
  const [showHistoryPaymentStatusEditPopover, setShowHistoryPaymentStatusEditPopover] = useState(false);
  const [editingHistoryPaymentStatusOrder, setEditingHistoryPaymentStatusOrder] = useState(null); // Stores { orderId, targetElement }
  const historyPaymentStatusEditRef = useRef(null);


  // State for sequential order numbering
  const [lastOrderSequence, setLastOrderSequence] = useState(() => {
    const saved = localStorage.getItem("lastOrderSequence");
    return saved ? parseInt(saved) : 0;
  });

  const getInitialNewProduct = () => ({
    id: Date.now(),
    purchase: "",
    delivery: "0",
    productName: "",
    paperFormat: "",
    sides: 1,
    layoutStatus: "client",
    quantity: 1,
    productComment: "",
    deliveryDate: "",
    retail: null,
    markup: null,
    margin: null,
    calculatorType: 'polygraphy',
    tags: [], // Tags array for the new product
    layoutCost: "",
    manualRetailEnabled: false, // New: Manual retail price toggle
    manualRetailPrice: "",      // New: Manual retail price input
    isValidPurchase: true,
    isValidDelivery: true,
    isValidQuantity: true,
    isValidLayoutCost: true,
    isValidManualRetailPrice: true,
    isValidProductName: true, // Add validation state for product name
  });


  // --- New Calculation Modal States ---
  const [showNewCalculationModal, setShowNewCalculationModal] = useState(false);
  const [currentClientInfo, setCurrentClientInfo] = useState({ name: "", phone: "", email: "", messenger: "", comment: "", orderComment: "", orderStatus: ["new"], paymentStatus: "unpaid", photoCenter: "Королёва 61", clientTags: [], employee: "Не указан", isValidName: true });
  const [showModalStatusDropdown, setShowModalStatusDropdown] = useState(false);
  const modalStatusDropdownRef = useRef(null);
  const [currentOrderProducts, setCurrentOrderProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(getInitialNewProduct());
  const [editingProductId, setEditingProductId] = useState(null);
  const [showProductTagDropdown, setShowProductTagDropdown] = useState(false); // State for product tag dropdown in modal
  const productTagDropdownRef = useRef(null); // Ref for product tag dropdown

  // New: State for client tag dropdown in new/edit calculation modal and client edit modal
  const [showNewCalculationClientTagDropdown, setShowNewCalculationClientTagDropdown] = useState(false);

  // State for photo center filter
  const [photoCenterFilter, setPhotoCenterFilter] = useState(() => {
    const saved = localStorage.getItem("photoCenterFilter");
    return saved || "all";
  });

  const clientNameInputRef = useRef(null);
  const modalScrollRef = useRef(null);

  // State for editing existing history entry
  const [editingIndex, setEditingIndex] = useState(null); // Corrected initialization
  
  // State for delete confirmation modal (shared for history deletion)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // State for product delete confirmation modal in order edit
  const [showProductDeleteConfirmModal, setShowProductDeleteConfirmModal] = useState(false);
  const [productToDeleteIdInModal, setProductToDeleteIdInModal] = useState(null);

  // State for archive/unarchive confirmation modal
  const [showArchiveConfirmModal, setShowArchiveConfirmModal] = useState(false);
  const [archiveIndex, setArchiveIndex] = useState(null);

  // State for toast notifications
  const [toastMessage, setToastMessage] = useState("");

  // State for toggling settings visibility (renamed)
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsView, setSettingsView] = useState('polygraphy');

  // Client suggestions (autocompletion)
  const [clientSuggestions, setClientSuggestions] = useState([]);

  // State for print options modal
  const [showPrintOptionsModal, setShowPrintOptionsModal] = useState(false);
  const [printEntry, setPrintEntry] = useState(null);
  const [printOptions, setPrintOptions] = useState({
    orderInfo: true,
    clientInfo: true,
    productDetails: true,
    productPurchase: true,
    productDelivery: true,
    productRetail: true,
    productMarkupMargin: true,
    productFormatSides: true,
    productLayoutQuantity: true,
    productCommentDate: true,
    productLayoutCost: true,
    totalSummary: true,
    totalPurchaseSummary: true,
    totalDeliverySummary: true,
    totalRetailSummary: true,
    totalMarkupSummary: true,
    totalMarginSummary: true,
    totalCoefficientSummary: true,
    paymentStatus: true, // New: print payment status
  });

  // New: Print format (A4, A5, etc.)
  const [printFormat, setPrintFormat] = useState(() => localStorage.getItem("printFormat") || 'A4');

  // New: Print templates
  const [printTemplates, setPrintTemplates] = useState(() => {
    const saved = localStorage.getItem("printTemplates");
    try {
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          name: "Полная",
          options: {
            orderInfo: true, clientInfo: true, productDetails: true, productPurchase: true, productDelivery: true,
            productRetail: true, productMarkupMargin: true, productFormatSides: true, productLayoutQuantity: true,
            productCommentDate: true, productLayoutCost: true, totalSummary: true, totalPurchaseSummary: true,
            totalDeliverySummary: true, totalRetailSummary: true, totalMarkupSummary: true, totalMarginSummary: true,
            totalCoefficientSummary: true, paymentStatus: true,
          }
        },
        {
          id: 2,
          name: "Для клиента",
          options: {
            orderInfo: true, clientInfo: true, productDetails: true, productPurchase: false, productDelivery: false,
            productRetail: true, productMarkupMargin: false, productFormatSides: true, productLayoutQuantity: true,
            productCommentDate: true, productLayoutCost: false, totalSummary: true, totalPurchaseSummary: false,
            totalDeliverySummary: false, totalRetailSummary: true, totalMarkupSummary: false, totalMarginSummary: false,
            totalCoefficientSummary: false, paymentStatus: true,
          }
        },
        {
          id: 3,
          name: "Для сотрудника",
          options: {
            orderInfo: true, clientInfo: true, productDetails: true, productPurchase: true, productDelivery: true,
            productRetail: true, productMarkupMargin: true, productFormatSides: true, productLayoutQuantity: true,
            productCommentDate: true, productLayoutCost: true, totalSummary: true, totalPurchaseSummary: true,
            totalDeliverySummary: true, totalRetailSummary: true, totalMarkupSummary: true, totalMarginSummary: true,
            totalCoefficientSummary: true, paymentStatus: true,
          }
        }
      ];
    } catch (e) {
      console.error("Failed to parse printTemplates from localStorage:", e);
      return [];
    }
  });

  // New: State for editing print template
  const [editingPrintTemplate, setEditingPrintTemplate] = useState(null);


  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // Client Management Modal States
  const [showClientManagerModal, setShowClientManagerModal] = useState(false);
  const [showClientEditModal, setShowClientEditModal] = useState(false);
  const [editingClientData, setEditingClientData] = useState(null); // The client object being edited
  const [showClientDeleteConfirmModal, setShowClientDeleteConfirmModal] = useState(false);
  const [clientToDeleteId, setClientToDeleteId] = useState(null);

  // Client Manager Filters
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [selectedClientTagsFilter, setSelectedClientTagsFilter] = useState([]);
  const clientTagFilterRef = useRef(null);
  const modalClientTagDropdownRef = useRef(null); // New: Ref for client tag dropdown in modal

  // Generic confirmation modal for settings deletions
  const [showConfirmActionModal, setShowConfirmActionModal] = useState(false);
  const [confirmActionMessage, setConfirmActionMessage] = useState("");
  const [confirmActionCallback, setConfirmActionCallback] = useState(null);

  // State for draggable modals
  const [draggableModalState, setDraggableModalState] = useState({});

  // --- localStorage persistence ---
  useEffect(() => {
    localStorage.setItem("calculationHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("allClients", JSON.stringify(allClients));
  }, [allClients]);

  useEffect(() => {
    // Store just the value for min coefficients
    localStorage.setItem("minCoefficientPolygraphy", JSON.stringify(minCoefficientPolygraphy));
  }, [minCoefficientPolygraphy]);

  useEffect(() => {
    localStorage.setItem("minCoefficientWideFormat", JSON.stringify(minCoefficientWideFormat));
  }, [minCoefficientWideFormat]);

  useEffect(() => {
    localStorage.setItem("minCoefficientRetail", JSON.stringify(minCoefficientRetail));
  }, [minCoefficientRetail]);

  useEffect(() => {
    localStorage.setItem("lowMarginThreshold", lowMarginThreshold);
  }, [lowMarginThreshold]);

  useEffect(() => {
    localStorage.setItem("controlPointsPolygraphy", JSON.stringify(controlPointsPolygraphy));
  }, [controlPointsPolygraphy]);

  useEffect(() => {
    localStorage.setItem("controlPointsWideFormat", JSON.stringify(controlPointsWideFormat));
  }, [controlPointsWideFormat]);

  useEffect(() => {
    localStorage.setItem("controlPointsRetail", JSON.stringify(controlPointsRetail));
  }, [controlPointsRetail]);

  useEffect(() => {
    localStorage.setItem("availableTags", JSON.stringify(availableTags));
  }, [availableTags]);

  useEffect(() => {
    localStorage.setItem("availableClientTags", JSON.stringify(availableClientTags));
  }, [availableClientTags]);

  useEffect(() => {
    localStorage.setItem("availableStatuses", JSON.stringify(availableStatuses));
  }, [availableStatuses]);

  useEffect(() => {
    localStorage.setItem("availablePaymentStatuses", JSON.stringify(availablePaymentStatuses)); // New: Persist payment statuses
  }, [availablePaymentStatuses]);

  useEffect(() => {
    localStorage.setItem("availableEmployees", JSON.stringify(availableEmployees));
  }, [availableEmployees]);

  useEffect(() => {
    localStorage.setItem("selectedStatusesFilter", JSON.stringify(selectedStatusesFilter));
  }, [selectedStatusesFilter]);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("startDateFilter", startDateFilter);
  }, [startDateFilter]);

  useEffect(() => {
    localStorage.setItem("endDateFilter", endDateFilter);
  }, [endDateFilter]);

  useEffect(() => {
    localStorage.setItem("selectedTagsFilter", JSON.stringify(selectedTagsFilter));
  }, [selectedTagsFilter]);

  useEffect(() => {
    localStorage.setItem("sortConfig", JSON.stringify(sortConfig));
  }, [sortConfig]);

  useEffect(() => {
    localStorage.setItem("photoCenterFilter", photoCenterFilter);
  }, [photoCenterFilter]);

  useEffect(() => {
    localStorage.setItem("lastOrderSequence", lastOrderSequence);
  }, [lastOrderSequence]);

  useEffect(() => {
    localStorage.setItem("printFormat", printFormat); // New: Persist print format
  }, [printFormat]);

  useEffect(() => {
    localStorage.setItem("printTemplates", JSON.stringify(printTemplates)); // New: Persist print templates
  }, [printTemplates]);


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagFilterRef.current && !tagFilterRef.current.contains(event.target)) {
        setShowTagFilterDropdown(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
        setShowStatusFilterDropdown(false);
      }
      if (modalStatusDropdownRef.current && !modalStatusDropdownRef.current.contains(event.target)) {
        setShowModalStatusDropdown(false);
      }
      if (historyTagEditRef.current && !historyTagEditRef.current.contains(event.target)) {
        setShowHistoryTagEditPopover(false);
        setEditingHistoryTagProduct(null);
      }
      if (historyStatusEditRef.current && !historyStatusEditRef.current.contains(event.target)) {
        setShowHistoryStatusEditPopover(false);
        setEditingHistoryStatusOrder(null);
      }
      if (historyPaymentStatusEditRef.current && !historyPaymentStatusEditRef.current.contains(event.target)) { // New: Payment status popover
        setShowHistoryPaymentStatusEditPopover(false);
        setEditingHistoryPaymentStatusOrder(null);
      }
      if (productTagDropdownRef.current && !productTagDropdownRef.current.contains(event.target)) {
        setShowProductTagDropdown(false);
      }
      // Updated: Check for client manager tag filter dropdown
      if (clientTagFilterRef.current && !clientTagFilterRef.current.contains(event.target)) {
        setShowClientManagerTagFilterDropdown(false);
      }
      // New: Check for new calculation/client edit modal client tag dropdown
      if (modalClientTagDropdownRef.current && !modalClientTagDropdownRef.current.contains(event.target)) {
        setShowNewCalculationClientTagDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Utility functions ---

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  }, []);

  const formatNumber = useCallback((num) => {
    if (typeof num !== 'number' || isNaN(num)) {
      return "-";
    }
    if (num === 0) { // New: Handle 0 explicitly
      return "0.00";
    }
    return num.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  }, []);

  const getStatusLabel = useCallback((statusValue) => {
    const status = availableStatuses.find(s => s.value === statusValue);
    return status ? status.name : "Неизвестно";
  }, [availableStatuses]);

  const getStatusColor = useCallback((statusValue) => {
    const status = availableStatuses.find(s => s.value === statusValue);
    return status ? status.color : "#6B7280"; // Default gray if not found
  }, [availableStatuses]);

  const getPaymentStatusLabel = useCallback((statusValue) => { // New: Get payment status label
    const status = availablePaymentStatuses.find(s => s.value === statusValue);
    return status ? status.name : "Неизвестно";
  }, [availablePaymentStatuses]);

  const getPaymentStatusColor = useCallback((statusValue) => { // New: Get payment status color
    const status = availablePaymentStatuses.find(s => s.value === statusValue);
    return status ? status.color : "#6B7280"; // Default gray if not found
  }, [availablePaymentStatuses]);

  const getClientTagColor = useCallback((tagName) => {
    const tag = availableClientTags.find(t => t.name === tagName);
    return tag ? tag.color : "#6B7280"; // Default gray if not found
  }, [availableClientTags]);

  const getEmployeeColor = useCallback((employeeName) => {
    const employee = availableEmployees.find(emp => emp.name === employeeName);
    return employee ? employee.color : "#6B7280"; // Default gray if not found
  }, [availableEmployees]);

  // Modified calculateRetailPrice to accept calculatorType
  const calculateRetailPrice = useCallback((price, type) => {
    price = Math.max(0, price);
    let result = 0;

    let currentMinCoefficient;
    let currentControlPoints;

    if (type === 'wideFormat') {
      currentMinCoefficient = minCoefficientWideFormat; // Use value directly
      currentControlPoints = controlPointsWideFormat;
    } else if (type === 'retail') {
      currentMinCoefficient = minCoefficientRetail; // Use value directly
      currentControlPoints = controlPointsRetail;
    } else { // Default to polygraphy
      currentMinCoefficient = minCoefficientPolygraphy; // Use value directly
      currentControlPoints = controlPointsPolygraphy;
    }

    const sortedPoints = [...currentControlPoints].sort((a, b) => a.purchase - b.purchase);
    if (sortedPoints.length < 2) return price * currentMinCoefficient;

    const maxPoint = sortedPoints[sortedPoints.length - 1];

    if (price > maxPoint.purchase) {
      const previousPoint = sortedPoints[sortedPoints.length - 2];
      // New: Add protection against division by zero
      const slope = (maxPoint.purchase - previousPoint.purchase) === 0 ? 0 : (maxPoint.retail - previousPoint.retail) / (maxPoint.purchase - previousPoint.purchase);
      result = maxPoint.retail + (price - maxPoint.purchase) * slope;
      // Ensure retail price doesn't go below the minimum coefficient based price for the extended part
      const extendedPriceDiff = price - maxPoint.purchase;
      const minRetailForExtended = extendedPriceDiff * currentMinCoefficient;
      result = Math.max(result, maxPoint.retail + minRetailForExtended);

    } else {
      for (let i = 0; i < sortedPoints.length - 1; i++) {
        const p1 = sortedPoints[i];
        const p2 = sortedPoints[i + 1];
        if (price >= p1.purchase && price <= p2.purchase) {
          const ratio = (p2.purchase - p1.purchase) === 0 ? 1 : (price - p1.purchase) / (p2.purchase - p1.purchase);
          result = p1.retail + ratio * (p2.retail - p1.retail);
          break;
        }
      }
    }
    const minRetail = price * currentMinCoefficient;
    return Math.max(result, minRetail);
  }, [controlPointsPolygraphy, minCoefficientPolygraphy, controlPointsWideFormat, minCoefficientWideFormat, controlPointsRetail, minCoefficientRetail]);

  const handleNewProductChange = useCallback((field, value) => {
    setNewProduct(prev => {
        let updatedProduct = { ...prev, [field]: value };

        // Validation logic
        let isValid = true;
        let numValue = parseFloat(value);

        if (['purchase', 'delivery', 'layoutCost', 'manualRetailPrice'].includes(field)) {
            if (isNaN(numValue) || numValue < 0) {
                isValid = false;
            }
            updatedProduct[`isValid${field.charAt(0).toUpperCase() + field.slice(1)}`] = isValid;
            updatedProduct[field] = value; // Keep string value for input field
        } else if (field === 'quantity') {
            numValue = parseInt(value);
            if (isNaN(numValue) || numValue < 1) { // Quantity must be at least 1
                isValid = false;
            }
            updatedProduct.isValidQuantity = isValid;
            updatedProduct.quantity = value; // Keep string value for input field
        } else if (field === 'productName') {
            updatedProduct.isValidProductName = value.trim() !== "";
        }

        const purchaseNum = parseFloat(updatedProduct.purchase) || 0;
        const deliveryNum = parseFloat(updatedProduct.delivery) || 0;
        const layoutCostNum = parseFloat(updatedProduct.layoutCost) || 0;
        let retailPrice = 0;

        // New logic for manual retail price
        if (updatedProduct.manualRetailEnabled) {
            retailPrice = parseFloat(updatedProduct.manualRetailPrice) || 0;
        } else {
            const baseRetail = calculateRetailPrice(purchaseNum, updatedProduct.calculatorType);
            retailPrice = baseRetail + deliveryNum + layoutCostNum;
        }
        updatedProduct.retail = retailPrice;

        updatedProduct.markup = purchaseNum !== 0 ? ((updatedProduct.retail - deliveryNum - layoutCostNum) / purchaseNum).toFixed(2) : "-";
        updatedProduct.margin = updatedProduct.retail - purchaseNum - deliveryNum - layoutCostNum;

        return updatedProduct;
    });
  }, [calculateRetailPrice]);

  const handleAddNewOrUpdateProduct = () => {
    // Re-validate all fields before adding/updating
    let allValid = true;
    const updatedProduct = { ...newProduct };

    if (!updatedProduct.productName.trim()) {
        updatedProduct.isValidProductName = false;
        allValid = false;
    } else {
        updatedProduct.isValidProductName = true;
    }

    const purchaseNum = parseFloat(updatedProduct.purchase);
    if (isNaN(purchaseNum) || purchaseNum < 0) {
        updatedProduct.isValidPurchase = false;
        allValid = false;
    } else {
        updatedProduct.isValidPurchase = true;
    }

    const deliveryNum = parseFloat(updatedProduct.delivery);
    if (isNaN(deliveryNum) || deliveryNum < 0) {
        updatedProduct.isValidDelivery = false;
        allValid = false;
    } else {
        updatedProduct.isValidDelivery = true;
    }

    const quantityNum = parseInt(updatedProduct.quantity);
    if (isNaN(quantityNum) || quantityNum < 1) {
        updatedProduct.isValidQuantity = false;
        allValid = false;
    } else {
        updatedProduct.isValidQuantity = true;
    }

    const layoutCostNum = parseFloat(updatedProduct.layoutCost);
    if (updatedProduct.layoutStatus === 'make' && (isNaN(layoutCostNum) || layoutCostNum < 0)) {
        updatedProduct.isValidLayoutCost = false;
        allValid = false;
    } else {
        updatedProduct.isValidLayoutCost = true;
    }

    if (updatedProduct.manualRetailEnabled) {
        const manualRetailPriceNum = parseFloat(updatedProduct.manualRetailPrice);
        if (isNaN(manualRetailPriceNum) || manualRetailPriceNum < 0) {
            updatedProduct.isValidManualRetailPrice = false;
            allValid = false;
        } else {
            updatedProduct.isValidManualRetailPrice = true;
        }
    } else {
        updatedProduct.isValidManualRetailPrice = true; // Not applicable if manual retail is off
    }

    setNewProduct(updatedProduct); // Update state to show validation errors

    if (!allValid) {
        showToast("Пожалуйста, исправьте ошибки в полях продукта.");
        return;
    }

    // If all valid, proceed with add/update
    if (editingProductId) {
        setCurrentOrderProducts(prev => prev.map(p => p.id === editingProductId ? updatedProduct : p));
        showToast("Продукт обновлен.");
    } else {
        setCurrentOrderProducts(prev => [...prev, { ...updatedProduct, id: Date.now() }]); // Ensure new ID for new products
        showToast("Продукт добавлен в заказ.");
    }

    // Reset form
    setNewProduct(getInitialNewProduct());
    setEditingProductId(null);
  };

  const handleStartEditing = (productId) => {
    const productToEdit = currentOrderProducts.find(p => p.id === productId);
    if (productToEdit) {
        // Ensure all validation flags are true when starting edit
        setNewProduct({
            ...productToEdit,
            purchase: String(productToEdit.purchase),
            delivery: String(productToEdit.delivery),
            quantity: String(productToEdit.quantity),
            layoutCost: String(productToEdit.layoutCost),
            manualRetailPrice: String(productToEdit.manualRetailPrice),
            isValidPurchase: true,
            isValidDelivery: true,
            isValidQuantity: true,
            isValidLayoutCost: true,
            isValidManualRetailPrice: true,
            isValidProductName: true,
        });
        setEditingProductId(productId);
    }
  };

  const handleRemoveProduct = (productId) => {
    if (currentOrderProducts.length <= 1 && editingIndex === null) {
        showToast("Должен быть хотя бы один продукт в заказе.");
        return;
    }
    setCurrentOrderProducts(prev => prev.filter(p => p.id !== productId));
    // If the edited product is removed, reset the form
    if(editingProductId === productId) {
        setNewProduct(getInitialNewProduct());
        setEditingProductId(null);
    }
    setShowProductDeleteConfirmModal(false); // Close confirmation modal
    showToast("Продукт удален.");
  };

  const handleClientInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setCurrentClientInfo(prev => {
        const updatedInfo = { ...prev, [name]: value };
        if (name === "name") {
            updatedInfo.isValidName = value.trim() !== "";
        }
        return updatedInfo;
    });

    if (name === "name" && value.length > 1) {
      const lowerCaseValue = value.toLowerCase();
      // Filter from allClients, not history
      const suggestions = allClients.filter(client => client.name.toLowerCase().includes(lowerCaseValue));
      setClientSuggestions(suggestions);
    } else if (name === "name") {
      setClientSuggestions([]);
    }
  }, [allClients]); // Dependency changed to allClients

  const handleModalOrderStatusChange = useCallback((statusValue, checked) => {
    setCurrentClientInfo(prev => {
      const currentStatuses = prev.orderStatus || [];
      const newStatuses = checked
        ? [...currentStatuses, statusValue]
        : currentStatuses.filter(s => s !== statusValue);
      return { ...prev, orderStatus: newStatuses };
    });
  }, []);

  const handleModalPaymentStatusChange = useCallback((statusValue) => { // New: Handle payment status change in modal
    setCurrentClientInfo(prev => ({ ...prev, paymentStatus: statusValue }));
  }, []);

  const handleProductTagChangeInModal = useCallback((tagName, checked) => {
    setNewProduct(prev => {
      const currentTags = prev.tags || [];
      const newTags = checked
        ? [...currentTags, tagName]
        : currentTags.filter(t => t !== tagName);
      return { ...prev, tags: newTags };
    });
  }, []);

  const handleClientTagChangeInModal = useCallback((tagName, checked) => {
    setCurrentClientInfo(prev => {
      const currentTags = prev.clientTags || [];
      const newTags = checked
        ? [...currentTags, tagName]
        : currentTags.filter(t => t !== tagName);
      return { ...prev, clientTags: newTags };
    });
  }, []);

  const selectClientSuggestion = useCallback((client) => {
    setCurrentClientInfo(prev => ({
      ...prev,
      name: client.name,
      phone: client.phone,
      email: client.email,
      messenger: client.messenger, // Add messenger here
      comment: client.comment, // Add comment here
      clientTags: client.clientTags ?? [], // Add clientTags here
      isValidName: true, // Reset validation for name
    }));
    setClientSuggestions([]);
    if (clientNameInputRef.current) {
      clientNameInputRef.current.focus();
    }
  }, []);

  const clearNewCalculationForm = useCallback(() => {
    setCurrentClientInfo({ name: "", phone: "", email: "", messenger: "", comment: "", orderComment: "", orderStatus: ["new"], paymentStatus: "unpaid", photoCenter: "Королёва 61", clientTags: [], employee: "Не указан", isValidName: true });
    setCurrentOrderProducts([]);
    setNewProduct(getInitialNewProduct());
    setEditingProductId(null);
    setEditingIndex(null);
  }, [setEditingIndex]);
  
  const openNewCalculationModal = () => {
    clearNewCalculationForm();
    setShowNewCalculationModal(true);
  }

  const saveOrderToHistory = useCallback(async () => {
    setLoading(true);

    try {
      // Client name validation
      if (!currentClientInfo.name.trim()) {
        setCurrentClientInfo(prev => ({ ...prev, isValidName: false }));
        showToast("Имя клиента не может быть пустым.");
        setLoading(false);
        return;
      } else {
        setCurrentClientInfo(prev => ({ ...prev, isValidName: true }));
      }

      if (currentOrderProducts.length === 0) {
        showToast("Добавьте хотя бы один продукт в заказ.");
        setLoading(false);
        return;
      }
      
      const finalProducts = currentOrderProducts.map(p => {
          const purchaseNum = parseFloat(p.purchase) || 0;
          const deliveryNum = parseFloat(p.delivery) || 0;
          const layoutCostNum = parseFloat(p.layoutCost) || 0;
          const retail = p.retail || 0;
          const margin = retail - purchaseNum - deliveryNum - layoutCostNum;
          const markup = purchaseNum !== 0 ? ((retail - deliveryNum - layoutCostNum) / purchaseNum).toFixed(2) : "-";

          return { ...p, retail, margin, markup, purchase: purchaseNum, delivery: deliveryNum, layoutCost: layoutCostNum, quantity: parseInt(p.quantity) || 1, manualRetailPrice: parseFloat(p.manualRetailPrice) || 0 };
      });

      const totalRetail = finalProducts.reduce((sum, p) => sum + p.retail, 0);
      const totalPurchase = finalProducts.reduce((sum, p) => sum + p.purchase, 0);
      const totalDelivery = finalProducts.reduce((sum, p) => sum + p.delivery, 0);
      const totalLayoutCost = finalProducts.reduce((sum, p) => sum + p.layoutCost, 0);
      const totalMargin = totalRetail - totalPurchase - totalDelivery - totalLayoutCost;
      const totalMarkup = totalPurchase !== 0 ? ((totalRetail - totalDelivery - totalLayoutCost) / totalPurchase).toFixed(2) : "-";

      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      const newSequence = lastOrderSequence + 1;
      setLastOrderSequence(newSequence);
      const sequentialNumber = String(newSequence).padStart(5, '0');

      const prefix = currentClientInfo.photoCenter === "Парашютная 61" ? "P" : "K";
      const orderNumber = `${prefix}${day}${month} ${hours}${minutes} ${sequentialNumber}`;

      // Update allClients list
      const currentClientKey = `${currentClientInfo.name}|${currentClientInfo.phone}|${currentClientInfo.email}`;
      let clientExists = false;
      const updatedAllClients = allClients.map(client => {
          const clientKey = `${client.name}|${client.phone}|${client.email}`;
          if (clientKey === currentClientKey) {
              clientExists = true;
              return { ...client, messenger: currentClientInfo.messenger, comment: currentClientInfo.comment, clientTags: currentClientInfo.clientTags }; // Update messenger, comment, and clientTags
          }
          return client;
      });

      if (!clientExists) {
          updatedAllClients.push({
              id: Date.now(), // Unique ID for the client
              name: currentClientInfo.name,
              phone: currentClientInfo.phone,
              email: currentClientInfo.email,
              messenger: currentClientInfo.messenger,
              comment: currentClientInfo.comment,
              clientTags: currentClientInfo.clientTags, // Save clientTags with new client
          });
      }
      setAllClients(updatedAllClients);


      const newEntry = {
        timestamp: now.toLocaleString("ru-RU"),
        orderNumber: orderNumber,
        client: {
          name: currentClientInfo.name,
          phone: currentClientInfo.phone,
          email: currentClientInfo.email,
          messenger: currentClientInfo.messenger, // Ensure messenger is saved with the order
          comment: currentClientInfo.comment, // Ensure comment is saved with the order
          clientTags: currentClientInfo.clientTags, // Ensure clientTags are saved with the order
        },
        products: finalProducts,
        orderComment: currentClientInfo.orderComment,
        status: currentClientInfo.orderStatus,
        paymentStatus: currentClientInfo.paymentStatus, // New: Save payment status
        photoCenter: currentClientInfo.photoCenter,
        employee: currentClientInfo.employee, // Save employee
        totalRetail,
        totalMarkup,
        totalMargin,
        totalPurchase,
        totalDelivery,
        totalLayoutCost,
        isArchived: false,
      };

      if (editingIndex !== null) {
        const updatedHistory = [...history];
        updatedHistory[editingIndex] = { ...updatedHistory[editingIndex], ...newEntry, isArchived: updatedHistory[editingIndex].isArchived };
        setHistory(updatedHistory);
        showToast("Заказ обновлён!");
      } else {
        setHistory([newEntry, ...history]);
        showToast("Заказ сохранён в историю!");
      }
      clearNewCalculationForm();
      setShowNewCalculationModal(false);
    } finally {
      setLoading(false);
    }
  }, [
    currentClientInfo,
    currentOrderProducts,
    editingIndex,
    history,
    showToast,
    clearNewCalculationForm,
    lastOrderSequence,
    allClients, // Add allClients to dependencies
  ]);

  // --- Handlers for History View ---

  const confirmDelete = useCallback((index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  }, []);

  const deleteFromHistory = useCallback((index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    setShowDeleteModal(false);
    showToast("Запись удалена из истории.");
  }, [history, showToast]);

  const deleteSelectedOrders = useCallback(() => {
    const updatedHistory = history.filter((_, i) => !selectedOrders.includes(i));
    setHistory(updatedHistory);
    setSelectedOrders([]);
    showToast(`Удалено ${selectedOrders.length} записей.`);
  }, [history, selectedOrders, showToast]);

  const confirmToggleArchive = useCallback((index) => {
    setArchiveIndex(index);
    setShowArchiveConfirmModal(true);
  }, []);

  const performArchiveToggle = useCallback(() => {
    if (archiveIndex !== null) {
      setHistory(prevHistory =>
        prevHistory.map((item, i) =>
          i === archiveIndex ? { ...item, isArchived: !item.isArchived } : item
        )
      );
      showToast(history[archiveIndex].isArchived ? "Заказ разархивирован!" : "Заказ заархивирован!");
      setShowArchiveConfirmModal(false);
      setArchiveIndex(null);
    }
  }, [archiveIndex, history, showToast]);

  const handleHistoryOrderStatusChange = useCallback((orderId, newStatuses) => {
    setHistory(prevHistory =>
      prevHistory.map((order) => {
        if (order.orderNumber === orderId) { // Use orderNumber as ID
          return { ...order, status: newStatuses };
        }
        return order;
      })
    );
    showToast("Статусы заказа обновлены.");
  }, [showToast]);

  const openHistoryStatusEditPopover = useCallback((orderId, targetElement, event) => {
    // Calculate position to keep popover within viewport
    const popoverWidth = 200; // Approximate popover width
    const popoverHeight = availableStatuses.length * 36 + 100; // Approx height per item + padding
    let left = event.clientX;
    let top = event.clientY + 5;

    if (left + popoverWidth > window.innerWidth) {
      left = window.innerWidth - popoverWidth - 10; // 10px padding from right
    }
    if (top + popoverHeight > window.innerHeight) {
      top = window.innerHeight - popoverHeight - 10; // 10px padding from bottom
    }

    setEditingHistoryStatusOrder({ orderId, targetElement, clientX: left, clientY: top });
    setShowHistoryStatusEditPopover(true);
  }, [availableStatuses]);

  const handleHistoryPaymentStatusChange = useCallback((orderId, newPaymentStatus) => { // New: Handle payment status change in history
    setHistory(prevHistory =>
      prevHistory.map((order) => {
        if (order.orderNumber === orderId) {
          return { ...order, paymentStatus: newPaymentStatus };
        }
        return order;
      })
    );
    showToast("Статус оплаты заказа обновлен.");
  }, [showToast]);

  const openHistoryPaymentStatusEditPopover = useCallback((orderId, targetElement, event) => { // New: Open payment status popover
    const popoverWidth = 200;
    const popoverHeight = availablePaymentStatuses.length * 36 + 100;
    let left = event.clientX;
    let top = event.clientY + 5;

    if (left + popoverWidth > window.innerWidth) {
      left = window.innerWidth - popoverWidth - 10;
    }
    if (top + popoverHeight > window.innerHeight) {
      top = window.innerHeight - popoverHeight - 10;
    }

    setEditingHistoryPaymentStatusOrder({ orderId, targetElement, clientX: left, clientY: top });
    setShowHistoryPaymentStatusEditPopover(true);
  }, [availablePaymentStatuses]);


  const handleHistoryProductTagChange = useCallback((orderId, productId, newTags) => {
    setHistory(prevHistory =>
      prevHistory.map((order) => {
        if (order.orderNumber === orderId) { // Find order by ID
          return {
            ...order,
            products: order.products.map((product) =>
              product.id === productId ? { ...product, tags: newTags } : product // Find product by ID
            ),
          };
        }
        return order;
      })
    );
    showToast("Теги продукта обновлены.");
  }, [showToast]);

  const openHistoryTagEditPopover = useCallback((orderId, productId, targetElement, event) => {
    // Calculate position to keep popover within viewport
    const popoverWidth = 200; // Approximate popover width
    const popoverHeight = availableTags.length * 36 + 100; // Approx height per item + padding
    let left = event.clientX;
    let top = event.clientY + 5;

    if (left + popoverWidth > window.innerWidth) {
      left = window.innerWidth - popoverWidth - 10; // 10px padding from right
    }
    if (top + popoverHeight > window.innerHeight) {
      top = window.innerHeight - popoverHeight - 10; // 10px padding from bottom
    }

    setEditingHistoryTagProduct({ orderId, productId, targetElement, clientX: left, clientY: top });
    setShowHistoryTagEditPopover(true);
  }, [availableTags]);

  const handleFilterStatusChange = useCallback((statusValue, checked) => {
    setSelectedStatusesFilter(prev => {
      if (checked) {
        return [...prev, statusValue];
      } else {
        return prev.filter(s => s !== statusValue);
      }
    });
  }, []);


  const getLayoutLabel = useCallback((layoutStatus) => {
    return layoutStatus === "client" ? "Макет клиента" : "Макет делаем";
  }, []);

  const getCalculatorTypeLabel = useCallback((type) => {
    switch (type) {
      case 'polygraphy': return 'Полиграфия';
      case 'wideFormat': return 'Широкоформатная';
      case 'retail': return 'Розница';
      default: return 'Неизвестно';
    }
  }, []);

  const isLowMargin = useCallback((marginValue) => {
    return marginValue < lowMarginThreshold;
  }, [lowMarginThreshold]);

  const openPrintOptions = useCallback((entry) => {
    setPrintEntry(entry);
    setShowPrintOptionsModal(true);
  }, []);

  const handlePrintOptionChange = useCallback((e) => {
    const { name, checked } = e.target;
    setPrintOptions(prev => {
      const newState = { ...prev, [name]: checked };
      if (name === "productDetails" && !checked) {
        Object.keys(newState).forEach(key => {
            if (key.startsWith('product') && key !== 'productDetails') newState[key] = false;
        });
      }
      if (name === "totalSummary" && !checked) {
        Object.keys(newState).forEach(key => {
            if (key.startsWith('total') && key !== 'totalSummary') newState[key] = false;
        });
      }
      return newState;
    });
  }, []);

  const applyPrintTemplate = useCallback((templateOptions) => { // New: Apply print template
    setPrintOptions(templateOptions);
  }, []);

  const printCalculation = useCallback((entry, options) => {
    const shouldShowTotalMarginWarning = !entry.products.some(p => p.calculatorType === 'retail');

    let htmlContent = `
      <html>
        <head><title>Печать расчёта</title></head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
          h2, h3 { color: #333; margin-top: 15px; margin-bottom: 5px; font-size: 16px;}
          .section { margin-bottom: 5px; }
          label { font-weight: bold; display: inline-block; width: 120px; }
          .value { display: inline-block; }
          .product-item { border: 1px dashed #ccc; padding: 8px; margin-bottom: 8px; }
          .product-item h4 { font-size: 14px; margin-bottom: 5px; }
          .tag { display: inline-block; padding: 2px 6px; margin-right: 4px; border-radius: 4px; font-size: 10px; color: white; background-color: #6B7280; }
          .status-badge { display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 10px; font-weight: 500; color: white; margin-right: 4px; }
          .client-tag { display: inline-block; padding: 2px 6px; margin-right: 4px; border-radius: 4px; font-size: 10px; color: white; }
          .payment-status-badge { display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 10px; font-weight: 500; color: white; margin-right: 4px; }
        </style>
        <body>
          <h2>🧮 Расчёт заказа</h2>
    `;

    if (options.orderInfo) {
      htmlContent += `
        <div class="section"><label>Номер заказа:</label> <span class="value">${entry.orderNumber || '-'}</span></div>
        <div class="section"><label>Дата заказа:</label> <span class="value">${entry.timestamp}</span></div>
        <div class="section"><label>Статус заказа:</label> <span class="value">
          ${Array.isArray(entry.status) ? entry.status.map(s => `<span class="status-badge" style="background-color: ${getStatusColor(s)};">${getStatusLabel(s)}</span>`).join('') : `<span class="status-badge" style="background-color: ${getStatusColor(entry.status)};">${getStatusLabel(entry.status)}</span>`}
        </span></div>
        ${options.paymentStatus ? `<div class="section"><label>Статус оплаты:</label> <span class="value"><span class="payment-status-badge" style="background-color: ${getPaymentStatusColor(entry.paymentStatus)};">${getPaymentStatusLabel(entry.paymentStatus)}</span></span></div>` : ''}
        <div class="section"><label>Фотоцентр:</label> <span class="value">${entry.photoCenter || '-'}</span></div>
        <div class="section"><label>Сотрудник:</label> <span class="value" style="color: ${getEmployeeColor(entry.employee)};">${entry.employee || '-'}</span></div>
        <div class="section"><label>Общий комментарий:</label> <span class="value">${entry.orderComment || "-"}</span></div>
      `;
    }

    if (options.clientInfo) {
      htmlContent += `
        <h3>👤 Клиент</h3>
        <div class="section"><label>Имя:</label> <span class="value">${entry.client.name}</span></div>
        <div class="section"><label>Тел:</label> <span class="value">${entry.client.phone}</span></div>
        <div class="section"><label>Email:</label> <span class="value">${entry.client.email}</span></div>
        <div class="section"><label>Мессенджер:</label> <span class="value">${entry.client.messenger || '-'}</span></div>
        <div class="section"><label>Комментарий:</label> <span class="value">${entry.client.comment || '-'}</span></div>
        ${entry.client.clientTags && entry.client.clientTags.length > 0 ? `<div class="section"><label>Теги клиента:</label> <span class="value">${entry.client.clientTags.map(tagName => `<span class="client-tag" style="background-color: ${getClientTagColor(tagName)};">${tagName}</span>`).join('')}</span></div>` : ''}
      `;
    }

    if (options.productDetails) {
      htmlContent += `<h3>📦 Продукты в заказе</h3>`;
      entry.products.forEach((product, pIdx) => {
        htmlContent += `<div class="product-item"><h4>Продукт ${pIdx + 1} (${getCalculatorTypeLabel(product.calculatorType)})</h4>`;
        if (product.tags && product.tags.length > 0) {
          htmlContent += `<div class="section"><label>Теги:</label> <span class="value">${product.tags.map(tagName => {
            const tag = availableTags.find(t => t.name === tagName);
            return `<span class="tag" style="background-color: ${tag ? tag.color : '#6B7280'};">${tagName}</span>`;
          }).join('')}</span></div>`;
        }
        htmlContent += `<div class="section"><label>Название:</label> <span class="value">${product.productName}</span></div>`;
        if (options.productPurchase) htmlContent += `<div class="section"><label>Закупочная цена:</label> <span class="value">${formatNumber(product.purchase)} руб.</span></div>`;
        if (options.productDelivery) htmlContent += `<div class="section"><label>Стоимость доставки:</label> <span class="value">${formatNumber(product.delivery)} руб.</span></div>`;
        if (options.productRetail) {
          htmlContent += `<div class="section"><label>Розничная цена:</label> <span class="value">${formatNumber(product.retail)} руб.</span></div>`;
          if (product.manualRetailEnabled) htmlContent += `<div class="section"><label>Введена вручную:</label> <span class="value">${formatNumber(product.manualRetailPrice)} руб.</span></div>`;
        }
        if (options.productMarkupMargin) {
          htmlContent += `<div class="section"><label>Маржа:</label> <span class="value">${formatNumber(product.margin)} руб.</span></div>`;
          htmlContent += `<div class="section"><label>Наценка:</label> <span class="value">x${product.markup}</span></div>`;
        }
        if (options.productFormatSides) {
          htmlContent += `<div class="section"><label>Формат:</label> <span class="value">${product.paperFormat}</span></div>`;
          htmlContent += `<div class="section"><label>Стороны:</label> <span class="value">${product.sides}</span></div>`;
        }
        if (options.productLayoutQuantity) {
          htmlContent += `<div class="section"><label>Макет:</label> <span class="value">${getLayoutLabel(product.layoutStatus)}</span></div>`;
          htmlContent += `<div class="section"><label>Количество:</label> <span class="value">${product.quantity} шт.</span></div>`;
        }
        if (options.productCommentDate) {
          htmlContent += `<div class="section"><label>Комментарий:</label> <span class="value">${product.productComment || "-"}</span></div>`;
          htmlContent += `<div class="section"><label>Дата выдачи:</label> <span class="value">${product.deliveryDate ? formatDate(product.deliveryDate) : "-"}</span></div>`;
        }
        if (options.productLayoutCost && product.layoutStatus === 'make') htmlContent += `<div class="section"><label>Стоимость макета:</label> <span class="value">${formatNumber(product.layoutCost)} руб.</span></div>`;
        htmlContent += `</div>`;
      });
    }

    if (options.totalSummary) {
      htmlContent += `<h3>Итого по заказу</h3>`;
      if (options.totalPurchaseSummary) htmlContent += `<div class="section"><label>Общая закупочная:</label> <span class="value">${formatNumber(entry.totalPurchase)} руб.</span></div>`;
      if (options.totalDeliverySummary) htmlContent += `<div class="section"><label>Общая доставка:</label> <span class="value">${formatNumber(entry.totalDelivery)} руб.</span></div>`;
      if (options.totalRetailSummary) htmlContent += `<div class="section"><label>Общая розничная:</label> <span class="value">${formatNumber(entry.totalRetail)} руб.</span></div>`;
      if (options.totalMarkupSummary) htmlContent += `<div class="section"><label>Общая наценка:</label> <span class="value">x${entry.totalMarkup}</span></div>`;
      if (options.totalMarginSummary) htmlContent += `<div class="section"><label>Общая маржа:</label> <span class="value">${formatNumber(entry.totalMargin)} руб.</span></div>`;
      if (options.totalCoefficientSummary) {
        const totalBaseRetail = entry.totalRetail - entry.totalDelivery - entry.totalLayoutCost;
        const totalCoefficient = entry.totalPurchase !== 0 ? (totalBaseRetail / entry.totalPurchase).toFixed(2) : "-";
        htmlContent += `<div class="section"><label>Общий коэффициент:</label> <span class="value">x${totalCoefficient}</span></div>`;
      }
      if (shouldShowTotalMarginWarning && isLowMargin(entry.totalMargin)) {
        htmlContent += `<div class="section" style="color: red; font-weight: bold;">Внимание! Маржа ниже ${formatNumber(lowMarginThreshold)} руб.</div>`;
      }
    }

    htmlContent += `</body></html>`;

    const win = window.open("", "_blank");
    win.document.write(htmlContent);
    win.document.close();
    win.print();
    setShowPrintOptionsModal(false);
  }, [formatNumber, getStatusLabel, getStatusColor, getPaymentStatusLabel, getPaymentStatusColor, getLayoutLabel, getCalculatorTypeLabel, formatDate, isLowMargin, lowMarginThreshold, availableTags, getClientTagColor, getEmployeeColor]);


  const editOrder = useCallback((index) => {
    const entry = history[index];
    setEditingIndex(index);
    setCurrentClientInfo({
      name: entry.client.name,
      phone: entry.client.phone,
      email: entry.client.email,
      messenger: entry.client.messenger ?? "", // Add messenger here
      comment: entry.client.comment ?? "", // Add comment here
      clientTags: entry.client.clientTags ?? [], // Add clientTags here
      orderComment: entry.orderComment,
      orderStatus: Array.isArray(entry.status) ? entry.status : (entry.status ? [entry.status] : ["new"]),
      paymentStatus: entry.paymentStatus ?? "unpaid", // New: Load payment status
      photoCenter: entry.photoCenter || "Королёва 61",
      employee: entry.employee ?? "Не указан", // Load employee
      isValidName: true, // Reset validation for name
    });

    setCurrentOrderProducts(entry.products.map(p => ({
      ...p,
      purchase: String(p.purchase),
      delivery: String(p.delivery),
      quantity: String(p.quantity),
      layoutCost: String(p.layoutCost),
      manualRetailPrice: String(p.manualRetailPrice),
      manualRetailEnabled: p.manualRetailEnabled ?? false, // Ensure this is loaded
      isValidPurchase: true,
      isValidDelivery: true,
      isValidQuantity: true,
      isValidLayoutCost: true,
      isValidManualRetailPrice: true,
      isValidProductName: true,
    })));
    
    setNewProduct(getInitialNewProduct());
    setEditingProductId(null);
    setShowNewCalculationModal(true);
  }, [history, setEditingIndex]);

  // --- Control Point Management Functions ---
  const addControlPoint = useCallback(() => {
    const newId = Date.now();
    if (settingsView === 'polygraphy') {
      setControlPointsPolygraphy(prev => [...prev, { id: newId, purchase: 0, retail: 0, name: "" }]);
    } else if (settingsView === 'wideFormat') {
      setControlPointsWideFormat(prev => [...prev, { id: newId, purchase: 0, retail: 0, name: "" }]);
    } else { // retail
      setControlPointsRetail(prev => [...prev, { id: newId, purchase: 0, retail: 0, name: "" }]);
    }
  }, [settingsView]);

  const updateControlPoint = useCallback((id, field, value) => {
    const updater = prev => prev.map(p => p.id === id ? { ...p, [field]: (field === "purchase" || field === "retail") ? (parseFloat(value) || 0) : value } : p).sort((a, b) => a.purchase - b.purchase);
    
    if (settingsView === 'polygraphy') setControlPointsPolygraphy(updater);
    else if (settingsView === 'wideFormat') setControlPointsWideFormat(updater);
    else setControlPointsRetail(updater);
  }, [settingsView]);

  const deleteControlPoint = useCallback((id) => {
    const deleter = prev => prev.filter(p => p.id !== id);
    if (settingsView === 'polygraphy') setControlPointsPolygraphy(deleter);
    else if (settingsView === 'wideFormat') setControlPointsWideFormat(deleter);
    else setControlPointsRetail(deleter);
  }, [settingsView]);

  // --- Tag Management Functions ---
  const addTag = useCallback(() => {
    const newId = Date.now();
    setAvailableTags(prev => [...prev, { id: newId, name: "", color: "#6B7280" }]);
  }, []);

  const updateTag = useCallback((id, field, value) => {
    setAvailableTags(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  }, []);

  const deleteTag = useCallback((id) => {
    const tagToDelete = availableTags.find(t => t.id === id);
    if (!tagToDelete) return;

    setConfirmActionMessage(`Вы уверены, что хотите удалить тег "${tagToDelete.name}"? Это действие удалит тег из всех связанных продуктов в истории.`);
    setConfirmActionCallback(() => () => {
      setAvailableTags(prev => prev.filter(t => t.id !== id));
      setHistory(prev =>
        prev.map(entry => ({
          ...entry,
          products: entry.products.map(p => ({
            ...p,
            tags: p.tags.filter(tagName => tagName !== tagToDelete.name),
          })),
        }))
      );
      showToast("Тег удален.");
      setShowConfirmActionModal(false);
    });
    setShowConfirmActionModal(true);
  }, [availableTags, history, showToast]);

  // --- Client Tag Management Functions ---
  const addClientTag = useCallback(() => {
    const newId = Date.now();
    setAvailableClientTags(prev => [...prev, { id: newId, name: "", color: "#6B7280" }]);
  }, []);

  const updateClientTag = useCallback((id, field, value) => {
    setAvailableClientTags(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  }, []);

  const deleteClientTag = useCallback((id) => {
    const tagToDelete = availableClientTags.find(t => t.id === id);
    if (!tagToDelete) return;

    setConfirmActionMessage(`Вы уверены, что хотите удалить тег клиента "${tagToDelete.name}"? Это действие удалит тег из всех связанных клиентов.`);
    setConfirmActionCallback(() => () => {
      setAvailableClientTags(prev => prev.filter(t => t.id !== id));
      setAllClients(prev =>
        prev.map(client => ({
          ...client,
          clientTags: client.clientTags.filter(tagName => tagName !== tagToDelete.name),
        }))
      );
      showToast("Тег клиента удален.");
      setShowConfirmActionModal(false);
    });
    setShowConfirmActionModal(true);
  }, [availableClientTags, allClients, showToast]);


  // --- Status Management Functions ---
  const addStatus = useCallback(() => {
    const newId = Date.now();
    setAvailableStatuses(prev => [...prev, { id: newId, name: "", value: `custom${newId}`, color: "#6B7280" }]);
  }, []);

  const updateStatus = useCallback((id, field, value) => {
    setAvailableStatuses(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  const deleteStatus = useCallback((id) => {
    const statusToDelete = availableStatuses.find(s => s.id === id);
    if (!statusToDelete) return;

    const defaultStatusValues = ['new', 'inProgress', 'completed'];
    if (defaultStatusValues.includes(statusToDelete.value)) {
      showToast("Невозможно удалить стандартный статус.");
      return;
    }

    setConfirmActionMessage(`Вы уверены, что хотите удалить статус "${statusToDelete.name}"? Заказы с этим статусом будут переведены в статус "Новый".`);
    setConfirmActionCallback(() => () => {
      setAvailableStatuses(prev => prev.filter(s => s.id !== id));
      setHistory(prev =>
        prev.map(entry => ({
          ...entry,
          status: entry.status.filter(s => s !== statusToDelete.value).length > 0
            ? entry.status.filter(s => s !== statusToDelete.value)
            : ["new"],
        }))
      );
      showToast("Статус удален.");
      setShowConfirmActionModal(false);
    });
    setShowConfirmActionModal(true);
  }, [availableStatuses, history, showToast]);

  // New: Payment Status Management Functions
  const addPaymentStatus = useCallback(() => {
    const newId = Date.now();
    setAvailablePaymentStatuses(prev => [...prev, { id: newId, name: "", value: `customPayment${newId}`, color: "#6B7280" }]);
  }, []);

  const updatePaymentStatus = useCallback((id, field, value) => {
    setAvailablePaymentStatuses(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  const deletePaymentStatus = useCallback((id) => {
    const statusToDelete = availablePaymentStatuses.find(s => s.id === id);
    if (!statusToDelete) return;

    const defaultPaymentStatusValues = ['paid', 'unpaid', 'partiallyPaid'];
    if (defaultPaymentStatusValues.includes(statusToDelete.value)) {
      showToast("Невозможно удалить стандартный статус оплаты.");
      return;
    }

    setConfirmActionMessage(`Вы уверены, что хотите удалить статус оплаты "${statusToDelete.name}"? Заказы с этим статусом будут переведены в статус "Не оплачен".`);
    setConfirmActionCallback(() => () => {
      setAvailablePaymentStatuses(prev => prev.filter(s => s.id !== id));
      setHistory(prev =>
        prev.map(entry => ({
          ...entry,
          paymentStatus: entry.paymentStatus === statusToDelete.value ? "unpaid" : entry.paymentStatus,
        }))
      );
      showToast("Статус оплаты удален.");
      setShowConfirmActionModal(false);
    });
    setShowConfirmActionModal(true);
  }, [availablePaymentStatuses, history, showToast]);


  // --- Employee Management Functions ---
  const addEmployee = useCallback(() => {
      const newId = Date.now();
      setAvailableEmployees(prev => [...prev, { id: newId, name: "", color: "#6B7280" }]); // Added default color
  }, []);

  const updateEmployee = useCallback((id, field, value) => { // Modified to accept field and value
      setAvailableEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, [field]: value } : emp));
  }, []);

  const deleteEmployee = useCallback((id) => {
      const employeeToDelete = availableEmployees.find(emp => emp.id === id);
      if (!employeeToDelete) return;

      if (employeeToDelete.name === "Не указан") {
          showToast("Невозможно удалить стандартного сотрудника.");
          return;
      }

      setConfirmActionMessage(`Вы уверены, что хотите удалить сотрудника "${employeeToDelete.name}"? Заказы, связанные с этим сотрудником, будут переведены на "Не указан".`);
      setConfirmActionCallback(() => () => {
          setAvailableEmployees(prev => prev.filter(emp => emp.id !== id));
          setHistory(prev =>
              prev.map(entry => ({
                  ...entry,
                  employee: entry.employee === employeeToDelete.name ? "Не указан" : entry.employee,
              }))
          );
          showToast("Сотрудник удален.");
          setShowConfirmActionModal(false);
      });
      setShowConfirmActionModal(true);
  }, [availableEmployees, history, showToast]);

  // --- Client Management Functions ---
  const startEditingClient = useCallback((client) => {
    setEditingClientData(client ? { ...client } : { id: Date.now(), name: "", phone: "", email: "", messenger: "", comment: "", clientTags: [], isValidName: true });
    setShowClientEditModal(true);
  }, []);

  const saveClientData = useCallback(() => {
    if (!editingClientData.name.trim()) {
        setEditingClientData(prev => ({ ...prev, isValidName: false }));
        showToast("Имя клиента не может быть пустым.");
        return;
    } else {
        setEditingClientData(prev => ({ ...prev, isValidName: true }));
    }

    setAllClients(prevClients => {
        if (editingClientData.id && prevClients.some(c => c.id === editingClientData.id)) {
            // Update existing client
            return prevClients.map(c => c.id === editingClientData.id ? editingClientData : c);
        } else {
            // Add new client
            return [...prevClients, { ...editingClientData, id: Date.now() }]; // Ensure new ID if adding
        }
    });
    showToast("Данды клиента сохранены.");
    setShowClientEditModal(false);
    setEditingClientData(null);
  }, [editingClientData, showToast]);

  const confirmDeleteClient = useCallback((clientId) => {
    setClientToDeleteId(clientId);
    setShowClientDeleteConfirmModal(true);
  }, []);

  const deleteClientConfirmed = useCallback(() => {
    setAllClients(prevClients => prevClients.filter(c => c.id !== clientToDeleteId));
    setShowClientDeleteConfirmModal(false);
    setClientToDeleteId(null);
    showToast("Клиент удален.");
  }, [clientToDeleteId, showToast]);


  // --- Memoized values for performance ---

  const areControlPointsValid = useMemo(() => {
    let pointsToCheck;
    if (settingsView === 'polygraphy') pointsToCheck = controlPointsPolygraphy;
    else if (settingsView === 'wideFormat') pointsToCheck = controlPointsWideFormat;
    else pointsToCheck = controlPointsRetail;

    const sorted = [...pointsToCheck].sort((a, b) => a.purchase - b.purchase);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (curr.purchase < prev.purchase) return false; // Purchase must strictly increase or stay same
      if (curr.retail < prev.retail) return false; // Retail must not decrease
    }
    return true;
  }, [controlPointsPolygraphy, controlPointsWideFormat, controlPointsRetail, settingsView]);

  const sortedHistory = useMemo(() => {
    let sortableItems = [...history];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'client.name') {
          aValue = a.client.name;
          bValue = b.client.name;
        } else if (sortConfig.key === 'totalRetail') {
          aValue = a.totalRetail;
          bValue = b.totalRetail;
        } else if (sortConfig.key === 'status') {
          aValue = Array.isArray(a.status) && a.status.length > 0 ? getStatusLabel(a.status[0]) : "";
          bValue = Array.isArray(b.status) && b.status.length > 0 ? getStatusLabel(b.status[0]) : "";
        } else { // timestamp
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [history, sortConfig, getStatusLabel]);

  const filteredHistory = useMemo(() => {
    return sortedHistory.filter(item => {
      const matchesArchive = showArchiveView ? item.isArchived : !item.isArchived;
      const matchesStatus = selectedStatusesFilter.length === 0 || (Array.isArray(item.status) && selectedStatusesFilter.some(filterStatus => item.status.includes(filterStatus)));
      const matchesSearch = searchQuery === "" ||
        item.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.phone.includes(searchQuery) ||
        item.orderComment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.products.some(p => p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || p.productComment?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTagsFilter.length === 0 || item.products.some(p => p.tags.some(tag => selectedTagsFilter.includes(tag)));
      const matchesPhotoCenter = photoCenterFilter === "all" || item.photoCenter === photoCenterFilter;
      const itemDate = new Date(item.timestamp);
      const start = startDateFilter ? new Date(startDateFilter) : null;
      const end = endDateFilter ? new Date(endDateFilter) : null;
      if(start) start.setHours(0, 0, 0, 0);
      if(end) end.setHours(23, 59, 59, 999);
      const matchesDate = (!start || itemDate >= start) && (!end || itemDate <= end);

      return matchesArchive && matchesStatus && matchesSearch && matchesTags && matchesDate && matchesPhotoCenter;
    });
  }, [sortedHistory, selectedStatusesFilter, searchQuery, selectedTagsFilter, photoCenterFilter, startDateFilter, endDateFilter, showArchiveView]);

  const totalPages = Math.ceil(filteredHistory.length / 10);

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filteredHistory.slice(start, start + 10);
  }, [filteredHistory, currentPage]);

  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const toggleSelectOrder = useCallback((index) => {
    setSelectedOrders(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }, []);

  const requestSort = useCallback((key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const getSortIndicator = useCallback((key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
    }
    return '';
  }, [sortConfig]);

  const exportToHTML = useCallback(() => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>История расчетов</title>
          <meta charset="UTF-8">
          <style>
              body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .tag { display: inline-block; padding: 2px 6px; margin-right: 4px; border-radius: 4px; font-size: 10px; color: white; background-color: #6B7280; }
              .status-badge { display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 10px; font-weight: 500; color: white; margin-right: 4px; }
              .payment-status-badge { display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 10px; font-weight: 500; color: white; margin-right: 4px; }
              .client-tag { display: inline-block; padding: 2px 6px; margin-right: 4px; border-radius: 4px; font-size: 10px; color: white; }
          </style>
      </head>
      <body>
          <h1>История расчетов</h1>
          <table>
              <thead>
                  <tr>
                      <th>Номер заказа</th>
                      <th>Дата</th>
                      <th>Клиент</th>
                      <th>Фотоцентр</th>
                      <th>Сотрудник</th>
                      <th>Продукты</th>
                      <th>Общая Закупка</th>
                      <th>Общая Доставка</th>
                      <th>Общая Розница</th>
                      <th>Общая Наценка</th>
                      <th>Статус</th>
                      <th>Статус оплаты</th>
                      <th>Комментарий</th>
                  </tr>
              </thead>
              <tbody>
                  ${filteredHistory.map(entry => `
                      <tr>
                          <td>${entry.orderNumber || '-'}</td>
                          <td>${entry.timestamp}</td>
                          <td>
                            ${entry.client.name} (${entry.client.phone || entry.client.email || '-'})
                            ${entry.client.clientTags && entry.client.clientTags.length > 0 ? `<div style="margin-top: 4px;">${entry.client.clientTags.map(tagName => `<span class="client-tag" style="background-color: ${getClientTagColor(tagName)};">${tagName}</span>`).join('')}</div>` : ''}
                          </td>
                          <td>${entry.photoCenter || '-'}</td>
                          <td style="color: ${getEmployeeColor(entry.employee)};">${entry.employee || '-'}</td>
                          <td>
                              <ul>
                                  ${entry.products.map(p => `
                                      <li>
                                          ${p.productName} (${getCalculatorTypeLabel(p.calculatorType)}) (Кол-во: ${p.quantity}, Закупка: ${formatNumber(p.purchase)}, Розница: ${formatNumber(p.retail)})
                                          ${p.tags && p.tags.length > 0 ? `<div style="margin-top: 4px;">${p.tags.map(tagName => {
                                                const tag = availableTags.find(t => t.name === tagName);
                                                return `<span class="tag" style="background-color: ${tag ? tag.color : '#6B7280'};">${tagName}</span>`;
                                              }).join('')}</div>` : ''}
                                      </li>
                                  `).join('')}
                              </ul>
                          </td>
                          <td>${formatNumber(entry.totalPurchase)} руб.</td>
                          <td>${formatNumber(entry.totalDelivery)} руб.</td>
                          <td>${formatNumber(entry.totalRetail)} руб.</td>
                          <td>x${entry.totalMarkup}</td>
                          <td>${Array.isArray(entry.status) ? entry.status.map(s => `<span class="status-badge" style="background-color: ${getStatusColor(s)};">${getStatusLabel(s)}</span>`).join('') : `<span class="status-badge" style="background-color: ${getStatusColor(entry.status)};">${getStatusLabel(entry.status)}</span>`}</td>
                          <td><span class="payment-status-badge" style="background-color: ${getPaymentStatusColor(entry.paymentStatus)};">${getPaymentStatusLabel(entry.paymentStatus)}</span></td>
                          <td>${entry.orderComment || '-'}</td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "история_расчетов.html";
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredHistory, formatNumber, getStatusLabel, getStatusColor, getPaymentStatusLabel, getPaymentStatusColor, getCalculatorTypeLabel, availableTags, getClientTagColor, getEmployeeColor]);

  // Effect to handle Escape key for closing modals
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showNewCalculationModal) setShowNewCalculationModal(false);
        else if (showDeleteModal) setShowDeleteModal(false);
        else if (showArchiveConfirmModal) setShowArchiveConfirmModal(false);
        else if (showPrintOptionsModal) setShowPrintOptionsModal(false);
        else if (showHistoryTagEditPopover) setShowHistoryTagEditPopover(false);
        else if (showHistoryStatusEditPopover) setShowHistoryStatusEditPopover(false);
        else if (showHistoryPaymentStatusEditPopover) setShowHistoryPaymentStatusEditPopover(false); // New: Payment status popover
        else if (showStatusFilterDropdown) setShowStatusFilterDropdown(false);
        else if (showModalStatusDropdown) setShowModalStatusDropdown(false);
        else if (showProductDeleteConfirmModal) setShowProductDeleteConfirmModal(false);
        else if (showProductTagDropdown) setShowProductTagDropdown(false); // Close product tag dropdown
        else if (showClientManagerModal) setShowClientManagerModal(false); // Close client manager modal
        else if (showClientEditModal) setShowClientEditModal(false); // Close client edit modal
        else if (showClientDeleteConfirmModal) setShowClientDeleteConfirmModal(false); // Close client delete confirm modal
        else if (showClientManagerTagFilterDropdown) setShowClientManagerTagFilterDropdown(false); // Close client tag filter dropdown
        else if (showNewCalculationClientTagDropdown) setShowNewCalculationClientTagDropdown(false); // New: Close client tag dropdown in modals
        else if (showConfirmActionModal) setShowConfirmActionModal(false); // Close generic confirmation modal
        else if (showSettingsModal) setShowSettingsModal(false); // Close settings modal
      }
    };
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [showNewCalculationModal, showDeleteModal, showArchiveConfirmModal, showPrintOptionsModal, showHistoryTagEditPopover, showHistoryStatusEditPopover, showHistoryPaymentStatusEditPopover, showStatusFilterDropdown, showModalStatusDropdown, showProductDeleteConfirmModal, showProductTagDropdown, showClientManagerModal, showClientEditModal, showClientDeleteConfirmModal, showClientManagerTagFilterDropdown, showNewCalculationClientTagDropdown, showConfirmActionModal, showSettingsModal]);

  const toggleExpandOrder = useCallback((index) => {
    setExpandedOrders(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }, []);

  // Function to update min coefficient value
  const updateMinCoefficient = useCallback((type, value) => {
    const numValue = parseFloat(value);
    if (type === 'polygraphy') {
      setMinCoefficientPolygraphy(numValue);
    } else if (type === 'wideFormat') {
      setMinCoefficientWideFormat(numValue);
    } else if (type === 'retail') {
      setMinCoefficientRetail(numValue);
    }
  }, []);

  const filteredClients = useMemo(() => {
    return allClients.filter(client => {
      const matchesSearch = clientSearchQuery === "" ||
        client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
        client.phone.includes(clientSearchQuery) ||
        client.email.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
        client.messenger.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
        client.comment.toLowerCase().includes(clientSearchQuery.toLowerCase());
      const matchesTags = selectedClientTagsFilter.length === 0 || (client.clientTags && selectedClientTagsFilter.some(filterTag => client.clientTags.includes(filterTag)));
      return matchesSearch && matchesTags;
    });
  }, [allClients, clientSearchQuery, selectedClientTagsFilter]);

  const handleClientFilterTagChange = useCallback((tagName, checked) => {
    setSelectedClientTagsFilter(prev => {
      if (checked) {
        return [...prev, tagName];
      } else {
        return prev.filter(t => t !== tagName);
      }
    });
  }, []);

  // --- Draggable Modal Logic ---
  const startDrag = useCallback((e, modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const rect = modal.getBoundingClientRect();
    setDraggableModalState({
      id: modalId,
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect.left,
      initialY: rect.top,
    });
  }, []);

  const onDrag = useCallback((e) => {
    if (draggableModalState.isDragging) {
      const dx = e.clientX - draggableModalState.startX;
      const dy = e.clientY - draggableModalState.startY;

      const newX = draggableModalState.initialX + dx;
      const newY = draggableModalState.initialY + dy;

      const modal = document.getElementById(draggableModalState.id);
      if (modal) {
        modal.style.left = `${newX}px`;
        modal.style.top = `${newY}px`;
        modal.style.transform = 'none'; // Remove any existing transform
      }
    }
  }, [draggableModalState]);

  const stopDrag = useCallback(() => {
    setDraggableModalState({});
  }, []);

  useEffect(() => {
    if (draggableModalState.isDragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDrag);
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [draggableModalState, onDrag, stopDrag]);

  // Calculate totals for the current order products in the modal
  const currentOrderTotals = useMemo(() => {
    const totalRetail = currentOrderProducts.reduce((sum, p) => sum + (p.retail || 0), 0);
    const totalPurchase = currentOrderProducts.reduce((sum, p) => sum + (p.purchase || 0), 0);
    const totalDelivery = currentOrderProducts.reduce((sum, p) => sum + (p.delivery || 0), 0);
    const totalLayoutCost = currentOrderProducts.reduce((sum, p) => sum + (p.layoutCost || 0), 0);
    const totalMargin = currentOrderProducts.reduce((sum, p) => sum + (p.margin || 0), 0);
    const totalMarkup = totalPurchase !== 0 ? ((totalRetail - totalDelivery - totalLayoutCost) / totalPurchase).toFixed(2) : "-";
    const totalCoefficient = totalPurchase !== 0 ? ((totalRetail - totalDelivery - totalLayoutCost) / totalPurchase).toFixed(2) : "-";

    return { totalRetail, totalPurchase, totalDelivery, totalLayoutCost, totalMargin, totalMarkup, totalCoefficient };
  }, [currentOrderProducts]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 font-sans px-4 py-6 max-w-7xl mx-auto">
      <header className="mb-8 text-center relative"> {/* Added relative for positioning settings button */}
        {/* Removed the logo as per user request */}
        <div>
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Калькулятор цен</h1>
          <p className="text-gray-600">Управляйте расчетами и заказами</p>
        </div>
        {/* Settings button moved to top right */}
        <button
          onClick={() => setShowSettingsModal(true)}
          className="absolute top-0 right-0 p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 shadow-md"
          title="Настройки"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.33.83 2.864 2.334a1.724 1.724 0 00.002 2.716c1.543.942-.231 2.716-1.774 2.334a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.33-.83-2.864-2.334a1.724 1.724 0 00-.002-2.716c-1.543-.942.231-2.716 1.774-2.334a1.724 1.724 0 002.573-1.066z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Main History View */}
      <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4 border-b pb-2 flex justify-between items-center">
          История расчетов
          <div className="flex space-x-2">
            <button
              onClick={openNewCalculationModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
            >
              + Новый расчет
            </button>
            <button
              onClick={() => setShowClientManagerModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Управление клиентами
            </button>
          </div>
        </h2>
        <div className="flex justify-center mb-4 space-x-2">
          <button
            onClick={() => setShowArchiveView(false)}
            className={`px-4 py-2 rounded-md transition-colors ${!showArchiveView ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Активные заказы
          </button>
          <button
            onClick={() => setShowArchiveView(true)}
            className={`px-4 py-2 rounded-md transition-colors ${showArchiveView ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Архивные заказы
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Фильтры</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
            title={showFilters ? "Свернуть фильтры" : "Развернуть фильтры"}
          >
            {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <label htmlFor="searchInput" className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
              <input
                id="searchInput"
                type="text"
                placeholder="Имя, телефон, продукт, № заказа"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  title="Очистить поиск"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="relative" ref={statusFilterRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Фильтр по статусу</label>
              <button
                type="button"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-left flex justify-between items-center"
                onClick={() => setShowStatusFilterDropdown(!showStatusFilterDropdown)}
                aria-haspopup="listbox"
                aria-expanded={showStatusFilterDropdown}
                aria-controls="status-filter-list"
              >
                <span className="truncate">
                  {selectedStatusesFilter.length === 0
                    ? "Все статусы"
                    : selectedStatusesFilter.map(statusValue => {
                        const status = availableStatuses.find(s => s.value === statusValue);
                        return (
                          <span key={statusValue} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white mr-1" style={{ backgroundColor: status?.color || '#6B7280' }}>
                            {status?.name}
                          </span>
                        );
                      })}
                </span>
                <span>{showStatusFilterDropdown ? '▲' : '▼'}</span>
              </button>
              {showStatusFilterDropdown && (
                <div id="status-filter-list" role="listbox" className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {availableStatuses.map(status => (
                    <label key={status.id} role="option" aria-selected={selectedStatusesFilter.includes(status.value)} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                        checked={selectedStatusesFilter.includes(status.value)}
                        onChange={(e) => handleFilterStatusChange(status.value, e.target.checked)}
                      />
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: status.color }}>
                        {status.name}
                      </span>
                    </label>
                  ))}
                  <label role="option" aria-selected={selectedStatusesFilter.length === 0} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 rounded" checked={selectedStatusesFilter.length === 0} onChange={() => setSelectedStatusesFilter([])} />
                    <span className="ml-2 text-gray-700">Все статусы</span>
                  </label>
                </div>
              )}
            </div>
            <div className="relative" ref={tagFilterRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Фильтр по тегам</label>
              <button
                type="button"
                className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-left flex justify-between items-center"
                onClick={() => setShowTagFilterDropdown(!showTagFilterDropdown)}
                aria-haspopup="listbox"
                aria-expanded={showTagFilterDropdown}
                aria-controls="tag-filter-list"
              >
                <span className="truncate">
                  {selectedTagsFilter.length === 0
                    ? "Все теги"
                    : selectedTagsFilter.map(tagName => {
                        const tag = availableTags.find(t => t.name === tagName);
                        return (
                          <span key={tagName} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white mr-1" style={{ backgroundColor: tag?.color || '#6B7280' }}>
                            {tagName}
                          </span>
                        );
                      })}
                </span>
                <span>{showTagFilterDropdown ? '▲' : '▼'}</span>
              </button>
              {showTagFilterDropdown && (
                <div id="tag-filter-list" role="listbox" className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {availableTags.map(tag => (
                    <label key={tag.id} role="option" aria-selected={selectedTagsFilter.includes(tag.name)} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                        checked={selectedTagsFilter.includes(tag.name)}
                        onChange={(e) => {
                          const newTags = e.target.checked ? [...selectedTagsFilter, tag.name] : selectedTagsFilter.filter(t => t !== tag.name);
                          setSelectedTagsFilter(newTags);
                        }}
                      />
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: tag.color }}>
                        {tag.name}
                      </span>
                    </label>
                  ))}
                   <label role="option" aria-selected={selectedTagsFilter.length === 0} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 rounded" checked={selectedTagsFilter.length === 0} onChange={() => setSelectedTagsFilter([])} />
                      <span className="ml-2 text-gray-700">Все теги</span>
                    </label>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="photoCenterFilter" className="block text-sm font-medium text-gray-700 mb-1">Фильтр по фотоцентру</label>
              <select id="photoCenterFilter" value={photoCenterFilter} onChange={(e) => setPhotoCenterFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded">
                <option value="all">Все фотоцентры</option>
                <option value="Королёва 61">Королёва 61</option>
                <option value="Парашютная 61">Парашютная 61</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDateFilter" className="block text-sm font-medium text-gray-700 mb-1">Дата от</label>
                <input id="startDateFilter" type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div>
                <label htmlFor="endDateFilter" className="block text-sm font-medium text-gray-700 mb-1">Дата до</label>
                <input id="endDateFilter" type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" />
              </div>
            </div>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Сортировать по:</label>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => requestSort('timestamp')} className={`px-3 py-1 text-sm rounded ${sortConfig.key === 'timestamp' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-700'}`}>Дата{getSortIndicator('timestamp')}</button>
            <button onClick={() => requestSort('client.name')} className={`px-3 py-1 text-sm rounded ${sortConfig.key === 'client.name' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-700'}`}>Клиент{getSortIndicator('client.name')}</button>
            <button onClick={() => requestSort('totalRetail')} className={`px-3 py-1 text-sm rounded ${sortConfig.key === 'totalRetail' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-700'}`}>Розница{getSortIndicator('totalRetail')}</button>
            <button onClick={() => requestSort('status')} className={`px-3 py-1 text-sm rounded ${sortConfig.key === 'status' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-700'}`}>Статус{getSortIndicator('status')}</button>
          </div>
        </div>
        {selectedOrders.length > 0 && (
          <button onClick={deleteSelectedOrders} className="mt-2 w-full py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">Удалить выбранные ({selectedOrders.length})</button>
        )}
        <div className="flex gap-2 mt-2">
          <button onClick={exportToHTML} className="flex-1 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm">Экспорт в HTML</button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 mt-4">
          {paginatedHistory.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">История пуста или нет совпадений по фильтрам</p>
          ) : (
            paginatedHistory.map((entry, idx) => {
              const index = (currentPage - 1) * 10 + idx;
              const isExpanded = expandedOrders.includes(index);
              return (
                <div key={entry.orderNumber} className={`border rounded-md p-3 transition-colors ${entry.isArchived ? 'bg-gray-100 border-gray-300' : 'bg-white'}`}>
                  <div className="flex items-start">
                    <input type="checkbox" checked={selectedOrders.includes(index)} onChange={() => toggleSelectOrder(index)} className="mr-2 mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">{entry.timestamp}</p>
                          <p className="font-medium">
                            <span className="text-indigo-700 mr-2">{entry.orderNumber?.split(' ')[0]}</span>
                            <span className="font-bold text-indigo-700">{entry.orderNumber?.split(' ')[1]}</span>
                            <span className="font-bold text-indigo-700 ml-2">{entry.orderNumber?.split(' ')[2]}</span>
                          </p>
                          <p className="font-medium">{entry.client.name}</p>
                          {/* New: Client contact info in collapsed view */}
                          {!isExpanded && (
                            <div className="text-sm text-gray-600 flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                              {entry.client.phone && <span className="flex items-center"><svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>{entry.client.phone}</span>}
                              {entry.client.email && <span className="flex items-center"><svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 6V5a2 2 0 00-2-2H7a2 2 0 00-2 2v9m6 3h6a2 2 0 002-2v-3a2 2 0 00-2-2H7a2 2 0 00-2 2v3a2 2 0 002 2h6z"/></svg>{entry.client.email}</span>}
                              {entry.client.messenger && <span className="flex items-center"><svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>{entry.client.messenger}</span>}
                            </div>
                          )}
                          {entry.client.clientTags && entry.client.clientTags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {entry.client.clientTags.map((tagName, tagIdx) => (
                                <span key={tagIdx} className="px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: getClientTagColor(tagName) }}>{tagName}</span>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-gray-600">Розница: <span className="font-bold">{formatNumber(entry.totalRetail)} руб</span></p>
                          {!isExpanded && entry.products.some(p => p.tags && p.tags.length > 0) && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {entry.products.flatMap(p => p.tags).filter((v, i, a) => a.indexOf(v) === i).map((tagName, tagIdx) => {
                                const tag = availableTags.find(t => t.name === tagName);
                                return <span key={tagIdx} className="px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: tag?.color || '#6B7280' }}>{tagName}</span>;
                              })}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex flex-wrap justify-end gap-1 mb-1">
                            {Array.isArray(entry.status) && entry.status.map((s, sIdx) => (
                              <span key={sIdx} className="inline-block px-2 py-0.5 rounded-full text-xs text-white cursor-pointer" style={{ backgroundColor: getStatusColor(s) }} onClick={(e) => openHistoryStatusEditPopover(entry.orderNumber, e.currentTarget, e)}>{getStatusLabel(s)}</span>
                            ))}
                            <button onClick={(e) => openHistoryStatusEditPopover(entry.orderNumber, e.currentTarget, e)} className="ml-1 text-xs text-blue-500 hover:text-blue-700" title="Редактировать статусы">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036V18.5h-2.5v-2.5L15.232 5.232z" /></svg>
                            </button>
                          </div>
                          {/* New: Payment Status Display */}
                          <div className="flex flex-wrap justify-end gap-1 mb-1">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs text-white cursor-pointer" style={{ backgroundColor: getPaymentStatusColor(entry.paymentStatus) }} onClick={(e) => openHistoryPaymentStatusEditPopover(entry.orderNumber, e.currentTarget, e)}>{getPaymentStatusLabel(entry.paymentStatus)}</span>
                            <button onClick={(e) => openHistoryPaymentStatusEditPopover(entry.orderNumber, e.currentTarget, e)} className="ml-1 text-xs text-blue-500 hover:text-blue-700" title="Редактировать статус оплаты">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036V18.5h-2.5v-2.5L15.232 5.232z" /></svg>
                            </button>
                          </div>
                          <button onClick={() => toggleExpandOrder(index)} className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600" title={isExpanded ? "Свернуть" : "Развернуть"}>{isExpanded ? '▲' : '▼'}</button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-2 border-t pt-2 border-gray-200">
                          <p className="text-sm text-gray-600">Тел: {entry.client.phone}</p>
                          <p className="text-sm text-gray-600">Email: {entry.client.email}</p>
                          <p className="text-sm text-gray-600">Мессенджер: {entry.client.messenger || '-'}</p>
                          <p className="text-sm text-gray-600">Комментарий клиента: {entry.client.comment || '-'}</p>
                          <p className="text-sm text-gray-600">Фотоцентр: {entry.photoCenter || '-'}</p>
                          <p className="text-sm text-gray-600">Сотрудник: <span style={{ color: getEmployeeColor(entry.employee) }}>{entry.employee || '-'}</span></p>
                          {entry.orderComment && <p className="text-sm text-gray-600 mt-1">Общий комментарий: {entry.orderComment}</p>}
                          <div className="mt-2 text-sm text-gray-700">
                            <p className="font-semibold">Продукты:</p>
                            <ul className="list-disc list-inside ml-2">
                              {entry.products.map((p) => (
                                <li key={p.id} className="mb-1">
                                  {p.productName} ({p.quantity} шт.)
                                  <span className="ml-1 text-xs px-1 py-0.5 rounded bg-gray-200 text-gray-700">{getCalculatorTypeLabel(p.calculatorType)}</span>
                                  {p.deliveryDate && ` | Выдача: ${formatDate(p.deliveryDate)}`}
                                  {p.productComment && ` | Комментарий: ${p.productComment}`}
                                  {p.layoutStatus === 'make' && p.layoutCost > 0 && ` | Макет: ${formatNumber(p.layoutCost)} руб.`}
                                  {p.tags && p.tags.length > 0 ? (
                                    <div className="mt-1 flex flex-wrap gap-1 items-center">
                                      {p.tags.map((tagName, tagIdx) => {
                                        const tag = availableTags.find(t => t.name === tagName);
                                        return <span key={tagIdx} className="px-2 py-0.5 rounded-full text-xs text-white cursor-pointer" style={{ backgroundColor: tag?.color || '#6B7280' }} onClick={(e) => openHistoryTagEditPopover(entry.orderNumber, p.id, e.currentTarget, e)}>{tagName}</span>;
                                      })}
                                      <button onClick={(e) => openHistoryTagEditPopover(entry.orderNumber, p.id, e.currentTarget, e)} className="ml-1 text-xs text-blue-500 hover:text-blue-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036V18.5h-2.5v-2.5L15.232 5.232z" /></svg>
                                      </button>
                                    </div>
                                  ) : (
                                    <button onClick={(e) => openHistoryTagEditPopover(entry.orderNumber, p.id, e.currentTarget, e)} className="ml-1 text-xs text-blue-500 hover:text-blue-700">+ Добавить теги</button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-3 flex space-x-2 justify-end">
                            <button onClick={() => editOrder(index)} className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm" title="Редактировать"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036V18.5h-2.5v-2.5L15.232 5.232z" /></svg></button>
                            <button onClick={() => openPrintOptions(entry)} className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm" title="Печать"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg></button>
                            <button onClick={() => confirmToggleArchive(index)} className="p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm" title={entry.isArchived ? "Разархивировать" : "Архивировать"}>{entry.isArchived ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm0 0V6a2 2 0 012-2h10a2 2 0 012 2v2M5 8h14L12 22l-7-14z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm0 0V6a2 2 0 012-2h10a2 2 0 012 2v2M5 8h14L12 22l-7-14z" /></svg>}</button>
                            <button onClick={() => confirmDelete(index)} className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" title="Удалить"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">← Назад</button>
            <span className="text-sm text-gray-600">Страница {currentPage} из {totalPages}</span>
            <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Вперед →</button>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div id="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title"
             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
             style={draggableModalState.id === 'settings-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
          <div className={`bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto ${areControlPointsValid ? "" : "border-2 border-red-500"}`}>
            <h2 id="settings-modal-title" className="text-xl font-semibold text-indigo-700 mb-4 border-b pb-2 flex justify-between items-center cursor-grab"
                onMouseDown={(e) => startDrag(e, 'settings-modal')}>
              Настройки
              <button onClick={() => setShowSettingsModal(false)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600" title="Закрыть">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <button onClick={() => setSettingsView('polygraphy')} className={`px-4 py-2 rounded-md transition-colors ${settingsView === 'polygraphy' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Настройки полиграфии</button>
                <button onClick={() => setSettingsView('wideFormat')} className={`px-4 py-2 rounded-md transition-colors ${settingsView === 'wideFormat' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Настройки широкоформатной</button>
                <button onClick={() => setSettingsView('retail')} className={`px-4 py-2 rounded-md transition-colors ${settingsView === 'retail' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Настройки розницы</button>
                <button onClick={() => setSettingsView('tags')} className={`px-4 py-2 rounded-md transition-colors ${settingsView === 'tags' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Настройки тегов</button>
                <button onClick={() => setSettingsView('clientTags')} className={`px-4 py-2 rounded-md transition-colors ${settingsView === 'clientTags' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Теги клиентов</button>
                <button onClick={() => setSettingsView('statuses')} className={`px-4 py-2 rounded-md transition-colors ${settingsView === 'statuses' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Настройки статусов</button>
                <button onClick={() => setSettingsView('paymentStatuses')} className={`px-4 py-2 rounded-md transition-colors ${settingsView === 'paymentStatuses' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Статусы оплаты</button>
                <button onClick={() => setSettingsView('employees')} className={`px-4 py-2 rounded-md transition-colors ${settingsView === 'employees' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Сотрудники</button>
                <button onClick={() => setSettingsView('printTemplates')} className={`px-4 py-2 rounded-md transition-colors ${settingsView === 'printTemplates' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Шаблоны печати</button>
              </div>

              {settingsView === 'polygraphy' && (
                <>
                  <div>
                    <label htmlFor="minCoefficientPolygraphyValue" className="block text-sm font-medium text-gray-700 mb-1">Минимальный коэффициент наценки (Полиграфия)</label>
                    <input id="minCoefficientPolygraphyValue" type="number" step="0.1" min="0" value={minCoefficientPolygraphy} onChange={(e) => updateMinCoefficient('polygraphy', e.target.value)} onWheel={(e) => e.preventDefault()} className="w-full px-4 py-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label htmlFor="lowMarginThresholdPolygraphy" className="block text-sm font-medium text-gray-700 mb-1">Порог низкой маржи (руб) для Полиграфии</label>
                    <input id="lowMarginThresholdPolygraphy" type="number" step="10" min="0" value={lowMarginThreshold} onChange={(e) => setLowMarginThreshold(parseFloat(e.target.value))} onWheel={(e) => e.preventDefault()} className="w-full px-4 py-2 border border-gray-300 rounded" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Контрольные точки (Полиграфия)</label>
                    {controlPointsPolygraphy.map((point) => (
                      <div key={point.id} className="flex space-x-2 items-center">
                        <input type="text" value={point.name} onChange={(e) => updateControlPoint(point.id, "name", e.target.value)} placeholder="Название точки" className="w-1/3 px-3 py-1 border border-gray-300 rounded" />
                        <input type="number" value={point.purchase} onChange={(e) => updateControlPoint(point.id, "purchase", e.target.value)} placeholder="Закупка" onWheel={(e) => e.preventDefault()} className="w-1/3 px-3 py-1 border border-gray-300 rounded" />
                        <input type="number" value={point.retail} onChange={(e) => updateControlPoint(point.id, "retail", e.target.value)} placeholder="Розница" onWheel={(e) => e.preventDefault()} className="w-1/3 px-3 py-1 border border-gray-300 rounded" />
                        <span className="text-sm text-gray-600 whitespace-nowrap">Коэф: x{point.purchase === 0 ? '-' : (point.retail / point.purchase).toFixed(2)}</span>
                        <button onClick={() => deleteControlPoint(point.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" disabled={controlPointsPolygraphy.length <= 1}>×</button>
                      </div>
                    ))}
                    <button onClick={addControlPoint} className="mt-2 w-full py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm">+ Добавить точку</button>
                  </div>
                </>
              )}

              {settingsView === 'wideFormat' && (
                <>
                  <div>
                    <label htmlFor="minCoefficientWideFormatValue" className="block text-sm font-medium text-gray-700 mb-1">Минимальный коэффициент наценки (Широкоформатная)</label>
                    <input id="minCoefficientWideFormatValue" type="number" step="0.1" min="0" value={minCoefficientWideFormat} onChange={(e) => updateMinCoefficient('wideFormat', e.target.value)} onWheel={(e) => e.preventDefault()} className="w-full px-4 py-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label htmlFor="lowMarginThresholdWideFormat" className="block text-sm font-medium text-gray-700 mb-1">Порог низкой маржи (руб) для Широкоформатной</label>
                    <input id="lowMarginThresholdWideFormat" type="number" step="10" min="0" value={lowMarginThreshold} onChange={(e) => setLowMarginThreshold(parseFloat(e.target.value))} onWheel={(e) => e.preventDefault()} className="w-full px-4 py-2 border border-gray-300 rounded" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Контрольные точки (Широкоформатная)</label>
                    {controlPointsWideFormat.map((point) => (
                      <div key={point.id} className="flex space-x-2 items-center">
                        <input type="text" value={point.name} onChange={(e) => updateControlPoint(point.id, "name", e.target.value)} placeholder="Название точки" className="w-1/3 px-3 py-1 border border-gray-300 rounded" />
                        <input type="number" value={point.purchase} onChange={(e) => updateControlPoint(point.id, "purchase", e.target.value)} placeholder="Закупка" onWheel={(e) => e.preventDefault()} className="w-1/3 px-3 py-1 border border-gray-300 rounded" />
                        <input type="number" value={point.retail} onChange={(e) => updateControlPoint(point.id, "retail", e.target.value)} placeholder="Розница" onWheel={(e) => e.preventDefault()} className="w-1/3 px-3 py-1 border border-gray-300 rounded" />
                        <span className="text-sm text-gray-600 whitespace-nowrap">Коэф: x{point.purchase === 0 ? '-' : (point.retail / point.purchase).toFixed(2)}</span>
                        <button onClick={() => deleteControlPoint(point.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" disabled={controlPointsWideFormat.length <= 1}>×</button>
                      </div>
                    ))}
                    <button onClick={addControlPoint} className="mt-2 w-full py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm">+ Добавить точку</button>
                  </div>
                </>
              )}

              {settingsView === 'retail' && (
                <>
                  <div>
                    <label htmlFor="minCoefficientRetailValue" className="block text-sm font-medium text-gray-700 mb-1">Минимальный коэффициент наценки (Розница)</label>
                    <input id="minCoefficientRetailValue" type="number" step="0.1" min="0" value={minCoefficientRetail} onChange={(e) => updateMinCoefficient('retail', e.target.value)} onWheel={(e) => e.preventDefault()} className="w-full px-4 py-2 border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label htmlFor="lowMarginThresholdRetail" className="block text-sm font-medium text-gray-700 mb-1">Порог низкой маржи (руб) для Розницы</label>
                    <input id="lowMarginThresholdRetail" type="number" step="10" min="0" value={lowMarginThreshold} onChange={(e) => setLowMarginThreshold(parseFloat(e.target.value))} onWheel={(e) => e.preventDefault()} className="w-full px-4 py-2 border border-gray-300 rounded" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Контрольные точки (Розница)</label>
                    {controlPointsRetail.map((point) => (
                      <div key={point.id} className="flex space-x-2 items-center">
                        <input type="text" value={point.name} onChange={(e) => updateControlPoint(point.id, "name", e.target.value)} placeholder="Название точки" className="w-1/3 px-3 py-1 border border-gray-300 rounded" />
                        <input type="number" value={point.purchase} onChange={(e) => updateControlPoint(point.id, "purchase", e.target.value)} placeholder="Закупка" onWheel={(e) => e.preventDefault()} className="w-1/3 px-3 py-1 border border-gray-300 rounded" />
                        <input type="number" value={point.retail} onChange={(e) => updateControlPoint(point.id, "retail", e.target.value)} placeholder="Розница" onWheel={(e) => e.preventDefault()} className="w-1/3 px-3 py-1 border border-gray-300 rounded" />
                        <span className="text-sm text-gray-600 whitespace-nowrap">Коэф: x{point.purchase === 0 ? '-' : (point.retail / point.purchase).toFixed(2)}</span>
                        <button onClick={() => deleteControlPoint(point.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" disabled={controlPointsRetail.length <= 1}>×</button>
                      </div>
                    ))}
                    <button onClick={addControlPoint} className="mt-2 w-full py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm">+ Добавить точку</button>
                  </div>
                </>
              )}

              {settingsView === 'tags' && (
                <>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Настройка тегов продуктов</h3>
                  <div className="space-y-2">
                    {availableTags.map((tag) => (
                      <div key={tag.id} className="flex space-x-2 items-center">
                        <input type="text" value={tag.name} onChange={(e) => updateTag(tag.id, "name", e.target.value)} placeholder="Название тега" className="w-1/2 px-3 py-1 border border-gray-300 rounded" />
                        <input type="color" value={tag.color} onChange={(e) => updateTag(tag.id, "color", e.target.value)} className="w-1/4 h-8 border border-gray-300 rounded p-0" title="Цвет тега" />
                        <button onClick={() => deleteTag(tag.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" disabled={availableTags.length <= 1}>×</button>
                      </div>
                    ))}
                    <button onClick={addTag} className="mt-2 w-full py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm">+ Добавить тег</button>
                  </div>
                </>
              )}

              {settingsView === 'clientTags' && (
                <>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Настройка тегов клиентов</h3>
                  <div className="space-y-2">
                    {availableClientTags.map((tag) => (
                      <div key={tag.id} className="flex space-x-2 items-center">
                        <input type="text" value={tag.name} onChange={(e) => updateClientTag(tag.id, "name", e.target.value)} placeholder="Название тега" className="w-1/2 px-3 py-1 border border-gray-300 rounded" />
                        <input type="color" value={tag.color} onChange={(e) => updateClientTag(tag.id, "color", e.target.value)} className="w-1/4 h-8 border border-gray-300 rounded p-0" title="Цвет тега" />
                        <button onClick={() => deleteClientTag(tag.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" disabled={availableClientTags.length <= 1}>×</button>
                      </div>
                    ))}
                    <button onClick={addClientTag} className="mt-2 w-full py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm">+ Добавить тег клиента</button>
                  </div>
                </>
              )}

              {settingsView === 'statuses' && (
                <>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Настройка статусов</h3>
                  <div className="space-y-2">
                    {availableStatuses.map((status) => (
                      <div key={status.id} className="flex space-x-2 items-center">
                        <input type="text" value={status.name} onChange={(e) => updateStatus(status.id, "name", e.target.value)} placeholder="Название статуса" className="w-1/2 px-3 py-1 border border-gray-300 rounded" />
                        <input type="color" value={status.color} onChange={(e) => updateStatus(status.id, "color", e.target.value)} className="w-1/4 h-8 border border-gray-300 rounded p-0" title="Цвет статуса" />
                        <button onClick={() => deleteStatus(status.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" disabled={['new', 'inProgress', 'completed'].includes(status.value)}>×</button>
                      </div>
                    ))}
                    <button onClick={addStatus} className="mt-2 w-full py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm">+ Добавить статус</button>
                  </div>
                </>
              )}

              {settingsView === 'paymentStatuses' && (
                <>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Настройка статусов оплаты</h3>
                  <div className="space-y-2">
                    {availablePaymentStatuses.map((status) => (
                      <div key={status.id} className="flex space-x-2 items-center">
                        <input type="text" value={status.name} onChange={(e) => updatePaymentStatus(status.id, "name", e.target.value)} placeholder="Название статуса оплаты" className="w-1/2 px-3 py-1 border border-gray-300 rounded" />
                        <input type="color" value={status.color} onChange={(e) => updatePaymentStatus(status.id, "color", e.target.value)} className="w-1/4 h-8 border border-gray-300 rounded p-0" title="Цвет статуса оплаты" />
                        <button onClick={() => deletePaymentStatus(status.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" disabled={['paid', 'unpaid', 'partiallyPaid'].includes(status.value)}>×</button>
                      </div>
                    ))}
                    <button onClick={addPaymentStatus} className="mt-2 w-full py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm">+ Добавить статус оплаты</button>
                  </div>
                </>
              )}

              {settingsView === 'employees' && (
                <>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Настройка сотрудников</h3>
                  <div className="space-y-2">
                    {availableEmployees.map((employee) => (
                      <div key={employee.id} className="flex space-x-2 items-center">
                        <input type="text" value={employee.name} onChange={(e) => updateEmployee(employee.id, "name", e.target.value)} placeholder="Имя сотрудника" className="w-1/2 px-3 py-1 border border-gray-300 rounded" />
                        <input type="color" value={employee.color} onChange={(e) => updateEmployee(employee.id, "color", e.target.value)} className="w-1/4 h-8 border border-gray-300 rounded p-0" title="Цвет сотрудника" />
                        <button onClick={() => deleteEmployee(employee.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" disabled={availableEmployees.length <= 1 || employee.name === "Не указан"}>×</button>
                      </div>
                    ))}
                    <button onClick={addEmployee} className="mt-2 w-full py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-sm">+ Добавить сотрудника</button>
                  </div>
                </>
              )}

              {settingsView === 'printTemplates' && (
                <>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Шаблоны печати</h3>
                  <div className="space-y-2">
                    {printTemplates.map((template) => (
                      <div key={template.id} className="flex space-x-2 items-center bg-gray-50 p-2 rounded-md">
                        <span className="font-medium flex-1">{template.name}</span>
                        <button onClick={() => { setEditingPrintTemplate(template); setShowPrintOptionsModal(true); }} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">Редактировать</button>
                      </div>
                    ))}
                    {/* Add a button to add new templates if desired, but not explicitly requested for CRUD */}
                  </div>
                </>
              )}

            </div>
            {!areControlPointsValid && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm font-medium">Контрольные точки некорректны!</p>
                <ul className="text-red-600 text-sm mt-1 list-disc pl-4">
                  <li>Цены закупки должны возрастать</li>
                  <li>Розничные цены должны быть не ниже предыдущих</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New/Edit Calculation Modal */}
      {showNewCalculationModal && (
        <div id="new-calculation-modal" role="dialog" aria-modal="true" aria-labelledby="new-calculation-title"
             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
             style={draggableModalState.id === 'new-calculation-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col">
            <h2 id="new-calculation-title" className="text-2xl font-bold text-indigo-800 mb-4 border-b pb-2 flex justify-between items-center flex-shrink-0 cursor-grab"
                onMouseDown={(e) => startDrag(e, 'new-calculation-modal')}>
              {editingIndex !== null ? "Редактировать заказ" : "Новый расчет"}
              <button onClick={(e) => { e.stopPropagation(); setShowNewCalculationModal(false); }} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 cursor-pointer" title="Закрыть">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </h2>

            <div ref={modalScrollRef} className="flex-grow overflow-y-auto pr-4 -mr-4">
              
              {/* Product Entry Form */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-3">{editingProductId ? `Редактирование продукта` : 'Добавление нового продукта'}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Тип калькулятора:</label>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center"><input type="radio" className="form-radio" name={`calcType-new`} value="polygraphy" checked={newProduct.calculatorType === 'polygraphy'} onChange={(e) => handleNewProductChange("calculatorType", e.target.value)} /><span className="ml-2">Полиграфия</span></label>
                            <label className="inline-flex items-center"><input type="radio" className="form-radio" name={`calcType-new`} value="wideFormat" checked={newProduct.calculatorType === 'wideFormat'} onChange={(e) => handleNewProductChange("calculatorType", e.target.value)} /><span className="ml-2">Широкоформатная</span></label>
                            <label className="inline-flex items-center"><input type="radio" className="form-radio" name={`calcType-new`} value="retail" checked={newProduct.calculatorType === 'retail'} onChange={(e) => handleNewProductChange("calculatorType", e.target.value)} /><span className="ml-2">Розница</span></label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Закупочная цена (руб)</label>
                        <input type="text" value={newProduct.purchase} onChange={(e) => handleNewProductChange("purchase", e.target.value)} className={`w-full px-4 py-2 border rounded ${!newProduct.isValidPurchase ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" />
                        {!newProduct.isValidPurchase && <p className="text-red-500 text-xs mt-1">Введите корректную закупочную цену (неотрицательную).</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Стоимость доставки (руб)</label>
                        <input type="text" value={newProduct.delivery} onChange={(e) => handleNewProductChange("delivery", e.target.value)} className={`w-full px-4 py-2 border rounded ${!newProduct.isValidDelivery ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" />
                        {!newProduct.isValidDelivery && <p className="text-red-500 text-xs mt-1">Введите корректную стоимость доставки (неотрицательную).</p>}
                    </div>
                  </div>

                  {/* Manual Retail Price Toggle and Input */}
                  <div className="mt-4">
                      <label className="flex items-center cursor-pointer">
                          <input
                              type="checkbox"
                              className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                              checked={newProduct.manualRetailEnabled}
                              onChange={(e) => {
                                  handleNewProductChange("manualRetailEnabled", e.target.checked);
                                  // Reset manual price if unchecked
                                  if (!e.target.checked) {
                                      handleNewProductChange("manualRetailPrice", "");
                                  }
                              }}
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">Ввести розничную цену вручную</span>
                      </label>
                      {newProduct.manualRetailEnabled && (
                          <div className="mt-2">
                              <label htmlFor="manualRetailPrice" className="block text-sm font-medium text-gray-700 mb-1">Розничная цена вручную (руб)</label>
                              <input
                                  type="text"
                                  id="manualRetailPrice"
                                  value={newProduct.manualRetailPrice}
                                  onChange={(e) => handleNewProductChange("manualRetailPrice", e.target.value)}
                                  className={`w-full px-4 py-2 border rounded ${!newProduct.isValidManualRetailPrice ? 'border-red-500' : 'border-gray-300'}`}
                                  placeholder="Введите розничную цену"
                              />
                              {!newProduct.isValidManualRetailPrice && <p className="text-red-500 text-xs mt-1">Введите корректную розничную цену (неотрицательную).</p>}
                          </div>
                      )}
                  </div>

                  {/* Calculation Result */}
                  <div className="my-4 p-3 bg-indigo-50 rounded-md">
                    <h4 className="text-md font-semibold text-indigo-700 mb-2">Расчет по продукту</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-600">Розничная цена:</span>
                        <span className="font-bold text-right text-green-600">
                            {newProduct.manualRetailEnabled ? "Вручную: " : ""}
                            {formatNumber(newProduct.retail)} руб
                        </span>
                        <span className="text-gray-600">Маржа:</span><span className="font-bold text-right text-green-600">{formatNumber(newProduct.margin)} руб</span>
                        <span className="text-gray-600">Наценка:</span><span className="font-bold text-right">x{newProduct.markup}</span>
                    </div>
                  </div>

                  {/* Product Details Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название продукта</label>
                        <input type="text" value={newProduct.productName} onChange={(e) => handleNewProductChange("productName", e.target.value)} className={`w-full px-4 py-2 border rounded ${!newProduct.isValidProductName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Например, Визитки" />
                        {!newProduct.isValidProductName && <p className="text-red-500 text-xs mt-1">Название продукта не может быть пустым.</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Количество</label>
                        <input type="text" value={newProduct.quantity} onChange={(e) => handleNewProductChange("quantity", e.target.value)} className={`w-full px-4 py-2 border rounded ${!newProduct.isValidQuantity ? 'border-red-500' : 'border-gray-300'}`} placeholder="1" />
                        {!newProduct.isValidQuantity && <p className="text-red-500 text-xs mt-1">Количество должно быть не менее 1.</p>}
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Формат бумаги</label><input type="text" value={newProduct.paperFormat} onChange={(e) => handleNewProductChange("paperFormat", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Например, А4" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Стороны печати</label><select value={newProduct.sides} onChange={(e) => handleNewProductChange("sides", parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded"><option value={1}>Односторонняя</option><option value={2}>Двусторонняя</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Макет</label><select value={newProduct.layoutStatus} onChange={(e) => handleNewProductChange("layoutStatus", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded"><option value="client">Макет клиента</option><option value="make">Макет делаем</option></select></div>
                    {newProduct.layoutStatus === 'make' && 
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Стоимость макета (руб)</label>
                          <input type="text" value={newProduct.layoutCost} onChange={(e) => handleNewProductChange("layoutCost", e.target.value)} className={`w-full px-4 py-2 border rounded ${!newProduct.isValidLayoutCost ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" />
                          {!newProduct.isValidLayoutCost && <p className="text-red-500 text-xs mt-1">Введите корректную стоимость макета (неотрицательную).</p>}
                      </div>
                    }
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Дата и время выдачи</label><input type="datetime-local" value={newProduct.deliveryDate} onChange={(e) => handleNewProductChange("deliveryDate", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" /></div>
                    <div className="col-span-full"><label className="block text-sm font-medium text-gray-700 mb-1">Комментарий к продукту</label><textarea rows="2" value={newProduct.productComment} onChange={(e) => handleNewProductChange("productComment", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Комментарий..."></textarea></div>
                    
                    {/* New: Tags for product */}
                    <div className="col-span-full relative" ref={productTagDropdownRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Теги продукта</label>
                      <button
                        type="button"
                        className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-left flex justify-between items-center"
                        onClick={() => setShowProductTagDropdown(!showProductTagDropdown)}
                        aria-haspopup="listbox"
                        aria-expanded={showProductTagDropdown}
                        aria-controls="product-tag-list"
                      >
                        <span className="truncate">
                          {newProduct.tags.length === 0
                            ? "Выберите теги"
                            : newProduct.tags.map(tagName => {
                                const tag = availableTags.find(t => t.name === tagName);
                                return (
                                  <span key={tagName} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white mr-1" style={{ backgroundColor: tag?.color || '#6B7280' }}>
                                    {tagName}
                                  </span>
                                );
                              })}
                        </span>
                        <span>{showProductTagDropdown ? '▲' : '▼'}</span>
                      </button>
                      {showProductTagDropdown && (
                        <div id="product-tag-list" role="listbox" className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                          {availableTags.map(tag => (
                            <label key={tag.id} role="option" aria-selected={newProduct.tags.includes(tag.name)} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                                checked={newProduct.tags.includes(tag.name)}
                                onChange={(e) => handleProductTagChangeInModal(tag.name, e.target.checked)}
                              />
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: tag.color }}>
                                {tag.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={handleAddNewOrUpdateProduct} className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    {editingProductId ? 'Обновить продукт' : '+ Добавить продукт в заказ'}
                  </button>
              </div>
              
              {/* Added Products List */}
              {currentOrderProducts.length > 0 && (
                <div className="space-y-2 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Добавленные продукты</h3>
                    {currentOrderProducts.map((p, idx) => (
                        <div key={p.id} className="flex justify-between items-center bg-white p-2 border rounded-md">
                            <span>{idx + 1}. {p.productName} ({p.quantity} шт.) - {formatNumber(p.retail)} руб.</span>
                            <div>
                                <button onClick={() => handleStartEditing(p.id)} className="p-1 text-blue-600 hover:text-blue-800" title="Редактировать"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036V18.5h-2.5v-2.5L15.232 5.232z" /></svg></button>
                                <button onClick={() => { setProductToDeleteIdInModal(p.id); setShowProductDeleteConfirmModal(true); }} className="p-1 text-red-600 hover:text-red-800" title="Удалить"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                        </div>
                    ))}
                </div>
              )}

              {/* Order Comment, Status and Employee moved here */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">Общие данные заказа</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Общий комментарий к заказу</label>
                    <textarea name="orderComment" rows="2" value={currentClientInfo.orderComment} onChange={handleClientInfoChange} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Комментарий к заказу..."></textarea>
                  </div>
                  <div className="relative" ref={modalStatusDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус заказа</label>
                    <button type="button" onClick={() => setShowModalStatusDropdown(!showModalStatusDropdown)} className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-left flex justify-between items-center"
                      aria-haspopup="listbox" aria-expanded={showModalStatusDropdown} aria-controls="modal-status-list">
                      <span className="truncate">{currentClientInfo.orderStatus.length > 0 ? currentClientInfo.orderStatus.map(s => getStatusLabel(s)).join(', ') : "Выберите статус"}</span>
                      <span>{showModalStatusDropdown ? '▲' : '▼'}</span>
                    </button>
                    {showModalStatusDropdown && (
                      <div id="modal-status-list" role="listbox" className="absolute bottom-full mb-1 z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {availableStatuses.map(status => (
                          <label key={status.id} role="option" aria-selected={currentClientInfo.orderStatus.includes(status.value)} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 rounded" checked={currentClientInfo.orderStatus.includes(status.value)} onChange={(e) => handleModalOrderStatusChange(status.value, e.target.checked)} />
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: status.color }}>{status.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* New: Payment Status Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус оплаты</label>
                    <select name="paymentStatus" value={currentClientInfo.paymentStatus} onChange={(e) => handleModalPaymentStatusChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded">
                      {availablePaymentStatuses.map(status => (
                        <option key={status.id} value={status.value} style={{ color: status.color }}>{status.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label>
                    <select name="employee" value={currentClientInfo.employee} onChange={handleClientInfoChange} className="w-full px-4 py-2 border border-gray-300 rounded">
                        {availableEmployees.map(emp => (
                            <option key={emp.id} value={emp.name} style={{ color: emp.color }}>{emp.name}</option>
                        ))}
                    </select>
                  </div>
                  {/* Moved Photo Center here */}
                  <div>
                    <label htmlFor="photoCenter" className="block text-sm font-medium text-gray-700 mb-1">Фотоцентр</label>
                    <select name="photoCenter" value={currentClientInfo.photoCenter} onChange={handleClientInfoChange} className="w-full px-4 py-2 border border-gray-300 rounded">
                      <option value="Королёва 61">Королёва 61</option>
                      <option value="Парашютная 61">Парошютная 61</option>
                    </select>
                  </div>
                </div>
              </div>


              {/* Client Info Section & Totals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-700 mb-3">Информация о клиенте</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Имя клиента</label>
                              <input type="text" name="name" value={currentClientInfo.name} onChange={handleClientInfoChange} className={`w-full px-4 py-2 border rounded ${!currentClientInfo.isValidName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Имя" ref={clientNameInputRef} />
                              {!currentClientInfo.isValidName && <p className="text-red-500 text-xs mt-1">Имя клиента не может быть пустым.</p>}
                              {clientSuggestions.length > 0 && (
                                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                                      {clientSuggestions.map((client, index) => (
                                          <li key={client.id || index} onClick={() => selectClientSuggestion(client)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{client.name} - {client.phone}</li>
                                      ))}
                                  </ul>
                              )}
                          </div>
                          <div><label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label><input type="text" name="phone" value={currentClientInfo.phone} onChange={handleClientInfoChange} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Телефон" /></div>
                          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={currentClientInfo.email} onChange={handleClientInfoChange} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Email" /></div>
                          <div><label className="block text-sm font-medium text-gray-700 mb-1">Мессенджер</label><input type="text" name="messenger" value={currentClientInfo.messenger} onChange={handleClientInfoChange} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Например, Telegram, WhatsApp" /></div>
                          
                          {/* New: Client Tags */}
                          <div className="md:col-span-2 relative" ref={modalClientTagDropdownRef}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Теги клиента</label>
                            <button
                                type="button"
                                className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-left flex justify-between items-center"
                                onClick={() => setShowNewCalculationClientTagDropdown(!showNewCalculationClientTagDropdown)} // Updated state
                                aria-haspopup="listbox"
                                aria-expanded={showNewCalculationClientTagDropdown} // Updated state
                                aria-controls="client-tag-modal-list"
                            >
                                <span className="truncate">
                                {currentClientInfo.clientTags.length === 0
                                    ? "Выберите теги клиента"
                                    : currentClientInfo.clientTags.map(tagName => {
                                        const tag = availableClientTags.find(t => t.name === tagName);
                                        return (
                                        <span key={tagName} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white mr-1" style={{ backgroundColor: tag?.color || '#6B7280' }}>
                                            {tagName}
                                        </span>
                                        );
                                    })}
                                </span>
                                <span>{showNewCalculationClientTagDropdown ? '▲' : '▼'}</span>
                            </button>
                            {showNewCalculationClientTagDropdown && ( // Updated state
                                <div id="client-tag-modal-list" role="listbox" className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                                {availableClientTags.map(tag => (
                                    <label key={tag.id} role="option" aria-selected={currentClientInfo.clientTags.includes(tag.name)} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                                        checked={currentClientInfo.clientTags.includes(tag.name)}
                                        onChange={(e) => handleClientTagChangeInModal(tag.name, e.target.checked)}
                                    />
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: tag.color }}>
                                        {tag.name}
                                    </span>
                                    </label>
                                ))}
                                </div>
                            )}
                          </div>
                          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Комментарий клиента</label><textarea name="comment" rows="2" value={currentClientInfo.comment} onChange={handleClientInfoChange} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Комментарий к клиенту..."></textarea></div>
                        </div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-indigo-700 mb-3">Итого по заказу</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center"><span className="text-gray-600">Общая розничная цена:</span><span className={`text-xl font-bold ${!currentOrderProducts.some(p => p.calculatorType === 'retail') && isLowMargin(currentOrderTotals.totalMargin) ? "text-red-600" : "text-indigo-700"}`}>{formatNumber(currentOrderTotals.totalRetail)} руб</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-600">Общая маржа:</span><span className={`text-lg font-medium ${!currentOrderProducts.some(p => p.calculatorType === 'retail') && isLowMargin(currentOrderTotals.totalMargin) ? "text-red-600 font-bold" : "text-green-600"}`}>{formatNumber(currentOrderTotals.totalMargin)} руб</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-600">Общая наценка:</span><span className="font-bold text-right">x{currentOrderTotals.totalMarkup}</span></div>
                        {!currentOrderProducts.some(p => p.calculatorType === 'retail') && isLowMargin(currentOrderTotals.totalMargin) && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md"><p className="text-red-700 text-sm">Внимание! Общая маржа по заказу ниже порога ({formatNumber(lowMarginThreshold)} руб).</p></div>
                        )}
                      </div>
                    </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 flex-shrink-0">
              <button onClick={() => setShowNewCalculationModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" disabled={loading}>Отмена</button>
              <button onClick={saveOrderToHistory} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center" disabled={loading}>
                {loading && <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {editingIndex !== null ? "Обновить заказ" : "Сохранить заказ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals: Delete, Archive, Print, etc. */}
      {showDeleteModal && (
        <div id="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title"
             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             style={draggableModalState.id === 'delete-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 id="delete-modal-title" className="text-xl font-semibold text-gray-800 mb-4 cursor-grab"
                onMouseDown={(e) => startDrag(e, 'delete-modal')}>Подтвердите удаление</h3>
            <p className="text-gray-700 mb-6">Вы уверены, что хотите удалить этот расчет?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Отмена</button>
              <button onClick={() => deleteFromHistory(deleteIndex)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Удалить</button>
            </div>
          </div>
        </div>
      )}
      {showProductDeleteConfirmModal && (
        <div id="product-delete-modal" role="dialog" aria-modal="true" aria-labelledby="product-delete-modal-title"
             className="fixed inset-0 bg-black bg-opacity50 flex items-center justify-center z-[60]"
             style={draggableModalState.id === 'product-delete-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 id="product-delete-modal-title" className="text-xl font-semibold text-gray-800 mb-4 cursor-grab"
                onMouseDown={(e) => startDrag(e, 'product-delete-modal')}>Подтвердите удаление продукта</h3>
            <p className="text-gray-700 mb-6">Вы уверены, что хотите удалить этот продукт из заказа?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowProductDeleteConfirmModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Отмена</button>
              <button onClick={() => handleRemoveProduct(productToDeleteIdInModal)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Удалить продукт</button>
            </div>
          </div>
        </div>
      )}
      {showArchiveConfirmModal && (
        <div id="archive-modal" role="dialog" aria-modal="true" aria-labelledby="archive-modal-title"
             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             style={draggableModalState.id === 'archive-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 id="archive-modal-title" className="text-xl font-semibold text-gray-800 mb-4 cursor-grab"
                onMouseDown={(e) => startDrag(e, 'archive-modal')}>Подтвердите {history[archiveIndex]?.isArchived ? "разархивацию" : "архивацию"}</h3>
            <p className="text-gray-700 mb-6">Вы уверены, что хотите {history[archiveIndex]?.isArchived ? "разархивировать" : "архивировать"} этот заказ?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowArchiveConfirmModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Отмена</button>
              <button onClick={performArchiveToggle} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">{history[archiveIndex]?.isArchived ? "Разархивировать" : "Архивировать"}</button>
            </div>
          </div>
        </div>
      )}
      {showPrintOptionsModal && printEntry && (
        <div id="print-options-modal" role="dialog" aria-modal="true" aria-labelledby="print-options-title"
             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
             style={draggableModalState.id === 'print-options-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 id="print-options-title" className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 cursor-grab"
                onMouseDown={(e) => startDrag(e, 'print-options-modal')}>Настройки печати</h3>
            
            {/* New: Print Format Selector */}
            <div className="mb-4">
              <label htmlFor="printFormat" className="block text-sm font-medium text-gray-700 mb-1">Формат печати</label>
              <select id="printFormat" value={printFormat} onChange={(e) => setPrintFormat(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded">
                <option value="A4">A4</option>
                <option value="A5">A5</option>
                {/* Add more formats as needed */}
              </select>
            </div>

            {/* New: Print Templates */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Шаблоны печати</label>
              <div className="flex space-x-2">
                {printTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => applyPrintTemplate(template.options)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center"><input type="checkbox" id="printOrderInfo" name="orderInfo" checked={printOptions.orderInfo} onChange={handlePrintOptionChange} className="mr-2" /><label htmlFor="printOrderInfo" className="text-gray-700">Информация о заказе</label></div>
              <div className="flex items-center"><input type="checkbox" id="printClientInfo" name="clientInfo" checked={printOptions.clientInfo} onChange={handlePrintOptionChange} className="mr-2" /><label htmlFor="printClientInfo" className="text-gray-700">Данные клиента</label></div>
              <div className="flex items-center"><input type="checkbox" id="printPaymentStatus" name="paymentStatus" checked={printOptions.paymentStatus} onChange={handlePrintOptionChange} className="mr-2" /><label htmlFor="printPaymentStatus" className="text-gray-700">Статус оплаты</label></div>
              <div className="ml-6 space-y-2 border-l-2 pl-4 border-gray-200">
                  <div className="flex items-center"><input type="checkbox" id="printProductPurchase" name="productPurchase" checked={printOptions.productPurchase} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.productDetails} /><label htmlFor="printProductPurchase" className="text-gray-700">Закупочная цена продукта</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printProductRetail" name="productRetail" checked={printOptions.productRetail} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.productDetails} /><label htmlFor="printProductRetail" className="text-gray-700">Розничная цена продукта</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printProductMarkupMargin" name="productMarkupMargin" checked={printOptions.productMarkupMargin} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.productDetails} /><label htmlFor="printProductMarkupMargin" className="text-gray-700">Маржа/Наценка продукта</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printProductFormatSides" name="productFormatSides" checked={printOptions.productFormatSides} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.productDetails} /><label htmlFor="printProductFormatSides" className="text-gray-700">Формат/Стороны продукта</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printProductLayoutQuantity" name="productLayoutQuantity" checked={printOptions.productLayoutQuantity} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.productDetails} /><label htmlFor="printProductLayoutQuantity" className="text-gray-700">Макет/Количество продукта</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printProductCommentDate" name="productCommentDate" checked={printOptions.productCommentDate} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.productDetails} /><label htmlFor="printProductCommentDate" className="text-gray-700">Комментарий/Дата выдачи продукта</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printProductLayoutCost" name="productLayoutCost" checked={printOptions.productLayoutCost} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.productDetails} /><label htmlFor="printProductLayoutCost" className="text-gray-700">Стоимость макета продукта</label></div>
              </div>
              <div className="flex items-center"><input type="checkbox" id="printTotalSummary" name="totalSummary" checked={printOptions.totalSummary} onChange={handlePrintOptionChange} className="mr-2" /><label htmlFor="printTotalSummary" className="text-gray-700">Итоговая сводка</label></div>
              <div className="ml-6 space-y-2 border-l-2 pl-4 border-gray-200">
                  <div className="flex items-center"><input type="checkbox" id="printTotalPurchaseSummary" name="totalPurchaseSummary" checked={printOptions.totalPurchaseSummary} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.totalSummary} /><label htmlFor="printTotalPurchaseSummary" className="text-gray-700">Общая закупочная</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printTotalDeliverySummary" name="totalDeliverySummary" checked={printOptions.totalDeliverySummary} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.totalSummary} /><label htmlFor="printTotalDeliverySummary" className="text-gray-700">Общая доставка</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printTotalRetailSummary" name="totalRetailSummary" checked={printOptions.totalRetailSummary} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.totalSummary} /><label htmlFor="printTotalRetailSummary" className="text-gray-700">Общая розничная</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printTotalMarkupSummary" name="totalMarkupSummary" checked={printOptions.totalMarkupSummary} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.totalSummary} /><label htmlFor="printTotalMarkupSummary" className="text-gray-700">Общая наценка</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printTotalMarginSummary" name="totalMarginSummary" checked={printOptions.totalMarginSummary} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.totalSummary} /><label htmlFor="printTotalMarginSummary" className="text-gray-700">Общая маржа</label></div>
                  <div className="flex items-center"><input type="checkbox" id="printTotalCoefficientSummary" name="totalCoefficientSummary" checked={printOptions.totalCoefficientSummary} onChange={handlePrintOptionChange} className="mr-2" disabled={!printOptions.totalSummary} /><label htmlFor="printTotalCoefficientSummary" className="text-gray-700">Общий коэффициент</label></div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowPrintOptionsModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Отмена</button>
              <button onClick={() => printCalculation(printEntry, printOptions)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Печать</button>
            </div>
          </div>
        </div>
      )}
      {showHistoryTagEditPopover && editingHistoryTagProduct && (
        <div ref={historyTagEditRef} className="bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50"
             style={{
                 position: 'fixed',
                 top: editingHistoryTagProduct.clientY + 'px',
                 left: editingHistoryTagProduct.clientX + 'px',
                 minWidth: '200px'
             }}>
          <h4 className="text-md font-semibold text-gray-800 mb-2">Редактировать теги</h4>
          <div className="space-y-2">
            {availableTags.map(tag => {
              // Find the specific order and product by their IDs
              const order = history.find(o => o.orderNumber === editingHistoryTagProduct.orderId);
              const product = order?.products.find(p => p.id === editingHistoryTagProduct.productId);
              const isChecked = product?.tags.includes(tag.name) || false;

              return (
                <label key={tag.id} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                    checked={isChecked}
                    onChange={(e) => {
                      const currentTags = product?.tags || [];
                      const newTags = e.target.checked ? [...currentTags, tag.name] : currentTags.filter(t => t !== tag.name);
                      handleHistoryProductTagChange(editingHistoryTagProduct.orderId, editingHistoryTagProduct.productId, newTags);
                    }}
                  />
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: tag.color }}>{tag.name}</span>
                </label>
              );
            })}
          </div>
          <button onClick={() => setShowHistoryTagEditPopover(false)} className="mt-4 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">Готово</button>
        </div>
      )}
      {showHistoryStatusEditPopover && editingHistoryStatusOrder && (
        <div ref={historyStatusEditRef} className="bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50"
             style={{
                 position: 'fixed',
                 top: editingHistoryStatusOrder.clientY + 'px',
                 left: editingHistoryStatusOrder.clientX + 'px',
                 minWidth: '200px'
             }}>
          <h4 className="text-md font-semibold text-gray-800 mb-2">Редактировать статусы</h4>
          <div className="space-y-2">
            {availableStatuses.map(status => {
              const order = history.find(o => o.orderNumber === editingHistoryStatusOrder.orderId);
              const isChecked = order?.status.includes(status.value) || false;

              return (
                <label key={status.id} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                    checked={isChecked}
                    onChange={(e) => {
                      const currentStatuses = order?.status || [];
                      const newStatuses = e.target.checked ? [...currentStatuses, status.value] : currentStatuses.filter(s => s !== status.value);
                      handleHistoryOrderStatusChange(editingHistoryStatusOrder.orderId, newStatuses);
                    }}
                  />
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: status.color }}>{status.name}</span>
                </label>
              );
            })}
          </div>
          <button onClick={() => setShowHistoryStatusEditPopover(false)} className="mt-4 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">Готово</button>
        </div>
      )}
      {showHistoryPaymentStatusEditPopover && editingHistoryPaymentStatusOrder && ( // New: Payment Status Popover
        <div ref={historyPaymentStatusEditRef} className="bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50"
             style={{
                 position: 'fixed',
                 top: editingHistoryPaymentStatusOrder.clientY + 'px',
                 left: editingHistoryPaymentStatusOrder.clientX + 'px',
                 minWidth: '200px'
             }}>
          <h4 className="text-md font-semibold text-gray-800 mb-2">Редактировать статус оплаты</h4>
          <div className="space-y-2">
            {availablePaymentStatuses.map(status => {
              const order = history.find(o => o.orderNumber === editingHistoryPaymentStatusOrder.orderId);
              const isChecked = order?.paymentStatus === status.value;

              return (
                <label key={status.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-indigo-600 rounded"
                    name="paymentStatusRadio"
                    value={status.value}
                    checked={isChecked}
                    onChange={(e) => handleHistoryPaymentStatusChange(editingHistoryPaymentStatusOrder.orderId, e.target.value)}
                  />
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: status.color }}>{status.name}</span>
                </label>
              );
            })}
          </div>
          <button onClick={() => setShowHistoryPaymentStatusEditPopover(false)} className="mt-4 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">Готово</button>
        </div>
      )}

      {/* Client Manager Modal */}
      {showClientManagerModal && (
          <div id="client-manager-modal" role="dialog" aria-modal="true" aria-labelledby="client-manager-title"
               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
               style={draggableModalState.id === 'client-manager-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl mx-auto max-h-[90vh] flex flex-col">
                  <h2 id="client-manager-title" className="text-2xl font-bold text-indigo-800 mb-4 border-b pb-2 flex justify-between items-center cursor-grab"
                      onMouseDown={(e) => startDrag(e, 'client-manager-modal')}>
                      Управление клиентами
                      <button onClick={() => setShowClientManagerModal(false)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600" title="Закрыть">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </h2>
                  {/* Client Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="clientSearchInput" className="block text-sm font-medium text-gray-700 mb-1">Поиск клиента</label>
                      <input
                        id="clientSearchInput"
                        type="text"
                        placeholder="Имя, телефон, email, мессенджер, комментарий"
                        value={clientSearchQuery}
                        onChange={(e) => setClientSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="relative" ref={clientTagFilterRef}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Фильтр по тегам клиента</label>
                      <button
                        type="button"
                        className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-left flex justify-between items-center"
                        onClick={() => setShowClientManagerTagFilterDropdown(!showClientManagerTagFilterDropdown)} // Updated state
                        aria-haspopup="listbox"
                        aria-expanded={showClientManagerTagFilterDropdown} // Updated state
                        aria-controls="client-tag-filter-list"
                      >
                        <span className="truncate">
                          {selectedClientTagsFilter.length === 0
                            ? "Все теги клиента"
                            : selectedClientTagsFilter.map(tagName => {
                                const tag = availableClientTags.find(t => t.name === tagName);
                                return (
                                  <span key={tagName} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white mr-1" style={{ backgroundColor: tag?.color || '#6B7280' }}>
                                    {tagName}
                                  </span>
                                );
                              })}
                        </span>
                        <span>{showClientManagerTagFilterDropdown ? '▲' : '▼'}</span>
                      </button>
                      {showClientManagerTagFilterDropdown && ( // Updated state
                        <div id="client-tag-filter-list" role="listbox" className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                          {availableClientTags.map(tag => (
                            <label key={tag.id} role="option" aria-selected={selectedClientTagsFilter.includes(tag.name)} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                                checked={selectedClientTagsFilter.includes(tag.name)}
                                onChange={(e) => handleClientFilterTagChange(tag.name, e.target.checked)}
                              />
                              <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: tag.color }}>
                                {tag.name}
                              </span>
                            </label>
                          ))}
                          <label role="option" aria-selected={selectedClientTagsFilter.length === 0} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 rounded" checked={selectedClientTagsFilter.length === 0} onChange={() => setSelectedClientTagsFilter([])} />
                            <span className="ml-2 text-gray-700">Все теги клиента</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                      {/* Client List */}
                      <div className="space-y-3">
                          {filteredClients.length === 0 ? (
                              <p className="text-gray-500 italic text-center py-4">Список клиентов пуст или нет совпадений по фильтрам.</p>
                          ) : (
                              filteredClients.map(client => (
                                  <div key={client.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border">
                                      <div>
                                          <p className="font-semibold">{client.name}</p>
                                          <p className="text-sm text-gray-600">Тел: {client.phone || '-'}</p>
                                          <p className="text-sm text-gray-600">Email: {client.email || '-'}</p>
                                          <p className="text-sm text-gray-600">Мессенджер: {client.messenger || '-'}</p>
                                          <p className="text-sm text-gray-600">Комментарий: {client.comment || '-'}</p>
                                          {client.clientTags && client.clientTags.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                              {client.clientTags.map((tagName, tagIdx) => (
                                                <span key={tagIdx} className="px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: getClientTagColor(tagName) }}>{tagName}</span>
                                              ))}
                                            </div>
                                          )}
                                      </div>
                                      <div className="flex space-x-2">
                                          <button onClick={() => startEditingClient(client)} className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm" title="Редактировать">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036V18.5h-2.5v-2.5L15.232 5.232z" /></svg>
                                          </button>
                                          <button onClick={() => confirmDeleteClient(client.id)} className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" title="Удалить">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                          </button>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                      <button onClick={() => startEditingClient(null)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm">
                          + Добавить нового клиента
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Client Add/Edit Modal */}
      {showClientEditModal && editingClientData && (
          <div id="client-edit-modal" role="dialog" aria-modal="true" aria-labelledby="client-edit-title"
               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
               style={draggableModalState.id === 'client-edit-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
                  <h3 id="client-edit-title" className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 cursor-grab"
                      onMouseDown={(e) => startDrag(e, 'client-edit-modal')}>
                      {editingClientData.id ? "Редактировать клиента" : "Добавить нового клиента"}
                  </h3>
                  <div className="space-y-4">
                      <div>
                          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Имя клиента</label>
                          <input type="text" id="clientName" value={editingClientData.name} onChange={(e) => setEditingClientData(prev => ({ ...prev, name: e.target.value, isValidName: e.target.value.trim() !== "" }))} className={`w-full px-4 py-2 border rounded ${!editingClientData.isValidName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Имя" />
                          {!editingClientData.isValidName && <p className="text-red-500 text-xs mt-1">Имя клиента не может быть пустым.</p>}
                      </div>
                      <div>
                          <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                          <input type="text" id="clientPhone" value={editingClientData.phone} onChange={(e) => setEditingClientData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Телефон" />
                      </div>
                      <div>
                          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input type="email" id="clientEmail" value={editingClientData.email} onChange={(e) => setEditingClientData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Email" />
                      </div>
                      <div>
                          <label htmlFor="clientMessenger" className="block text-sm font-medium text-gray-700 mb-1">Мессенджер</label>
                          <input type="text" id="clientMessenger" value={editingClientData.messenger} onChange={(e) => setEditingClientData(prev => ({ ...prev, messenger: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Например, Telegram, WhatsApp" />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Теги клиента</label>
                        <button
                            type="button"
                            className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-left flex justify-between items-center"
                            onClick={() => setShowNewCalculationClientTagDropdown(!showNewCalculationClientTagDropdown)} // Updated state
                            aria-haspopup="listbox"
                            aria-expanded={showNewCalculationClientTagDropdown} // Updated state
                            aria-controls="client-edit-tag-list"
                        >
                            <span className="truncate">
                            {editingClientData.clientTags.length === 0
                                ? "Выберите теги клиента"
                                : editingClientData.clientTags.map(tagName => {
                                    const tag = availableClientTags.find(t => t.name === tagName);
                                    return (
                                    <span key={tagName} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white mr-1" style={{ backgroundColor: tag?.color || '#6B7280' }}>
                                        {tagName}
                                    </span>
                                    );
                                })}
                            </span>
                            <span>{showNewCalculationClientTagDropdown ? '▲' : '▼'}</span>
                        </button>
                        {showNewCalculationClientTagDropdown && ( // Updated state
                            <div id="client-edit-tag-list" role="listbox" className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                            {availableClientTags.map(tag => (
                                <label key={tag.id} role="option" aria-selected={editingClientData.clientTags.includes(tag.name)} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                                    checked={editingClientData.clientTags.includes(tag.name)}
                                    onChange={(e) => {
                                        setEditingClientData(prev => {
                                            const currentTags = prev.clientTags || [];
                                            const newTags = e.target.checked ? [...currentTags, tag.name] : currentTags.filter(t => t !== tag.name);
                                            return { ...prev, clientTags: newTags };
                                        });
                                    }}
                                />
                                <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: tag.color }}>
                                    {tag.name}
                                </span>
                                </label>
                            ))}
                            </div>
                        )}
                      </div>
                      <div>
                          <label htmlFor="clientComment" className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                          <textarea id="clientComment" rows="3" value={editingClientData.comment} onChange={(e) => setEditingClientData(prev => ({ ...prev, comment: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded" placeholder="Дополнительный комментарий о клиенте..."></textarea>
                      </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                      <button onClick={() => setShowClientEditModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Отмена</button>
                      <button onClick={saveClientData} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Сохранить</button>
                  </div>
              </div>
          </div>
      )}

      {/* Client Delete Confirmation Modal */}
      {showClientDeleteConfirmModal && (
          <div id="client-delete-modal" role="dialog" aria-modal="true" aria-labelledby="client-delete-modal-title"
               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
               style={draggableModalState.id === 'client-delete-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                  <h3 id="client-delete-modal-title" className="text-xl font-semibold text-gray-800 mb-4 cursor-grab"
                      onMouseDown={(e) => startDrag(e, 'client-delete-modal')}>Подтвердите удаление клиента</h3>
                  <p className="text-gray-700 mb-6">Вы уверены, что хотите удалить этого клиента?</p>
                  <div className="flex justify-end space-x-3">
                      <button onClick={() => setShowClientDeleteConfirmModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Отмена</button>
                      <button onClick={deleteClientConfirmed} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Удалить</button>
                  </div>
              </div>
          </div>
      )}

      {/* Generic Confirmation Modal for Settings Deletions */}
      {showConfirmActionModal && (
        <div id="confirm-action-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-action-title"
             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
             style={draggableModalState.id === 'confirm-action-modal' ? { left: draggableModalState.initialX, top: draggableModalState.initialY, position: 'fixed' } : {}}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 id="confirm-action-title" className="text-xl font-semibold text-gray-800 mb-4 cursor-grab"
                onMouseDown={(e) => startDrag(e, 'confirm-action-modal')}>Подтверждение действия</h3>
            <p className="text-gray-700 mb-6">{confirmActionMessage}</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowConfirmActionModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Отмена</button>
              <button onClick={confirmActionCallback} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Подтвердить</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-down z-[1001]">{toastMessage}</div>
      )}
    </div>
  );
};

export default App;
