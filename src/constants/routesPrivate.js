import React, {lazy} from 'react';
import * as links from "../constants/links";
import {FORM_TYPE_EDIT, FORM_TYPE_NEW, ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_SUPERADMIN} from "./constants";
import EmployeeList from "../modules/Employee/EmployeeList";
import EmployeeForm from "../modules/Employee/EmployeeForm";
import ProjectList from "../modules/Project/ProjectList";
import ProjectTypeList from "../modules/ProjectType/ProjectTypeList";
import ProductList from "../modules/Product/ProductList";
import ProductForm from "../modules/Product/ProductForm";
import ProductTypeList from "../modules/ProductType/ProductTypeList";
import EquipmentList from "../modules/Equipment/EquipmentList";
import EquipmentTypeList from "../modules/EquipmentType/EquipmentTypeList";
import ClientList from "../modules/Client/ClientList";
import ClientForm from "../modules/Client/ClientForm";
import EquipmentForm from "../modules/Equipment/EquipmentForm";
import ProjectForm from "../modules/Project/ProjectForm";
import Tracking from "../modules/GpsRoute/Tracking";
import GpsRoutePage from "../modules/GpsRoute/GpsRoutePage";
import Home from "../modules/Home/Home";
import {
    INVOICE_EDIT,
    INVOICE_LIST,
    INVOICE_NEW, TRANSPORT_ORDER_EDIT,
    TRANSPORT_ORDER_LIST, TRANSPORT_ORDER_NEW,
    VEHICLE_EDIT,
    VEHICLE_LIST,
    VEHICLE_NEW
} from "../constants/links";
import VehicleList from "../modules/Vehicle/VehicleList";
import VehicleForm from "../modules/Vehicle/VehicleForm";
import TransportOrderForm from "../modules/TransportOrder/TransportOrderForm";
import TransportOrderList from "../modules/TransportOrder/TransportOrderList";
import InvoiceForm from "../modules/Invoice/InvoiceForm";
import InvoiceList from "../modules/Invoice/InvoiceList";
import BackOffice from "../modules/BackOffice/BackOffice";

const arrayRoutesPrivate = [
    {
        path: links.HOME,
        component: () => <Home/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
            ROLE_EMPLOYEE
        ]
    },
    {
        path: links.ACCOUNT,
        component: (match) => <EmployeeForm match={match} formType="account"/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
            ROLE_EMPLOYEE
        ]
    },
    {
        path: links.EMPLOYEE_LIST,
        component: () => <EmployeeList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.EMPLOYEE_NEW,
        component: (match) => <EmployeeForm match={match} formType={FORM_TYPE_NEW}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.EMPLOYEE_EDIT,
        component: (match) => <EmployeeForm match={match} formType={FORM_TYPE_EDIT}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.PROJECT_LIST,
        component: () => <ProjectList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.PROJECT_NEW,
        component: (match) => <ProjectForm match={match} formType={FORM_TYPE_NEW}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.PROJECT_EDIT,
        component: (match) => <ProjectForm match={match} formType={FORM_TYPE_EDIT}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.PROJECT_TYPE_LIST,
        component: () => <ProjectTypeList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.PRODUCT_LIST,
        component: () => <ProductList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.PRODUCT_NEW,
        component: (match) => <ProductForm match={match} formType={FORM_TYPE_NEW}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.PRODUCT_EDIT,
        component: (match) => <ProductForm match={match} formType={FORM_TYPE_EDIT}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.PRODUCT_TYPE_LIST,
        component: (match) => <ProductTypeList match={match}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.EQUIPMENT_LIST,
        component: () => <EquipmentList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.EQUIPMENT_NEW,
        component: (match) => <EquipmentForm match={match} formType={FORM_TYPE_NEW}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.EQUIPMENT_EDIT,
        component: (match) => <EquipmentForm match={match} formType={FORM_TYPE_EDIT}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.EQUIPMENT_TYPE_LIST,
        component: () => <EquipmentTypeList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.CLIENT_LIST,
        component: () => <ClientList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.CLIENT_NEW,
        component: (match) => <ClientForm match={match} formType={FORM_TYPE_NEW}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.CLIENT_EDIT,
        component: (match) => <ClientForm match={match} formType={FORM_TYPE_EDIT}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.TRACKING,
        component: () => <Tracking/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.GPS_ROUTE,
        component: () => <GpsRoutePage/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
            ROLE_EMPLOYEE
        ]
    },
    {
        path: links.VEHICLE_LIST,
        component: () => <VehicleList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.VEHICLE_NEW,
        component: (match) => <VehicleForm match={match} formType={FORM_TYPE_NEW}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.VEHICLE_EDIT,
        component: (match) => <VehicleForm match={match} formType={FORM_TYPE_EDIT}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.INVOICE_LIST,
        component: () => <InvoiceList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.INVOICE_NEW,
        component: (match) => <InvoiceForm match={match} formType={FORM_TYPE_NEW}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.INVOICE_EDIT,
        component: (match) => <InvoiceForm match={match} formType={FORM_TYPE_EDIT}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.TRANSPORT_ORDER_LIST,
        component: () => <TransportOrderList/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.TRANSPORT_ORDER_NEW,
        component: (match) => <TransportOrderForm match={match} formType={FORM_TYPE_NEW}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.TRANSPORT_ORDER_EDIT,
        component: (match) => <TransportOrderForm match={match} formType={FORM_TYPE_EDIT}/>,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
            ROLE_ADMIN,
        ]
    },
    {
        path: links.BACKOFFICE_PAGE,
        component: () => <BackOffice />,
        exact: true,
        permission: [
            ROLE_SUPERADMIN,
        ]
    },
];


export default arrayRoutesPrivate;
