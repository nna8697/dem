sap.ui.define(
    [
        "jquery.sap.global",
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/Device"
    ],
    function (jQuery, Controller, JSONModel, Filter, FilterOperator, Device) {
        "use strict";
        return Controller.extend("app.masterPage", {
            masterModel: new JSONModel("/app/data/Sidebar.json"),

            oDeviceModel: new JSONModel(Device),

            onInit: function () {
                this.getView().setModel(this.masterModel);
            },

            onSideNavButtonPress: function () {
                var viewId = this.getView().getId();
                var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
                toolPage.setSideExpanded(!toolPage.getSideExpanded());
            },

            onItemSelect: function (oEvent) {
                var item = oEvent.getParameter("item");
                var routeKey = item.getKey();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if (routeKey && routeKey !== "" && routeKey) {
                    oRouter.navTo(item.getKey());
                }
            },
        });
    });