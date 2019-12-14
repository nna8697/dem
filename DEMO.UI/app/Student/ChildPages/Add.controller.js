sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/Core",
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    "sap/m/UploadCollectionParameter",
    "sap/ui/commons/FileUploaderParameter"
], function (jQuery, Core, Controller, JSONModel, MessageToast, UploadCollectionParameter, FileUploaderParameter) {
    "use strict";
    var filesNameArr = [];
    return Controller.extend("app.Student.ChildPages", {
        fileName: null,
        onInit: function () {
            this.bus = Core.getEventBus();
        },
        onExit: function () {
            this.bus.unsubscribe("StudentChannel", "switchToAddPage", this.getDocumentTypeData, this);
        },

        onChange: function (oEvent) {
            var root = this;
            var uniqueName = getGuid();
            this.fileName = uniqueName + "-" + oEvent.getParameter("newValue").normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
            var uploadFileName = new FileUploaderParameter({
                name: "filePathUpload",
                value: root.fileName
            });
            root.getView().byId('fileUploader').insertHeaderParameter(uploadFileName);
        },

        //BUTTON HANDLE
        onSave: function () {
            let root = this;
            let oEventBus = Core.getEventBus();

            let addname = root.byId('addname').getValue();
            if (!addname) {
                this.byId('addname').setValueState('Error');
                this.byId('addname').setValueStateText('Không được để trống');
                return;
            }

            let adddob = root.byId('adddob').getDateValue();
            if (!adddob) {
                this.byId('adddob').setValueState('Error');
                this.byId('adddob').setValueStateText('Không được để trống');
                return;
            }

            let addadr = root.byId('addadr').getValue();
            if (!addadr) {
                this.byId('addadr').setValueState('Error');
                this.byId('addadr').setValueStateText('Không được để trống');
                return;
            }

            let addclass = root.byId('addclass').getValue();
            if (!addclass) {
                this.byId('addclass').setValueState('Error');
                this.byId('addclass').setValueStateText('Không được để trống');
                return;
            }
            root.byId('fileUploader').upload();

            $.ajax({
                type: "POST",
                url: apiEndpoint + "/api/student/add",
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify({
                    Name: addname,
                    DateOfBirth: adddob,
                    Address: addadr,
                    Class: addclass,
                    ImagePath: root.fileName
                }),
                success: function (data) {
                    MessageToast.show("Thêm thành công");
                    oEventBus.publish("StudentChannel", "updateList");
                    root.closeDetailArea();
                    root.fileName = null;
                    root.getView().byId('fileUploader').setValue(null);
                }
            });
        },

        onClearForm: function () {
            let oView = this.getView();
            oView.byId("addname").setValue(null);
            oView.byId("adddob").setValue(null);
            oView.byId("addadr").setValue(null);
            oView.byId("addclass").setValue(null);
        },

        closeDetailArea: function () {
            this.onClearForm();
            this.bus.publish("StudentChannel", "closeMidColumn");
        },

        //FORMAT
        formatOtherText: function (value) {
            if (value === null || value === "null" || value === "")
                return 'Không có thông tin hiển thị';
            return value;
        },

    });
}, true);