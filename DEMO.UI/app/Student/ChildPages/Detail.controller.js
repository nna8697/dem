sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/Core",
    'sap/m/MessageBox',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
], function (jQuery, Core, MessageBox, Controller, JSONModel, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("app.Student.ChildPages.Detail", {
        studentModel: new JSONModel(),

        onInit: function () {

            this.bus = Core.getEventBus();
            this.getView().setModel(this.studentModel, 'studentModel');
            this.bus.subscribe("StudentChannel", "loadDataDetailPage", this.getStudentData, this);
            this.bus.subscribe("StudentChannel", "reloadmidcolumn", this.reloadmidcolumn, this);
        },

        //Data
        getStudentData: function (sChanel, sEvent, oData) {
            let root = this;
            $.ajax({
                type: "GET",
                url: apiEndpoint + '/api/student/listbyid/' + oData.Id,
                contentType: 'application/json',
                success: function (data) {
                    root.studentModel.setData(data, true);
                }
            });
        },

        //BUTTON HANDLE

        handleClose: function () {
            this.bus.publish("StudentChannel", "closeMidColumn");
        },

        //FORMAT

        reloadmidcolumn: function () {
            let root = this;
            let id = this.workunitId;
            this.getDepartmentData(this.workunitId);
            $.ajax({
                type: "GET",
                url: apiEndpoint + '/api/workunit/listbyid/' + id,
                contentType: 'application/json',
                success: function (data) {
                    root.studentModel.setData(data, true);
                }
            });
        },

        showAddNewDepartment: function () {
            this.bus.publish("StudentChannel", "switchToDepatmentAddPage", { Id: this.workunitId });
        },

        handleItemPress: function (oControlEvent) {
            var oItem = oControlEvent.getParameters().listItem;
            var oContext = oItem.getBindingContext('departmentModel');
            this.departmentId = oContext.getProperty("MaPhongBan");
            this.workunitId = oContext.getProperty("MaDonVi");
            this.bus.publish("StudentChannel", "switchToDepartmentPage", { Id: this.departmentId, workunitId: this.workunitId });
        },



    });
}, true);

