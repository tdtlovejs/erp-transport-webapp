import React, {useContext, useState} from "react";
import {Layout, Menu, Dropdown, Button} from "antd";
import {
    UserOutlined,
} from "@ant-design/icons";
import {Link, withRouter} from "react-router-dom";
import logo from "../../assets/images/logo.png";
import logoFull from "../../assets/images/logoFull.png";
import {compose} from "redux";
import {connect, useDispatch, useSelector} from "react-redux";
import * as links from "../../constants/links";
import {setDataUser} from "../../redux/actions/auth";
import HomeIcon from "../../assets/images/home.png"
import EmployeeIcon from "../../assets/images/employee.png";
import ListIcon from "../../assets/images/list.png";
import AddIcon from "../../assets/images/add.png";
import ProductIcon from "../../assets/images/product.png"
import ProjectIcon from "../../assets/images/project.png"
import EquipmentIcon from "../../assets/images/equipment.png"
import ClientIcon from "../../assets/images/client.png"
import InvoiceIcon from "../../assets/images/invoice.png"
import TransportIcon from "../../assets/images/transport.png";
import VehicleIcon from "../../assets/images/vehicle.png";
import GpsRouteIcon from "../../assets/images/route.png";
import TrackingIcon from "../../assets/images/tracking.png"
import AccountIcon from "../../assets/images/account.png";
import BackofficeIcon from "../../assets/images/backoffice.png"
import PropTypes from "prop-types";
import {withStyles} from "@mui/styles";
import SwitchLanguage from "../../theme/SwitchLanguage";
import {useTranslation} from "react-i18next";
import {ROLE_ADMIN, ROLE_SUPERADMIN} from "../../constants/constants";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const styles = {
    layout: {
        '&.collapsed': {
            '& .ant-menu-submenu-title': {
                '& span': {
                    display: 'none'
                }
            }
        },
        minHeight: "100vh",
        '& .logo': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '& img': {
                height: 60,
            }
        },
        '& .header-avatar': {
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        '& .ant-menu-item': {
            display: 'flex',
            alignItems: 'center',
        },
        '& .layout-menu-header': {
            backgroundColor: '#002140',
            display: 'flex',
            flexDirection: 'row-reverse',
            padding: '10px 20px',
            '& .header-name': {
                cursor: 'pointer',
                marginRight: 16,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
            }
        },
        '& .layout-menu-footer': {
            textAlign: 'center',
            color: '#fff',
            padding: '20px 0',
        }
    },
    content: {
        height: 'calc(100vh - 100px)',
        overflow: 'auto',
        margin: 0,
        padding: '10px 20px',
        '&::-webkit-scrollbar': {
            height: 9,
            width: 9
        },
        '&::-webkit-scrollbar-track': {
            // background: '#fff',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#002140',
            zIndex: 999,
        },
        '& .contentWrapper': {
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 9,
            minHeight: '100%',
        },
        '& .logoCellWrapper': {
            height: 48,
            width: 48,
            marginRight: 5,
            overflow: 'hidden',
            '& .logoCellImg': {
                width: '100%'
            }
        }
    },
    menuIcon: {
        height: 24,
        width: 24,
        margin: 2,
        marginRight: 5,
    }
}
const LayoutMenu = (props) => {
    const {
        children,
        classes
    } = props;
    const {
        dataUser
    } = useSelector(state => state.authReducer);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const email = dataUser?.data?.person?.email ?? "";
    const username = dataUser?.data?.username ?? "";
    const fullName = (dataUser?.data?.person?.firstName ?? "") + (dataUser?.data?.person?.lastName ?? "")
    const role = dataUser?.data?.role ?? "";
    const photo = dataUser?.data?.person?.avatar?.fileId ? `https://drive.google.com/uc?export=view&id=${dataUser?.data?.person?.avatar.fileId}` : null;
    const isAdmin = [ROLE_ADMIN, ROLE_SUPERADMIN].includes(role);
    const isSuperAdmin = role === ROLE_SUPERADMIN;
    const menu = (
        <Menu>
            <Menu.Item>{fullName}</Menu.Item>
            <Menu.Item>{email}</Menu.Item>
            <Menu.Item>{username}</Menu.Item>
            <Menu.Item onClick={() => {
                dispatch(setDataUser(null))
            }}>{t('label.logout')}</Menu.Item>
        </Menu>
    );
    return (
        <Layout className={classes.layout + (collapsed ? " collapsed" :"")}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => {
                setCollapsed(prev => !prev)
            }}>
                <div
                    className="logo"
                >
                    <Link to={links.HOME}>
                        <img src={collapsed ? logo : logoFull}/>
                    </Link>
                </div>
                <Menu theme="dark" defaultSelectedKeys={["1"]}>
                    <Menu.Item
                        key="home"
                        icon={<img className={classes.menuIcon} src={HomeIcon}/>}
                    >
                        <Link to={links.HOME}>
                            {t('label.home')}
                        </Link>
                    </Menu.Item>
                    {
                        isAdmin && <>
                            <SubMenu
                                key="employee"
                                icon={<img className={classes.menuIcon} src={EmployeeIcon}/>}
                                title={t('employee.label.title')}
                            >
                                <Menu.Item
                                    key="employee_1"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.EMPLOYEE_LIST}>
                                        {t('employee.label.listEmployee')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="employee_2"
                                    icon={<img className={classes.menuIcon} src={AddIcon}/>}
                                >
                                    <Link to={links.EMPLOYEE_NEW}>
                                        {t('employee.label.addEmployee')}
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="product"
                                icon={<img className={classes.menuIcon} src={ProductIcon}/>}
                                title={t('product.label.title')}
                            >
                                <Menu.Item
                                    key="product_1"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.PRODUCT_LIST}>
                                        {t('product.label.listProduct')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="product_2"
                                    icon={<img className={classes.menuIcon} src={AddIcon}/>}
                                >
                                    <Link to={links.PRODUCT_NEW}>
                                        {t('product.label.addProduct')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="product_3"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.PRODUCT_TYPE_LIST}>
                                        {t('product.label.listProductType')}
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="project"
                                icon={<img className={classes.menuIcon} src={ProjectIcon}/>}
                                title={t('project.label.title')}
                            >
                                <Menu.Item
                                    key="project_1"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.PROJECT_LIST}>
                                        {t('project.label.listProject')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="project_2"
                                    icon={<img className={classes.menuIcon} src={AddIcon}/>}
                                >
                                    <Link to={links.PROJECT_NEW}>
                                        {t('project.label.addProject')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="project_3"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.PROJECT_TYPE_LIST}>
                                        {t('project.label.listProjectType')}
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="equipment"
                                icon={<img className={classes.menuIcon} src={EquipmentIcon}/>}
                                title={t('equipment.label.title')}
                            >
                                <Menu.Item
                                    key="equipment_1"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.EQUIPMENT_LIST}>
                                        {t('equipment.label.listEquipment')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="equipment_2"
                                    icon={<img className={classes.menuIcon} src={AddIcon}/>}
                                >
                                    <Link to={links.EQUIPMENT_NEW}>
                                        {t('equipment.label.add_new_equipment')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="equipment_3"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.EQUIPMENT_TYPE_LIST}>
                                        {t('equipment.label.listEquipmentType')}
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="client"
                                icon={<img className={classes.menuIcon} src={ClientIcon}/>}
                                title={t('client.label.title')}
                            >
                                <Menu.Item
                                    key="client_1"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.CLIENT_LIST}>
                                        {t('client.label.listClient')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="client_2"
                                    icon={<img className={classes.menuIcon} src={AddIcon}/>}
                                >
                                    <Link to={links.CLIENT_NEW}>
                                        {t('client.label.addClient')}
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="vehicle"
                                icon={<img className={classes.menuIcon} src={VehicleIcon}/>}
                                title={t('vehicle.label.title')}
                            >
                                <Menu.Item
                                    key="vehicle_1"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.VEHICLE_LIST}>
                                        {t('vehicle.label.listVehicle')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="vehicle_2"
                                    icon={<img className={classes.menuIcon} src={AddIcon}/>}
                                >
                                    <Link to={links.VEHICLE_NEW}>
                                        {t('vehicle.label.addVehicle')}
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="invoice"
                                icon={<img className={classes.menuIcon} src={InvoiceIcon}/>}
                                title={t('invoice.label.title')}
                            >
                                <Menu.Item
                                    key="invoice_1"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.INVOICE_LIST}>
                                        {t('invoice.label.listInvoice')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="invoice_2"
                                    icon={<img className={classes.menuIcon} src={AddIcon}/>}
                                >
                                    <Link to={links.INVOICE_NEW}>
                                        {t('invoice.label.addInvoice')}
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="transportOrder"
                                icon={<img className={classes.menuIcon} src={TransportIcon}/>}
                                title={t('transportOrder.label.title')}
                            >
                                <Menu.Item
                                    key="transportOrder_1"
                                    icon={<img className={classes.menuIcon} src={ListIcon}/>}
                                >
                                    <Link to={links.TRANSPORT_ORDER_LIST}>
                                        {t('transportOrder.label.listTransport')}
                                    </Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="transportOrder_2"
                                    icon={<img className={classes.menuIcon} src={AddIcon}/>}
                                >
                                    <Link to={links.TRANSPORT_ORDER_NEW}>
                                        {t('transportOrder.label.addTransport')}
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                        </>
                    }

                    <SubMenu
                        key="route"
                        icon={<img className={classes.menuIcon} src={GpsRouteIcon}/>}
                        title={t('gpsRoute.label.title')}
                    >
                        {isAdmin && <Menu.Item
                            key="route_1"
                            icon={<img className={classes.menuIcon} src={TrackingIcon}/>}
                        >
                            <Link to={links.TRACKING}>
                                {t('gpsRoute.label.tracking')}
                            </Link>
                        </Menu.Item>}
                        <Menu.Item
                            key="route_2"
                            icon={<img className={classes.menuIcon} src={ListIcon}/>}
                        >
                            <Link to={links.GPS_ROUTE}>
                                {t('gpsRoute.label.listRoute')}
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item
                        key="account"
                        icon={<img className={classes.menuIcon} src={AccountIcon}/>}
                    >
                        <Link to={links.ACCOUNT}>
                            {t('account.label.title')}
                        </Link>
                    </Menu.Item>
                    {isSuperAdmin && <Menu.Item
                        key="backoffice"
                        icon={<img className={classes.menuIcon} src={BackofficeIcon}/>}
                    >
                        <Link to={links.BACKOFFICE_PAGE}>
                            {t('backoffice.label.title')}
                        </Link>
                    </Menu.Item>}
                </Menu>
                <SwitchLanguage />
            </Sider>
            <Layout className="site-layout">
                <Header class="layout-menu-header">
                    <div className="header-avatar">
                        <Dropdown overlay={menu} placement="bottomRight" arrow>
                            <Button
                                shape="circle"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                icon={photo ? <div style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    overflow: 'hidden'
                                }}>
                                    <img style={{
                                        width: '100%',
                                        height: '100%'
                                    }} src={photo} alt=""/>
                                </div> : <UserOutlined/>}
                            ></Button>
                        </Dropdown>
                    </div>
                    <div className="header-name">{username}</div>
                </Header>
                <Content className={classes.content}>
                    <div className="contentWrapper">
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

LayoutMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(withStyles(styles), withRouter)(LayoutMenu);
