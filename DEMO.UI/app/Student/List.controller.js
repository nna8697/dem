sap.ui.define([
    'jquery.sap.global',
    "sap/ui/core/Core",
    'sap/m/MessageBox',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast'
], function (jQuery, Core, MessageBox, Controller, JSONModel, MessageToast) {
    "use strict";
    let nameOrder = "name";
    let codeOrder = "code";
    let createdateOrder = "createdate";

    return Controller.extend("app.Student.List", {
        studentModel: new JSONModel(),

        onInit: function () {
            this.bus = Core.getEventBus();
            let oView = this.getView();
            this.loadStudentData();
            oView.setModel(this.studentModel, 'studentModel');
            this.bus.subscribe("StudentChannel", "updateList", this.loadStudentData, this);

        },

        ////Data 
        loadStudentData: function () {
            let root = this;
            $.ajax({
                url: apiEndpoint + '/api/student/list',
                type: 'GET',
                contentType: 'application/json',
                success: function (data) {
                    root.studentModel.setData(data);
                }
            });
        },



        //BUTTON HANDLE
        onCellClick: function (oControlEvent) {
            if (oControlEvent.getParameters().rowBindingContext) {
                let Id = oControlEvent.getParameters().rowBindingContext.getProperty("ID");
                let oEventBus = Core.getEventBus();
                oEventBus.publish("StudentChannel", "switchToDetailPage", { Id: Id });
            }
        },

        onAddButtonPress: function () {
            let oEventBus = Core.getEventBus();
            oEventBus.publish("StudentChannel", "switchToAddPage");
        },

        onRowDelete: function (oEvent) {
            let root = this;
            let oEventBus = Core.getEventBus();
            let oRow = oEvent.getParameter("row");
            let id = this.getView().getModel("studentModel").getProperty("ID", oRow.getBindingContext("studentModel"));
            MessageBox.show(
                "Bạn có chắc chắn muốn xóa?", {
                    icon: MessageBox.Icon.WARNING,
                    title: "Xác nhận",
                    actions: ["Xóa", "Hủy bỏ"],
                    onClose: function (oAction) {
                        if (oAction == "Xóa") {
                            $.ajax({
                                type: "POST",
                                url: apiEndpoint + "/api/student/delete",
                                data: JSON.stringify([id]),
                                success: function () {
                                    MessageToast.show("Đã xóa thành công");
                                    root.getView().byId("studentTable").clearSelection();
                                    root.loadStudentData();
                                    oEventBus.publish("studentModel", "closeMidColumn");
                                },
                                contentType: "application/json",
                                dataType: 'json'
                            });
                        }
                    }
                });
        },

        onOpenEditDetailPage: function (oEvent) {
            let oRow = oEvent.getParameter("row");
            let Id = this.getView().getModel('studentModel').getProperty("ID", oRow.getBindingContext('studentModel'));
            let oEventBus = Core.getEventBus();
            oEventBus.publish("StudentChannel", "switchToEditPage", { Id: Id});
        },

        //SORT

        //SEARCH

        //FORMAT


    });
});