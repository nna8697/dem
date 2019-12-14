sap.ui.define([
    "sap/m/SplitContainer",
    "sap/ui/Device",
    "sap/ui/core/Core",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/mvc/XMLView"
], function (SplitContainer, Device, Core, Controller, XMLView) {
    "use strict";
    return Controller.extend("app.Student.Layout", {
        documentFormMode: 'view',
        onInit: function () {
            this.bus = Core.getEventBus();
            this.bus.subscribe("StudentChannel", "switchToAddPage", this.switchToAddPage, this);
            this.bus.subscribe("StudentChannel", "switchToDetailPage", this.switchToDetailPage, this);
            this.bus.subscribe("StudentChannel", "switchToEditPage", this.switchToEditPage, this);
            this.bus.subscribe("StudentChannel", "closeMidColumn", this.closeMidColumn, this);
            this.mainLayout = this.byId("MainLayout");
        },
        onExit: function () {
            this.bus.unsubscribe("StudentChannel", "switchToAddPage", this.switchToAddPage, this);
            this.bus.unsubscribe("StudentChannel", "switchToDetailPage", this.switchToDetailPage, this);
            this.bus.unsubscribe("StudentChannel", "switchToEditPage", this.switchToEditPage, this);
            this.bus.unsubscribe("StudentChannel", "closeMidColumn", this.closeMidColumn, this);
        },
        switchToAddPage: function () {
            if (!this.AddPageId) {
                this.AddPageId = "app.Student.ChildPages.Add";
                var page = new XMLView({
                    id: this.AddPageId,
                    viewName: "app.Student.ChildPages.Add"
                });
                this.mainLayout.addMidColumnPage(page);
            }
            this.mainLayout.toMidColumnPage(this.AddPageId);
            this.showMidColumn();
        },
        switchToDetailPage: function (sChanel, sEvent, oData) {
            if (!this.DetailPageId) {
                this.DetailPageId = "app.Student.ChildPages.Detail";
                var page = new XMLView({
                    id: this.DetailPageId,
                    viewName: "app.Student.ChildPages.Detail"
                });
                this.mainLayout.addMidColumnPage(page);
            }
            this.mainLayout.toMidColumnPage(this.DetailPageId);
            this.showMidColumn();
            this.bus.publish("StudentChannel", "loadDataDetailPage", oData);
        },
        switchToEditPage: function (sChanel, sEvent, oData) {
            if (!this.EditPageId) {
                this.EditPageId = "app.Student.ChildPages.Edit";
                var page = new XMLView({
                    id: this.EditPageId,
                    viewName: "app.Student.ChildPages.Edit"
                });
                this.mainLayout.addMidColumnPage(page);
            }
            this.mainLayout.toMidColumnPage(this.EditPageId);
            this.showMidColumn();
            this.bus.publish("StudentChannel", "loadDataEditPage", oData);
        },
        showMidColumn: function () {
            this.mainLayout.setLayout('TwoColumnsBeginExpanded');
        },
        closeMidColumn: function () {
            this.mainLayout.setLayout("OneColumn");
        },
    });
}, true);