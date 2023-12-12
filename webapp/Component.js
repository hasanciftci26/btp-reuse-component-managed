/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (UIComponent, ReuseComponentSupport, Filter, FilterOperator) {
        "use strict";

        return UIComponent.extend("com.ndbs.reusecomponentui.Component", {
            metadata: {
                manifest: "json",
                library: "demoLibrary",
                //interfaces: ["sap.ui.core.IAsyncContentCreation"],
                properties: {
                    /* Standard properties for reuse components */
                    uiMode: {
                        type: "string",
                        group: "standard",
                        defaultValue: "Display"
                    },
                    semanticObject: {
                        type: "string",
                        group: "standard"
                    },
                    stIsAreaVisible: {
                        type: "boolean",
                        group: "standard",
                        defaultValue: true
                    },
                    /* Component specific properties */
                    companyName: {
                        type: "string",
                        group: "specific",
                        defaultValue: ""
                    }
                }
            },

            setStIsAreaVisible: function (bIsAreaVisible) {
                if (bIsAreaVisible !== this.getStIsAreaVisible()) {
                    this.setProperty("stIsAreaVisible", bIsAreaVisible);
                }
            },

            setCompanyName: function (sCompanyName) {
                if (sCompanyName !== this.getCompanyName()) {
                    this.setProperty("companyName", sCompanyName);
                    this.getStIsAreaVisible() &&
                        this.getModel("northwind").metadataLoaded().then(() => {
                            this._filterTable();
                        });
                } else {
                    this._filterTable();
                }
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                //Transform this component into a reuse component for smart templates:
                ReuseComponentSupport.mixInto(this, "componentModel", true);
                //Defensive call of init of the super class:
                (UIComponent.prototype.init || jQuery.noop).apply(this, arguments);
            },

            setView: function (oView) {
                this._componentView = oView;
            },
            _filterTable: function () {
                const aFilters = [];
                let oFilter = new Filter({
                    filters: aFilters,
                    and: true
                });

                this.getCompanyName() && aFilters.push(new Filter({
                    path: "CompanyName",
                    operator: FilterOperator.Contains,
                    value1: this.getCompanyName()
                }));

                this._componentView.byId("tblReuseCustomer").getBinding("items").filter(oFilter);

                setTimeout(() => {
                    let oParentModel = this.getModel(); //Access consumer's propagated model
                }, 5000);
            }
        });
    }
);