sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("com.ndbs.reusecomponentui.controller.Homepage", {
            onInit: function () {
                this.getOwnerComponent().setView(this.getView());
            },
            onAfterRendering: function () {
                let oConsumerOdataModel = this.getOwnerComponent().getModel(),
                    oConsumerJSONModel = this.getOwnerComponent().getModel("ui"),
                    oJSONData = oConsumerJSONModel.getData(),
                    oComponentModel = this.getOwnerComponent().getComponentModel(),
                    oFilter = new Filter("CompanyName", FilterOperator.Contains, oComponentModel.getProperty("/companyName"));

                this.getView().byId("tblReuseCustomer").getBinding("items").filter(oFilter);
            },
            onCustomerSelected: function (oEvent) {
                let sPath = oEvent.getParameter("listItem").getBindingContextPath();

                this.getView().getModel("northwind").read(sPath, {
                    filters: null,
                    sorters: null,
                    async: true,
                    success: function (oData) {
                        let oViewModel = new JSONModel(oData);
                        this.getView().setModel(oViewModel, "viewModel");
                    }.bind(this),
                    error: function (err) {
                        MessageBox.error(err.message);
                    }
                });
            },
            onSwitchEditDisplayMode: function () {
                let oComponentModel = this.getOwnerComponent().getComponentModel(),
                    sUIMode = oComponentModel.getProperty("/uiMode") === "Display" ? "Edit" : "Display";

                oComponentModel.setProperty("/uiMode", sUIMode);
            }
        });
    });
