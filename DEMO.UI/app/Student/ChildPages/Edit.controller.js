sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/Core",
    'sap/m/MessageBox',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    "sap/m/UploadCollectionParameter"
], function (jQuery, Core, MessageBox, Controller, JSONModel, MessageToast, UploadCollectionParameter) {
    "use strict";
    let filesNameArr = [];
    return Controller.extend("app.Student.ChildPages.Edit", {
        studentModel: new JSONModel(),

        onInit: function () {
            this.bus = Core.getEventBus();
            this.getView().setModel(this.studentModel, 'studentModel');
            this.bus.subscribe("StudentChannel", "loadDataEditPage", this.getDocumentData, this);
        },
        onExit: function () {
            this.bus.unsubscribe("StudentChannel", "loadDataEditPage", this.getDocumentData, this);
        },
        //DATA
        getDocumentData: function (sChanel, sEvent, oData) {
            let root = this;
            $.ajax({
                type: "GET",
                url: apiEndpoint + '/api/Student/listbyid/' + oData.Id,
                contentType: 'application/json',
                success: function (data) {
                    root.studentModel.setData(data, true);
                }
            });
        },

        refreshData: function () {
            let root = this;
            root.studentModel.setData(root.departmentRawData.getData(), false);
        },
        //BUTTON HANDLE
        onSaveButtonPress: function () {
            let root = this;
            let oEventBus = Core.getEventBus();
            let id = this.studentModel.getData().ID;

            let editname = root.byId('editname').getValue();
            if (!editname) {
                this.byId('editname').setValueState('Error');
                this.byId('editname').setValueStateText('Không được để trống');
                return;
            }

            let editdob = root.byId('editdob').getDateValue();
            if (!editdob) {
                this.byId('editdob').setValueState('Error');
                this.byId('editdob').setValueStateText('Không được để trống');
                return;
            }

            let editadr = root.byId('editadr').getValue();
            if (!editadr) {
                this.byId('editadr').setValueState('Error');
                this.byId('editadr').setValueStateText('Không được để trống');
                return;
            }

            let editclass = root.byId('editclass').getValue();
            if (!editclass) {
                this.byId('editclass').setValueState('Error');
                this.byId('editclass').setValueStateText('Không được để trống');
                return;
            }

            $.ajax({
                type: "POST",
                url: apiEndpoint + "/api/student/update",
                data: JSON.stringify({
                    ID: id,
                    Name: editname,
                    DateOfBirth: editdob,
                    Address: editadr,
                    Class: editclass
                }),
                success: function (data) {
                    oEventBus.publish("StudentChannel", "updateList");
                    oEventBus.publish("StudentChannel", "switchToDetailPage", { Id: id });
                },
                contentType: "application/json",
                dataType: 'json'
            });
        },


        //LAYOUT
        closeDetailArea: function () {
            this.bus.publish("StudentChannel", "closeMidColumn");
        },
        //FORMAT
        formatDateText: function (value) {
            if (value) {
                let date = value.split("T");
                let dateArr = date[0].split("-");
                return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
            } else {
                return "Không có dữ liệu";
            }
        }
    });
}, true);